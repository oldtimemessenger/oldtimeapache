import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("bottom navigation stays opaque with no fade, gradient or dimming across tabs", () => {
  const css = readFileSync(new URL("./quiet-interface.css", import.meta.url), "utf8");
  assert.match(css, /#app \.phone>nav\.nav\{background:#090a0c!important;background-image:none!important/);
  assert.match(css, /#app \.phone>nav\.nav button\{color:#b7bbc2!important;background:transparent!important\}/);
  assert.match(css, /#app \.phone>nav\.nav button\.on\{color:#fff!important;background:transparent!important\}/);
  assert.match(css, /#app \.phone>nav\.nav button\.nav-create-button \.nav-create-icon\{color:#fff!important;background:#1456d9!important\}/);
  assert.match(css, /#app \.phone>nav\.nav,#app \.phone>nav\.nav \*\{opacity:1!important;transition:none!important;animation:none!important;filter:none!important/);
});
