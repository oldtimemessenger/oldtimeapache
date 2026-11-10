import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = name => readFileSync(new URL(name, import.meta.url), "utf8");
const chat = read("chat.js");
const contactDetails = chat.slice(chat.indexOf("function contactInfo"), chat.indexOf("function sharedPreview"));
const groupDetails = chat.slice(chat.indexOf("function info"), chat.indexOf("function contactInfo"));
const contactActions = chat.slice(chat.indexOf("async function toggleContactFollow"), chat.indexOf("function groupOptions"));
const sharedMedia = chat.slice(chat.indexOf("function media(ctx"), chat.indexOf("function group(ctx"));

test("chat details no longer expose wallpaper customization controls", () => {
  assert.doesNotMatch(`${contactDetails}\n${groupDetails}`, /Customize chat|Change conversation wallpaper|id="(?:details-wall|wall)"/i);
  assert.doesNotMatch(contactActions, /Wallpaper/i);
});

test("cloud chat follow uses authenticated relationships and local follow checks missing profiles", () => {
  const followStart = contactActions.indexOf("async function toggleContactFollow");
  const followEnd = contactActions.indexOf("async function blockContact");
  const follow = contactActions.slice(followStart, followEnd);
  assert.ok(followStart >= 0 && followEnd > followStart);
  assert.match(follow, /api\.refreshCloudRelationships\(\)/);
  assert.match(follow, /api\.setCloudFollow\(other\.id,/);
  assert.match(follow, /if \(!currentProfile \|\| !targetProfile\)/);
  assert.match(chat, /id="empty-chat-follow"/);
  assert.match(chat, /emptyChatFollowLabel/);
  assert.doesNotMatch(contactDetails, /id="contact-follow"|toggleContactFollow\(ctx, other, me\)/);
});

test("contact details match the profile shortcut row and keep all existing chat actions", () => {
  for (const action of [
    'ctx.$("#mute-shortcut").onclick',
    'ctx.$("#media").onclick',
    'ctx.$("#details-dis").onclick',
    'ctx.$("#details-hide").onclick',
    'ctx.$("#block").onclick',
    'ctx.$("#report").onclick',
  ]) assert.ok(contactDetails.includes(action), action);
  assert.match(contactDetails, /bindShared\(ctx\)/);
  assert.match(contactDetails, /syncCloudChatState\(id, ctx\)/);
  assert.match(contactActions, /api\.replaceCloudBlocks/);
  assert.match(contactActions, /api\.submitCloudReport/);
  assert.match(contactDetails, /id="contact-create-group-shortcut"/);
  assert.match(contactDetails, /id="contact-profile-shortcut"/);
  assert.match(contactDetails, /id="contact-search-shortcut"/);
  assert.match(contactDetails, /pick\(ctx, true, \{ initialId: other\.id \}\)/);
  assert.doesNotMatch(contactDetails, /id="contact-follow"/);
  assert.doesNotMatch(chat, /id="(?:more|group-options|group-options-short|group-search)"/);
  assert.doesNotMatch(chat, /ctx\.\$\("#(?:more|group-options|group-options-short|group-search)"\)/);
  assert.match(chat, /ctx\.\$\("#info"\)\.onclick = \(\) => \{ ui\.screen = "info"/);
});

test("message screens omit relationship totals and do not load profile stats", () => {
  assert.doesNotMatch(chat, /relationshipTotal|ensureChatRelationshipStats|chat-empty-stats|contact-stats/);
  assert.doesNotMatch(chat, /refreshCloudProfileStats/);
  assert.match(chat, /followers10k/);
});

test("shared media has a native Oldtime empty state and returns to chat details", () => {
  assert.match(sharedMedia, /aria-label="Back to chat details"/);
  assert.match(sharedMedia, />Shared media<\/b>/);
  assert.match(sharedMedia, /data-testid="chat-shared-media-empty"/);
  assert.match(sharedMedia, /class="chat-shared-media-icon"[^>]*>\$\{ic\.image\}/);
  assert.match(sharedMedia, /Photos, videos, files, and voice messages shared in this conversation will appear here/);
  assert.match(sharedMedia, /ui\.screen = "info"; ctx\.render\(\)/);
  const css = read("chat-reference-refinement.css");
  assert.match(css, /#app \.chat-shared-media-empty\s*\{[^}]*justify-content:center/);
  assert.match(css, /#app \.chat-shared-media-icon \.navic\s*\{[^}]*width:32px/);
});

test("Messages keeps the Stories/Notes strip and Oldtime card details", () => {
  assert.match(chat, /renderConsole\(consoleCards/);
  assert.match(chat, /<div class="chat-list-body">\s*\$\{renderConsole\(consoleCards/);
  const css = read("chat-reference-refinement.css");
  assert.match(css, /#app \.chat-list-screen > \.scroll\.page\s*\{[^}]*background:var\(--bg,#fff\)/);
  assert.match(css, /#app \.chat-list-screen \.chat-inbox-row\s*\{[^}]*border-radius:19px[^}]*box-shadow:0 5px 18px/);
});
