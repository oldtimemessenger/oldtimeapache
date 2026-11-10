import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");

test("a text-only Community post linked from Story opens the original in a compact sheet", () => {
  assert.match(app, /const textOnlyCommunityPost = !sharedTarget\.commentId && isCommunitySurfacePost\(originalPost\)/);
  assert.match(app, /if \(textOnlyCommunityPost\) openCommunityOriginalPostSheet\(originalPost\)/);
  assert.match(app, /function openCommunityOriginalPostSheet\(post\)/);
  assert.match(app, /aria-labelledby="community-original-post-title"/);
  assert.match(app, /profileMediaSource\(avatar\)/);
  assert.doesNotMatch(app, /avatar: "\/app\/avatar\.svg"/);
});
