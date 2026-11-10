import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
const discovery = readFileSync(new URL("./discovery-professional.css", import.meta.url), "utf8");
const immersive = readFileSync(new URL("./post-viewer-immersive.css", import.meta.url), "utf8");

test("the fifth navigation slot is Profile while Home keeps a Search shortcut", () => {
  assert.match(app, /data-tab="profile"[^>]*aria-label="Profile"[^>]*data-testid="button-nav-profile"/);
  assert.match(app, /class="app-search-shortcut" data-tab="search"/);
  assert.match(styles, /#app \.nav:not\(\.nav-hidden\)\s*\{\s*grid-template-columns:repeat\(5,minmax\(0,1fr\)\);/);
  assert.match(styles, /\.nav-profile-frame\s*\{[^}]*width:28px[^}]*height:28px/);
});

test("Home keeps native vertical scrolling, momentum, and snap", () => {
  assert.match(styles, /\.feed\s*\{[^}]*overflow-y:\s*auto;[^}]*scroll-snap-type:\s*y mandatory;[^}]*-webkit-overflow-scrolling:\s*touch;/);
  assert.match(app, /new IntersectionObserver\(entries => \{\s*if \(entries\.some\(entry => entry\.isIntersecting\)\) void loadMoreCloudPosts\(\);\s*\}, \{ root: \$\("#feed"\), rootMargin: feedPaginationRootMargin\(\{ viewportHeight: window\.innerHeight \}\) \}\)/,
    "native scrolling still prefetches the next page based on viewport and connection");
});

test("full-screen media uses native vertical snap instead of scripted touch swipes", () => {
  assert.match(discovery, /\.post-viewer-explore \.post-viewer-feed[^}]*overflow-y:auto[^}]*scroll-snap-type:y mandatory[^}]*touch-action:pan-y/);
  const start = app.indexOf("function bindExploreViewerSwipe");
  const end = app.indexOf("// Search/Discover media viewer", start);
  const binder = app.slice(start, end);
  assert.match(binder, /feed\.addEventListener\("scroll", onScroll/);
  assert.doesNotMatch(binder, /feed\.addEventListener\("touch(?:start|end|cancel)"/);
  assert.doesNotMatch(binder, /feed\.addEventListener\("wheel"/);
});

test("Search and Discover keep viewer cards stacked and avoid remounting on each swipe", () => {
  assert.match(app, /exploreViewer \? " post-viewer-explore" : ""/);
  assert.match(immersive, /post-viewer-feed\s*>\s*\.clip\.post-detail\s*\{[^}]*position:relative!important/);
  const start = app.indexOf("function bindExploreViewerSwipe");
  const end = app.indexOf("// Search/Discover media viewer", start);
  const binder = app.slice(start, end);
  assert.match(binder, /activeId = active\.dataset\.id;[\s\S]*?viewer = activeId/);
  assert.match(binder, /screen\.dataset\.scrollContext = screenScrollContext/);
  assert.match(binder, /bindMediaViewerComments\(activeId\)/);
  assert.doesNotMatch(binder, /viewer = active\.dataset\.id;\s*render\(\)/);
});

test("Search viewer likes and follows update without remounting the active video", () => {
  assert.match(app, /like\(id, null, !isPlaceViewer && !isMediaViewer\)/);
  assert.match(app, /follow\(b\.dataset\.follow, \{ rerender: !Boolean\(b\.closest\("\.post-viewer-media"\)\) \}\)/);
  assert.match(app, /function syncFollowButtons\(id\)/);
  assert.match(app, /bindPosts\(\{ observe: false \}\)/);
});

test("Search viewer pages through matching media and Discover loads more posts", () => {
  assert.match(app, /viewerAdjacentPostIds\(id, viewerSource\)/);
  assert.match(app, /const ids = api\.posts\(\)\.filter\(post =>/);
  assert.match(app, /exploreEco\.ensureNext\(cursorId\)/);
  assert.match(app, /const appendSearchNext = \(\) =>/);
  assert.match(app, /data-viewer-next-pending/);
});
