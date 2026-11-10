import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { icon, iconPaths } from "./icons.js";

const dir = path.dirname(fileURLToPath(import.meta.url));
const source = name => readFileSync(path.join(dir, name), "utf8");

test("the legacy overflow glyph remains available for compatibility", () => {
  const circles = [...iconPaths.more.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"\/>/g)]
    .map(([, x, y]) => [Number(x), Number(y)]);
  assert.deepEqual(circles, [[12, 5], [12, 12], [12, 19]]);
  assert.equal((icon("more").match(/<circle\b/g) || []).length, 3);
});

test("menu, filter, settings, and studio controls share the short-bar icon", () => {
  const expected = '<path d="M5 6h14M5 12h10M5 18h6"/>';
  for (const name of ["menu", "tune", "settings", "sliders"]) {
    assert.equal(iconPaths[name], expected, `${name} uses the reference hamburger shape`);
  }
  assert.match(source("creative-view-icons.js"), /sliders:\s*svg\(iconPaths\.sliders\)/);
  assert.match(source("app.js"), /class="discovery-filter-button"[\s\S]*?\$\{icon\("sliders"\)\}/);
  assert.equal((icon("sliders").match(/<circle\b/g) || []).length, 0);
});

test("new-message icon is an original outlined chat bubble with a plus", () => {
  assert.match(iconPaths.messagePlus, /<path d="M4 8\.5/);
  assert.match(iconPaths.messagePlus, /M9 11v5m-2\.5-2\.5h5/);
  assert.equal((icon("messagePlus").match(/<path\b/g) || []).length, 2);
});

test("Messages is an original outline stack with an open pair of back edges",()=>{
  assert.match(iconPaths.messages,/class="conversation-front"/);
  assert.match(iconPaths.messages,/v10l-3\.5-2H4/);
  assert.match(iconPaths.messages,/<path fill="none" d="M6 5\.5/);
  assert.match(icon("messages"),/stroke-width="1\.75"/);
  assert.doesNotMatch(iconPaths.messages,/<(?:image|text|circle)\b/);
  assert.doesNotMatch(icon('bad"><script>'),/<script>/);
});

test("app action menus use the hamburger icon instead of vertical overflow dots", () => {
  assert.match(source("sports-mode.js"), /aria-label="Menu">\$\{svg\(I\.menu\)\}/);
  assert.match(source("creative-create-view.js"), /aria-label="Editing actions">\$\{I\.menu\}/);
  assert.match(source("creative-editor-view.js"), /aria-label="Editing actions">\$\{I\.menu\}/);
  assert.match(source("blast-social.js"), /aria-label="Post type options"[^>]*>\$\{icon\("menu"\)\}/);
  assert.match(source("creative-view-icons.js"), /more:\s*svg\(iconPaths\.menu\)/);
  assert.match(source("creative-view-icons.js"), /menu:\s*svg\(iconPaths\.menu\)/);
  assert.match(source("sports-mode.js"), /more:\s*iconPaths\.menu/);
  assert.match(source("sports-mode.js"), /menu:\s*iconPaths\.menu/);
  assert.match(source("post-actions-menu.js"), /icons\.tune \|\| icons\.menu/);
  assert.match(source("app.js"), /ic\[iconName\] \|\| ic\.info/);
  assert.match(source("story-interactions.js"), /class="story-more-open"[^>]*>\$\{icon\("menu"\)\}/);
  assert.match(source("app.js"), /aria-label="Comment actions">\$\{ic\.tune\}/);
});

test("chat hold actions show reactions and the full labeled options panel without a trigger button", () => {
  const chat = source("chat.js");
  assert.match(chat, /data-chat-quick-reaction/);
  assert.match(chat, /data-chat-reaction-more/);
  assert.match(chat, /data-context-action="reply"/);
  assert.match(chat, /data-context-action="save"/);
  assert.match(chat, /data-context-action="forward"/);
  assert.match(chat, /data-context-action="delete"/);
  assert.match(chat, /data-context-action="more"/);
  assert.doesNotMatch(chat, /class="chat-quick-more"/);
  assert.doesNotMatch(chat, /chat-location-options|data-location-options/);
  assert.match(chat, /const actions = \["Forward", "Copy", "Keep"/);
  assert.doesNotMatch(chat, /data-chat-quick-reply/);
  assert.match(chat, /class="chat-context-more-glyph">···/);
  assert.doesNotMatch(chat, /const actions = \["Reply", "React"/);
  assert.match(chat, /openMessageQuickActions\(ctx, id, b\.dataset\.msg\)/);
});

test("profile and review-queue controls use the current menu and recovery actions", () => {
  const app = source("app.js");
  assert.match(app, /profile-actions-open[\s\S]*?\$\{ic\.menu\}/);
  assert.match(app, /id="review-queue-retry"/);
  assert.match(app, /id="review-queue-back"/);
});

test("comment controls use a heart for Like and a downward thumb for Dislike", () => {
  const app = source("app.js");
  assert.match(app, /data-clike="\$\{esc\(comment\.id\)\}"[^>]*>\$\{ic\.mediaHeart\}/);
  assert.match(app, /data-cdislike="\$\{esc\(comment\.id\)\}"[^>]*><svg[^>]*><path transform="rotate\(180 12 12\)"/);
});

test("social post actions use recognizable outlined heart, bubble, bookmark and repost glyphs", () => {
  assert.match(iconPaths.heart, /a5\.6 5\.6 0 0 0-7\.9 0/);
  assert.match(iconPaths.comment, /a8\.5 8\.5 0 0 1-8\.5 8\.5/);
  assert.match(iconPaths.bookmark, /v17l-6-4-6 4z/);
  assert.match(iconPaths.repost, /m17 2 4 4-4 4/);
  assert.match(icon("heart"), /fill="none"/);
  assert.match(icon("bookmark"), /fill="none"/);
});

test("media post rails use the approved heart, comment, and bookmark silhouettes", () => {
  const app = source("app.js");
  const blast = source("blast-social.js");
  const places = source("places-view.js");
  assert.match(iconPaths.mediaHeart, /matrix\(\.3 0 0 \.3 -10\.8 -\.45\)/);
  assert.match(iconPaths.mediaComment, /M77 164c-16 0-29 12-29 28/);
  assert.match(iconPaths.mediaBookmark, /M61 312h30c5 0 8 3 8 8/);
  assert.match(icon("mediaHeart"), /vector-effect="non-scaling-stroke"/);
  assert.match(icon("mediaHeart", true), /fill="currentColor"/);
  assert.ok(app.includes("${liked ? ic.mediaHeartOn : ic.mediaHeart}"));
  assert.ok(app.includes("${ic.mediaComment}"));
  assert.ok(app.includes("${saved ? ic.mediaBookmarkOn : ic.mediaBookmark}"));
  assert.ok(app.includes("${liked ? ic.heartOn : ic.heart}"), "Community post controls keep their original heart");
  assert.ok(app.includes("${ic.comment}"), "Community post controls keep their original comment bubble");
  assert.ok(app.includes("${saved ? ic.bookmarkOn : ic.bookmark}"), "Community post controls keep their original bookmark");
  assert.ok(blast.includes('icon("mediaHeart")'));
  assert.ok(blast.includes('icon("mediaComment")'));
  assert.ok(blast.includes('icon("mediaBookmark", isSaved)'));
  assert.ok(places.includes("matrix(.3 0 0 .3 -10.8 -.45)"));
});

test("Community quick actions include like, repost, comment, views, save, and share in order", () => {
  const app = source("app.js");
  assert.match(app, /class="community-post-actions" aria-label="Post actions">\$\{likeButton\}\$\{repostButton\}\$\{commentButton\}\$\{viewsMetric\}\$\{saveButton\}\$\{shareButton\}/);
});
