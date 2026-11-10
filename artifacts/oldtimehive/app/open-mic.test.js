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
test("Open Mic is direct-join peer-to-peer audio with no speaker queue",async()=>{
  const source=await read("./open-mic.js");
  assert.match(source,/new RTCPeerConnection/);
  assert.match(source,/iceServers\(/);
  assert.match(source,/publishOpenMic/);
  assert.match(source,/subscribeOpenMic/);
  assert.match(source,/replaceTrack/);
  assert.match(source,/Everyone can speak/);
  assert.doesNotMatch(source,/livekit|raise hand|hand raise|request to speak|speaker queue/i);
  assert.doesNotMatch(source,/https?:\/\//);
});
test("Open Mic exposes host moderation, room sharing, and lifecycle heartbeats",async()=>{
  const source=await read("./open-mic.js");
  for(const marker of ["allow-mic","remove","share","/heartbeat","/moderate","method:\"DELETE\"","navigator.share"])
    assert.ok(source.includes(marker),`missing ${marker}`);
});
test("Open Mic visual system respects phone safe areas and reduced motion",async()=>{
  const css=await read("./open-mic.css");
  assert.match(css,/env\(safe-area-inset-top\)/);
  assert.match(css,/env\(safe-area-inset-bottom\)/);
  assert.match(css,/prefers-reduced-motion/);
  assert.match(css,/max-width:380px/);
});
test("Open Mic header mic shortcut has a compact accessible target",async()=>{
  const css=await read("./open-mic.css");
  assert.match(css,/app-open-mic-shortcut/);
  assert.match(css,/focus-visible/);
});
