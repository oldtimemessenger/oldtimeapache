import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("./search-discovery.css", import.meta.url), "utf8");
const compact = readFileSync(new URL("./compact-interface.css", import.meta.url), "utf8");
const destination = readFileSync(new URL("./destination-landing-refinement.css", import.meta.url), "utf8");
const xe = readFileSync(new URL("./explore-ecosystem.js", import.meta.url), "utf8");
const finalCss = readFileSync(new URL("./unboxed-interface.css", import.meta.url), "utf8");
const search = app.slice(app.indexOf("function search()"), app.indexOf("\nfunction notes()", app.indexOf("function search()")));

test("Search uses the Community header and inline input without a compose button", () => {
  const head = search.slice(search.indexOf('<header class="community-header search-app-header">'), search.indexOf("</header>", search.indexOf("search-app-header")));
  assert.match(head, /<h1>Search<\/h1>/);
  assert.match(head, /class="community-search-button discovery-search-toggle[\s\S]*?id="discovery-search-toggle"/);
  assert.doesNotMatch(head, /search-new-post|community-new-post/);
  assert.doesNotMatch(search, /search-new-post/);
  assert.match(search, /searchSection === "search"\) requestAnimationFrame\(\(\) => \$\("#q"\)\?\.focus/);
  assert.match(head, /class="search-header-control">\$\{searchHeaderInput\}[\s\S]*?class="search-header-close discovery-search-toggle" id="discovery-search-toggle"/);
  assert.match(head, /class="community-header-actions">\s*\$\{searchHeaderOpen \? ""/);
  assert.doesNotMatch(search, /class="discovery-header"/);
  assert.match(css, /\.search-app-header \.community-search-button \{[^}]*border:0;[^}]*background:transparent/);
  assert.match(app, /import "\.\/release-interface\.css"/);
});

test("Category row is one unboxed underlined scroller with the filter icon on the right", () => {
  const row = search.slice(search.indexOf('class="discovery-home-topic-tabs"'), search.indexOf('class="discovery-browse-menu"'));
  assert.ok(row.indexOf('class="discovery-topic-scroll"') < row.indexOf('class="discovery-filter-button"'));
  assert.match(css, /\.search-screen \.discovery-topic-scroll \.discovery-category \{[^}]*border:0;[^}]*background:none/);
  assert.match(css, /\.discovery-category\.on::after \{[^}]*background:#1456d9/);
});

test("Search removes Stories but keeps the horizontal video rail and discovery hub", () => {
  assert.doesNotMatch(app, /discoveryStoryRail|bindDiscoveryStoryPreviews|data-discovery-story-preview/);
  assert.doesNotMatch(css, /discovery-stories|discovery-story-card/);
  assert.match(search, /const videoPreviewRail = exploreIsCloud\(\)[\s\S]*videoPreviewRailMarkup\(\)/);
  assert.ok(search.indexOf("${homeTopicTabs}") < search.indexOf("${videoPreviewRail}"));
  assert.ok(search.indexOf("${videoPreviewRail}") < search.indexOf('<div class="discovery-body">'));
  assert.match(css, /\.discovery-video-rail \{/);
  assert.match(css, /\.discovery-video-track \{[^}]*overflow-x:auto/);
  assert.match(xe, /let type = "videos"/);
  assert.match(xe, /\["engagement", "Most interacted"\]/);
  assert.match(xe, /\["shuffle", "Shuffle"\]/);
  assert.match(search, /role="menuitemradio" aria-checked="\$\{exploreEco\.currentSort\(\) === value\}" data-xe-sort="\$\{value\}"/);
  assert.match(xe, /setSort\(button\.dataset\.xeSort\)/);
  assert.doesNotMatch(xe, /class="xe-chips xe-sort"/);
  assert.match(xe, /sort === "shuffle" && shuffleSeed/);
});

test("Search keeps the Videos/Places landing and opens broader result types", () => {
  assert.match(search, /data-search-hub="videos">Videos/);
  assert.match(search, /data-search-hub="places">\$\{searchPlacesMapGlyph\(\)\}<span>Places<\/span>/);
  assert.match(search, /class="search-hub-tabs" role="tablist"/);
  assert.match(search, /showTypeFilters: searchSection === "search"/);
  assert.match(xe, /\["all", "Top"\].*\["people", "People"\].*\["hashtags", "Topics"\].*\["videos", "Videos"\].*\["places", "Places"\]/);
  assert.match(search, /Search Oldtime/);
  assert.doesNotMatch(search, /id="search-layout-toggle"|Open Explore layout/);
  assert.ok(search.indexOf("searchHubTabs") < search.indexOf("${homeTopicTabs}"),
    "the Videos/Places switch stays above the existing interest row");
  assert.match(css, /\.search-screen \.search-hub-tabs \{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /\.search-screen \.search-hub-tabs \[role="tab"\]\.on \{[^}]*background:#fff/);
  assert.match(css, /\.search-screen \.search-hub-tabs \[role="tab"\] \{[^}]*min-height:44px/);
});

test("Search combines real trends and public feeds, expanding them in place", () => {
  assert.match(search, /const showCombinedSearchLanding = searchSection === "trending"[\s\S]*loadDiscoveryTrends\(\);[\s\S]*loadSearchExploreFeeds\(\);/);
  assert.match(search, /searchExploreLandingMarkup\(\{ compact: !searchExploreAllExpanded \}\)/);
  assert.match(search, /data-search-discovery-expand/);
  assert.match(search, /searchExploreAllExpanded = !searchExploreAllExpanded/);
  assert.doesNotMatch(search, /id="search-layout-toggle"|data-trends-all/);
  assert.match(search, /data-search-hub="places">\$\{searchPlacesMapGlyph\(\)\}<span>Places<\/span>/);
  const placesGlyph = app.slice(app.indexOf("function searchPlacesMapGlyph()"), app.indexOf("\nfunction localTrendingTopics()", app.indexOf("function searchPlacesMapGlyph()")));
  assert.doesNotMatch(placesGlyph, /<rect|<image/);
  assert.match(css, /\.search-explore-home--combined \.search-explore-trend-rail \{[^}]*overflow-x:auto;[^}]*scroll-snap-type:x mandatory/);
  assert.match(css, /\.search-explore-home--combined \.search-explore-trend \{[^}]*scroll-snap-align:start/);
});

test("failed topic results wait for an explicit retry instead of rerendering in a request loop", () => {
  const start = app.indexOf("function loadDiscoveryTopicPosts");
  const end = app.indexOf("\nfunction discoveryReasonLabel", start);
  const loader = app.slice(start, end);
  assert.match(loader, /if \(!append && sameTopic && \["loading", "success", "error"\]\.includes\(discoveryTopicPosts\.status\)\) return/);
  assert.match(app, /app\.querySelectorAll\("\[data-topic-retry\]"\)\.forEach\(button => button\.onclick = \(\) => \{\s*discoveryTopicPosts = \{ topic: discoveryTopic, status: "idle"/);
});

test("Search has no separate Explore control and preserves inline Trends and feeds", () => {
  assert.doesNotMatch(search, /id="search-layout-toggle"|class="search-layout-toggle/);
  assert.doesNotMatch(search, /id="search-new-post"/);
  assert.match(search, /searchSection !== "search" \? `<nav class="search-hub-tabs"/);
  assert.match(search, /searchSection === "search"/);
  assert.match(search, /searchExploreLandingMarkup\(\{/);
  assert.match(search, /data-search-pin-feed/);
  assert.match(app, /function pinSearchExploreFeed/);
  assert.match(app, /requestCloudApi\("\/api\/community\/lists"\)/);
  assert.match(app, /topic\.postCount[\s\S]*topic\.creatorCount/);
  assert.match(css, /\.search-screen \.search-explore-trend-copy b \{[^}]*overflow-wrap:anywhere/);
  assert.match(css, /\.search-screen \.search-explore-feed-copy p \{[^}]*overflow-wrap:anywhere/);
  assert.doesNotMatch(css, /search-explore-layout|search-layout-toggle/);
});

test("Discover is exactly two columns everywhere; no stale three-column rule", () => {
  assert.doesNotMatch(css, /(explore-feed-grid|xe-grid)[^{}]*\{[^}]*repeat\(3/);
  assert.match(css, /\.search-screen \.xe-grid, \.search-screen \.explore-feed-grid \{ ?grid-template-columns:repeat\(2, minmax\(0, 1fr\)\)/);
});

test("cloud Community uses the real feed module without an internal release notice", () => {
  assert.match(app, /legacyFeedFallback \? communityFallbackTabs :/);
  const tabs = app.slice(app.indexOf("const communityFallbackTabs"), app.indexOf("shell(`", app.indexOf("const communityFallbackTabs")));
  assert.match(tabs, /<nav class="cf-feed-tabs"/);
  assert.match(tabs, />Following<\/button>[\s\S]*>Discover<\/button>[\s\S]*\["popular", "Popular"\], \["friends", "Mutuals \/ Friends"\]/);
  assert.doesNotMatch(tabs, /Photos & Video|Unavailable<\/small>/);
  assert.match(tabs, /class="cf-controls" data-community-fallback-controls/);
  assert.match(tabs, /class="cf-description"/);
  assert.doesNotMatch(app, /This server doesn’t support Popular/);
  assert.doesNotMatch(app, /Updated feed controls are awaiting the server release|data-community-server-update/);
});

test("Magnifier opens a real focused input; compact field with no oversized focus ring", () => {
  assert.match(search, /const closing = \["search","places"\]\.includes\(searchSection\);[\s\S]*searchSection = closing \? "trending" : "search";/);
  assert.match(search, /class="search-header-field"><div class="search-header-control">\$\{searchHeaderInput\}/);
  assert.match(search, /if \(searchInput\) searchInput\.oninput =/);
  assert.match(search, /exploreEco\.bind\(app, \{ bindQuery:/);
  assert.match(css, /\.search-screen \.xe-search,\s*\.search-screen \.discovery-search-wrap \{[^}]*min-height:38px;[^}]*border:0;[^}]*box-shadow:none/);
  assert.match(css, /\.search-screen \.xe-search:focus-within,\s*\.search-screen \.discovery-search-wrap:focus-within \{[^}]*border:0; box-shadow:none; outline:0/);
});

test("Active Search keeps one uniform capsule and a quiet close action", () => {
  assert.match(finalCss, /#app \.search-screen \.search-header-control\s*\{[^}]*background:#f1f2f4/);
  assert.match(finalCss, /#app \.search-screen \.search-header-control:focus-within\s*\{[^}]*background:#f1f2f4;[^}]*box-shadow:inset 0 0 0 1px #d7dce3/);
  assert.match(finalCss, /#app \.search-screen \.search-header-control input\[type="search"\]\s*\{[^}]*-webkit-appearance:none!important;[^}]*background:transparent!important/);
  assert.match(finalCss, /input\[type="search"\]::-webkit-search-cancel-button,[\s\S]*?display:none/);
  assert.match(finalCss, /#app \.search-screen \.search-header-close\s*\{[^}]*background:transparent!important;[^}]*color:#68717d/);
});

test("Search text and segmented controls fit narrow mobile viewports", () => {
  assert.match(css, /\.search-screen \.search-hub-tabs \{[^}]*min-width:0/);
  assert.match(css, /\.search-screen \.search-hub-tabs \[role="tab"\] \{[^}]*overflow:hidden/);
  assert.match(css, /\.search-screen \.discovery-body,[\s\S]*?\.search-screen \.places-post-author \{[^}]*min-width:0;[^}]*max-width:100%/);
  assert.match(destination, /\.notifications-screen \.notification-category > span:nth-child\(2\),[\s\S]*?overflow-wrap:anywhere/);
  assert.match(compact, /\.phone :is\(p,small,b,strong,h1,h2,h3,label,span/);
  assert.match(css, /\.search-screen \.discovery-topic-scroll \.discovery-category \{[^}]*border:0;[^}]*background:none/);
});
