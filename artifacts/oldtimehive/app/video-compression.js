import { fitVideoTo1080p, fitVideoTo720p } from "./video-geometry.js";
import { fragmentedMp4FrameRate } from "./video-container.js";
import { readVideoAudioPresence } from "./video-audio-policy.js";
export { fitVideoTo1080p, fitVideoTo720p };
export const MAX_VIDEO_FRAME_RATE = 60;
export const VIDEO_AUDIO_BITRATE = 128_000;
export const VIDEO_COMPRESSION_PROFILE = Object.freeze({
  AUTO: "auto",
  HIGH_QUALITY: "high-quality",
  DATA_SAVER: "data-saver",
});
export const DEFAULT_VIDEO_COMPRESSION_PROFILE = VIDEO_COMPRESSION_PROFILE.AUTO;
export const VIDEO_COMPRESSION_PROFILE_LABELS = Object.freeze({
  [VIDEO_COMPRESSION_PROFILE.AUTO]: "Auto",
  [VIDEO_COMPRESSION_PROFILE.HIGH_QUALITY]: "High quality",
  [VIDEO_COMPRESSION_PROFILE.DATA_SAVER]: "Data saver",
});
const MAX_AUDIO_SAFE_PASSTHROUGH_BYTES = 50 * 1024 * 1024;
const TARGET_BITRATES = {
  auto: { 720: 2_300_000, 1080: 2_800_000 },
  "high-quality": { 720: { 30: 3_000_000, 60: 4_000_000 }, 1080: { 30: 4_500_000, 60: 6_000_000 }, 2160: { 30: 12_000_000, 60: 18_000_000 } },
  "data-saver": { 720: 1_250_000 },
};
const AUDIO_BITRATES = { auto: 128_000, "high-quality": 128_000, "data-saver": 96_000 };
export const MAX_VIDEO_DURATION_SECONDS = 129;
const AUDIO_PREPARATION_ERROR =
  "This device could not prepare the video's audio. Your edit is still here; tap Retry while the page stays open.";

function videoDurationLimitError() {
  return new Error("Videos must be 2 minutes 9 seconds or shorter. The original was not uploaded.");
}

function validateVideoDuration(duration) {
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error("The video duration could not be read.");
  }
  if (duration > MAX_VIDEO_DURATION_SECONDS) throw videoDurationLimitError();
  return duration;
}

const MIME_TYPES = [
  "video/mp4;codecs=avc1.64002A,mp4a.40.2",
  "video/webm;codecs=vp8,opus",
  "video/webm;codecs=vp9,opus",
  "video/mp4",
  "video/webm",
];

function normalizeVideoCompressionProfile(profile) {
  return Object.values(VIDEO_COMPRESSION_PROFILE).includes(profile)
    ? profile : DEFAULT_VIDEO_COMPRESSION_PROFILE;
}

function fitVideoToProfile(width, height, profile) {
  if (profile === VIDEO_COMPRESSION_PROFILE.AUTO) return fitVideoTo1080p(width, height);
  if (profile === VIDEO_COMPRESSION_PROFILE.DATA_SAVER) return fitVideoTo720p(width, height);
  const sourceWidth = Number(width), sourceHeight = Number(height);
  if (!Number.isFinite(sourceWidth) || !Number.isFinite(sourceHeight) || sourceWidth <= 0 || sourceHeight <= 0) {
    return { width: 0, height: 0 };
  }
  const scale = Math.min(1, 3840 / sourceWidth, 3840 / sourceHeight);
  return {
    width: Math.max(2, Math.floor(sourceWidth * scale / 2) * 2),
    height: Math.max(2, Math.floor(sourceHeight * scale / 2) * 2),
  };
}

export function videoEncodingProfile(width, height, frameRate = 30, selectedProfile = VIDEO_COMPRESSION_PROFILE.HIGH_QUALITY) {
  const profile = normalizeVideoCompressionProfile(selectedProfile);
  const dimensions = fitVideoToProfile(width, height, profile);
  const sourceFrameRate = Number(frameRate);
  const maxFrameRate = profile === VIDEO_COMPRESSION_PROFILE.HIGH_QUALITY ? MAX_VIDEO_FRAME_RATE : 30;
  const outputFrameRate = Number.isFinite(sourceFrameRate)
    ? Math.max(1, Math.min(maxFrameRate, Math.round(sourceFrameRate))) : 30;
  const longEdge = Math.max(dimensions.width, dimensions.height);
  const resolutionTier = longEdge > 1920 ? 2160 : longEdge > 1280 ? 1080 : 720;
  const videoBitsPerSecond = profile === VIDEO_COMPRESSION_PROFILE.AUTO
    ? TARGET_BITRATES.auto[resolutionTier === 720 ? 720 : 1080]
    : profile === VIDEO_COMPRESSION_PROFILE.DATA_SAVER
      ? TARGET_BITRATES["data-saver"][720]
      : TARGET_BITRATES["high-quality"][resolutionTier][outputFrameRate > 30 ? 60 : 30];
  return {
    ...dimensions,
    profile,
    frameRate: outputFrameRate,
    videoBitsPerSecond,
    audioBitsPerSecond: AUDIO_BITRATES[profile],
  };
}

export function videoCompressionPlan({
  width, height, size, duration, frameRate = 30, compatible = true,
  profile = DEFAULT_VIDEO_COMPRESSION_PROFILE,
}) {
  profile = normalizeVideoCompressionProfile(profile);
  const dimensions = fitVideoToProfile(width, height, profile);
  const bytes = Number(size);
  if (!Number.isFinite(bytes) || bytes <= 0) throw new Error("The video file size could not be read.");
  const seconds = validateVideoDuration(Number(duration));
  const averageBitrate = bytes * 8 / seconds;
  const sourceFrameRate = Number(frameRate);
  const encoding = videoEncodingProfile(dimensions.width, dimensions.height, sourceFrameRate, profile);
  const targetTotalBitrate = encoding.videoBitsPerSecond + encoding.audioBitsPerSecond;
  const sourceCanPassThrough = dimensions.width === Number(width) &&
    dimensions.height === Number(height) &&
    Number.isFinite(sourceFrameRate) && sourceFrameRate <= encoding.frameRate &&
    compatible === true && averageBitrate <= targetTotalBitrate * 1.25;
  return {
    ...encoding,
    needsEncoding: !sourceCanPassThrough,
    averageBitrate,
    targetTotalBitrate,
    duration: seconds,
  };
}

export function videoCaptureReachedEnd(video, duration, frameRate) {
  if (video?.ended === true) return true;
  const currentTime = Number(video?.currentTime);
  const totalDuration = Number(duration);
  const rate = Math.max(1, Math.min(MAX_VIDEO_FRAME_RATE, Number(frameRate) || 30));
  if (!Number.isFinite(currentTime) || !Number.isFinite(totalDuration) || totalDuration <= 0) return false;
  // Some mobile WebKit versions reach the final decoded frame without
  // dispatching `ended`. Finalize on that frame so MediaRecorder is not left
  // running until the preparation timeout.
  const finalFrameWindow = Math.max(0.025, 1.25 / rate);
  return currentTime >= totalDuration - finalFrameWindow;
}

export function videoMimeType(Recorder = globalThis.MediaRecorder) {
  if (typeof Recorder?.isTypeSupported !== "function") return "";
  return MIME_TYPES.find(type => Recorder.isTypeSupported(type)) || "";
}

