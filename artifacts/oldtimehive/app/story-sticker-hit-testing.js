/**
 * Convert a pointer location on a rotated, aspect-fitted Story addition into
 * normalized coordinates in the source artwork, then test its action region.
 */
export function pointInArtRegion({
  clientX, clientY, rect, width, height, rotation = 0,
  artWidth, artHeight, region, keyboard = false,
} = {}) {
  if (keyboard) return true;
  if (!rect || !Array.isArray(region) || region.length !== 4 ||
      ![clientX, clientY, rect.left, rect.top, rect.width, rect.height, width, height, artWidth, artHeight]
        .every(Number.isFinite) || width <= 0 || height <= 0 || artWidth <= 0 || artHeight <= 0) return false;

  const angle = (Number.isFinite(rotation) ? rotation : 0) * Math.PI / 180;
  const dx = clientX - (rect.left + rect.width / 2);
  const dy = clientY - (rect.top + rect.height / 2);
  const localX = dx * Math.cos(angle) + dy * Math.sin(angle);
  const localY = -dx * Math.sin(angle) + dy * Math.cos(angle);
  const frameX = localX / width + 0.5;
  const frameY = localY / height + 0.5;

  const frameAspect = width / height;
  const artAspect = artWidth / artHeight;
  const fitWidth = Math.min(1, artAspect / frameAspect);
  const fitHeight = Math.min(1, frameAspect / artAspect);
  const artX = (frameX - (1 - fitWidth) / 2) / fitWidth;
  const artY = (frameY - (1 - fitHeight) / 2) / fitHeight;
  const [left, top, right, bottom] = region;
  return artX >= left && artX <= right && artY >= top && artY <= bottom;
}
