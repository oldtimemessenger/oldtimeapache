import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = name => readFileSync(new URL(name, import.meta.url), "utf8");
const app = read("./app.js");
const css = read("./publishing-sharing-premium.css");

test("publishing and sharing polish loads after the account surface pass", () => {
  const account = app.indexOf('import "./profile-account-auth-premium.css";');
  const publishing = app.indexOf('import "./publishing-sharing-premium.css";');
  assert.notEqual(account, -1);
  assert.notEqual(publishing, -1);
  assert.ok(publishing > account);
});

test("thread composition retains editable textareas with accessible focus treatment", () => {
  assert.match(css, /\.community-thread-part textarea/);
  assert.match(css, /textarea:focus-visible/);
  assert.match(css, /caret-color:var\(--ot-pub-ink\)/);
});

test("thread and original-post surfaces use the shared obsidian palette", () => {
  for (const selector of [".community-thread-viewer", ".community-thread-viewer-part",
    ".community-original-post-panel", ".community-original-post-card"]) {
    assert.ok(css.includes(selector), `Missing publishing surface: ${selector}`);
  }
  assert.match(css, /--ot-pub-bg:#090a0e/);
});

test("community recipient sharing is unified without changing selection or send semantics", () => {
  assert.match(css, /\.share-recipient-panel\.srp-community-share/);
  assert.match(css, /\.srp-friend input:checked/);
  assert.match(css, /\.srp-send:disabled/);
  assert.doesNotMatch(css, /\.srp-friend\s*\{[^}]*display:\s*none/);
});

test("presentation pass does not target live camera or editor canvases", () => {
  assert.doesNotMatch(css, /#ce-canvas|\.cs-stage|\.sc-live|\.sc-canvas/);
  assert.doesNotMatch(css, /^img\s*\{/m);
});
