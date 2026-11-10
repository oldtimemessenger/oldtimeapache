import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";
import { __openMicTest } from "../src/cloudflare/open-mic.js";

const config={serverUrl:"wss://voice.example.test",apiKey:"oldtime-test-key",apiSecret:"only-for-tests"};
const decode=token=>JSON.parse(Buffer.from(token.split(".")[1],"base64url").toString("utf8"));
function verify(token){
  const [header,payload,signature]=token.split(".");
  const expected=createHmac("sha256",config.apiSecret).update(header+"."+payload).digest("base64url");
  assert.equal(signature,expected);
}
test("Open Mic refuses to issue media credentials until the self-hosted SFU is configured",()=>{
  assert.equal(__openMicTest.liveKitReady({serverUrl:config.serverUrl,apiKey:config.apiKey}),false);
  assert.equal(__openMicTest.liveKitReady(config),true);
});
test("Open Mic participant tokens scope identity, room, and publish permission",async()=>{
  const room="11111111-1111-4111-8111-111111111111";
  const user="22222222-2222-4222-8222-222222222222";
  const speaker=await __openMicTest.participantToken(config,room,user,true);
  const listener=await __openMicTest.participantToken(config,room,user,false);
  verify(speaker);verify(listener);
  const claims=decode(speaker),listenerClaims=decode(listener);
  assert.equal(claims.iss,config.apiKey);
  assert.equal(claims.sub,user);
  assert.equal(claims.video.room,room);
  assert.equal(claims.video.roomJoin,true);
  assert.equal(claims.video.canPublish,true);
  assert.equal(claims.video.canSubscribe,true);
  assert.equal(listenerClaims.video.canPublish,false);
  assert.ok(claims.exp-claims.iat<=300);
});
test("Open Mic host moderation token is restricted to its room",async()=>{
  const room="33333333-3333-4333-8333-333333333333";
  const token=await __openMicTest.adminToken(config,room);
  verify(token);
  const claims=decode(token);
  assert.equal(claims.sub,"oldtime-open-mic-service");
  assert.deepEqual(claims.video,{roomAdmin:true,room});
  assert.ok(claims.exp-claims.iat<=300);
});
test("Open Mic schema keeps room visibility and participant roles constrained",async()=>{
  const migration=await readFile(new URL("../migrations/0035_open_mic_rooms.sql",import.meta.url),"utf8");
  assert.match(migration,/visibility IN \('public','unlisted'\)/);
  assert.match(migration,/status IN \('live','ended'\)/);
  assert.match(migration,/role IN \('host','listener'\)/);
  assert.match(migration,/FOREIGN KEY/);
});
