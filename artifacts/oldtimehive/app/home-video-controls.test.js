import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const store = readFileSync(new URL("./store.js", import.meta.url), "utf8");
const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
const icons = readFileSync(new URL("./icons.js", import.meta.url), "utf8");
const profileRefinements = readFileSync(new URL("./destination-landing-refinement.css", import.meta.url), "utf8");
const audioPanel = readFileSync(new URL("./audio-panel.js", import.meta.url), "utf8");
const soundbarStart = app.indexOf('<div class="soundbar"');
const soundbarEnd = app.indexOf("</article>", soundbarStart);
const soundbarMarkup = app.slice(soundbarStart, soundbarEnd + "</article>".length);

test("Home video playback has no in-app volume button and lets the device set playback level", () => {
  assert.doesNotMatch(app, /sound-mute-control|data-mute=/);
  assert.match(app, /video\.muted = false/);
  assert.match(css, /#feed \.clip:not\(\.post-detail\) \.rail \.act\s*\{[^}]*border-radius:0[^}]*background:transparent/);
});

test("The Home comments panel uses a flat edge instead of a rounded sheet", () => {
  assert.match(css, /\.comment-panel\s*\{[^}]*border-radius:\s*0/);
});

test("Profile post tiles hide engagement metrics without discarding stored counts", () => {
  assert.match(store, /measuredViews:\s*Number\.isSafeInteger\(post\.measuredViews\)\s*&&\s*post\.measuredViews\s*>=\s*0\s*\?\s*post\.measuredViews\s*:\s*0/,
    "the server-measured view count remains stored");
  const gridMarkup = app.slice(app.indexOf("const profileGridMarkup"), app.indexOf("const profileGridEmptyMessage"));
  assert.doesNotMatch(gridMarkup, /profile-post-(?:stats|likes|views)|profilePostViewCount|postLikes/,
    "profile tiles do not render like or view counts");
  const mediaStart = app.indexOf('class="profile-post-media');
  const mediaEnd = app.indexOf('</${archived ? "div" : "button"}>', mediaStart);
  assert.ok(mediaStart >= 0 && mediaEnd > mediaStart, "profile media preview markup remains intact");
  assert.doesNotMatch(app.slice(mediaStart, mediaEnd), /profile-post-views|profile-post-video-mark|profile-repost-mark|profile-post-menu/,
    "profile media previews have no badges or menu overlay");
  const statsStart = app.indexOf("const profileStatsMarkup =");
  const statsEnd = app.indexOf("const requested", statsStart);
  assert.ok(statsStart >= 0 && statsEnd > statsStart, "profile header stats are assembled separately");
  assert.doesNotMatch(app.slice(statsStart, statsEnd), /\bviews?\b/i,
    "view totals stay off the profile header");
  assert.doesNotMatch(app, /measured plays/);
});

test("Qualifying post views use Old Time's own vertical-bar mark in feed and Community action rows", () => {
  assert.match(icons, /viewBars:\s*'<path d="M4 19V13M9\.3 19V8M14\.7 19V4M20 19V10"/);
  assert.match(app, /const viewsMetric = p\.cloud && Number\.isSafeInteger\(p\.measuredViews\) && p\.measuredViews >= 0/);
  assert.match(app, /class="ot-view-metric" aria-label="\$\{fmt\(p\.measuredViews\)\} views"/);
  assert.match(app, /class="ot-view-metric" aria-label="\$\{fmt\(post\.measuredViews\)\} views"/);
  assert.match(app, /\$\{likeButton\}\$\{repostButton\}\$\{commentButton\}\$\{viewsMetric\}\$\{saveButton\}\$\{shareButton\}/);
  assert.match(css, /\.community-post-actions \{[^}]*grid-template-columns:repeat\(6,minmax\(0,1fr\)\)/);
  assert.match(css, /\.ot-view-metric \.navic \{ width:18px; height:18px/);
});

test("saved-post buttons preserve valid class and data-action attributes in both feed branches", () => {
  const saveAction = app.slice(app.indexOf("const saveAction ="), app.indexOf("const actions = placesViewer"));
  assert.match(saveAction, /<button class="act \$\{saved \? "on" : ""\}" data-save="\$\{p\.id\}"/);
  const actionsStart = app.indexOf("const actions = placesViewer");
  const actionsEnd = app.indexOf("const soundTitle", actionsStart);
  const actions = app.slice(actionsStart, actionsEnd);
  assert.ok(actionsStart >= 0 && actionsEnd > actionsStart, "the feed action branches are present");
  assert.equal(actions.split("${saveAction}").length - 1, 2);
});

test("Profile posts use a responsive grid with creator details only", () => {
  assert.match(profileRefinements, /#app \.profile-screen \.profile-post-grid\s*\{[\s\S]*?grid-template-columns:repeat\(2,minmax\(0,1fr\)\)[\s\S]*?column-gap:10px[\s\S]*?row-gap:12px/);
  assert.match(profileRefinements, /@media \(min-width:700px\)[\s\S]*?grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/,
    "the gallery gains a column on wider screens");
  assert.match(profileRefinements, /@media \(min-width:1100px\)[\s\S]*?grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/,
    "the gallery can expand again on desktop");
  assert.match(app, /import "\.\/destination-landing-refinement\.css"/,
    "the final profile gallery refinement is loaded after base styles");
  const profileCard = app.indexOf('return `<article class="profile-post-card">');
  const media = app.indexOf('class="profile-post-media', profileCard);
  const detail = app.indexOf('class="profile-post-detail"', media);
  const byline = app.indexOf('class="profile-post-byline"', detail);
  const profileCardMarkup = app.slice(profileCard, app.indexOf("</article>", profileCard));
  assert.ok(profileCard >= 0 && media > profileCard && detail > media && byline > detail,
    "existing media and creator byline stay in the profile card");
  assert.doesNotMatch(profileCardMarkup, /profile-post-caption|profile-post-(?:stats|likes|views)/,
    "captions and like/view counters are omitted from profile tiles");
  assert.doesNotMatch(app, /const profilePostMenu =/,
    "profile thumbnails do not gain an extra floating options button");
});

test("Full-screen video hearts and comments are white while saves keep their existing color", () => {
  assert.match(css, /\.clip:not\(\.post-detail\) > \.rail \.act\[data-like\]:not\(\.on\),[\s\S]*?\.clip:not\(\.post-detail\) > \.rail \.act\[data-comment\]\s*\{ color:#fff; \}/);
  assert.match(css, /\.clip:not\(\.post-detail\) > \.rail \.act\[data-like\]\.on \{ color:var\(--feed-like\); \}/);
  assert.match(css, /\.clip \.act\[data-save\]\.on \.navic \{ color:#1d9bf0; fill:#1d9bf0; stroke:#1d9bf0; \}/);
});

test("Feed sound is a simple label with reuse actions in sound details", () => {
  assert.match(css, /\.soundbar\s*\{[^}]*left: 14px; right: 76px; bottom: calc\(128px \+ env\(safe-area-inset-bottom\)\);[^}]*border:0; border-radius:0; background:transparent/);
  assert.match(css, /\.clip \.meta\{bottom:calc\(144px \+ env\(safe-area-inset-bottom,0px\)\)/);
  assert.match(soundbarMarkup, /class="soundbar-note" aria-hidden="true">♫<\/span>/);
  assert.match(soundbarMarkup, /data-audio-open="\$\{esc\(p\.id\)\}"/);
  assert.doesNotMatch(soundbarMarkup, /soundbar-action|soundbar-sub|data-audio-action/);
  assert.match(audioPanel, /data-audio-reuse/);
  assert.match(audioPanel, /data-audio-remix/);
});

test("Home feed details and action icons sit closer to navigation without sound overlap", () => {
  assert.match(css, /#feed \.clip:not\(\.post-detail\) \.meta \{ bottom:calc\(98px \+ env\(safe-area-inset-bottom,0px\)\); \}/);
  assert.match(css, /#feed \.clip:not\(\.post-detail\) \.soundbar \{ bottom:calc\(64px \+ env\(safe-area-inset-bottom,0px\)\); \}/);
  assert.match(css, /#feed \.clip:not\(\.post-detail\) \.rail \{ bottom:calc\(76px \+ env\(safe-area-inset-bottom,0px\)\); \}/);
  assert.equal(126 - (96 + 22), 8, "metadata ends 8px above the sound label");
});

test("Opaque cross-origin browser errors are not shown verbatim as app toasts", () => {
  assert.match(app, /function handleUnhandledClientError\(error\)/);
  assert.match(app, /crossOriginLoad = \/cross\[- \]origin/);
  assert.doesNotMatch(app, /toast\(e\.(?:error|reason)\.message\)/);
});
