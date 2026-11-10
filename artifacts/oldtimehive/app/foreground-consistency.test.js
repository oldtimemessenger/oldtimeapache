import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = name => readFileSync(new URL(name, import.meta.url), "utf8");
const css = read("./foreground-consistency.css");
const app = read("./app.js");
const palette = read("./styles.css");
const community = read("./community-feeds.css");
const story = read("./story-immersive-redesign.css");

function luminance(hex) {
  const channels = hex.match(/[0-9a-f]{2}/gi).map(value => parseInt(value, 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

test("semantic Oldtime text colors remain readable on ordinary white surfaces", () => {
  assert.match(palette, /--color-ink:\s*#17191c;/);
  assert.match(palette, /--color-muted:\s*#6b6f76;/);
  assert.match(palette, /--color-primary:\s*#1456d9;/);
  assert.match(palette, /--color-burgundy:\s*#8e1b24;/);
  assert.ok(contrast("#6b6f76", "#ffffff") >= 4.5);
  assert.ok(contrast("#1456d9", "#ffffff") >= 4.5);
  assert.ok(contrast("#8e1b24", "#ffffff") >= 4.5);
});

test("color correction layer is deliberate and limited to verified ordinary text", () => {
  assert.ok(app.indexOf('import "./foreground-consistency.css";') >
    app.indexOf('import "./profile-header-refinement.css";'));
  assert.match(css, /\.profile-screen \.profile-simple-hero \.profile-city small/);
  assert.match(css, /\.search-screen \.discovery-search\.discovery-search::placeholder/);
  assert.match(css, /\.search-screen \.discovery-trend-rank/);
  assert.match(css, /\.account-settings-screen \.settings-entry-copy small/);
  assert.doesNotMatch(css, /(^|[,{])\s*#app\s*\{/);
});

test("immersive Story and established Community palettes remain untouched", () => {
  assert.match(story, /#storyview\.storyview\s*\{[^}]*background:#08090c;[^}]*color:#fff;/s);
  assert.match(community, /\.cf-screen \{ background:#fff; color:#14171c; \}/);
  assert.doesNotMatch(css, /storyview|\.clip|\.community-/);
});
