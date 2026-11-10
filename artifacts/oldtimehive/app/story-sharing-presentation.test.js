import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { sharedStatusLayerHitbox, storyStageAppearance } from "./story-presentation.js";

const sharing = readFileSync(new URL("./status-sharing.js", import.meta.url), "utf8");

test("community text post Stories start on a true white canvas", () => {
  assert.match(sharing, /project\.background = \{ kind: "color", color: "#ffffff", media: "" \}/);
  assert.deepEqual(storyStageAppearance({
    color: "#000000",
    creativeProject: { background: { kind: "color", color: "#ffffff" } },
  }), { color: "#ffffff", isLight: true });
});

test("Story stage appearance preserves dark colors and rejects unsafe color input", () => {
  assert.deepEqual(storyStageAppearance({ color: "#17191c" }), { color: "#17191c", isLight: false });
  assert.deepEqual(storyStageAppearance({ color: "red; background:url(javascript:alert(1))" }), { color: "#000000", isLight: false });
});

test("the tappable shared-post area follows its movable and pinch-scaled overlay", () => {
  assert.deepEqual(sharedStatusLayerHitbox({
    width: 1080,
    height: 1920,
    layers: [{ statusOverlay: true, x: 0.37, y: 0.62, width: 840, height: 350, scale: 1.1, rotation: 17 }],
  }), {
    left: 37,
    top: 62,
    width: 85.55555555555556,
    height: 20.052083333333336,
    rotation: 17,
  });
});

test("stories without a shared snapshot do not get a post hit area", () => {
  assert.equal(sharedStatusLayerHitbox({ layers: [{ kind: "image", width: 500, height: 500 }] }), null);
});
