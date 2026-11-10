import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Sports workspace includes the premium performance surfaces", async () => {
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
