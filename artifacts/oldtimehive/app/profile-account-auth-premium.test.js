import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = name => readFileSync(new URL(name, import.meta.url), "utf8");
const app = read("./app.js");
const css = read("./profile-account-auth-premium.css");

test("profile and account polish loads after the shared surface foundation", () => {
  const foundation = app.indexOf('import "./full-app-surface-unification.css";');
  const profile = app.indexOf('import "./profile-account-auth-premium.css";');
  assert.notEqual(foundation, -1);
  assert.notEqual(profile, -1);
  assert.ok(profile > foundation);
});

test("profile editor receives dark identity, field and cover surfaces", () => {
  for (const selector of [".edit-profile-screen", ".profile-editor-avatar-section",
    ".profile-editor-fields", ".profile-editor-cover-section", ".profile-editor-interests"]) {
    assert.ok(css.includes(selector), `Missing profile treatment: ${selector}`);
  }
  assert.match(css, /--pe-bg:#090a0e/);
  assert.match(css, /profile-editor-header-save/);
});

test("account settings controls use legible dark surfaces", () => {
  for (const selector of [".ap-wrap", ".ap-card", ".ap-overview-metric", ".ap-field",
    ".ap-tabs", ".ap-seg", ".ap-btn"]) {
    assert.ok(css.includes(selector), `Missing account treatment: ${selector}`);
  }
});

test("authentication shell and inputs are unified without changing auth behavior", () => {
  assert.match(css, /#app \.auth\.ot-auth/);
  assert.match(css, /\.auth\.ot-auth \.field/);
  assert.match(css, /\.auth\.ot-auth \.btn\.primary/);
  assert.doesNotMatch(css, /\.auth-form\s*\{[^}]*display:none/);
});

test("profile shelves retain media while using the obsidian surface palette", () => {
  assert.match(css, /\.ot-profile-shelf/);
  assert.match(css, /\.ot-quote-card\.has-photo::after/);
  assert.doesNotMatch(css, /^img\s*\{/m);
  assert.doesNotMatch(css, /filter:\s*(?:grayscale|blur)/);
});
