const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function safeHexColor(value) {
  const color = String(value || "").trim();
  return /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(color) ? color : "#000000";
}

export function storyStageAppearance(story) {
  const background = story?.creativeProject?.background;
  const color = safeHexColor(background?.kind === "color" ? background.color : story?.color);
  const hex = color.length === 4
    ? `#${color.slice(1).split("").map(part => part + part).join("")}`
    : color;
  const channels = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
    .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  return { color, isLight: luminance >= 0.6 };
}

export function sharedStatusLayerHitbox(project) {
  const layer = Array.isArray(project?.layers)
    ? project.layers.find(candidate => candidate?.statusOverlay && !candidate.hidden)
    : null;
  if (!layer) return null;
  const projectWidth = Number(project.width) > 0 ? Number(project.width) : 1080;
  const projectHeight = Number(project.height) > 0 ? Number(project.height) : 1920;
  const layerWidth = Number(layer.width);
  const layerHeight = Number(layer.height);
  if (!Number.isFinite(layerWidth) || !Number.isFinite(layerHeight) || layerWidth <= 0 || layerHeight <= 0) return null;
  const scaleValue = Number(layer.scale);
  const scale = Number.isFinite(scaleValue) && scaleValue > 0 ? clamp(scaleValue, 0.2, 4) : 1;
  const xValue = Number(layer.x);
  const yValue = Number(layer.y);
  const rotationValue = Number(layer.rotation);
  return {
    left: (Number.isFinite(xValue) ? clamp(xValue, 0, 1) : 0.5) * 100,
    top: (Number.isFinite(yValue) ? clamp(yValue, 0, 1) : 0.5) * 100,
    width: clamp(layerWidth * scale / projectWidth * 100, 0, 100),
    height: clamp(layerHeight * scale / projectHeight * 100, 0, 100),
    rotation: Number.isFinite(rotationValue) ? clamp(rotationValue, -360, 360) : 0,
  };
}
