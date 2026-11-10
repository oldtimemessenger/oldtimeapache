import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = name => readFileSync(new URL(name, import.meta.url), "utf8");
const chat = read("chat.js");
const styles = read("styles.css");
const icons = read("icons.js");
const inboxStyles = read("chat-reference-refinement.css");
const inbox = chat.slice(chat.indexOf('<section class="screen on light chat-list-screen"'), chat.indexOf('let listFilter = "all"'));
const header = inbox.slice(inbox.indexOf('<div class="chat-list-topline">'), inbox.indexOf('<div class="chat-list-body">'));

test("inbox settings gear replaces the three-dot header control", () => {
  assert.match(header, /id="chat-more"[^>]*aria-label="Chat Settings"[^>]*>\$\{ic\.gear\}/);
  assert.doesNotMatch(header, /chat-search-trigger|toggle-chat-search/);
  assert.doesNotMatch(inbox, /chat-filter-control|chat-filter-label|>All</);
  assert.match(inbox, /data-more-filter="all"[^>]*>.*Every chat/);
  assert.doesNotMatch(inbox, /chat-search-wrap|chat-search-panel|Search messages/);
});

test("Messages header has no divider underneath it", () => {
  const heading = inboxStyles.match(/#app \.chat-list-screen \.chat-list-heading\s*\{([^}]*)\}/)?.[1] || "";
  assert.match(heading, /border-bottom:0!important/);
});

test("chat keeps its light surface and header while glass blue stays on messages", () => {
  const unboxed = read("unboxed-interface.css");
  const refinement = read("chat-conversation-refinement.css");
  const chatLocation = read("chat-location.js");
  const threadPalette = unboxed.slice(
    unboxed.indexOf("/* Chat thread palette:"),
    unboxed.indexOf("/* The saved state on media rails"),
  );
  const messageOnlyPalette = threadPalette.slice(threadPalette.indexOf("/* Keep the original light conversation layout"));
  assert.match(messageOnlyPalette, /#app \.conversation-screen\s*\{[^}]*background:#fff!important/);
  assert.match(messageOnlyPalette, /#app \.conversation-screen \.chat-header\s*\{[^}]*background:#fff!important/);
  assert.match(messageOnlyPalette, /#app \.conversation-screen \.chat-identity-copy b \{ color:#17191c!important; \}/);
  assert.match(threadPalette, /\.bubble-msg\.mine\s*\{[^}]*background:var\(--thread-blue-glass\)!important[^}]*color:#fff!important/);
  assert.match(messageOnlyPalette, /\.bubble-msg\.theirs:not\(\.media-card-message\):not\(\.location-request-message\)\s*\{[^}]*background:#f6f4ef!important[^}]*color:#17191c!important/);
  assert.match(messageOnlyPalette, /\.chat-composer #chat-add\s*\{\s*color:#1456d9!important;\s*background:#f0f4fc!important/);
  assert.match(messageOnlyPalette, /\.chat-composer button\[type=submit\]\s*\{\s*color:#fff!important;\s*background:var\(--color-burgundy\)!important/);
  assert.match(messageOnlyPalette, /\.chat-message-context-options\s*\{[^}]*background:rgba\(255,255,255,\.94\)!important/);
  assert.match(messageOnlyPalette, /\.chat-message-context-options\s*\{\s*width:min\(270px,100%\)!important/);
  assert.match(threadPalette, /\.chat-composer #chat-add,[\s\S]*border-radius:50%!important/);
  assert.match(styles, /\.conversation-screen \.message-row \{[^}]*width:fit-content/);
  assert.match(styles, /\.chat-compose-start\s*\{[^}]*background:#111/);
  assert.match(styles, /--color-primary:\s*#1456d9/i);
  assert.match(threadPalette, /linear-gradient\(145deg,rgba\(47,122,255,\.92\),rgba\(20,86,217,\.72\)\)/);
  assert.match(threadPalette, /\.bubble-msg\.mine\s*\{[^}]*backdrop-filter:blur\(16px\) saturate\(145%\)/);
  assert.match(threadPalette, /\.chat-back,\s*#app \.conversation-screen \.chat-action\s*\{[^}]*background:transparent!important/);
  assert.match(threadPalette, /\.bubble-msg\.media-card-message\s*\{[^}]*background:transparent!important/);
  assert.match(threadPalette, /\.bubble-msg\.location-request-message\s*\{[^}]*background:transparent!important/);
  assert.match(threadPalette, /\.bubble-msg\.media-card-message \.chat-location-map-canvas\s*\{[^}]*height:78px!important/);
  assert.match(threadPalette, /\.message-row\.media-message-row\s*\{[^}]*grid-template-columns:36px minmax\(0,1fr\)!important/);
  assert.match(chat, /mediaCard \? " media-card-message"/);
  assert.match(chat, /locationRequest \? " location-request-message"/);
  assert.doesNotMatch(chat, /class="chat-message-share"|data-forward-message/);
  assert.match(chat, /data-context-action="forward"/);
  assert.match(chat, /data-context-action="reply"/);
  assert.match(chat, /data-context-action="more"/);
  assert.match(chat, /class="chat-location-place-icon"/);
  assert.match(chat, /return `<div \$\{messageRow\}>\$\{avatar\}<div class="media-message-content">\$\{bubbleMarkup\}\$\{metadata\}<\/div><\/div>`;/);
  assert.match(chatLocation, /openFreeMapProvider\.load\("dark"\)/);
  assert.match(refinement, /\.bubble-msg\s*\{[^}]*border-radius:19px/);
  assert.match(refinement, /\.chat-header\s*\{[^}]*box-shadow:none/);
  assert.match(refinement, /\.composer\s*\{[^}]*box-shadow:none/);
});

test("inbox keeps folders in consolidated Chat Settings", () => {
  assert.doesNotMatch(header, /chat-search-trigger|toggle-chat-search/);
  assert.match(chat, /moreButton\.onclick = \(\) => showInboxSettings\(ctx\)/);
  assert.match(read("chat-settings.js"), /Allow direct messages from/);
  assert.match(read("chat-settings.js"), /Allow group chat invites from/);
  assert.match(read("chat-settings.js"), /Folders/);
  assert.doesNotMatch(header, /id="saved"|id="chat-filter-open"/);
  // New message/group creation stays in the header; Messages has no extra inline Search field.
  assert.match(header, /id="newchat"/);
  assert.equal((header.match(/<button type="button" class="chat-(?:search-trigger|head-icon)"/g) || []).length, 2);
  assert.doesNotMatch(inbox, /chat-inbox-tabs|chat-inbox-tab/);
  assert.match(inbox, /\["primary","Primary"\]/);
  assert.match(inbox, /\["requests","Requests"\]/);
  assert.match(inbox, /\["general","General"\]/);
  assert.match(inbox, /id="more-saved"/);
  assert.match(inbox, /<h2>Filters<\/h2>/);
  assert.match(inbox, /id="more-folders" aria-expanded="true"/);
  assert.match(inbox, /id="chat-folder-options">/);
  assert.match(icons, /sendUp: '<path d="M12 19V5m-7 7 7-7 7 7"/);
});

test("new-chat picker keeps Oldtime styling and the reference contact layout", () => {
  const refinement = read("chat-reference-refinement.css");
  assert.match(chat, /class="chat-compose-header"[\s\S]*?id="chat-compose-cancel"[\s\S]*?New chat/);
  assert.match(chat, /id="chat-contact-search" type="text" inputmode="search"[^>]*placeholder="Search"/);
  assert.match(chat, /class="chat-compose-create-group" id="chat-compose-create-group"/);
  assert.match(chat, /class="chat-compose-group-icon"/);
  assert.match(chat, /class="chat-compose-avatar"/);
  assert.match(chat, /ctx\.\$\("#chat-compose-cancel"\)\.onclick = \(\) => sheet\.classList\.remove\("on"\)/);
  assert.match(chat, /ctx\.\$\("#chat-compose-create-group"\)/);
  assert.match(refinement, /#sheet \.chat-compose-panel\s*\{[^}]*border-radius:24px 24px 0 0/);
  assert.match(refinement, /#sheet \.chat-compose-person\s*\{[^}]*min-height:82px/);
  assert.match(refinement, /#sheet \.chat-compose-avatar\s*\{[^}]*width:64px/);
});

test("Messages inbox has no extra inline Search field", () => {
  assert.doesNotMatch(chat, /chat-search-wrap|chat-search-panel|Search messages|id="cq"/);
  assert.match(chat, /id="chat-contact-search" type="text" inputmode="search"[^>]*placeholder="Search"/,
    "New chat keeps its separate contact picker search");
});

test("chat refresh failures only notify on the active signed-in message screen", () => {
  const refresh = chat.slice(chat.indexOf("function refreshActiveChat"), chat.indexOf("subscribeChatUpdates(refreshActiveChat)"));
  assert.match(refresh, /view\.owner !== api\.cloudAccountId\(\)/);
  assert.match(refresh, /activeChatView === view/);
  assert.match(refresh, /current\.owner === api\.cloudAccountId\(\)/);
  assert.match(refresh, /Messages could not refresh\. Check your connection and reopen the chat\./);
  assert.doesNotMatch(refresh, /error\??\.message/);
});

test("selected inbox filters and Saved card use flat colors without glow", () => {
  const unboxed = read("unboxed-interface.css");
  assert.match(unboxed, /chat-option\[aria-checked=true\],\.chat-folder-options button\.active\)[\s\S]*background:#e8f1ff!important/);
  assert.match(unboxed, /chat-option\[aria-checked=true\] \.chat-option-radio::after[\s\S]*background:#fff/);
  assert.match(unboxed, /#app \.chat-option\[aria-checked=true\]:focus-visible \{[^}]*outline:0/);
  assert.doesNotMatch(unboxed, /chat-option\[aria-checked=true\][^{]*\{[^}]*box-shadow:[^;]*rgba/);
  assert.match(styles, /\.chat-option\[aria-checked="true"\] \{[^}]*background:#e8f1ff/);
  assert.match(styles, /\.chat-option-radio \{ width:26px; height:26px/);
  assert.match(styles, /\.chat-organize-card \{[^}]*background:#fff[^}]*box-shadow:none/);
  assert.match(styles, /\.chat-organize-icon \{[^}]*background:#fff[^}]*box-shadow:none/);
  assert.match(styles, /\.chat-organize-card #more-saved \{[^}]*box-shadow:none/);
  assert.doesNotMatch(styles, /\.chat-organize-card \{[^}]*linear-gradient/);
});

test("empty inbox offers a working, compact New chat action", () => {
  assert.match(chat, /Say hi to someone/);
  assert.match(chat, /id="empty-newchat"[^>]*><span>New message<\/span>/);
  assert.match(chat, /emptyNewChat\.onclick = \(\) => pick\(ctx, false\)/);
  assert.match(icons, /messagePlus: '<path d=/);
});

test("Discovery search keeps a borderless rounded search capsule", () => {
  const unboxed = read("unboxed-interface.css");
  assert.doesNotMatch(unboxed, /\.chat-search-wrap|\.chatsearch/);
  assert.match(unboxed, /#app \.discovery-search-wrap\s*\{[^}]*border-radius:999px!important[^}]*background:#f1f2f4!important/);
  assert.match(unboxed, /#app \.discovery-search\s*\{[^}]*background:transparent!important/);
});

test("empty chats show the profile introduction and a working waving-hand sticker", () => {
  const refinement = read("chat-conversation-refinement.css");
  const store = read("store.js");
  assert.match(chat, /class="chat-empty-intro \$\{c\.group \? "is-group" : "is-contact"\}"/);
  assert.match(chat, /class="chat-empty-profile"/);
  assert.match(chat, /class="chat-empty-avatar"/);
  assert.match(chat, /class="chat-empty-date"/);
  assert.match(store, /createdAt:Number\(room\.createdAt\) \|\| 0/);
  assert.match(chat, /Say hi by sending a sticker/);
  assert.match(chat, /id="send-hi-sticker" class="chat-hello-sticker" aria-label="Send waving hand sticker"/);
  assert.match(chat, /pushMsg\(id, \{ kind: "sticker", body: "👋" \}, ownerId\)/);
  assert.match(chat, /id="empty-chat-follow"/);
  assert.match(refinement, /#app \.conversation-screen \.chat-empty-intro\s*\{[^}]*padding:clamp\(28px,6vh,56px\)/);
  assert.match(refinement, /#app \.conversation-screen \.chat-empty-date\s*\{[^}]*margin:auto 0 0/);
  assert.match(refinement, /#app \.conversation-screen \.chat-hello-sticker\s*\{[^}]*border-radius:50%[^}]*box-shadow:none/);
  assert.match(chat, /<textarea id="msg" rows="1"/);
  assert.match(chat, /e\.currentTarget\.form\?\.requestSubmit\(\)/);
  assert.match(styles, /\.chat-composer textarea \{[^}]*max-height:112px/);
  assert.match(styles, /\.conversation-screen \.message-body \{[^}]*white-space:pre-wrap/);
  assert.match(styles, /\.conversation-screen \.composer \{[^}]*position:relative[^}]*bottom:auto[^}]*flex:0 0 auto/);
  assert.match(styles, /\.conversation-messages \{[^}]*min-height:0[^}]*padding:10px 12px 12px/);
  assert.match(styles, /\.chat-option-icon \{[^}]*border-radius:0[^}]*background:transparent/);
});

test("thread keeps its header actions and details page shortcuts", () => {
  const detailsStyles = read("chat-reference-refinement.css");
  assert.match(chat, /id="chat-more" class="chat-action" aria-label="More chat actions"/);
  assert.match(chat, /ctx\.\$\("#chat-more"\)\.onclick = \(\) => c\.group \? groupOptions\(ctx, id\) : contactOptions\(ctx, id, other, me\)/);
  assert.match(chat, /id="contact-profile-shortcut"/);
  assert.match(chat, /id="contact-search-shortcut"/);
  assert.match(chat, /ctx\.\$\("#contact-profile-shortcut"\)\.onclick = \(\) => ctx\.openProfile\?\.\(other\.id\)/);
  assert.match(chat, /ctx\.\$\("#contact-search-shortcut"\)\.onclick = \(\) => \{ ui\.screen = "search"; ctx\.render\(\); \}/);
  assert.match(chat, /id="location-share"/);
  assert.match(chat, /id="location-request"/);
  assert.match(chat, /id="details-dis"/);
  assert.match(chat, /id="details-hide"/);
  assert.match(chat, /id="block"/);
  assert.match(chat, /id="report"/);
  assert.match(detailsStyles, /#app \.chat-details-screen \.contact-shortcuts\s*\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
});

test("text message bubbles size to their content and keep sender and receiver alignment", () => {
  assert.match(styles, /\.conversation-screen \.bubble-msg \{[^}]*height:auto[^}]*min-height:0[^}]*flex:0 0 auto/);
  assert.match(styles, /\.conversation-screen \.bubble-msg\.mine \{[^}]*align-self:flex-end/);
  assert.match(styles, /\.conversation-screen \.bubble-msg\.theirs \{[^}]*align-self:flex-start/);
  assert.match(styles, /\.conversation-screen \.message-row \{[^}]*background:transparent/);
  assert.match(chat, /<div class="message-body">\$\{body\(m, c\.legacyArchive, mine\)\}<\/div>/);
  assert.match(chat, /const bubbleMarkup = `<div class="bubble-msg/);
  assert.match(chat, /return `<div \$\{messageRow\}>\$\{bubbleMarkup\}\$\{metadata\}<\/div>`;/);
  assert.match(chat, /messageDayLabel\(m\.created\)/);
  assert.match(chat, /const time = cluster\.endsCluster \? `<span class="message-time">/);
  assert.match(chat, /const metadata = flags \|\| footer \?/);
  assert.match(chat, /messageDetails = \[messageDateTime\(m\.created\), m\.edited \? "Edited" : ""\]/);
  assert.match(chat, /return `<div \$\{messageRow\}>\$\{avatar\}<div class="media-message-content">\$\{bubbleMarkup\}\$\{metadata\}<\/div><\/div>`;/);
  assert.match(chat, /String\(m\.body \|\| ""\)\.replace\(\/\\r\\n\?\/g, "\\n"\)\.trim\(\)/);
});
