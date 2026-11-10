import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const src = readFileSync(new URL("./places-view.js", import.meta.url), "utf8");
test("place profile markup hooks exist", () => {
  for (const hook of ["data-place-post", 'data-place-tab="${key}"', "data-place-profile", "data-place-people-more", "data-place-review-form", "data-place-review-report", "data-place-tips-more", 'name="rating"', 'name="tip"', 'name="tags"', 'maxlength="200"', "data-place-category", "data-place-address", 'import "./place-profile.css"']) assert.ok(src.includes(hook), hook);
  assert.ok(!/transition:\s*all/.test(readFileSync(new URL("./place-profile.css", import.meta.url), "utf8")));
});
test("discovery cards use real counts and metadata", () => {
  assert.ok(src.includes("data-place-city"));
  assert.ok(!/public posts<\/span>/.test(src.slice(src.indexOf("function placeCard"), src.indexOf("export function renderDiscoveryPlaces"))));
  assert.ok(src.includes('posts === 1 ? "post" : "posts"'));
});
test("stage3 place page structure", () => {
  for (const hook of ["data-place-save", "aria-pressed", "data-place-directions", "fossgis_osrm_car", "data-place-share", '["tips", "Tips"]', "renderPlacesLanding", "Choose a place from search when posting to add a map pin.", "coverReference"]) assert.ok(src.includes(hook), hook);
  assert.ok(!src.includes('<h2 data-testid="text-place-name"'));
});
test("compact Places follow-up hooks", () => {
  for (const hook of ["export function placeFeedCard", "data-place-post-like", "data-place-post-comment", "data-place-post-share", "Be the first to comment", "Add a comment", "data-places-nearby", "Places people love", "Near you", "Suggested for you", "Trending this week", "personForPost", "place-feed-open"]) assert.ok(src.includes(hook), hook);
  assert.equal((src.match(/id="place-detail-heading"/g) || []).length, 1);
});
test("media place labels use the green pin overlay while Community markup stays separate", () => {
  const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
  const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
  assert.ok(app.includes('class="post-viewer-place-location place-video-overlay"'));
  assert.ok(app.includes('videoOverlay ? " place-video-overlay" : ""'));
  assert.ok(css.includes(".clip .clip-place-card.place-video-overlay"));
  assert.ok(css.includes("background:#10b994"));
  assert.ok(app.includes("postPlaceCard(post) ? `<div class=\"cvc-place\">"));
});
test("discovery landing on empty query", () => {
  assert.ok(src.includes('query = "", landing = null, location = null'));
  assert.ok(!src.includes("showPlace: false"));
});
test("place cover cards offer comments only for featured posts", async () => {
  const body = src.slice(src.indexOf("function placeCard(item)"), src.indexOf("function renderPlacesLanding") > 0 ? src.indexOf("export function renderDiscoveryPlaces") : undefined);
  assert.ok(body.includes("featuredPostId") && body.includes("data-place-post-comment"));
  assert.ok(body.includes("if (!featuredId) return card;"));
  assert.ok(body.includes('<div class="places-card-wrap">${card}<button'));
  const css = readFileSync(new URL("./place-profile.css", import.meta.url), "utf8");
  assert.ok(css.includes(".place-comment-offer {") && !/transition:\s*all/.test(css));
});
