import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const ecosystem = readFileSync(new URL("./explore-ecosystem.js", import.meta.url), "utf8");
const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("./search-discovery.css", import.meta.url), "utf8");

test("Search keeps its Videos/Places landing and supports broad result searches", () => {
  const search = app.slice(app.indexOf("function search()"), app.indexOf("\nfunction notes()", app.indexOf("function search()")));
  assert.match(ecosystem, /const TYPES = \[\["all", "Top"\], \["people", "People"\], \["hashtags", "Topics"\], \["videos", "Videos"\], \["places", "Places"\]\]/);
  assert.match(ecosystem, /let type = "videos"/);
  assert.match(search, /showTypeFilters: searchSection === "search"/);
  assert.match(app, /function localSearchResultsMarkup/);
  assert.match(app, /data-local-search-type="\$\{id\}"/);
  assert.match(search, /data-search-hub="videos">Videos/);
  assert.match(search, /data-search-hub="places">\$\{searchPlacesMapGlyph\(\)\}<span>Places<\/span>/);
  assert.doesNotMatch(search, /data-search-section="people"/);
});

test("Search segment tabs keep safe text widths on small phones", () => {
  assert.match(styles, /\.search-hub-tabs \[role="tab"\]\s*\{[^}]*min-width:0[^}]*overflow:hidden/s);
  assert.match(styles, /\.search-hub-tabs \[role="tab"\]\s*\{[^}]*text-overflow:ellipsis[^}]*white-space:nowrap/s);
  assert.match(styles, /\.search-hub-tabs \[role="tab"\]\.on\s*\{[^}]*background:#fff/);
});