export async function startMutedCapturePlayback(video, { progressTimeoutMs = 7_000 } = {}) {
  video.muted = true;
  const startTime = Number(video.currentTime) || 0;
  await video.play();
  video.muted = false;
  await waitForVideoPlaybackAdvance(video, progressTimeoutMs, startTime);
}

function waitForVideoPlaybackAdvance(video, timeoutMs = 7_000, startTime = Number(video.currentTime) || 0) {
  const advanced = () => Number(video.currentTime) > startTime + 0.005;
  if (advanced() || video.ended) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let interval;
    const cleanup = () => {
      clearTimeout(timer);
      clearInterval(interval);
      video.removeEventListener("timeupdate", check);
      video.removeEventListener("ended", check);
      video.removeEventListener("error", failed);
    };
    const check = () => {
      if (advanced() || video.ended) {
        cleanup();
        resolve();
      }
    };
    const failed = () => {
      cleanup();
      reject(new Error("The video could not begin playback for optimization."));
    };
    const timer = setTimeout(() => {
      cleanup();
      const error = new Error(
        "Video playback did not advance on this device. Your edit is still here; try again or choose another clip.",
      );
      error.videoDiagnostics = {
        playbackSeconds: Number(Number(video.currentTime || 0).toFixed(3)),
        paused: video.paused === true,
        readyState: Number(video.readyState) || 0,
        networkState: Number(video.networkState) || 0,
        mediaErrorCode: Number(video.error?.code) || null,
        muted: video.muted === true,
        playbackRate: Number(video.playbackRate) || null,
        visibilityState: globalThis.document?.visibilityState || null,
      };
      reject(error);
    }, timeoutMs);
    interval = setInterval(check, 100);
    video.addEventListener("timeupdate", check);
    video.addEventListener("ended", check, { once: true });
    video.addEventListener("error", failed, { once: true });
    check();
  });
}

function parseIsoBoxes(view, start, end) {
  const boxes = [];
  let offset = start;
  while (offset + 8 <= end) {
    let size = view.getUint32(offset);
    const type = String.fromCharCode(
      view.getUint8(offset + 4), view.getUint8(offset + 5),
      view.getUint8(offset + 6), view.getUint8(offset + 7),
    );
    let headerSize = 8;
    if (size === 1) {
      if (offset + 16 > end) break;
      size = view.getUint32(offset + 8) * 4_294_967_296 + view.getUint32(offset + 12);
      headerSize = 16;
    } else if (size === 0) size = end - offset;
    if (!Number.isFinite(size) || size < headerSize || offset + size > end) break;
    boxes.push({ type, start: offset, end: offset + size, headerSize });
    offset += size;
  }
  return boxes;
}

function parseMp4FrameRate(buffer) {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const moovCandidates = [];
  for (let index = 4; index + 4 <= bytes.length; index++) {
    if (bytes[index] !== 0x6d || bytes[index + 1] !== 0x6f ||
        bytes[index + 2] !== 0x6f || bytes[index + 3] !== 0x76) continue;
    const start = index - 4;
    const size32 = view.getUint32(start);
    let size = size32;
    let headerSize = 8;
    if (size32 === 1 && start + 16 <= bytes.length) {
      size = view.getUint32(start + 8) * 4_294_967_296 + view.getUint32(start + 12);
      headerSize = 16;
    } else if (size32 === 0) size = bytes.length - start;
    if (size >= headerSize && start + size <= bytes.length) {
      moovCandidates.push({ type: "moov", start, end: start + size, headerSize });
    }
  }
  for (const moov of moovCandidates) {
    const tracks = parseIsoBoxes(view, moov.start + moov.headerSize, moov.end)
      .filter(box => box.type === "trak");
    for (const track of tracks) {
      const trackChildren = parseIsoBoxes(view, track.start + track.headerSize, track.end);
      const mdia = trackChildren.find(box => box.type === "mdia");
      if (!mdia) continue;
      const mediaChildren = parseIsoBoxes(view, mdia.start + mdia.headerSize, mdia.end);
      const handler = mediaChildren.find(box => box.type === "hdlr");
      if (!handler) continue;
      const handlerType = String.fromCharCode(
        view.getUint8(handler.start + handler.headerSize + 8),
        view.getUint8(handler.start + handler.headerSize + 9),
        view.getUint8(handler.start + handler.headerSize + 10),
        view.getUint8(handler.start + handler.headerSize + 11),
      );
      if (handlerType !== "vide") continue;
      const mdhd = mediaChildren.find(box => box.type === "mdhd");
      const minf = mediaChildren.find(box => box.type === "minf");
      if (!mdhd || !minf) continue;
      const mdhdPayload = mdhd.start + mdhd.headerSize;
      const timescale = view.getUint32(mdhdPayload + (view.getUint8(mdhdPayload) === 1 ? 20 : 12));
      const stbl = parseIsoBoxes(view, minf.start + minf.headerSize, minf.end)
        .find(box => box.type === "stbl");
      const stts = stbl && parseIsoBoxes(view, stbl.start + stbl.headerSize, stbl.end)
        .find(box => box.type === "stts");
      if (!stts || !timescale) continue;
      const payload = stts.start + stts.headerSize;
      const entries = view.getUint32(payload + 4);
      let sampleCount = 0;
      let durationTicks = 0;
      for (let entry = 0, offset = payload + 8; entry < entries && offset + 8 <= stts.end; entry++, offset += 8) {
        const count = view.getUint32(offset);
        const delta = view.getUint32(offset + 4);
        sampleCount += count;
        durationTicks += count * delta;
      }
      const frameRate = sampleCount * timescale / durationTicks;
      if (Number.isFinite(frameRate) && frameRate > 0 && frameRate <= 240) return frameRate;
    }
  }
  return null;
}

export async function readVideoFrameRate(blob) {
  const mimeType = String(blob?.type || "").split(";")[0].toLowerCase();
  if (!(blob instanceof Blob) || !["video/mp4", "video/quicktime"].includes(mimeType)) return null;
  const rangeSize = Math.min(blob.size, 4 * 1024 * 1024);
  const head = await blob.slice(0, rangeSize).arrayBuffer();
  let rate = parseMp4FrameRate(head) ?? fragmentedMp4FrameRate(head);
  if (rate !== null || blob.size <= rangeSize) return rate;
  const tail = await blob.slice(Math.max(0, blob.size - rangeSize)).arrayBuffer();
  rate = parseMp4FrameRate(tail);
  return rate;
}

