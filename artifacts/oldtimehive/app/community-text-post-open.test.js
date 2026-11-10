import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");

test("Community text post cards open their original post without a separate View button", () => {
  assert.match(app, /data-community-open-post="\$\{esc\(post\.id\)\}"/);
  assert.match(app, /function bindCommunityTextPostOpen\(\)/);
  assert.match(app, /openPostViewer\(card\.dataset\.communityOpenPost\)/);
  assert.match(app, /event\.key !== "Enter" && event\.key !== " "/);
});

test("text-only posts never enter the full-screen media viewer", () => {
  assert.match(app, /const hasViewerMedia = Boolean\(profilePostMedia\(p\)\.length \|\| p\.creativeProject\)/);
  assert.match(app, /const mediaViewer = !fromPlaces && hasViewerMedia/);
  assert.match(app, /mediaViewer \|\| \(fromPlaces && hasViewerMedia\) \? "dark" : "light"/);
});
