import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const detailCss = readFileSync(new URL("./post-detail.css", import.meta.url), "utf8");
const immersiveCss = readFileSync(new URL("./post-viewer-immersive.css", import.meta.url), "utf8");
const mediaStyle = readFileSync(new URL("./media-style-consistency.css", import.meta.url), "utf8");
const quietStyle = readFileSync(new URL("./quiet-interface.css", import.meta.url), "utf8");
const homeCss = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
const postCardStart = app.indexOf("function postCard(");
const postCardEnd = app.indexOf("function postPlaceValue(", postCardStart);
const postCardSource = app.slice(postCardStart, postCardEnd);

test("media viewer uses the Home creator row and keeps top Share removed", () => {
  const header = app.match(/<header class="post-viewer-topbar">([\s\S]*?)<\/header>/)?.[1] || "";
  assert.ok(header, "post viewer header should exist");
  assert.doesNotMatch(header, /post-viewer-share|aria-label="Share post"/);
  assert.match(header, /: mediaViewer\s*\?\s*""\s*:\s*`<button type="button" class="post-viewer-avatar"/,
    "media viewers omit the custom top identity row while other detail screens keep theirs");
  assert.doesNotMatch(header, /post-viewer-download/,
    "the download control is no longer a separate viewer-header button");
  assert.match(header, /post-viewer-avatar/);
  assert.match(header, /post-viewer-identity/);
  assert.match(header, /post-viewer-follow/);
  assert.match(app, /class="feed-author-avatar" data-avatar-profile=/);
  assert.match(app, /class="feed-author-name" data-profile=/);
  assert.match(app, /feedFollowButton\(\{author:u,me:api\.me\(\),following,requests:api\.db\(\)\.requests,className:"followpill"/);
  assert.doesNotMatch(postCardSource, /<details class="profile-post-menu"/,
    "profile grid cards no longer display the floating options menu");
  assert.match(postCardSource, /<details class="post-actions-menu post-viewer-actions-menu" data-post-actions-menu>/,
    "full-screen media keeps post actions in one accessible menu");
  assert.match(postCardSource, /data-save="\$\{esc\(p\.id\)\}"[^>]*aria-pressed="\$\{saved\}"/,
    "Save is available from the full-screen post menu");
  assert.match(postCardSource, /data-post-viewer-download="\$\{esc\(p\.id\)\}"/,
    "Download moves into the full-screen post menu");
  assert.match(postCardSource, /const saveAction = mediaViewer \? "" : `<button class="act/,
    "full-screen media removes the duplicate Save action from the side rail");
  assert.match(detailCss, /#app \.post-viewer-media \.post-viewer-media-info \.meta \.handle\s*\{\s*display:flex!important;/);
  assert.match(immersiveCss, /#app \.post-viewer-media \.post-viewer-actions-menu\s*\{/);
  assert.match(immersiveCss, /\.post-viewer-actions-menu > summary\s*\{[^}]*width:44px;[^}]*height:44px;[^}]*border:0!important;[^}]*background:transparent!important;[^}]*color:#fff!important;[^}]*box-shadow:none!important/s,
    "the post menu keeps its tap target but removes the circle around the hamburger");
  assert.match(homeCss, /#feed \.clip:not\(\.post-detail\) \.rail \.ot-view-metric\s*\{[^}]*flex-direction:column/s,
    "feed view counts stack directly under the views icon");
  assert.match(mediaStyle, /#app #feed \.clip:not\(\.post-detail\) \.handle,\s*#app \.post-viewer-media \.post-viewer-media-info \.meta \.handle/);
  assert.match(quietStyle, /#app \.home-screen \.handle \.feed-author-name,#app \.post-viewer-media \.post-viewer-media-info \.meta \.feed-author-name/);
  assert.match(homeCss, /#feed \.clip:not\(\.post-detail\) \.meta \{ bottom:calc\(98px \+ env\(safe-area-inset-bottom,0px\)\); \}/);
  assert.match(homeCss, /#feed \.clip:not\(\.post-detail\) \.soundbar \{ bottom:calc\(64px \+ env\(safe-area-inset-bottom,0px\)\); \}/);
  assert.match(homeCss, /#feed \.clip:not\(\.post-detail\) \.rail \{ bottom:calc\(76px \+ env\(safe-area-inset-bottom,0px\)\); \}/);
  assert.match(mediaStyle, /#app \.post-viewer-screen\.post-viewer-media \.post-viewer-media-info\s*\{\s*left:14px;\s*right:60px;\s*bottom:calc\(70px \+ env\(safe-area-inset-bottom,0px\)\)!important;\s*align-items:stretch;\s*gap:4px;/);
  assert.match(mediaStyle, /#app \.post-viewer-screen\.post-viewer-media \.clip\.post-detail > \.rail\s*\{\s*bottom:calc\(76px \+ env\(safe-area-inset-bottom,0px\)\);/);
  assert.match(mediaStyle, /#app \.post-viewer-screen\.post-viewer-media \.clip\.post-detail > \.rail\s*\{[^}]*right:12px;[^}]*width:46px;[^}]*gap:18px;/);
  assert.match(mediaStyle, /#app \.post-viewer-screen\.post-viewer-media \.clip\.post-detail > \.rail \.act\s*\{[^}]*min-height:44px/);
  assert.match(mediaStyle, /#app \.post-viewer-screen\.post-viewer-media \.clip\.post-detail > \.rail \.act:is\(\[data-like\],\[data-comment\],\[data-save\],\[data-share\]\) \.navic\s*\{[^}]*width:28px;[^}]*height:28px;/);
  assert.match(mediaStyle, /#app \.post-viewer-screen\.post-viewer-media \.post-viewer-media-info \.meta \.caption-more\s*\{\s*color:rgba\(255,255,255,\.82\);/);
  assert.match(quietStyle, /#app \.post-viewer-media \.post-viewer-media-info \.meta \.followpill\{[^}]*min-width:78px;min-height:44px[^}]*font-size:12px/);
  assert.match(quietStyle, /#app \.post-viewer-media \.post-viewer-media-info \.meta \.followpill::before\{[^}]*inset:6px 0;border:1px solid #fff/);
  assert.match(quietStyle, /#app \.post-viewer-media \.post-viewer-media-info \.meta \.followpill:is\(:hover,:active,\[aria-pressed=true\]\)\{background:transparent;color:#fff/);
  assert.match(immersiveCss, /\.post-viewer-screen\.post-viewer-media \s*\{[^}]*width:100%; height:100dvh/);
  assert.match(immersiveCss, /#app \.post-viewer-screen\.post-viewer-media \.clip\.post-detail > \.fullimg,[\s\S]*?object-fit:contain!important/);
  assert.match(immersiveCss, /object-position:center/);
  assert.match(immersiveCss, /#app \.post-viewer-screen\.post-viewer-media \.post-viewer-media-backdrop \{ display:block; \}/);
  assert.doesNotMatch(detailCss, /font-size:12\.5px|font:600 11\.5px/,
    "viewer metadata uses the Home feed's caption and sound text sizes");
  assert.match(app, /class="act" data-share="\$\{p\.id\}"/,
    "the in-feed share action remains available");
});
