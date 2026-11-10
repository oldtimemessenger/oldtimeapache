import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { renderShareSheet } from "./saved-sheets.js";

const read = file => readFile(new URL(file, import.meta.url), "utf8");
const [appSource, placesSource, placeStyles, chatSource, chatStyles] = await Promise.all([
  read("./app.js"),
  read("./places-view.js"),
  read("./place-profile.css"),
  read("./chat.js"),
  read("./chat-conversation-refinement.css"),
]);

test("profile Reposts has no extra avatar rail and does not mislabel reposts with the owner", () => {
  assert.doesNotMatch(appSource, /profile-repost-faces|profile-repost-face/);
  assert.match(appSource, /profileMode === "reposts" \? null : u/);
  assert.match(appSource, /postAuthorSource\.avatar/);
});

test("share sheet resolves the post preview and contact photos from private media", () => {
  const markup = renderShareSheet({
    view: "messages",
    post: {
      id: "shared-post",
      author: "post-owner",
      caption: "A day out",
      media: ["oldtime-media:post-cover"],
    },
    author: { name: "Krysti" },
    friends: [{
      id: "friend-id",
      name: "Pretty Jess",
      username: "prettyjess",
      avatar: "oldtime-media:friend-portrait",
    }],
    canCopy: true,
  });

  assert.match(markup, /Pretty Jess/);
  assert.match(markup, /data-local-media="oldtime-media:friend-portrait"/);
  assert.match(markup, /data-local-media-owner="friend-id"/);
  assert.match(markup, /data-local-media-owner="post-owner"/);
  assert.match(markup, /A day out/);
  assert.equal((markup.match(/Krysti/g) || []).length, 1, "the creator appears once in the compact post preview");
});

test("Place comment prompts stay on one compact line", () => {
  assert.match(placesSource, /Be the first to comment/);
  assert.match(placeStyles, /\.place-feed-comment\s*\{[^}]*white-space:nowrap/);
  assert.match(placeStyles, /\.place-feed-comment\s*\{[^}]*text-overflow:ellipsis/);
});

test("chat messages expose the reference reaction and labeled hold-options panel", () => {
  const activationStart = chatSource.indexOf("function onMessage(ctx, cid, id)");
  const activationEnd = chatSource.indexOf("function onMessageMore(ctx, cid, id)", activationStart);
  const activation = chatSource.slice(activationStart, activationEnd);
  assert.match(activation, /openMessageQuickActions\(ctx, cid, id\)/);
  assert.match(chatSource, /data-chat-quick-reaction/);
  assert.match(chatSource, /data-context-action="reply"/);
  assert.match(chatSource, /data-context-action="save"/);
  assert.match(chatSource, /data-context-action="forward"/);
  assert.match(chatSource, /data-context-action="delete"/);
  assert.match(chatSource, /data-context-action="more"/);
  assert.match(chatSource, /Math\.abs\(dx\) >= 58/);
  assert.match(chatSource, /openMessageQuickActions\(ctx, id, b\.dataset\.msg\)/);
  assert.match(chatStyles, /touch-action:pan-y/);
});
