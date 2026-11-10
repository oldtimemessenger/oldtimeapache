export function matchesChatThread(previousThread, ownerId, conversationId) {
  return Boolean(previousThread && ownerId && conversationId &&
    previousThread.ownerId === ownerId && previousThread.conversationId === conversationId);
}

export function shouldScrollChatToBottom({
  requested = false,
  sameThreadVisible = false,
  returningToSavedThread = false,
  wasAtBottom = false,
  scrollRestored = false,
} = {}) {
  if (requested) return true;
  if (sameThreadVisible) return wasAtBottom;
  if (returningToSavedThread && scrollRestored) return false;
  return true;
}
