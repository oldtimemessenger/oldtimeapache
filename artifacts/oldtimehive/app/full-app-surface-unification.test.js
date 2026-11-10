import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = name => readFileSync(new URL(name, import.meta.url), "utf8");
const app = read("./app.js");
const css = read("./full-app-surface-unification.css");

test("full-app visual layer loads after the existing editorial foundation", () => {
  const editorial = app.indexOf('import "./editorial-compact-redesign.css";');
  const unified = app.indexOf('import "./full-app-surface-unification.css";');
  assert.notEqual(editorial, -1);
  assert.notEqual(unified, -1);
  assert.ok(unified > editorial);
});

test("detached feature panels share the obsidian surface system", () => {
  for (const selector of [
    ".audio-panel", ".share-recipient-panel", ".saved-social-panel",
    ".pp-sheet", ".remix-studio", ".chat-attachment-panel"
  ]) assert.ok(css.includes(selector), `Missing unified surface: ${selector}`);
  assert.match(css, /--ot-night:\s*#050609/);
  assert.match(css, /--ot-ink:\s*#f5f6fa/);
});

test("secondary destinations receive consistent styling without replacing creative media", () => {
  for (const selector of [".ct-wrap", ".ap-wrap", ".mq", ".hc", ".guide-library", ".places-view", ".chat-settings-screen"]) {
    assert.ok(css.includes(selector), `Missing secondary destination: ${selector}`);
  }
  assert.match(css, /video,canvas,img,\.maplibregl-map/);
  assert.match(css, /creative-editor/);
});

test("account library surfaces use the unified dark system and preserve media", () => {
  for (const selector of [
    ".acl", ".acl-head", ".acl-tabs", ".acl-tile", ".acl-col",
    ".acl-sound", ".acl-prefs", ".acl-sheet", ".acl-skel"
  ]) assert.ok(css.includes(selector), `Missing account library treatment: ${selector}`);
  assert.match(css, /\.acl\s*\{[\s\S]*?background:var\(--ot-night\)!important/);
  assert.doesNotMatch(css, /^img\s*\{/m);
  assert.match(css, /\.acl \.acl-btn-primary/);
});
