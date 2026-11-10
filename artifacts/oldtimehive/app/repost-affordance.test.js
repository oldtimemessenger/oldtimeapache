import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderRepostAffordance } from "./repost-affordance.js";

const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
})[char]);
const account = {
  me: () => ({ id: "viewer", username: "viewer", avatar: "viewer.jpg" }),
  user: () => null,
  canSee: () => true,
};
const renderIcon = name => `<svg class="navic" data-icon="${name}"></svg>`;

test("the zero-count action uses the same avatar pill and separate icon button", () => {
  const html = renderRepostAffordance({
    id: "post-1", author: "creator", repostCount: 0, reposts: [], repostedByFriends: [],
  }, { esc, account, renderIcon });

  assert.match(html, /class="rp-summary"/);
  assert.match(html, /class="rp-count">Repost to followers</);
  assert.match(html, /<img src="viewer\.jpg"/);
  assert.match(html, /class="rp-action rp-action-icon-only"/);
  assert.match(html, /data-repost="post-1"/);
  assert.match(html, /aria-label="Repost to followers"/);
  assert.match(html, /data-icon="repost"/);
  assert.doesNotMatch(html, /rp-action-label/);
});

test("repost counts use the avatar pill beside the same repost action", () => {
  const html = renderRepostAffordance({
    id: "post-2",
    author: "creator",
    repostCount: 2,
    reposts: ["friend-1", "friend-2"],
    repostedByFriends: [
      { id: "friend-1", username: "first", avatar: "first.jpg" },
      { id: "friend-2", username: "second", avatar: "second.jpg" },
    ],
  }, { esc, account, renderIcon });

  assert.match(html, /<div class="rp-row">/);
  assert.match(html, /class="rp-summary"/);
  assert.match(html, />2 reposted</);
  assert.equal((html.match(/class="rp-face rp-face-compact"/g) || []).length, 2);
  assert.match(html, /class="rp-action rp-action-icon-only"/);
  assert.match(html, /data-repost="post-2"/);
  assert.match(html, /class="rp-count" data-reposters-open="post-2" aria-label="See who reposted this post"/);
  assert.doesNotMatch(html, /rp-badge/);
});

test("the repost preview shows only two avatars and opens the full list from its count", () => {
  const html = renderRepostAffordance({
    id: "post-many",
    author: "creator",
    repostCount: 3,
    reposts: ["friend-1", "friend-2", "friend-3"],
    repostedByFriends: [
      { id: "friend-1", username: "first", avatar: "first.jpg" },
      { id: "friend-2", username: "second", avatar: "second.jpg" },
      { id: "friend-3", username: "third", avatar: "third.jpg" },
    ],
  }, { esc, account, renderIcon });
  assert.match(html, />3 reposted</);
  assert.equal((html.match(/class="rp-face rp-face-compact"/g) || []).length, 2);
  assert.match(html, /data-reposters-open="post-many"/);
});

test("a single visible reposter is labeled by display name without an invented @ handle", () => {
  const html = renderRepostAffordance({
    id: "post-3",
    author: "creator",
    repostCount: 1,
    reposts: ["friend-1"],
    repostedByFriends: [
      { id: "friend-1", username: "caribbeangirl", name: "Caribbean Girl", avatar: "friend.jpg" },
    ],
  }, { esc, account, renderIcon });

  assert.match(html, /class="rp-count"[^>]*>Caribbean Girl reposted</);
  assert.doesNotMatch(html, /class="rp-count">@caribbeangirl reposted/);
});

test("an unknown single reposter shows the real count, not a generic Reposted pill", () => {
  const html = renderRepostAffordance({
    id: "post-unknown-reposter",
    author: "creator",
    repostCount: 1,
    reposts: ["unavailable-account"],
    repostedByFriends: [],
  }, { esc, account, renderIcon });

  assert.match(html, /class="rp-count"[^>]*>1 repost</);
  assert.doesNotMatch(html, />Reposted</);
});

test("a creator cannot repost their own post, but can still see its attribution", () => {
  const html = renderRepostAffordance({
    id: "own-post",
    author: "viewer",
    repostCount: 2,
    repostedByFriends: [
      { id: "friend-1", username: "first", avatar: "first.jpg" },
      { id: "friend-2", username: "second", avatar: "second.jpg" },
    ],
    reposts: [],
  }, { esc, account, renderIcon });

  assert.match(html, /2 reposted/);
  assert.doesNotMatch(html, /data-repost="own-post"/);
});

test("overlay styles match the place and repost reference without changing Community cards", () => {
  const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
  const placeCss = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
  const repostCss = readFileSync(new URL("./repost-affordance.css", import.meta.url), "utf8");
  const viewerCss = readFileSync(new URL("./post-detail.css", import.meta.url), "utf8");
  const icons = readFileSync(new URL("./icons.js", import.meta.url), "utf8");
  assert.match(app, /class="post-viewer-place-location place-video-overlay"/);
  assert.match(app, /ic\.locationBadge/);
  assert.match(app, /videoOverlay \? " place-video-overlay" : ""/);
  assert.match(placeCss, /\.clip \.clip-place-card\.place-video-overlay/);
  assert.match(placeCss, /background:#10b994/);
  assert.match(icons, /repost: '<path d="m17 2 4 4-4 4"/);
  assert.doesNotMatch(icons.match(/repost: ([^\n]+)/)?.[1] || "", /star|circle|sparkle/i);
  assert.match(repostCss, /\.rp-summary\{[^}]*background:rgba\(255,255,255/);
  assert.match(repostCss, /min-height:27px/);
  assert.match(repostCss, /width:19px;height:19px/);
  assert.match(repostCss, /width:24px;height:24px/);
  assert.match(repostCss, /border:0;border-radius:5px/);
  assert.match(repostCss, /\.rp-row\{display:flex;align-items:center;gap:4px/);
  assert.match(repostCss, /\.rp-action-icon-only/);
  assert.match(repostCss, /#app \.post-viewer-media \.post-viewer-media-info \.meta \.rp-aff \.rp-count\{color:#17191c\}/);
  assert.match(viewerCss, /\.post-viewer-media-info \.meta \* \{ color:inherit; \}/);
  assert.match(repostCss, /Repost to followers|\.rp-action-label/);
});

test("Home metadata rows are tighter and sit just above the navigation", () => {
  const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
  const repostCss = readFileSync(new URL("./repost-affordance.css", import.meta.url), "utf8");
  assert.match(css, /#feed \.clip:not\(\.post-detail\) \.meta \{ bottom:calc\(98px \+ env/);
  assert.match(css, /#feed \.clip:not\(\.post-detail\) \.soundbar \{ bottom:calc\(64px \+ env/);
  assert.match(css, /#feed \.clip:not\(\.post-detail\) \.meta \[data-post-likes\] \{ min-height:24px/);
  assert.match(css, /#feed \.clip:not\(\.post-detail\) \.meta \.cap \{ margin-top:3px/);
  assert.match(repostCss, /\.rp-aff\{[^}]*margin:0 0 4px/);
  assert.doesNotMatch(css, /#feed \.clip:not\(\.post-detail\) \.meta \.rp-aff/);
});

test("successful reposts preserve the count pill instead of replacing it with a pulse label", () => {
  const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
  const affordance = readFileSync(new URL("./repost-affordance.js", import.meta.url), "utf8");
  assert.doesNotMatch(app, /showRepostedPulse/);
  assert.doesNotMatch(affordance, /label\.textContent\s*=\s*"Reposted"/);
});