export async function measureSourceFrameRate(video, sampleMs = 600) {
  if (typeof video?.requestVideoFrameCallback !== "function") {
    const sourcePlayable = video?.readyState >= 2 && video.videoWidth > 0;
    return {
      frameRate: MAX_VIDEO_FRAME_RATE,
      observedFrameRate: null,
      reportedFrameRate: null,
      playbackVerified: sourcePlayable,
      sourcePlayable,
      hasAudioTrack: null,
    };
  }
  const wasPaused = video.paused !== false;
  const wasMuted = video.muted;
  const originalTime = Number(video.currentTime);
  let probeStream = null;
  const captureSource = video.captureStream || video.mozCaptureStream;
  try { if (typeof captureSource === "function") probeStream = captureSource.call(video); } catch {}
  const frameTimes = [];
  let callbackId = null;
  let finishSample;
  let firstFrameAt = null;
  let sourcePlayable = false;
  const sampling = new Promise(resolve => {
    finishSample = resolve;
    const onFrame = (timestamp, metadata) => {
      firstFrameAt ??= timestamp;
      const mediaTime = Number(metadata?.mediaTime);
      const previousMediaTime = frameTimes.length ? frameTimes[frameTimes.length - 1].mediaTime : NaN;
      if (!Number.isFinite(mediaTime) || mediaTime > previousMediaTime + 0.0001) {
        frameTimes.push({ timestamp, mediaTime });
      }
      if (timestamp - firstFrameAt >= sampleMs) {
        resolve(timestamp);
        return;
      }
      try { callbackId = video.requestVideoFrameCallback(onFrame); }
      catch { resolve(timestamp); }
    };
    try { callbackId = video.requestVideoFrameCallback(onFrame); }
    catch { resolve(performance.now()); }
  });
  const ended = () => finishSample?.(performance.now());
  video.addEventListener?.("ended", ended, { once: true });
  try {
    video.muted = true;
    await withTimeout(video.play(), 5_000, "This video could not be sampled for frame rate.");
    sourcePlayable = video.readyState >= 2 && video.videoWidth > 0;
    await withTimeout(sampling, Math.max(1_200, sampleMs * 2), "Frame-rate sampling timed out.");
    if (frameTimes.length < 2) {
      return {
        frameRate: MAX_VIDEO_FRAME_RATE,
        observedFrameRate: null,
        reportedFrameRate: null,
        playbackVerified: false,
        sourcePlayable,
        hasAudioTrack: probeStream?.getAudioTracks?.().length > 0,
      };
    }
    const elapsed = frameTimes[frameTimes.length - 1].timestamp - frameTimes[0].timestamp;
    if (!(elapsed > 0)) {
      return {
        frameRate: MAX_VIDEO_FRAME_RATE,
        observedFrameRate: null,
        reportedFrameRate: null,
        playbackVerified: false,
        sourcePlayable,
        hasAudioTrack: probeStream?.getAudioTracks?.().length > 0,
      };
    }
    const observedRate = (frameTimes.length - 1) * 1000 / elapsed;
    const trackRate = Number(probeStream?.getVideoTracks?.()[0]?.getSettings?.().frameRate);
    const sourceRate = Number.isFinite(trackRate) && trackRate > 0
      ? Math.max(observedRate, trackRate)
      : observedRate;
    return {
      frameRate: Math.max(1, Math.min(120, Math.round(sourceRate))),
      observedFrameRate: Math.max(1, Math.min(120, Math.round(observedRate))),
      reportedFrameRate: Number.isFinite(trackRate) && trackRate > 0 ? trackRate : null,
      playbackVerified: true,
      sourcePlayable,
      hasAudioTrack: probeStream?.getAudioTracks?.().length > 0,
    };
  } catch {
    // If a browser cannot expose frame callbacks, request the 60 fps ceiling.
    // The canvas only redraws when the source time advances, so this does not
    // invent extra source frames.
    return {
      frameRate: MAX_VIDEO_FRAME_RATE,
      observedFrameRate: null,
      reportedFrameRate: null,
      playbackVerified: false,
      sourcePlayable,
      hasAudioTrack: probeStream?.getAudioTracks?.().length > 0,
    };
  } finally {
    if (callbackId !== null && typeof video.cancelVideoFrameCallback === "function") {
      video.cancelVideoFrameCallback(callbackId);
    }
    for (const track of probeStream?.getTracks?.() || []) track.stop();
    video.removeEventListener?.("ended", ended);
    video.pause();
    if (Number.isFinite(originalTime) && video.readyState >= 1 &&
        Math.abs(Number(video.currentTime) - originalTime) > 0.01) {
      let restoreTimer;
      await Promise.race([
        new Promise(resolve => {
          const restored = () => {
            clearTimeout(restoreTimer);
            video.removeEventListener("seeked", restored);
            resolve();
          };
          video.addEventListener("seeked", restored, { once: true });
          video.currentTime = originalTime;
          restoreTimer = setTimeout(restored, 1_500);
        }),
      ]);
    }
    video.muted = wasMuted;
    if (!wasPaused) await video.play().catch(() => {});
  }
}

// Call directly from the user's Publish tap so Safari can unlock Web Audio
// before rendering and upload work introduces asynchronous delays.
export function createVideoAudioSession(existingContext = null) {
  const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AudioContextClass && !existingContext) return null;
  let context;
  let oscillator;
  let gain;
  let closed = false;
  let ownsContext = !existingContext;
  try {
    context = existingContext || new AudioContextClass();
    const ready = Promise.resolve(context.resume());
    ready.catch(() => {});
    oscillator = context.createOscillator();
    gain = context.createGain();
    gain.gain.value = 0;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    return {
      context,
      ready,
      retainContext() { ownsContext = false; },
      async close() {
        if (closed) return;
        closed = true;
        try { oscillator.stop(); } catch {}
        try { oscillator.disconnect(); } catch {}
        try { gain.disconnect(); } catch {}
        if (ownsContext && context.state !== "closed") await context.close().catch(() => {});
      },
    };
  } catch {
    try { oscillator?.stop(); } catch {}
    try { if (ownsContext) context?.close(); } catch {}
    return null;
  }
}

function abortError(message = "Video preparation canceled. Your post is still in the editor.") {
  const error = new Error(message);
  error.name = "AbortError";
  return error;
}

function throwIfAborted(signal) {
  if (signal?.aborted) throw abortError();
}

function withAbort(promise, signal) {
  if (!signal) return promise;
  throwIfAborted(signal);
  let onAbort;
  const canceled = new Promise((_, reject) => {
    onAbort = () => reject(abortError());
    signal.addEventListener("abort", onAbort, { once: true });
  });
  return Promise.race([promise, canceled]).finally(() => signal.removeEventListener("abort", onAbort));
}

function report(onProgress, fraction, phase, details) {
  try { onProgress?.(Math.max(0, Math.min(1, fraction)), phase, details); } catch {}
}

function waitForMetadata(video, timeoutMs = 15_000) {
  if (video.readyState >= 1 && video.videoWidth && video.videoHeight) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let timer;
    const loaded = () => { cleanup(); resolve(); };
    const failed = () => { cleanup(); reject(new Error("This video could not be opened for optimization. The original was not uploaded.")); };
    const cleanup = () => {
      clearTimeout(timer);
      video.removeEventListener("loadedmetadata", loaded);
      video.removeEventListener("error", failed);
    };
    video.addEventListener("loadedmetadata", loaded, { once: true });
    video.addEventListener("error", failed, { once: true });
    timer = setTimeout(() => {
      cleanup();
      reject(new Error("This video took too long to prepare. Check your connection to the photo library and try again."));
    }, timeoutMs);
  });
}

function waitForSeek(video, timeoutMs = 10_000) {
  if (video.readyState >= 2) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let timer;
    const loaded = () => { cleanup(); resolve(); };
    const failed = () => { cleanup(); reject(new Error("A video thumbnail could not be prepared.")); };
    const cleanup = () => {
      clearTimeout(timer);
      video.removeEventListener("seeked", loaded);
      video.removeEventListener("loadeddata", loaded);
      video.removeEventListener("error", failed);
    };
    video.addEventListener("seeked", loaded, { once: true });
    video.addEventListener("loadeddata", loaded, { once: true });
    video.addEventListener("error", failed, { once: true });
    timer = setTimeout(() => {
      cleanup();
      reject(new Error("The video stopped responding while preparing. Try choosing it again."));
    }, timeoutMs);
  });
}

