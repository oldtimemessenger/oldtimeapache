import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Sports workspace loads the premium performance visual system", async () => {
  const [entry, css] = await Promise.all([
    readFile(new URL("./sports-mode.js", import.meta.url), "utf8"),
    readFile(new URL("./sports-mode-premium.css", import.meta.url), "utf8"),
  ]);
  assert.match(entry, /import "\.\/sports-mode-premium\.css"/);
  for (const selector of [
    ".sp-tile", ".sp-stage", ".sp-hud", ".sp-dhero", ".sp-replay-map-wrap",
    ".sp-replay-map-stats", ".sp-replay-dock", ".sp-privacy-panel",
  ]) assert.ok(css.includes(selector), "missing Sports redesign selector " + selector);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
});

test("Sports shortcut is present in the Home header and respects the server release gate", async () => {
  const [app, css, state] = await Promise.all([
    readFile(new URL("./app.js", import.meta.url), "utf8"),
    readFile(new URL("./sports-header.css", import.meta.url), "utf8"),
    readFile(new URL("../../../lib/sports/feature-state.ts", import.meta.url), "utf8"),
  ]);
  assert.match(app, /class="app-sports-shortcut" data-sports-open/);
  assert.match(app, /SPORTS_MODE_ENABLED/);
  assert.match(app, /openSportsFromHeader/);
  assert.match(css, /\.app-sports-shortcut/);
  assert.match(state, /SPORTS_MODE_ENABLED = false/);
  assert.match(app, /Sports is being prepared while workout recording and publishing are verified/);
});

test("Sports map styling adds real building extrusions without replacing route data", async () => {
  const style = await readFile(new URL("./sports-vector-style.js", import.meta.url), "utf8");
  assert.match(style, /oldtime-sports-building-extrusions/);
  assert.match(style, /fill-extrusion-height/);
  assert.match(style, /source-layer: "building"/);
  assert.match(style, /fill-extrusion-vertical-gradient/);
  assert.match(style, /OPENFREEMAP_CREDITS/);
});
