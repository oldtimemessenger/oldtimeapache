import { describe,it } from "node:test";
import assert from "node:assert/strict";
import { parseCallSignalMessage } from "../src/cloudflare/realtime.ts";

const recipient="123e4567-e89b-42d3-a456-426614174001";
const conversation="123e4567-e89b-42d3-a456-426614174002";
const callId="123e4567-e89b-42d3-a456-426614174003";
const envelope=(data:unknown)=>JSON.stringify({event:"call:signal",data});

describe("Cloudflare WebRTC call signaling validation",()=>{
  it("accepts a bounded direct-call offer envelope",()=>{
    const result=parseCallSignalMessage(envelope({
      callId,type:"invite",to:recipient,conversationId:conversation,
      payload:{convoId:conversation,video:true,offer:{type:"offer",sdp:"v=0\r\n"}},
    }));
    assert.equal(result?.callId,callId);
    assert.equal(result?.type,"invite");
    assert.equal(result?.to,recipient);
  });

  it("rejects unsupported events, malformed identifiers, and oversized frames",()=>{
    assert.equal(parseCallSignalMessage(JSON.stringify({event:"chat:changed",data:{}})),null);
    assert.equal(parseCallSignalMessage(envelope({
      callId:"not-a-uuid",type:"ringing",to:recipient,conversationId:conversation,payload:{},
    })),null);
    assert.equal(parseCallSignalMessage("x".repeat(24_001)),null);
  });

  it("rejects malformed session descriptions and unexpected payload fields",()=>{
    assert.equal(parseCallSignalMessage(envelope({
      callId,type:"answer",to:recipient,conversationId:conversation,
      payload:{answer:{type:"offer",sdp:"v=0"}},
    })),null);
    assert.equal(parseCallSignalMessage(envelope({
      callId,type:"ringing",to:recipient,conversationId:conversation,payload:{sdp:"unexpected"},
    })),null);
    assert.equal(parseCallSignalMessage(envelope({
      callId,type:"invite",to:recipient,conversationId:conversation,
      payload:{convoId:conversation,video:false,offer:{type:"offer",sdp:""}},
    })),null);
  });

  it("accepts a valid ICE candidate and rejects oversized candidate data",()=>{
    const base={callId,type:"ice",to:recipient,conversationId:conversation};
    assert.ok(parseCallSignalMessage(envelope({
      ...base,payload:{candidate:{candidate:"candidate:1 1 UDP 123 192.0.2.1 1234 typ host",sdpMid:"0",sdpMLineIndex:0}},
    })));
    assert.equal(parseCallSignalMessage(envelope({
      ...base,payload:{candidate:{candidate:"x".repeat(4097),sdpMid:"0",sdpMLineIndex:0}},
    })),null);
  });
});
