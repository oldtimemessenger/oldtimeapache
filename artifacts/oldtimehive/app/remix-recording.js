import { measureSourceFrameRate, videoEncodingProfile, videoMimeType } from "./video-compression.js";

const graphs = new WeakMap();

function isAudioMediaElement(element) {
  const tag = String(element?.tagName || element?.nodeName || "").toUpperCase();
  return (tag === "AUDIO" || tag === "VIDEO")
    && typeof element.play === "function"
    && typeof element.pause === "function";
}

function graphFor(soundtrack) {
  const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!Audio) throw new Error("Audio recording is not supported by this browser.");
  let graph = graphs.get(soundtrack);
  if (!graph) {
    graph = { audio: new Audio(), sources: new WeakMap() };
    graphs.set(soundtrack, graph);
  }
  return graph;
}

function mediaSource(graph, element) {
  if (!isAudioMediaElement(element)) {
    throw new TypeError("Remix audio can only be read from an audio or video element.");
  }
  if (!graph.sources.has(element)) {
    graph.sources.set(element, graph.audio.createMediaElementSource(element));
  }
  return graph.sources.get(element);
}

export function releaseRemixAudio(soundtrack) {
  const graph = graphs.get(soundtrack);
  if (graph) { void graph.audio.close().catch(() => {}); graphs.delete(soundtrack); }
}

// Call synchronously from the Record tap. This prepares the same graph and starts
// both activation promises before any segmentation or frame-rate awaits begin.
export function activateRemixAudio({ soundtrack, self, stream, state }) {
  if (!isAudioMediaElement(soundtrack)) throw new TypeError("The original sound is not ready.");
  const graph = graphFor(soundtrack);
  const { audio } = graph;
  const destination = audio.createMediaStreamDestination();
  const gains = {}, usedSources = [];
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    soundtrack.pause();
    for (const gain of Object.values(gains)) gain.disconnect();
    for (const node of usedSources) node.disconnect();
    for (const track of destination.stream.getTracks?.() || []) track.stop();
  };
  const connect = (node, key, level) => {
    usedSources.push(node);
    const gain = audio.createGain();
    gain.gain.value = Math.max(0, Math.min(1, Number.isFinite(Number(level)) ? Number(level) : 0));
    node.connect(gain);
    gain.connect(destination);
    gains[key] = gain;
  };
  try {
    connect(mediaSource(graph, soundtrack), "original", state.originalVolume);
    let mePlayback = Promise.resolve();
    const microphoneTracks = stream?.getAudioTracks?.() || [];
    if (microphoneTracks.some(track => track.readyState !== "ended")) {
      connect(audio.createMediaStreamSource(stream), "me", state.meVolume);
    } else if (isAudioMediaElement(self)) {
      self.muted = false;
      try { self.currentTime = 0; } catch {}
      connect(mediaSource(graph, self), "me", state.meVolume);
      mePlayback = self.play();
    }
    const duration = Number.isFinite(soundtrack.duration) ? soundtrack.duration : 0;
    soundtrack.currentTime = Math.max(0, Math.min(Number(state.offset) || 0, Math.max(0, duration - .1)));
    soundtrack.loop = true;
    soundtrack.muted = false;
    const resume = audio.state === "running" ? Promise.resolve() : audio.resume();
    const playback = soundtrack.play();
    const ready = Promise.all([resume, playback, mePlayback]).then(() => undefined);
    ready.catch(() => {});
    return { audio, destination, gains, ready, release };
  } catch (failure) {
    release();
    throw failure;
  }
}

export async function startRemixRecording({ canvas, soundtrack, sourceVideo, self, stream, state, audioSession, onDone, onError }) {
  if (!globalThis.MediaRecorder || !canvas.captureStream) throw new Error("Video recording is not supported by this browser.");
  const mimeType = videoMimeType();
  if (!mimeType) throw new Error("This browser cannot export video. Try a current Safari or Chrome.");
  const session = audioSession || activateRemixAudio({ soundtrack, self, stream, state });
  const { audio, destination, gains } = session;
  let output, recorder, timer, failed = false;
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    clearTimeout(timer);
    soundtrack.pause();
    for (const track of output?.getTracks() || []) track.stop();
    session.release();
  };
  try {
    await session.ready;
    const measuredFrameRate = sourceVideo
      ? (await measureSourceFrameRate(sourceVideo)).frameRate
      : Number(stream?.getVideoTracks?.()[0]?.getSettings?.().frameRate) || 30;
    const profile = videoEncodingProfile(canvas.width, canvas.height, measuredFrameRate);
    soundtrack.currentTime = Math.min(state.offset, Math.max(0, (soundtrack.duration || 0) - .1));
    soundtrack.loop = true;
    await soundtrack.play();
    if (isAudioMediaElement(self) && !stream) { self.muted = false; self.currentTime = 0; await self.play(); }
    output = canvas.captureStream(profile.frameRate);
    for (const track of destination.stream.getAudioTracks()) output.addTrack(track);
    const chunks = [];
    recorder = new MediaRecorder(output, {
      mimeType,
      videoBitsPerSecond: profile.videoBitsPerSecond,
      audioBitsPerSecond: profile.audioBitsPerSecond,
      videoBitrateMode: "variable",
    });
    recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    recorder.onerror = () => { failed = true; release(); onError(new Error("Recording failed. Nothing was published.")); };
    recorder.onstop = () => {
      release();
      if (failed) return;
      const blob = new Blob(chunks, { type: recorder.mimeType });
      if (!blob.size) onError(new Error("The recording was empty. Please try again."));
      else onDone(blob);
    };
    recorder.start(250);
    timer = setTimeout(() => { if (recorder.state === "recording") recorder.stop(); }, 60_000);
    return {
      cancel() { failed = true; if (recorder.state !== "inactive") recorder.stop(); },
      stop() { if (recorder.state !== "inactive") recorder.stop(); },
      levels() {
        gains.original?.gain.setValueAtTime(state.originalVolume, audio.currentTime);
        gains.me?.gain.setValueAtTime(state.meVolume, audio.currentTime);
      }
    };
  } catch (error) { release(); throw error; }
}
