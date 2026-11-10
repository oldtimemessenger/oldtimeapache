import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = name => readFileSync(new URL(name, import.meta.url), "utf8");
const app = read("./app.js");
const css = read("./create-actions-premium-polish.css");

test("Create Studio polish loads after the shared surface foundation", () => {
  const foundation = app.indexOf('import "./full-app-surface-unification.css";');
  const polish = app.indexOf('import "./create-actions-premium-polish.css";');
  assert.notEqual(foundation, -1);
  assert.notEqual(polish, -1);
  assert.ok(polish > foundation);
});

test("Create Studio editing controls use dark, legible workspace surfaces", () => {
  for (const selector of [".cs-ws", ".cs-tl", ".cs-tools", ".cs-sheet", ".cs-details", ".cs-pop", ".ce-sound-picker"]) {
    assert.ok(css.includes(selector), `Missing Create Studio treatment: ${selector}`);
  }
  assert.match(css, /--ws-bg:#090a0e/);
  assert.match(css, /--ws-ink:#f5f6fa/);
  assert.match(css, /\.cs-studio \.cs-tl-block\.is-media/);
});

test("contextual action menus share dark surfaces and retain destructive-action distinction", () => {
  for (const selector of [".post-actions-menu-items", ".profile-post-menu-items", ".post-edit-menu-items"]) {
    assert.ok(css.includes(selector), `Missing action-menu treatment: ${selector}`);
  }
  assert.match(css, /button\.is-destructive\s*\{\s*color:#ff9b9b/);
});

test("presentation polish does not target the editor canvas or capture media", () => {
  assert.doesNotMatch(css, /#ce-canvas|\.cs-stage\s*\{|\.sc-live\s*\{/);
});
