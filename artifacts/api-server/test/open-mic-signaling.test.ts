import { describe,it } from "node:test";
import assert from "node:assert/strict";
import { parseOpenMicSignalMessage } from "../src/cloudflare/realtime.ts";
const roomId="123e4567-e89b-42d3-a456-426614174004";
const recipient="123e4567-e89b-42d3-a456-426614174001";
const envelope=(data:unknown)=>JSON.stringify({event:"open-mic:signal",data});
describe("Open Mic peer signaling validation",()=>{
  it("accepts bounded offers, answers and ICE candidates",()=>{
    assert.equal(parseOpenMicSignalMessage(envelope({roomId,to:recipient,kind:"offer",payload:{description:{type:"offer",sdp:"v=0\\r\\n"}}}))?.kind,"offer");
    assert.equal(parseOpenMicSignalMessage(envelope({roomId,to:recipient,kind:"answer",payload:{description:{type:"answer",sdp:"v=0\\r\\n"}}}))?.kind,"answer");
    assert.equal(parseOpenMicSignalMessage(envelope({roomId,to:recipient,kind:"ice",payload:{candidate:{candidate:"candidate:1 1 UDP 123 192.0.2.1 1234 typ host",sdpMid:"0",sdpMLineIndex:0}}))?.kind,"ice");
  });
  it("accepts only host mute, allow-mic and removal control messages",()=>{
    for(const action of ["mute","allow-mic","remove"])assert.equal(
      parseOpenMicSignalMessage(envelope({roomId,to:recipient,kind:"moderation",payload:{action,targetUserId:recipient}}))?.kind,"moderation");
    assert.equal(parseOpenMicSignalMessage(envelope({roomId,to:recipient,kind:"moderation",payload:{action:"promote",targetUserId:recipient}})),null);
  });
  it("rejects invalid room or recipient ids, malformed descriptions and oversized candidates",()=>{
    assert.equal(parseOpenMicSignalMessage(envelope({roomId:"bad",to:recipient,kind:"offer",payload:{description:{type:"offer",sdp:"v=0"}}})),null);
    assert.equal(parseOpenMicSignalMessage(envelope({roomId,to:"bad",kind:"offer",payload:{description:{type:"offer",sdp:"v=0"}}})),null);
    assert.equal(parseOpenMicSignalMessage(envelope({roomId,to:recipient,kind:"answer",payload:{description:{type:"offer",sdp:"v=0"}}})),null);
    assert.equal(parseOpenMicSignalMessage(envelope({roomId,to:recipient,kind:"ice",payload:{candidate:{candidate:"x".repeat(4097)}}})),null);
    assert.equal(parseOpenMicSignalMessage("x".repeat(24_513)),null);
  });
});
