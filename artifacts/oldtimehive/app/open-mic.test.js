import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const read=path=>readFile(new URL(path,import.meta.url),"utf8");
test("Open Mic has a dedicated Home header entry and opens its own experience",async()=>{
  const app=await read("./app.js");
  assert.match(app,/data-open-mic-launch/);
  assert.match(app,/data-testid="button-header-open-mic"/);
  assert.match(app,/import\("\.\/open-mic\.js"\)/);
  assert.match(app,/import "\.\/open-mic\.css"/);
});
test("Open Mic is a direct-join audio room with no hand-raise queue",async()=>{
  const source=await read("./open-mic.js");
  assert.match(source,/livekit-client@2\.23\.0/);
  assert.match(source,/new LK\.Room/);
  assert.match(source,/RoomEvent\.ActiveSpeakersChanged/);
  assert.match(source,/setMicrophoneEnabled\(false\)/);
  assert.match(source,/data-om-action="mic"/);
  assert.match(source,/Everyone can speak/);
  assert.doesNotMatch(source,/raise hand|hand raise|request to speak|speaker queue/i);
  assert.doesNotMatch(source,/new RTCPeerConnection/);
});
test("Open Mic exposes host moderation, room sharing, and lifecycle heartbeats",async()=>{
  const source=await read("./open-mic.js");
  for(const marker of ["data-om-action=\"mute\"","data-om-action=\"remove\"","data-om-action=\"share\"",
    "/heartbeat","/moderate","method:\"DELETE\"","navigator.share"])assert.ok(source.includes(marker),`missing ${marker}`);
});
test("Open Mic visual system respects phone safe areas and reduced motion",async()=>{
  const css=await read("./open-mic.css");
  assert.match(css,/env\(safe-area-inset-top\)/);
  assert.match(css,/env\(safe-area-inset-bottom\)/);
  assert.match(css,/prefers-reduced-motion/);
  assert.match(css,/max-width:380px/);
});
