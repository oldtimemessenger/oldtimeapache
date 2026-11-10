import assert from "node:assert/strict";
import test from "node:test";
import { pointInArtRegion } from "./story-sticker-hit-testing.js";

function pointerForArtPoint({ x, y, width, height, artWidth, artHeight, rotation }) {
  const aspect = width / height;
  const artAspect = artWidth / artHeight;
  const fitWidth = Math.min(1, artAspect / aspect);
  const fitHeight = Math.min(1, aspect / artAspect);
  const frameX = (1 - fitWidth) / 2 + x * fitWidth;
  const frameY = (1 - fitHeight) / 2 + y * fitHeight;
  const localX = (frameX - 0.5) * width;
  const localY = (frameY - 0.5) * height;
  const angle = rotation * Math.PI / 180;
  const centerX = 250;
  const centerY = 360;
  const clientX = centerX + localX * Math.cos(angle) - localY * Math.sin(angle);
  const clientY = centerY + localX * Math.sin(angle) + localY * Math.cos(angle);
  const rectWidth = Math.abs(width * Math.cos(angle)) + Math.abs(height * Math.sin(angle));
  const rectHeight = Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle));
  return {
    clientX, clientY, width, height, rotation, artWidth, artHeight,
    rect: { left: centerX - rectWidth / 2, top: centerY - rectHeight / 2, width: rectWidth, height: rectHeight },
  };
}

test("visible Join targets work with rotated stickers and aspect-fit artwork", () => {
  const trendJoin = [.20, .74, .80, .96];
  const heyWorldJoin = [.12, .70, .88, .88];

  for (const rotation of [0, 27, -34]) {
    const point = pointerForArtPoint({
      x: .5, y: .84, width: 280, height: 145, artWidth: 900, artHeight: 529, rotation,
    });
    assert.equal(pointInArtRegion({ ...point, region: trendJoin }), true, `Trendsetters Join at ${rotation}°`);
  }

  const tallPoint = pointerForArtPoint({
    x: .5, y: .79, width: 150, height: 270, artWidth: 601, artHeight: 648, rotation: 19,
  });
  assert.equal(pointInArtRegion({ ...tallPoint, region: heyWorldJoin }), true);
});

test("taps outside the visible Join action do not count as a join", () => {
  const promptPoint = pointerForArtPoint({
    x: .5, y: .57, width: 280, height: 145, artWidth: 900, artHeight: 529, rotation: 31,
  });
  assert.equal(pointInArtRegion({ ...promptPoint, region: [.20, .74, .80, .96] }), false);

  const letterboxPoint = pointerForArtPoint({
    x: .5, y: .14, width: 120, height: 260, artWidth: 900, artHeight: 529, rotation: 0,
  });
  assert.equal(pointInArtRegion({ ...letterboxPoint, region: [.20, .74, .80, .96] }), false);
});

test("keyboard activation remains available for accessible Story actions", () => {
  assert.equal(pointInArtRegion({ keyboard: true, region: [.2, .7, .8, .9] }), true);
});