function withTimeout(promise, timeoutMs, message) {
  let timer;
  return Promise.race([
    Promise.resolve(promise),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(typeof message === "function" ? message() : new Error(message)), timeoutMs);
    }),
  ]).finally(() => clearTimeout(timer));
}

async function hasSupportedVideoSignature(blob) {
  const mimeType = String(blob?.type || "").split(";")[0].toLowerCase();
  const bytes = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
  if (mimeType === "video/mp4") {
    return bytes.length >= 8 && String.fromCharCode(...bytes.subarray(4, 8)) === "ftyp";
  }
  if (mimeType === "video/webm") {
    return bytes.length >= 4 && bytes[0] === 0x1a && bytes[1] === 0x45 &&
      bytes[2] === 0xdf && bytes[3] === 0xa3;
  }
  return false;
}

async function inspectVideoContainer(blob) {
  let input;
  try {
    const m = await import("mediabunny");
    input = new m.Input({ source: new m.BlobSource(blob), formats: m.ALL_FORMATS });
    const [videoTrack, audioTrack] = await Promise.all([
      input.getPrimaryVideoTrack(), input.getPrimaryAudioTrack(),
    ]);
    if (!videoTrack) return null;
    const [width, height, metadataDuration, stats, videoCodec, audioCodec] = await Promise.all([
      videoTrack.getDisplayWidth(),
      videoTrack.getDisplayHeight(),
      videoTrack.getDurationFromMetadata(),
      videoTrack.computePacketStats(500),
      videoTrack.getCodec(),
      audioTrack?.getCodec() ?? Promise.resolve(null),
    ]);
    const duration = Number.isFinite(metadataDuration) && metadataDuration > 0
      ? metadataDuration : await videoTrack.computeDuration();
    return {
      width, height, duration,
      frameRate: stats?.averagePacketRate ?? null,
      hasAudioTrack: !!audioTrack,
      videoCodec, audioCodec,
    };
  } catch {
    return null;
  } finally {
    try { await input?.dispose?.(); } catch {}
  }
}

async function inspectEncodedVideo(blob, durationHint) {
  const sourceUrl = URL.createObjectURL(blob);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  try {
    const metadata = waitForMetadata(video);
    video.src = sourceUrl;
    video.load();
    await metadata;
    const decodeSize = fitVideoTo1080p(video.videoWidth, video.videoHeight);
    video.style.cssText = `position:fixed;left:0;top:0;width:${decodeSize.width}px;height:${decodeSize.height}px;opacity:0.001;pointer-events:none;z-index:-1`;
    const [sample, container] = await Promise.all([
      measureSourceFrameRate(video, 900), inspectVideoContainer(blob),
    ]);
    const containerFrameRate = await readVideoFrameRate(blob);
    const playbackFrameRate = sample.observedFrameRate;
    const frameRate = container?.frameRate ?? containerFrameRate ?? playbackFrameRate ?? sample.reportedFrameRate;
    return {
      width: container?.width || video.videoWidth,
      height: container?.height || video.videoHeight,
      duration: container?.duration || (Number.isFinite(video.duration) && video.duration > 0 ? video.duration : null),
      frameRate,
      playbackVerified: !!container?.videoCodec && video.readyState >= 2 &&
        Number.isFinite(frameRate) || sample.sourcePlayable && sample.playbackVerified,
      hasAudioTrack: container?.hasAudioTrack ?? sample.hasAudioTrack,
      videoCodec: container?.videoCodec ?? null,
      audioCodec: container?.audioCodec ?? null,
      durationHint,
    };
  } catch {
    return {
      width: 0, height: 0, duration: null, frameRate: null,
      playbackVerified: false, hasAudioTrack: null, videoCodec: null, audioCodec: null, durationHint,
    };
  } finally {
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.remove();
    URL.revokeObjectURL(sourceUrl);
  }
}

