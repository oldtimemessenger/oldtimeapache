import test from "node:test";
import assert from "node:assert/strict";
import { matchesChatThread, shouldScrollChatToBottom } from "./chat-scroll.js";

test("saved reading position belongs to the same account and conversation", () => {
  const previous = { ownerId: "reader", conversationId: "thread-a" };
  assert.equal(matchesChatThread(previous, "reader", "thread-a"), true);
  assert.equal(matchesChatThread(previous, "reader", "thread-b"), false);
  assert.equal(matchesChatThread(previous, "other-reader", "thread-a"), false);
  assert.equal(matchesChatThread(null, "reader", "thread-a"), false);
  assert.equal(matchesChatThread(previous, null, "thread-a"), false);
});

test("a new thread opens at the latest message", () => {
  assert.equal(shouldScrollChatToBottom(), true);
});

test("rerendering a thread follows new content only when already at the bottom", () => {
  assert.equal(shouldScrollChatToBottom({ sameThreadVisible: true, wasAtBottom: true }), true);
  assert.equal(shouldScrollChatToBottom({ sameThreadVisible: true, wasAtBottom: false }), false);
});

test("returning to a saved thread position does not force the latest message", () => {
  assert.equal(shouldScrollChatToBottom({
    returningToSavedThread: true,
    scrollRestored: true,
  }), false);
});

test("a different thread opens at the latest message even if another scroll position was restored", () => {
  assert.equal(shouldScrollChatToBottom({
    returningToSavedThread: false,
    scrollRestored: true,
  }), true);
});

test("sending a message explicitly follows the latest message", () => {
  assert.equal(shouldScrollChatToBottom({ requested: true, sameThreadVisible: true }), true);
});
