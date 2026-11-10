import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = name => readFileSync(new URL(name, import.meta.url), "utf8");
const app = read("./app.js");
const css = read("./profile-onboarding-settings-premium.css");

test("account polish loads after the shared app and Create Studio foundations", () => {
  const foundation = app.indexOf('import "./full-app-surface-unification.css";');
  const create = app.indexOf('import "./create-actions-premium-polish.css";');
  const polish = app.indexOf('import "./profile-onboarding-settings-premium.css";');
  assert.notEqual(foundation, -1);
  assert.notEqual(create, -1);
  assert.ok(polish > create && create > foundation);
});

test("profile editor uses accessible obsidian surfaces while retaining grouped editor controls", () => {
  for (const selector of [".edit-profile-screen", ".profile-editor-avatar-section", ".profile-editor-fields", ".profile-editor-cover-section", ".profile-editor-interests", ".profile-editor-footer"]) {
    assert.ok(css.includes(selector), `Missing profile editor treatment: ${selector}`);
  }
  assert.match(css, /--pe-bg:#090a0e/);
  assert.match(css, /:focus-visible/);
});

test("account and creator tools share consistent dark cards, tabs and controls", () => {
  for (const selector of [".ap-wrap", ".ap-card", ".ap-overview-metric", ".ap-tabs", ".ap-field", ".ap-btn"]) {
    assert.ok(css.includes(selector), `Missing account surface treatment: ${selector}`);
  }
});

test("authentication and signup preserve readable input, selected and primary states", () => {
  for (const selector of [".auth.ot-auth", ".ot-auth .btn.primary", ".ot-auth .signup-interest.selected", ".ot-auth .auth-success"]) {
    assert.ok(css.includes(selector), `Missing auth treatment: ${selector}`);
  }
  assert.match(css, /-webkit-text-fill-color:#f5f6fa/);
});
