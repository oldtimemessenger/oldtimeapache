import { readFileSync } from "node:fs";
import assert from "node:assert";
import { test } from "node:test";
const js = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
const flatCss = readFileSync(new URL("./flat-surfaces.css", import.meta.url), "utf8");
test("narrow Messages headers reserve separate title and action columns",()=>{
  assert.match(css,/\.chat-list-topline\s*\{[^}]*grid-template-columns:minmax\(0,1fr\) auto/);
  assert.match(css,/\.chat-list-topline \.chat-head-actions\s*\{[^}]*position:static/);
  assert.doesNotMatch(readFileSync(new URL("./chat.js",import.meta.url),"utf8"),/id="saved"/);
});
test("long chat names truncate independently of verification badges",()=>{
  const chat=readFileSync(new URL("./chat.js",import.meta.url),"utf8");
  assert.match(chat,/class="chat-identity-name"/);
  assert.match(css,/\.chat-identity-name\s*\{[^}]*text-overflow:ellipsis/);
  assert.match(css,/\.chat-identity-copy \.verified\s*\{[^}]*flex:0 0 auto/);
});
test("Settings home matches the centered title, handle, Done action and search layout",()=>{
  assert.match(js,/settingsView === "home" \? "settings-home-view" : ""/);
  assert.match(js,/settingsView === "home" \? "settings-home-header" : ""/);
  assert.match(js,/<h1>\$\{titles\.home\}<\/h1><p>@\$\{esc\(me\.username\)\}<\/p>/);
  assert.match(js,/class="settings-home-done"[^>]*>Done<\/button>/);
  assert.doesNotMatch(js,/class="settings-account-card"[^>]*data-settings-profile/);
  assert.match(js,/placeholder="Search settings"/);
  assert.match(flatCss,/\.settings-home-view \.settings-header\.settings-home-header\{[^}]*grid-template-columns:minmax\(44px,1fr\) minmax\(0,auto\) minmax\(44px,1fr\)/);
  assert.match(flatCss,/\.settings-home-view \.settings-search\{[^}]*border-radius:999px/);
  assert.match(flatCss,/\.settings-home-view \.settings-entry-chevron \.navic\{[^}]*width:16px/);
});
test("Settings categories use distinct semantic line icons",()=>{
  assert.match(js,/"close-friends":"users"/);
  assert.match(js,/"profile-visibility":"eye"/);
  assert.match(js,/entry\("edit", "Edit profile"/);
  assert.match(js,/entry\("trash", "Delete account"/);
  assert.match(js,/class="settings-entry-chevron" aria-hidden="true">\$\{ic\.chevronRight\}/);
});
test("full feed captions stay scrollable above the audio and navigation controls",()=>{
  assert.match(css,/\.clip \.meta\s*\{[^}]*bottom:calc\(144px[^}]*max-height:calc\(100% - 348px[^}]*overflow-y:auto[^}]*overscroll-behavior-y:contain/);
  assert.match(js,/<div class="meta" tabindex="0" aria-label="Post details">/);
});
test("Home keeps Stories out of the status tray", () => {
  assert.doesNotMatch(js, /class="home-story"/);
  assert.doesNotMatch(css, /\.home-stories?\b/);
});
test("story media fills the viewer and reply permissions stay in the options menu", () => {
  const interactions = readFileSync(new URL("./story-interactions.js", import.meta.url), "utf8");
  const interactionCss = readFileSync(new URL("./story-interactions.css", import.meta.url), "utf8");
  const icons = readFileSync(new URL("./icons.js", import.meta.url), "utf8");
  assert.match(js, /class="story-stage\$\{stageAppearance\.isLight \? " is-light-background" : ""\}"/);
  assert.match(js, /class="story-stage-media"/);
  assert.match(interactionCss, /\.story-stage-media,[\s\S]*?object-fit:\s*cover/);
  assert.match(interactionCss, /\.storyview > \.story-stage\s*\{[^}]*inset:0/);
  assert.match(js, /class="story-header"/);
  assert.match(js, /Close Story/);
  assert.match(interactions, /class="story-more-open"/);
  assert.match(interactions, /class="story-comment-setting"/);
  assert.match(interactionCss, /\.story-more-menu\[hidden\][^{]*\{\s*display:none/);
  assert.match(interactions, /liveChat\.className = "story-live-chat"/);
  assert.match(interactions, /REPLY_FADE_MS = 6500/);
  assert.match(interactions, /className = "story-live-list"/);
  assert.match(interactions, /showReplyHistory/);
  assert.match(interactionCss, /\.story-live-message\.is-entering\s*\{[^}]*story-reply-in/);
  assert.match(interactionCss, /\.story-live-message\.is-faded\s*\{[^}]*opacity:0/);
  assert.match(interactionCss, /\.story-live-message > span\s*\{[^}]*border-radius:0[^}]*background:transparent/);
  assert.match(interactions, /liveChat\.addEventListener\("touchmove"/);
  assert.match(interactions, /liveChat\.addEventListener\("wheel"/);
  assert.match(interactions, /storyReplyFadeDelay/);
  assert.doesNotMatch(interactions, /slice\(-80\)/, "expanded history keeps every loaded Story reply");
  assert.match(interactionCss, /prefers-reduced-motion: reduce/);
  assert.match(interactions, /class="story-activity-open story-panel-tab"/);
  assert.ok(interactions.includes('icon("viewBars")'));
  assert.doesNotMatch(interactions, /story-side-actions|story-heart/);
  assert.doesNotMatch(interactions, /class="story-quick-reaction"|class="story-reaction-open"/);
  assert.match(interactions, /class="story-reaction-picker" role="group" aria-label="Story reactions"[^>]*>\$\{QUICK_EMOJI\.map/);
  assert.match(interactions, /class="story-more-item story-share"/);
  assert.match(js, /viewerAvatar && !isDefaultAvatarMediaReference\(viewerAvatar\)/,
    "the reply pill never falls back to Oldtime's generic avatar");
  assert.match(interactions, /createStoryTapRecognizer/);
  assert.match(interactions, /onDouble: point => \{ if \(!isStoryAuthor\) void saveReaction\("❤️", point\); \}/);
  assert.match(interactions, /onSingle: point => \{ if \(!isStoryAuthor\) burst\.spawn\(\.\.\.point\); \}/);
  assert.match(interactions, /placeholder="Comment…"/);
  assert.match(interactions, /class="story-send" aria-label="Send reply"/);
  assert.match(interactions, /sendButton\.hidden = !hasText \|\| !canReply/);
  assert.match(interactionCss, /\.story-send\[hidden\][^{]*\{\s*display:none !important/);
  const store = readFileSync(new URL("./store.js", import.meta.url), "utf8");
  assert.match(interactions, /api\.sendCloudStoryComment\(story\.id, body\)/);
  assert.match(store, /async sendCloudStoryComment[\s\S]*?cloudRequest\(`\/api\/stories\/\$\{encodeURIComponent\(id\)\}\/comments`/);
  assert.match(interactions, /field\.addEventListener\("keydown"[\s\S]*?compose\.requestSubmit\(\)/);
  assert.match(interactions, /story-more-menu story-sheet[\s\S]*?story-activity-open/);
  assert.match(interactions, /view\.append\(moreMenu\)/);
  assert.match(interactions, /closeReplyHistory\(true\)/);
  assert.match(interactions, /liveChat\.addEventListener\("touchcancel", finishHistoryTouch/);
  assert.match(interactionCss, /\.story-live-message\[hidden\]\s*\{[^}]*display:none!important/);
  assert.match(interactionCss, /\.story-reaction-picker\s*\{[^}]*background:transparent/);
  assert.match(icons, /more: '<circle cx="12" cy="5"[\s\S]*?cy="12"[\s\S]*?cy="19"/);
  assert.match(icons, /viewBars: '<path/);
  assert.match(icons, /smilePlus: '<circle/);
  assert.match(js, /id="sclose"/);
  assert.doesNotMatch(js, /id="ssave"|id="sdelete"/);
  assert.doesNotMatch(interactions, /story-close-menu|Close story/);
});
test("Story composer stays full width and selected controls use a white underline", () => {
  const interactionCss = readFileSync(new URL("./story-interactions.css", import.meta.url), "utf8");
  const visualCss = readFileSync(new URL("./story-visual-refinement.css", import.meta.url), "utf8");
  const identityCss = readFileSync(new URL("./story-identity.css", import.meta.url), "utf8");
  const interactions = readFileSync(new URL("./story-interactions.js", import.meta.url), "utf8");
  assert.match(interactionCss, /\.story-bar\s*\{[^}]*grid-template-columns:minmax\(0,1fr\)/);
  assert.doesNotMatch(`${interactionCss}\n${visualCss}`, /grid-template-columns:\s*(?:34|36|38|40)px\s+minmax\(0,1fr\)\s+auto/,
    "no breakpoint reserves the removed avatar/action columns");
  assert.match(interactionCss, /\.story-panel-tab\[aria-selected=true\]::after\s*\{[^}]*background:#fff/);
  assert.match(identityCss, /#storyview\.storyview \.story-panel-tab\[aria-selected="true"\]\s*\{[^}]*background:\s*transparent/);
  assert.match(interactions, /const canReply = enabled && !isStoryAuthor/);
  assert.match(interactions, /compose\.hidden = !canReply/);
  assert.match(interactions, /if \(isStoryAuthor \|\| !story\.cloud \|\| story\.commentsEnabled === false\) return/);
  assert.match(interactions, /const saveReaction = async[\s\S]*?if \(isStoryAuthor\) return/);
  assert.match(interactionCss, /\.story-compose\[hidden\]\s*\{\s*display:none !important/);
  assert.match(interactions, /field\.placeholder = enabled \? "Comment…" : "Replies are off"/);
  assert.match(js, /const storyTextIsRenderedInMedia = Boolean\(s\.creativeProject \|\| \(Array\.isArray\(s\.stickers\) && s\.stickers\.length\)\)/);
  assert.match(js, /renderMentionText\(storyCaption\)/);
});
test("Story sharing opens a specific cloud Story and keeps access checks", () => {
  assert.match(js, /url\.searchParams\.set\("story", s\.id\)/);
  assert.match(js, /pendingStoryId = params\.get\("story"\)/);
  assert.match(js, /await api\.refreshCloudStories\(\)/);
  assert.match(js, /api\.canSeeStory\(story\)/);
  assert.match(js, /openStory\(story\.author, story\.id\)/);
});
test("shared comment Stories open from the card and keep action icons unboxed", () => {
  const interactions = readFileSync(new URL("./story-interactions.js", import.meta.url), "utf8");
  const identity = readFileSync(new URL("./story-identity.css", import.meta.url), "utf8");
  assert.match(js, /const commentCardTarget = Boolean\(sharedTarget\?\.commentId && s\.creativeProject\)/);
  assert.match(js, /const sourceHitClass = commentCardTarget \? "story-comment-source"/);
  assert.match(js, /const sourceHitbox = sharedStatusLayerHitbox\(s\.creativeProject\)/);
  assert.match(js, /const sourceHitMarkup = sharedTarget/);
  assert.doesNotMatch(js, /story-source-link|View \$\{sharedTarget\.commentId/);
  assert.match(js, /event\.stopPropagation\(\);[\s\S]{0,100}const button = event\.currentTarget/);
  assert.match(interactions, /button\.setAttribute\("aria-pressed", String\(story\.viewerReaction === button\.dataset\.reaction\)\)/);
  assert.match(identity, /\.story-reaction-picker button[\s\S]*?border-radius: 0 !important/);
  assert.doesNotMatch(identity, /story-heart|story-share/);
  assert.match(identity, /\.story-creator img[\s\S]*?border-radius: 50% !important/);
  assert.match(identity, /\.story-post-source/);
  assert.match(identity, /\.story-comment-source:focus-visible/);
});
test("stories share one expiry rule and the retired Hey Word prompt is absent", () => {
  const lifecycle = readFileSync(new URL("./story-lifecycle.js", import.meta.url), "utf8");
  const interactions = readFileSync(new URL("./story-interactions.js", import.meta.url), "utf8");
  const blast = readFileSync(new URL("./blast-social.js", import.meta.url), "utf8");
  const chat = readFileSync(new URL("./chat.js", import.meta.url), "utf8");
  assert.match(lifecycle, /STORY_LIFETIME_MS = 24 \* 60 \* 60 \* 1000/);
  assert.match(js, /isStoryActive\(s\)/);
  assert.match(blast, /isStoryActive\(story\)/);
  assert.match(chat, /isStoryActive\(story\)/);
  assert.doesNotMatch(interactions, /Keep on profile/);
  assert.match(interactions, /Save to profile/);
  assert.match(interactions, /onSave/);
  assert.doesNotMatch(js, /Share your take|Add yours/);
  assert.doesNotMatch(interactions, /Hey Word|hey-word/i);
});

test("Stories reuse the Home feed action icon scale and shared menu rhythm", () => {
  const shared = readFileSync(new URL("./ecosystem-consistency.css", import.meta.url), "utf8");
  assert.match(js, /import "\.\/ecosystem-consistency\.css"/);
  assert.doesNotMatch(shared, /\.story-reaction-open/);
  assert.doesNotMatch(shared, /story-heart|story-share/);
  assert.match(shared, /\.story-more-item\s*\{[^}]*min-height:44px/);
  assert.match(shared, /\.post-actions-menu-items button,[\s\S]*?\{[^}]*min-height:44px/);
  assert.match(shared, /prefers-reduced-motion:reduce/);
});

test("Story replies use a transparent stage, inline avatar composer and swipeable Cloudflare reactions", () => {
  const interactions = readFileSync(new URL("./story-interactions.js", import.meta.url), "utf8");
  const visual = readFileSync(new URL("./story-visual-refinement.css", import.meta.url), "utf8");
  const identity = readFileSync(new URL("./story-identity.css", import.meta.url), "utf8");
  const store = readFileSync(new URL("./store.js", import.meta.url), "utf8");
  assert.doesNotMatch(visual, /story-stage::before\s*\{[^}]*linear-gradient|story-stage::after\s*\{[^}]*inset 0 0 90px/);
  assert.match(interactions, /\$\{viewerAvatarMarkup\}/);
  assert.match(js, /resolveProfileAvatar\(api\.me\(\) \|\| \{\}, ""\)/);
  assert.match(identity, /\.story-compose \.story-reaction-picker\s*\{[^}]*overflow-x:auto/);
  assert.match(identity, /\.story-compose \.story-reaction-picker\s*\{[^}]*touch-action:pan-x/);
  assert.match(identity, /\.story-compose\s*\{[^}]*border:1px solid[^}]*background:rgba\(0,0,0,\.12\)[^}]*box-shadow:none[^}]*backdrop-filter:none/);
  assert.match(interactions, /reactionPicker\.hidden = hasText/);
  assert.match(interactions, /sendButton\.hidden = !hasText \|\| !canReply/);
  assert.match(interactions, /api\.setCloudStoryReaction\(story\.id, emoji\)/);
  assert.match(store, /async setCloudStoryReaction[\s\S]*?\/reactions/);
});

test("Story playback progress follows video time and photo duration is five seconds", () => {
  assert.match(js, /const progressBar = \$\("#bar"\)/);
  assert.match(js, /video\.currentTime \/ video\.duration/);
  assert.match(js, /if \(video\.ended\) advanceStory\(\)/);
  assert.match(js, /mediaPending \|\| view\.dataset\.stickerOpen/);
  assert.match(js, /: 5000/);
  assert.match(js, /document\.hidden/);
});


test("Stories use the immersive responsive viewer without replacing the existing Story engine", () => {
  const redesign = readFileSync(new URL("./story-immersive-redesign.css", import.meta.url), "utf8");
  assert.match(js, /import "\.\/story-immersive-redesign\.css"/);
  assert.match(redesign, /#storyview\.storyview\s*\{[^}]*overscroll-behavior:contain/);
  assert.match(redesign, /\.story-creator\s*\{[^}]*backdrop-filter:blur/);
  assert.match(redesign, /\.story-compose:focus-within/);
  assert.match(redesign, /@media\s*\(min-width:700px\)/);
  assert.match(redesign, /--story-frame-width\s*:\s*min\(460px/);
  assert.match(redesign, /\.story-stage\s*\{[^}]*border-radius:26px/);
  assert.match(redesign, /@media\s*\(max-height:520px\) and \(orientation:landscape\)/);
  assert.match(redesign, /prefers-reduced-motion:reduce/);
  assert.match(js, /mountStoryInteractions\(/);
  assert.match(js, /api\.canSeeStory\(s\)/);
});

test("Stories use a centered immersive stage on desktop and preserve full-bleed mobile playback", () => {
  const visual = readFileSync(new URL("./story-visual-refinement.css", import.meta.url), "utf8");
  assert.match(visual, /--story-frame-width:min\(480px/);
  assert.match(visual, /--story-frame-height:min\(854px/);
  assert.match(visual, /\.story-stage\s*\{[\s\S]*?border-radius:26px/);
  assert.match(visual, /\.story-bar\s*\{[\s\S]*?max-width:calc\(var\(--story-frame-width\) - 24px\)/);
  assert.match(visual, /@media \(max-width:699px\)[\s\S]*?border-radius:0/);
  assert.match(visual, /\.story-compose:focus-within[\s\S]*?var\(--color-primary/);
  assert.match(visual, /prefers-reduced-motion:reduce/);
});

test("Story progress is segmented by item and announces the current position", () => {
  const redesign = readFileSync(new URL("./story-immersive-redesign.css", import.meta.url), "utf8");
  assert.match(js, /class="progress story-progress" role="group" aria-label="Story \$\{i \+ 1\} of \$\{list\.length\}"/);
  assert.match(js, /class="progress-segment\$\{index < i \? " is-complete" : ""\}\$\{index === i \? " is-active" : ""\} story-progress-segment" aria-hidden="true"/);
  assert.match(js, /index === i \? ' id="bar"'/);
  assert.match(js, /const progressBar = \$\("#bar"\)/);
  assert.match(redesign, /\.story-progress\s*\{[^}]*display:flex/);
  assert.match(redesign, /\.story-progress-segment\.is-complete > b\s*\{[^}]*width:100%/);
  assert.match(redesign, /\.story-progress-segment\.is-active > b/);
  assert.match(js, /role="group" aria-label="Story \$\{i \+ 1\} of \$\{list\.length\}"/);
  assert.match(js, /progress-segment\$\{index < i \? " is-complete" : ""\}/);
  const visual = readFileSync(new URL("./story-visual-refinement.css", import.meta.url), "utf8");
  assert.match(visual, /\.progress-segment\s*\{[^}]*flex:1 1 0/);
  assert.match(visual, /\.progress-segment\.is-complete b\s*\{\s*width:100%/);
});


test("Story viewer warms only the next authorized image and respects reduced motion", () => {
  assert.match(js, /preloadStoryImage\(nextStory\)/);
  assert.match(js, /!isStoryActive\(story\) \|\| !api\.canSeeStory\(story\)/);
  assert.match(js, /story\.kind === "video"/);
  assert.match(js, /list\[i \+ 1\]\?\.id !== nextStory\.id/);
  const immersive = readFileSync(new URL("./story-immersive-redesign.css", import.meta.url), "utf8");
  assert.match(immersive, /story-stage-arrive/);
  assert.match(immersive, /prefers-reduced-motion:reduce/);
});


test("Story viewer warms only the next authorized image and respects reduced motion", () => {
  assert.match(js, /preloadStoryImage\(nextStory\)/);
  assert.match(js, /!isStoryActive\(story\) \|\| !api\.canSeeStory\(story\)/);
  assert.match(js, /story\.kind === "video"/);
  assert.match(js, /list\[i \+ 1\]\?\.id !== nextStory\.id/);
  const immersive = readFileSync(new URL("./story-immersive-redesign.css", import.meta.url), "utf8");
  assert.match(immersive, /story-stage-arrive/);
  assert.match(immersive, /prefers-reduced-motion:reduce/);
});

test("app-wide action controls use a consistent menu and contextual icon language", () => {
  const icons = readFileSync(new URL("./icons.js", import.meta.url), "utf8");
  const storyInteractions = readFileSync(new URL("./story-interactions.js", import.meta.url), "utf8");
  const storyStyles = readFileSync(new URL("./story-interactions.css", import.meta.url), "utf8");
  const explore = readFileSync(new URL("./explore-ecosystem.js", import.meta.url), "utf8");
  const blastDrawer = readFileSync(new URL("./blast-settings-drawer.js", import.meta.url), "utf8");
  const blastStyles = readFileSync(new URL("./blast-video-notes.css", import.meta.url), "utf8");
  const menu = readFileSync(new URL("./post-actions-menu.js", import.meta.url), "utf8");
  const visual = readFileSync(new URL("./app-wide-visual-language.css", import.meta.url), "utf8");
  assert.match(js, /import "\.\/app-wide-visual-language\.css"/);
  assert.match(js, /profile-actions-open[\s\S]*?\$\{ic\.menu\}/);
  assert.match(js, /aria-label="Comment actions">\$\{ic\.tune\}/);
  assert.match(js, /aria-label="Reply actions">\$\{ic\.tune\}/);
  assert.doesNotMatch(storyInteractions, /story-heart|story-side-actions/, "Story likes use double-tap rather than a persistent side button");
  assert.ok(storyInteractions.includes('class="story-more-item story-share"'), "Story sharing is available from the options menu");
  assert.match(js, /ic\.mediaHeart/);
  assert.match(js, /ic\.share/);
  assert.doesNotMatch(storyStyles, /story-heart|story-side-actions/);
  assert.ok(storyInteractions.includes('class="story-more-open" aria-label="Story activity and options" aria-haspopup="dialog" aria-expanded="false">${icon("menu")}'), "Story options use the shared Old Time menu icon");
  assert.ok(explore.includes('aria-label="Why this post and Not interested">${ic.tune}</button>'), "Explore uses the shared contextual action icon");
  assert.ok(blastDrawer.includes('ctx.icon("chevronRight")'), "Blast settings rows use a directional chevron, not an ellipsis");
  assert.match(blastStyles, /\.bvn-settings-chevron \{ display:grid/);
  assert.match(menu, /icons\.tune \|\| icons\.menu/);
  assert.match(icons, /const shortBarMenu = '<path d="M5 6h14M5 12h10M5 18h6"\/>'/);
  assert.match(icons, /tune: shortBarMenu/);
  assert.match(visual, /\.profile-actions-open/);
  assert.match(visual, /min-height:40px/);
  assert.match(visual, /min-height:44px/);
  assert.match(visual, /prefers-reduced-motion:reduce/);
  assert.ok(js.includes('title="${mine ? "Settings" : "Profile actions"}">${ic.menu}</button>'), "Profile actions use the shared menu while keeping the Settings label");
  assert.match(visual, /\.phone > \.nav:not\(\.nav-hidden\)/);
  assert.match(visual, /backdrop-filter:blur\(18px\)/);
  assert.match(visual, /\.chat-header/);
  assert.match(visual, /\.notification-filter/);
  assert.match(visual, /\.xe-cap-more/);
});
