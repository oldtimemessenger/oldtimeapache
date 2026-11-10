import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const designSource = readFileSync(new URL("./auth-design.js", import.meta.url), "utf8")
  .replace(/^import "\.\/[^"]+\.css";\s*$/gm, "")
  .replace('from "./legal-documents.js"', `from "${new URL("./legal-documents.js", import.meta.url).href}"`);
const authDesign = await import(
  `data:text/javascript;base64,${Buffer.from(designSource).toString("base64")}`
);
const appSource = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const storeSource = readFileSync(new URL("./store.js", import.meta.url), "utf8");

test("the sign-in screen exposes a password recovery action", () => {
  const markup = authDesign.loginMarkup("/brand.svg");
  assert.match(markup, /id="forgot-password"/);
  assert.match(markup, /Forgot password\?/);
  assert.doesNotMatch(markup, /oldtime-legal-links|Contact|Privacy Policy|Terms of Service|Community Guidelines|Support/);
  assert.match(appSource, /#forgot-password"\)\.onclick = event =>/);
});

test("password recovery has request and reset forms with accessible feedback", () => {
  const requestMarkup = authDesign.passwordRecoveryRequestMarkup("/brand.svg");
  const resetMarkup = authDesign.passwordRecoveryResetMarkup("/brand.svg");

  assert.match(requestMarkup, /id="password-recovery-form"/);
  assert.match(requestMarkup, /type="email"/);
  assert.match(requestMarkup, /id="recovery-status" role="status"/);
  assert.match(resetMarkup, /id="password-reset-form"/);
  assert.match(resetMarkup, /id="reset-password-confirm"/);
  assert.match(resetMarkup, /minlength="8" maxlength="128"/);
  assert.match(resetMarkup, /id="recovery-error" role="alert"/);
  assert.match(appSource, /get\("password-reset"\)/);
  assert.match(appSource, /history\.replaceState/);
  assert.match(storeSource, /authRequest\("password\/recovery\/request"/);
  assert.match(storeSource, /authRequest\("password\/recovery\/confirm"/);
});
