import { createMatteSurface, foregroundConfidence } from "./remix-matte.js";

export async function createPersonCutout({ forceCpu = false, still = false } = {}) {
  const base = `${import.meta.env.BASE_URL}remix-assets/`;
  const probe = document.createElement("canvas");
  const graphics = probe.getContext("webgl2") || probe.getContext("webgl");
  graphics?.getExtension("WEBGL_lose_context")?.loseContext();
  if (forceCpu) {
    const { createCpuCutout } = await import("./remix-cutout-cpu.js");
    return createCpuCutout(base,{still});
  }
  let FilesetResolver, ImageSegmenter, files, segmenter;
  try {
    ({ FilesetResolver, ImageSegmenter } = await import("@mediapipe/tasks-vision"));
    files = await FilesetResolver.forVisionTasks(`${base}wasm`);
  } catch {
    const { createCpuCutout } = await import("./remix-cutout-cpu.js");
    return createCpuCutout(base,{still});
  }
  const options = delegate => ({
    baseOptions: { modelAssetPath: `${base}selfie_segmenter.tflite`, delegate },
    runningMode: still ? "IMAGE" : "VIDEO", outputCategoryMask: false, outputConfidenceMasks: true
  });
  try {
    if (graphics) {
      try { segmenter = await ImageSegmenter.createFromOptions(files, options("GPU")); }
      catch (gpuFailure) {
        console.warn("GPU person segmentation is unavailable; using the on-device CPU model.", gpuFailure);
        segmenter = await ImageSegmenter.createFromOptions(files, options("CPU"));
      }
    } else {
      segmenter = await ImageSegmenter.createFromOptions(files, options("CPU"));
    }
  } catch (modelFailure) {
    console.warn("MediaPipe person segmentation is unavailable; using the on-device fallback.", modelFailure);
    const { createCpuCutout } = await import("./remix-cutout-cpu.js");
    return createCpuCutout(base,{still});
  }
  const surface = createMatteSurface({ maxDimension: still ? 1024 : 640 }), labels = segmenter.getLabels();
  let lastTime = -1, lastVideo = null, closed = false, fallback = null, retired = false;
  let stillReady = false, stillSource = null, stillPending = null;
  const frame = (video, time) => {
      if (video.readyState < 2) return surface.canvas;
      if (lastVideo !== video) { lastVideo = video; surface.reset(); lastTime = -1; }
      if (time - lastTime < 85) return surface.canvas;
      lastTime = time;
      const result = segmenter.segmentForVideo(video, time);
      try {
        return surface.update(video, foregroundConfidence(result.confidenceMasks, labels));
      } finally { result.close(); }
  };
  const image = async source => {
    if(!still||closed)throw new Error("Still-image segmentation is unavailable.");
    if (stillSource === source && stillReady) return fallback ? fallback.frame(source, 0) : surface.canvas;
    if (stillSource === source && stillPending) return stillPending;
    stillSource = source;
    const operation = (async () => {
      try {
        const result = segmenter.segment(source);
        try {
          const output = surface.update(source, foregroundConfidence(result.confidenceMasks, labels));
          stillReady = true;
          return output;
        } finally { result.close(); }
      } catch (failure) {
        console.warn("Person cutout: switching to CPU after image segmentation failure", failure);
        segmenter.close(); retired = true;
        const { createCpuCutout } = await import("./remix-cutout-cpu.js");
        fallback = await createCpuCutout(base, { still: true });
        if (closed) { fallback.close(); throw failure; }
        const output = await fallback.image(source);
        stillReady = true;
        return output;
      }
    })();
    stillPending = operation;
    try { return await operation; }
    finally { if (stillPending === operation) stillPending = null; }
  };
  return {
    image,
    async prepare(video) {
      if (closed) throw new Error("Cutout is closed.");
      if (fallback) return fallback.prepare(video);
      if (still) {
        if (!stillReady || stillSource !== video) await image(video);
        return;
      }
      try {
        if (video.readyState >= 2) { lastTime = -1; frame(video, performance.now()); }
      } catch (failure) {
        console.warn("Remix cutout: switching to CPU after first-frame failure", failure);
        segmenter.close();
        retired=true;
        const { createCpuCutout } = await import("./remix-cutout-cpu.js");
        fallback = await createCpuCutout(base);
        if (closed) { fallback.close(); return; }
        await fallback.prepare(video);
      }
    },
    frame(video, time) {
      if (still) {
        if (!stillReady) throw new Error("The photo cutout is not ready yet.");
        return fallback ? fallback.frame(video, time) : surface.canvas;
      }
      return fallback ? fallback.frame(video, time) : frame(video, time);
    },
    close() { if (closed) return; closed = true; if(fallback)fallback.close();else if(!retired)segmenter.close(); surface.close(); }
  };
}