/** Create a small, separate poster image from the optimized video for feed tiles. */
export async function generateVideoThumbnail(blob) {
  if (!(blob instanceof Blob) || !blob.size || !String(blob.type || "").startsWith("video/")) {
    throw new Error("A video is required to generate its feed thumbnail.");
  }
  if (!globalThis.document?.createElement || typeof URL?.createObjectURL !== "function") {
    throw new Error("This browser cannot prepare a video thumbnail.");
  }
  const sourceUrl = URL.createObjectURL(blob);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "metadata";
  try {
    const metadata = waitForMetadata(video);
    video.src = sourceUrl;
    video.load();
    await metadata;
    const width = Number(video.videoWidth);
    const height = Number(video.videoHeight);
    if (!(width > 0 && height > 0)) throw new Error("The video dimensions could not be read for its thumbnail.");
    const seekTime = Math.min(0.25, Math.max(0, Number(video.duration || 0) / 2));
    if (seekTime > 0) {
      video.currentTime = seekTime;
      await waitForSeek(video);
    }
    const scale = Math.min(1, 1080 / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("This browser cannot draw the video thumbnail.");
    context.imageSmoothingQuality = "high";
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const encode = type => new Promise(resolve => {
      try {
        canvas.toBlob(resolve, type, type === "image/png" ? undefined : 0.82);
      } catch {
        resolve(null);
      }
    });
    let thumbnail = null;
    // Safari may return PNG when WebP is requested but unsupported. Check the
    // actual Blob type and continue to JPEG instead of rejecting that fallback.
    for (const type of ["image/webp", "image/jpeg", "image/png"]) {
      const candidate = await encode(type);
      if (candidate?.size && candidate.type === type) {
        thumbnail = candidate;
        break;
      }
    }
    if (!thumbnail?.size || !/^image\/(webp|jpeg|png)$/.test(thumbnail.type)) {
      throw new Error("The video thumbnail could not be verified.");
    }
    return thumbnail;
  } finally {
    video.pause();
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(sourceUrl);
  }
}

async function transcodeWithWebCodecs(blob, plan, { onProgress, onDiagnostic, signal } = {}) {
  if (typeof globalThis.VideoEncoder !== "function") return null;
  throwIfAborted(signal);
  let input;
  try {
    const m = await import("mediabunny");
    input = new m.Input({ source: new m.BlobSource(blob), formats: m.ALL_FORMATS });
    const [videoTrack, audioTrack] = await Promise.all([
      input.getPrimaryVideoTrack(), input.getPrimaryAudioTrack(),
    ]);
    if (!videoTrack) return null;
    const audioSettings = audioTrack ? {
      numberOfChannels: await audioTrack.getNumberOfChannels() || 2,
      sampleRate: await audioTrack.getSampleRate() || 48_000,
      bitrate: plan.audioBitsPerSecond,
    } : null;
    const formats = [
      { format: new m.Mp4OutputFormat(), videoCodec: "avc", audioCodec: "aac" },
      { format: new m.WebMOutputFormat(), videoCodec: ["vp9", "vp8"], audioCodec: "opus" },
    ];
    let lastFailure = null;
    for (const candidate of formats) {
      throwIfAborted(signal);
      const supportedVideoCodecs = candidate.format.getSupportedVideoCodecs()
        .filter(codec => (Array.isArray(candidate.videoCodec) ? candidate.videoCodec : [candidate.videoCodec]).includes(codec));
      const videoCodec = await m.getFirstEncodableVideoCodec(supportedVideoCodecs, {
        width: plan.width, height: plan.height, bitrate: plan.videoBitsPerSecond,
      });
      const supportedAudioCodecs = candidate.format.getSupportedAudioCodecs()
        .filter(codec => codec === candidate.audioCodec);
      const audioCodec = audioTrack
        ? await m.getFirstEncodableAudioCodec(supportedAudioCodecs, audioSettings)
        : null;
      if (!videoCodec || (audioTrack && !audioCodec)) continue;

      let output, conversion, completed = false;
      const target = new m.BufferTarget();
      const onAbort = () => { void conversion?.cancel?.().catch(() => {}); };
      try {
        output = new m.Output({ format: candidate.format, target });
        conversion = await m.Conversion.init({
          input,
          output,
          tracks: "primary",
          video: {
            codec: videoCodec,
            width: plan.width,
            height: plan.height,
            fit: "contain",
            frameRate: plan.frameRate,
            bitrate: plan.videoBitsPerSecond,
            keyFrameInterval: 2,
            allowTransformationMetadata: false,
          },
          audio: audioTrack ? {
            codec: audioCodec,
            bitrate: plan.audioBitsPerSecond,
            forceTranscode: true,
          } : { discard: true },
          copy: false,
          showWarnings: false,
        });
        const utilizedAudio = conversion.utilizedTracks.some(track => track.type === "audio");
        onDiagnostic?.({
          stage: "webcodecs-plan", valid: conversion.isValid, mimeType: candidate.format.mimeType,
          videoCodec, audioCodec, utilizedAudio,
          discardedTracks: conversion.discardedTracks.map(item => ({
            type: item.track?.type || "", reason: item.reason || "",
          })),
        });
        if (!conversion.isValid || (audioTrack && !utilizedAudio)) continue;
        conversion.onProgress = (fraction, processedSeconds) => report(onProgress, fraction, "compressing", {
          originalBytes: blob.size,
          processedSeconds,
          durationSeconds: plan.duration,
          profile: plan.profile,
          targetWidth: plan.width,
          targetHeight: plan.height,
          targetFrameRate: plan.frameRate,
          targetVideoBitrate: plan.videoBitsPerSecond,
          targetAudioBitrate: plan.audioBitsPerSecond,
          encoder: "webcodecs",
          outputFormat: candidate.format.mimeType,
        });
        signal?.addEventListener("abort", onAbort, { once: true });
        throwIfAborted(signal);
        await conversion.execute();
        throwIfAborted(signal);
        if (!target.buffer?.byteLength) continue;
        completed = true;
        return new Blob([target.buffer], { type: candidate.format.mimeType });
      } catch (error) {
        if (signal?.aborted || error?.name === "AbortError") throw error;
        lastFailure = error;
      } finally {
        signal?.removeEventListener("abort", onAbort);
        if (!completed && conversion) await conversion.cancel().catch(() => {});
        if (!completed && output) await output.cancel().catch(() => {});
      }
    }
    if (lastFailure) {
      try { onDiagnostic?.({ stage: "webcodecs-encode", name: lastFailure?.name || "Error", message: lastFailure?.message || String(lastFailure) }); } catch {}
    }
    return null;
  } catch (error) {
    if (signal?.aborted || error?.name === "AbortError") throw error;
    try { onDiagnostic?.({ stage: "webcodecs-encode", name: error?.name || "Error", message: error?.message || String(error) }); } catch {}
    return null;
  } finally {
    try { await input?.dispose?.(); } catch {}
  }
}

function seekToStart(video, timeoutMs = 10_000) {
  if (video.currentTime === 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let timer;
    const done = () => { cleanup(); resolve(); };
    const failed = () => { cleanup(); reject(new Error("This video could not be prepared for optimization.")); };
    const cleanup = () => {
      clearTimeout(timer);
      video.removeEventListener("seeked", done);
      video.removeEventListener("error", failed);
    };
    video.addEventListener("seeked", done, { once: true });
    video.addEventListener("error", failed, { once: true });
    timer = setTimeout(() => {
      cleanup();
      reject(new Error("The video stopped responding while preparing. Try choosing it again."));
    }, timeoutMs);
    video.currentTime = 0;
  });
}

function getFiniteDuration(video) {
  if (Number.isFinite(video.duration) && video.duration > 0) {
    return Promise.resolve(validateVideoDuration(video.duration));
  }
  if (video.ended && Number.isFinite(video.currentTime) && video.currentTime > 0) {
    return Promise.resolve(validateVideoDuration(video.currentTime));
  }
  // Some browser-recorded WebM files omit duration metadata. They are still
  // playable; measure their actual timeline instead of rejecting or uploading
  // the original unoptimized file.
  return new Promise((resolve, reject) => {
    let deadlineTimer;
    let stallTimer;
    const fail = error => {
      cleanup();
      video.pause();
      reject(error);
    };
    const ended = () => {
      cleanup();
      const duration = Number(video.currentTime);
      try { resolve(validateVideoDuration(duration)); }
      catch (error) { reject(error); }
    };
    const failed = () => {
      cleanup();
      reject(new Error("The video duration could not be measured. The original was not uploaded."));
    };
    const checkLimit = () => {
      if (Number(video.currentTime) > MAX_VIDEO_DURATION_SECONDS) fail(videoDurationLimitError());
      else {
        clearTimeout(stallTimer);
        stallTimer = setTimeout(() => fail(new Error("The video stopped playing while its duration was being checked. Try choosing it again.")), 15_000);
      }
    };
    const cleanup = () => {
      clearTimeout(deadlineTimer);
      clearTimeout(stallTimer);
      video.removeEventListener("ended", ended);
      video.removeEventListener("error", failed);
      video.removeEventListener("timeupdate", checkLimit);
    };
    video.addEventListener("ended", ended, { once: true });
    video.addEventListener("error", failed, { once: true });
    video.addEventListener("timeupdate", checkLimit);
    deadlineTimer = setTimeout(() => fail(new Error("The video duration could not be measured in time. Try choosing it again.")),
      (MAX_VIDEO_DURATION_SECONDS + 15) * 1000);
    checkLimit();
  });
}

/**
 * Re-encode newly uploaded videos in browser memory. Only the resulting Blob is
 * handed to the cloud upload path; no original is written to browser storage.
 */
