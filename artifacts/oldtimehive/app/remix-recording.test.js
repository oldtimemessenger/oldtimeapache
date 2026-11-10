import assert from "node:assert/strict";
import test from "node:test";
import { activateRemixAudio, releaseRemixAudio } from "./remix-recording.js";

let events = [];

class FakeNode {
  connect() { return this; }
  disconnect() {}
}

class FakeMediaElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.currentTime = 0;
    this.duration = 12;
    this.loop = false;
    this.muted = true;
  }
  play() { events.push(`play:${this.tagName}`); return Promise.resolve(); }
  pause() { events.push(`pause:${this.tagName}`); }
}

class FakeAudioContext {
  constructor() { this.state = "suspended"; this.currentTime = 0; }
  createMediaStreamDestination() {
    const track = { stop() {} };
    return { stream: { getTracks: () => [track], getAudioTracks: () => [track] } };
  }
  createMediaElementSource(element) {
    if (!(element instanceof FakeMediaElement)) {
      throw new TypeError("Argument 1 must be an HTMLMediaElement.");
    }
    events.push(`source:${element.tagName}`);
    return new FakeNode();
  }
  createMediaStreamSource() { events.push("stream-source"); return new FakeNode(); }
  createGain() { return Object.assign(new FakeNode(), { gain: { value: 0, setValueAtTime() {} } }); }
  resume() { events.push("resume"); this.state = "running"; return Promise.resolve(); }
  close() { this.state = "closed"; return Promise.resolve(); }
}

async function withFakeAudio(run) {
  const savedAudioContext = globalThis.AudioContext;
  const savedWebkitAudioContext = globalThis.webkitAudioContext;
  events = [];
  globalThis.AudioContext = FakeAudioContext;
  delete globalThis.webkitAudioContext;
  try { await run(); }
  finally {
    if (savedAudioContext === undefined) delete globalThis.AudioContext;
    else globalThis.AudioContext = savedAudioContext;
    if (savedWebkitAudioContext === undefined) delete globalThis.webkitAudioContext;
    else globalThis.webkitAudioContext = savedWebkitAudioContext;
  }
}

test("photo layers never enter createMediaElementSource and audio activates on the tap", async () => {
  await withFakeAudio(async () => {
    const soundtrack = new FakeMediaElement("VIDEO");
    const photo = { tagName: "IMG", width: 600, height: 800 };
    const state = { originalVolume: 0.75, meVolume: 0.5, offset: 2 };
    const session = activateRemixAudio({ soundtrack, self: photo, state });

    assert.deepEqual(events.slice(-2), ["resume", "play:VIDEO"],
      "context resume and soundtrack playback start synchronously");
    assert.deepEqual(events.filter(event => event.startsWith("source:")), ["source:VIDEO"]);
    assert.equal(session.gains.me, undefined, "a still photo has no audio gain");
    assert.equal(soundtrack.currentTime, 2);
    await session.ready;
    session.release();
    releaseRemixAudio(soundtrack);
  });
});

test("uploaded video selfie audio uses its media element graph", async () => {
  await withFakeAudio(async () => {
    const soundtrack = new FakeMediaElement("VIDEO");
    const self = new FakeMediaElement("VIDEO");
    const session = activateRemixAudio({
      soundtrack,
      self,
      state: { originalVolume: 1, meVolume: 0.4, offset: 0 },
    });
    assert.deepEqual(events.filter(event => event.startsWith("source:")), ["source:VIDEO", "source:VIDEO"]);
    assert.ok(session.gains.me, "uploaded video has its own volume control");
    await session.ready;
    session.release();
    releaseRemixAudio(soundtrack);
  });
});

test("live camera microphone audio uses the captured stream track", async () => {
  await withFakeAudio(async () => {
    const soundtrack = new FakeMediaElement("VIDEO");
    const self = new FakeMediaElement("VIDEO");
    const stream = { getAudioTracks: () => [{ readyState: "live" }] };
    const session = activateRemixAudio({
      soundtrack,
      self,
      stream,
      state: { originalVolume: 1, meVolume: 0.4, offset: 0 },
    });
    assert.deepEqual(events.filter(event => event.startsWith("source:")), ["source:VIDEO"]);
    assert.ok(events.includes("stream-source"));
    assert.ok(session.gains.me);
    await session.ready;
    session.release();
    releaseRemixAudio(soundtrack);
  });
});