export async function compressVideoTo720p(blob, {
  onProgress, audioSession = null, signal,
  profile = DEFAULT_VIDEO_COMPRESSION_PROFILE,
} = {}) {
  if (!(blob instanceof Blob) || !blob.size) throw new Error("Choose a video file first.");
  throwIfAborted(signal);
  if (!String(blob.type || "").toLowerCase().startsWith("video/")) return blob;

  const Recorder = globalThis.MediaRecorder;
  const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!globalThis.document?.createElement) throw new Error("This browser cannot prepare the video. The original was not uploaded. Update your browser and retry.");

  const sourceUrl = URL.createObjectURL(blob);
  const video = document.createElement("video");
  video.playsInline = true;
  video.muted = true;
  video.preload = "auto";
  video.controls = false;
  video.style.cssText = "position:fixed;left:-4px;top:-4px;width:2px;height:2px;opacity:0;pointer-events:none";
  let audioContext;
  let audioDestination;
  let canvasStream;
  let sourceCaptureStream;
  let directCapture = false;
  let drawFrame = 0;
  let videoFrameCallback = null;
  let recorder;
  let handleVideoEnded;
  let observePlaybackEnd;
  let didReportFailure = false;
  const stopForAbort = () => {
    video.pause();
    if (recorder?.state !== "inactive") {
      try { recorder.stop(); } catch {}
    }
  };
  const ownsAudioContext = !audioSession?.context;
  try {
    document.body.append(video);
    signal?.addEventListener("abort", stopForAbort, { once: true });
    const metadata = withAbort(waitForMetadata(video), signal);
    video.src = sourceUrl;
    video.load();
    await metadata;
    throwIfAborted(signal);
    const decodeSize = fitVideoTo1080p(video.videoWidth, video.videoHeight);
    // Keep the source at its intended decode size while sampling and
    // recording; tiny hidden elements can throttle browser video callbacks.
    video.style.cssText = `position:fixed;left:0;top:0;width:${decodeSize.width}px;height:${decodeSize.height}px;opacity:0.001;pointer-events:none;z-index:-1`;
    // Most uploaded containers include a duration in their header. Reject an
    // over-limit file before playing it or starting its encoder.
    let duration;
    if (Number.isFinite(video.duration) && video.duration > 0) {
      duration = validateVideoDuration(video.duration);
    } else {
      await withAbort(withTimeout(video.play(), 10_000, "This browser could not start the video. The original was not uploaded."), signal);
      duration = await getFiniteDuration(video);
      video.pause();
    }
    const parsedFrameRate = await readVideoFrameRate(blob);
    const sourceMime = String(blob.type || "").split(";")[0].toLowerCase();
    const sourceContainer = await inspectVideoContainer(blob);
    const supportedContainer = sourceMime === "video/mp4" || sourceMime === "video/webm";
    const canPlaySource = typeof video.canPlayType !== "function" || !!video.canPlayType(sourceMime);
    const sourceSignatureValid = await hasSupportedVideoSignature(blob);
    const metadataPlayable = video.readyState >= 1 && video.videoWidth > 0 && video.videoHeight > 0;
    const sourceCodecCompatible = sourceMime === "video/mp4"
      ? sourceContainer?.videoCodec === "avc" &&
        (sourceContainer.hasAudioTrack !== true || sourceContainer.audioCodec === "aac")
      : sourceMime === "video/webm"
        ? ["vp8", "vp9", "av1"].includes(sourceContainer?.videoCodec) &&
          (sourceContainer.hasAudioTrack !== true || ["opus", "vorbis"].includes(sourceContainer.audioCodec))
        : false;
    const metadataCompatible = supportedContainer && canPlaySource && sourceSignatureValid &&
      metadataPlayable && parsedFrameRate !== null && sourceCodecCompatible;
    if (metadataCompatible) {
      const metadataPlan = videoCompressionPlan({
        width: video.videoWidth,
        height: video.videoHeight,
        size: blob.size,
        duration,
        frameRate: parsedFrameRate,
        compatible: sourceCodecCompatible,
        profile,
      });
      if (!metadataPlan.needsEncoding) {
        // A supported, metadata-verified file already within the upload
        // profile needs no hidden playback. Besides avoiding a needless
        // encode, this keeps iOS autoplay policy out of the pass-through path.
        report(onProgress, 1, "compressing", {
          originalBytes: blob.size, optimizedBytes: blob.size, profile: metadataPlan.profile,
          width: video.videoWidth, height: video.videoHeight, frameRate: parsedFrameRate, encoder: "pass-through",
        });
        return blob;
      }
    }
    const sampledRate = await measureSourceFrameRate(video);
    throwIfAborted(signal);
    const sourceFrameRate = parsedFrameRate ?? sampledRate.frameRate;
    const sourceFrameRateVerified = parsedFrameRate !== null || sampledRate.playbackVerified;
    const compatible = supportedContainer && canPlaySource &&
      sourceSignatureValid && (sampledRate.sourcePlayable || metadataPlayable) && sourceFrameRateVerified &&
      sourceCodecCompatible;
    const plan = videoCompressionPlan({
      width: video.videoWidth,
      height: video.videoHeight,
      size: blob.size,
      duration,
      frameRate: sourceFrameRate,
      compatible,
      profile,
    });
    if (!plan.needsEncoding) {
      report(onProgress, 1, "compressing", {
        originalBytes: blob.size, optimizedBytes: blob.size, profile: plan.profile,
        width: video.videoWidth, height: video.videoHeight, frameRate: sourceFrameRate, encoder: "pass-through",
      });
      return blob;
    }
    let webCodecsDiagnostics = null;
    const webCodecsOutput = await transcodeWithWebCodecs(blob, plan, {
      onProgress, signal, onDiagnostic: value => { webCodecsDiagnostics = { ...webCodecsDiagnostics, ...value }; },
    });
    throwIfAborted(signal);
    if (webCodecsOutput) {
      const encoded = await withAbort(inspectEncodedVideo(webCodecsOutput, duration), signal);
      const durationTolerance = Math.max(0.15, duration * 0.02);
      const frameRateValid = Number.isFinite(encoded.frameRate) &&
        encoded.frameRate >= plan.frameRate * 0.95 && encoded.frameRate <= plan.frameRate * 1.05;
      const dimensionsValid = encoded.width === plan.width && encoded.height === plan.height;
      const durationValid = Number.isFinite(encoded.duration) &&
        Math.abs(encoded.duration - duration) <= durationTolerance &&
        encoded.duration <= MAX_VIDEO_DURATION_SECONDS;
      const audioValid = sampledRate.hasAudioTrack !== true || encoded.hasAudioTrack === true;
      const codecValid = webCodecsOutput.type === "video/mp4"
        ? encoded.videoCodec === "avc" && (sampledRate.hasAudioTrack !== true || encoded.audioCodec === "aac")
        : webCodecsOutput.type === "video/webm"
          ? ["vp8", "vp9", "av1"].includes(encoded.videoCodec) &&
            (sampledRate.hasAudioTrack !== true || encoded.audioCodec === "opus")
          : false;
      const bitrate = encoded.duration ? webCodecsOutput.size * 8 / encoded.duration : Infinity;
      const bitrateValid = bitrate <= plan.targetTotalBitrate * 1.25;
      webCodecsDiagnostics = {
        ...webCodecsDiagnostics,
        stage: "webcodecs-validation", size: webCodecsOutput.size,
        encoded, checks: { frameRateValid, dimensionsValid, durationValid, audioValid, codecValid, bitrateValid },
      };
      if (encoded.playbackVerified && frameRateValid && dimensionsValid &&
          durationValid && audioValid && codecValid && bitrateValid) {
        report(onProgress, 1, "compressing", {
          originalBytes: blob.size, optimizedBytes: webCodecsOutput.size, profile: plan.profile,
          width: encoded.width, height: encoded.height, frameRate: encoded.frameRate, encoder: "webcodecs",
        });
        return webCodecsOutput;
      }
    }
    if (sampledRate.observedFrameRate &&
        sourceFrameRate > sampledRate.observedFrameRate * 1.05) {
      if (plan.profile === VIDEO_COMPRESSION_PROFILE.HIGH_QUALITY &&
          plan.width === video.videoWidth && plan.height === video.videoHeight && compatible) {
        // Preserve the original rather than silently dropping frames on a
        // device whose decoder/recorder cannot keep pace with the source.
        report(onProgress, 1, "original-preserved", {
          originalBytes: blob.size, optimizedBytes: blob.size, profile: plan.profile,
          width: video.videoWidth, height: video.videoHeight, frameRate: sourceFrameRate, encoder: "pass-through",
        });
        return blob;
      }
      throw new Error("This device cannot re-encode the video at its original frame rate. The original was not uploaded.");
    }

    if (!Recorder || !AudioContextClass ||
        typeof document.createElement("canvas").captureStream !== "function") {
      throw new Error("This browser cannot optimize the video to 1080p. Update your browser and retry; the original was not uploaded.");
    }
    const mimeType = videoMimeType(Recorder);
    if (!mimeType) {
      throw new Error("This browser has no supported video encoder. Update your browser and retry; the original was not uploaded.");
    }

    video.pause();
    await withAbort(seekToStart(video), signal);
    audioContext = audioSession?.context || new AudioContextClass();
    audioDestination = audioContext.createMediaStreamDestination();
    audioContext.createMediaElementSource(video).connect(audioDestination);
    // Start muted so Safari allows playback after the async preparation work.
    // Web Audio routes the source only to the recorder stream, never speakers.
    video.muted = true;
    try {
      if (audioContext.state !== "running" && audioSession?.ready) {
        await withAbort(withTimeout(audioSession.ready, 8_000, AUDIO_PREPARATION_ERROR), signal);
      }
      if (audioContext.state !== "running") {
        await withAbort(withTimeout(audioContext.resume(), 8_000, AUDIO_PREPARATION_ERROR), signal);
      }
      if (audioContext.state !== "running") throw new Error(AUDIO_PREPARATION_ERROR);
    } catch (cause) {
      throw new Error(AUDIO_PREPARATION_ERROR, { cause });
    }
    let context = null;
    const captureSource = video.captureStream || video.mozCaptureStream;
    if (plan.width === video.videoWidth && plan.height === video.videoHeight &&
        sourceFrameRate <= plan.frameRate &&
        typeof captureSource === "function" && typeof globalThis.MediaStream === "function") {
      try {
        sourceCaptureStream = captureSource.call(video);
        const sourceTracks = sourceCaptureStream.getVideoTracks();
        if (sourceTracks.length) {
          canvasStream = new MediaStream(sourceTracks);
          directCapture = true;
          for (const track of sourceCaptureStream.getAudioTracks()) track.stop();
        }
      } catch {
        for (const track of sourceCaptureStream?.getTracks?.() || []) track.stop();
        sourceCaptureStream = null;
      }
    }
    if (!directCapture) {
      const canvas = document.createElement("canvas");
      canvas.width = plan.width;
      canvas.height = plan.height;
      context = canvas.getContext("2d", { alpha: false });
      if (!context) throw new Error("This browser cannot prepare the video encoder.");
      canvasStream = canvas.captureStream(plan.frameRate);
    }
    for (const track of audioDestination.stream.getAudioTracks()) canvasStream.addTrack(track);

    try {
      recorder = new Recorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: plan.videoBitsPerSecond,
        audioBitsPerSecond: plan.audioBitsPerSecond,
        videoBitrateMode: "variable",
      });
    } catch {
      throw new Error("This browser could not start the 1080p video encoder. The original was not uploaded.");
    }
    const chunks = [];
    let rejectRecording;
    let stopRequested = false;
    let endedEventSeen = false;
    const stopRecorder = () => {
      if (!recorder || recorder.state === "inactive" || stopRequested) return;
      stopRequested = true;
      try {
        recorder.stop();
      } catch (error) {
        didReportFailure = true;
        rejectRecording?.(error);
      }
    };
    observePlaybackEnd = () => {
      if (video.ended) endedEventSeen = true;
      if (videoCaptureReachedEnd(video, duration, plan.frameRate)) stopRecorder();
    };
    handleVideoEnded = () => {
      endedEventSeen = true;
      stopRecorder();
    };
    const recordingDone = new Promise((resolve, reject) => {
      rejectRecording = reject;
      recorder.addEventListener("dataavailable", event => {
        if (event.data?.size) chunks.push(event.data);
      });
      recorder.addEventListener("error", event => {
        didReportFailure = true;
        reject(event?.error || recorder.error || new Error("The video could not be optimized. The original was not uploaded."));
      }, { once: true });
      recorder.addEventListener("stop", resolve, { once: true });
      video.addEventListener("ended", handleVideoEnded, { once: true });
    });
    recordingDone.catch(() => {});
    let lastProgressAt = 0;
    let lastDrawAt = -Infinity;
    let lastSourceFrameTime = -Infinity;
    let scheduleDraw = () => {};
    const draw = (timestamp, metadata) => {
      videoFrameCallback = null;
      const sourceFrameTime = Number.isFinite(Number(metadata?.mediaTime))
        ? Number(metadata.mediaTime) : Number(video.currentTime);
      // Draw each distinct decoded source frame, up to the source frame-rate
      // limit. This avoids forcing 30/60 fps media through a 24 fps timer.
      if (!directCapture && context && video.readyState >= 2 &&
          sourceFrameTime > lastSourceFrameTime + 0.0001 &&
          timestamp - lastDrawAt >= 1000 / plan.frameRate - 1) {
        lastDrawAt = timestamp;
        lastSourceFrameTime = sourceFrameTime;
        try { context.drawImage(video, 0, 0, plan.width, plan.height); }
        catch {
          if (!didReportFailure) {
            didReportFailure = true;
            if (recorder?.state !== "inactive") recorder?.stop();
          }
        }
      }
      if (timestamp - lastProgressAt >= 400) {
        lastProgressAt = timestamp;
        report(onProgress, video.duration ? video.currentTime / video.duration : 0, "compressing", {
          originalBytes: blob.size, profile: plan.profile, targetWidth: plan.width,
          targetHeight: plan.height, targetFrameRate: plan.frameRate,
          targetVideoBitrate: plan.videoBitsPerSecond, targetAudioBitrate: plan.audioBitsPerSecond,
          encoder: "mediarecorder",
        });
      }
      if (videoCaptureReachedEnd(video, duration, plan.frameRate)) stopRecorder();
      else if (recorder?.state !== "inactive") scheduleDraw();
    };
    scheduleDraw = () => {
      if (typeof video.requestVideoFrameCallback === "function") {
        try {
          videoFrameCallback = video.requestVideoFrameCallback(draw);
          return;
        } catch {}
      }
      drawFrame = requestAnimationFrame(draw);
    };
    scheduleDraw();
    video.addEventListener("timeupdate", observePlaybackEnd);
    recorder.start(500);
    try {
      await withTimeout(startMutedCapturePlayback(video), 10_000,
        "This browser could not start video optimization. The original was not uploaded.");
    } catch (error) {
      if (error?.name === "NotAllowedError" && error && typeof error === "object") {
        error.videoDiagnostics = {
          operation: "start-muted-capture-playback",
          mimeType: sourceMime,
          width: video.videoWidth,
          height: video.videoHeight,
          durationSeconds: Number.isFinite(duration) ? Number(duration.toFixed(3)) : null,
          frameRate: Number.isFinite(sourceFrameRate) ? sourceFrameRate : null,
          parsedFrameRate: Number.isFinite(parsedFrameRate) ? parsedFrameRate : null,
          observedFrameRate: Number.isFinite(sampledRate.observedFrameRate) ? sampledRate.observedFrameRate : null,
          averageBitrate: Math.round(plan.averageBitrate),
          targetBitrate: Math.round(plan.targetTotalBitrate),
          plannedWidth: plan.width,
          plannedHeight: plan.height,
          encodingRequired: plan.needsEncoding,
          compatible,
          canPlaySource,
          sourceSignatureValid,
          readyState: video.readyState,
          muted: video.muted,
          paused: video.paused,
          playbackTimeSeconds: Number(Number(video.currentTime || 0).toFixed(3)),
        };
      }
      // Preserve only a fully compatible source that already meets both the
      // resolution and bitrate profile. Never turn an autoplay denial into an
      // upload of an over-limit source or a file that still needs downscaling.
      if (error?.name === "NotAllowedError" && compatible &&
          plan.width === video.videoWidth && plan.height === video.videoHeight &&
          plan.averageBitrate <= plan.targetTotalBitrate * 1.25) {
        report(onProgress, 1, "compressing");
        return blob;
      }
      const canPreserveOriginal = error?.message?.startsWith("Video playback did not advance") &&
        compatible && sourceFrameRateVerified && sourceFrameRate <= MAX_VIDEO_FRAME_RATE &&
        plan.width === video.videoWidth && plan.height === video.videoHeight &&
        blob.size <= MAX_AUDIO_SAFE_PASSTHROUGH_BYTES;
      if (canPreserveOriginal) {
        const sourceHasAudio = sampledRate.hasAudioTrack === true ||
          await readVideoAudioPresence(blob) === true;
        if (sourceHasAudio) {
          // Publish only the complete source Blob, not a partial recording. It
          // already contains the finished sound mix, but costs more to upload.
          report(onProgress, 1, "original-preserved");
          return blob;
        }
      }
      throw error;
    }
    // Audio is routed through MediaStreamDestination, never the speakers.
    video.muted = false;
    await withAbort(withTimeout(recordingDone, Math.min(240_000, Math.max(45_000, duration * 3_000 + 15_000)), () => {
      const error = new Error("Video optimization stopped responding. Your edit is still here; try again.");
      error.videoDiagnostics = {
        durationSeconds: Number(duration.toFixed(3)),
        playbackSeconds: Number(Number(video.currentTime).toFixed(3)),
        mediaEnded: video.ended === true,
        endedEventSeen,
        recorderState: recorder?.state || null,
        chunkCount: chunks.length,
        recordedBytes: chunks.reduce((sum, chunk) => sum + chunk.size, 0),
        paused: video.paused === true,
        readyState: Number(video.readyState) || 0,
        networkState: Number(video.networkState) || 0,
        mediaErrorCode: Number(video.error?.code) || null,
        muted: video.muted === true,
        playbackRate: Number(video.playbackRate) || null,
        visibilityState: document.visibilityState || null,
        frameRate: plan.frameRate,
        width: video.videoWidth,
        height: video.videoHeight,
      };
      return error;
    }), signal);
    throwIfAborted(signal);
    if (didReportFailure) throw new Error("The video could not be optimized. The original was not uploaded.");
    const outputType = String(recorder.mimeType || mimeType).split(";")[0].toLowerCase();
    const output = new Blob(chunks, { type: outputType });
    if (!output.size || !output.type.startsWith("video/")) {
      throw new Error("The 1080p video could not be verified. The original was not uploaded.");
    }
    const encoded = await inspectEncodedVideo(output, duration);
    const durationTolerance = Math.max(0.15, duration * 0.02);
    const frameRateValid = Number.isFinite(encoded.frameRate) &&
      encoded.frameRate >= plan.frameRate * 0.95 && encoded.frameRate <= plan.frameRate * 1.05;
    const dimensionsValid = encoded.width === plan.width && encoded.height === plan.height;
    const durationValid = Number.isFinite(encoded.duration) &&
      Math.abs(encoded.duration - duration) <= durationTolerance &&
      encoded.duration <= MAX_VIDEO_DURATION_SECONDS;
    const audioValid = sampledRate.hasAudioTrack !== true || encoded.hasAudioTrack === true;
      const codecValid = output.type === "video/mp4"
        ? encoded.videoCodec === "avc" && (sampledRate.hasAudioTrack !== true || encoded.audioCodec === "aac")
        : output.type === "video/webm"
          ? ["vp8", "vp9", "av1"].includes(encoded.videoCodec) &&
            (sampledRate.hasAudioTrack !== true || encoded.audioCodec === "opus")
          : false;
    const bitrate = encoded.duration ? output.size * 8 / encoded.duration : Infinity;
    const bitrateValid = bitrate <= plan.targetTotalBitrate * 1.25;
    if (!encoded.playbackVerified || !frameRateValid || !dimensionsValid ||
        !durationValid || !audioValid || !codecValid || !bitrateValid) {
      if (plan.width === video.videoWidth && plan.height === video.videoHeight &&
          sourceFrameRate <= plan.frameRate && compatible) {
        report(onProgress, 1, "original-preserved", {
          originalBytes: blob.size, optimizedBytes: blob.size, profile: plan.profile,
          width: video.videoWidth, height: video.videoHeight, frameRate: sourceFrameRate, encoder: "pass-through",
        });
        return blob;
      }
      const error = new Error("This device could not create a verified video without dropping frames or changing quality. The original was not uploaded.");
      error.videoDiagnostics = {
        source: { width: video.videoWidth, height: video.videoHeight, mime: sourceMime,
          parsedFrameRate, sampledRate, supportedContainer, canPlaySource, sourceSignatureValid,
          sourceContainer, sourceCodecCompatible, compatible },
        plan, encoded, webCodecs: webCodecsDiagnostics,
        checks: { frameRateValid, dimensionsValid, durationValid, audioValid, codecValid, bitrateValid },
      };
      throw error;
    }
    report(onProgress, 1, "compressing", {
      originalBytes: blob.size, optimizedBytes: output.size, profile: plan.profile,
      width: encoded.width, height: encoded.height, frameRate: encoded.frameRate, encoder: "mediarecorder",
    });
    return output;
  } catch (error) {
    if (signal?.aborted || error?.name === "AbortError") throw abortError();
    if (error?.name === "NotAllowedError") {
      throw new Error("Video preparation could not finish. Your edit is still here; tap Retry publish while keeping this page open. The original was not uploaded.", { cause: error });
    }
    if (error instanceof Error && /original was not uploaded/i.test(error.message)) throw error;
    if (error instanceof Error && error.message === "Choose a video file first.") throw error;
    const detail = error instanceof Error ? error.message : "An encoder error occurred.";
    const failure = new Error(`${detail} The original was not uploaded.`, { cause: error });
    if (error && typeof error === "object" && error.videoDiagnostics) {
      failure.videoDiagnostics = error.videoDiagnostics;
    }
    throw failure;
  } finally {
    signal?.removeEventListener("abort", stopForAbort);
    if (drawFrame) cancelAnimationFrame(drawFrame);
    if (videoFrameCallback !== null && typeof video.cancelVideoFrameCallback === "function") {
      video.cancelVideoFrameCallback(videoFrameCallback);
    }
    video.removeEventListener("ended", handleVideoEnded);
    video.removeEventListener("timeupdate", observePlaybackEnd);
    if (recorder?.state !== "inactive") {
      try { recorder.stop(); } catch {}
    }
    for (const track of canvasStream?.getTracks?.() || []) track.stop();
    for (const track of sourceCaptureStream?.getTracks?.() || []) track.stop();
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.remove();
    URL.revokeObjectURL(sourceUrl);
    if (ownsAudioContext && audioContext && audioContext.state !== "closed") {
      await audioContext.close().catch(() => {});
    }
  }
}
