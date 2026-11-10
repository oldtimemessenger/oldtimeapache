// Receive-only account updates: messages and notifications stay on the API.
import { api, requestCloudApi } from "../store.js";
import { cloudApiUrl } from "../api-origin.js";
import { createCloudflareTransport } from "./cloudflare-transport.js";

const chatListeners = new Set();
const notificationListeners = new Set();
const callListeners = new Set();
const openMicListeners = new Set();
let transport = null;
let transportToken = "";

function notifyChatListeners(update) {
  for (const listener of chatListeners) {
    try { Promise.resolve(listener(update)).catch(() => {}); } catch {}
  }
}

function notifyNotificationListeners() {
  for (const listener of notificationListeners) {
    try { Promise.resolve(listener()).catch(() => {}); } catch {}
  }
}

function notifyCallListeners(signal) {
  for (const listener of callListeners) {
    try { Promise.resolve(listener(signal)).catch(() => {}); } catch {}
  }
}
function notifyOpenMicListeners(signal) {
  for (const listener of openMicListeners) { try { Promise.resolve(listener(signal)).catch(() => {}); } catch {} }
}

function refreshLiveViews() {
  notifyChatListeners({ conversationId: null });
  notifyNotificationListeners();
}

function ensureConnected() {
  const token = api.cloudAccessToken();
  if (!token) {
    transport?.disconnect();
    transport = null;
    transportToken = "";
    return null;
  }
  if (transport && transportToken === token) return transport;

  transport?.disconnect();
  const currentToken = token;
  const current = createCloudflareTransport({
    url: cloudApiUrl("/api/realtime"),
    requestTicket: () => requestCloudApi("/api/realtime/ticket", { method: "POST", body: {} }),
    isCurrent: () => api.cloudAccessToken() === currentToken,
  });
  transport = current;
  transportToken = currentToken;
  current.on("chat:changed", notifyChatListeners)
    .on("notifications:changed", notifyNotificationListeners)
    .on("call:signal", notifyCallListeners)
    .on("open-mic:signal", notifyOpenMicListeners)
    .on("connect", refreshLiveViews);
  return current;
}

export function subscribeChatUpdates(fn) {
  chatListeners.add(fn);
  ensureConnected();
  return () => chatListeners.delete(fn);
}

export function subscribeNotificationUpdates(fn) {
  notificationListeners.add(fn);
  ensureConnected();
  return () => notificationListeners.delete(fn);
}

export function subscribe(fn) {
  callListeners.add(fn);
  ensureConnected();
  return () => callListeners.delete(fn);
}

export function subscribeOpenMic(fn) {
  openMicListeners.add(fn); ensureConnected(); return () => openMicListeners.delete(fn);
}
export function publishOpenMic(signal) {
  return ensureConnected()?.sendOpenMicSignal(signal) || false;
}

export function publish(type, callId, to, payload = {}, conversationId = "") {
  const active = ensureConnected();
  if (!active?.connected || typeof conversationId !== "string" || !conversationId) return false;
  return active.sendCallSignal({
    type, callId, to, conversationId, payload,
  });
}

export function waitForCallSignaling(timeoutMs = 10000) {
  const active = ensureConnected();
  if (!active) return Promise.reject(new Error("Sign in to start a call."));
  if (active.connected) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => {
      clearTimeout(timer);
      active.off("connect", onConnect).off("connect_error", onError);
    };
    const finish = callback => {
      if (settled) return;
      settled = true;
      cleanup();
      callback();
    };
    const onConnect = () => finish(resolve);
    const onError = error => {
      if ([401, 403].includes(Number(error?.status))) {
        finish(() => reject(new Error("Your session expired. Sign in again.")));
      }
    };
    const timer = setTimeout(() => {
      finish(() => reject(new Error("The call connection is unavailable. Try again.")));
    }, timeoutMs);
    active.on("connect", onConnect).on("connect_error", onError);
    if (active.connected) onConnect();
  });
}

export function setCallTransportActive(active) {
  ensureConnected()?.setKeepAliveForCall(!!active);
}

export function reportCallTransport() { return false; }

export function maintainSignalConnection({ refresh = false } = {}) {
  const active = ensureConnected();
  if (refresh && active?.connected) refreshLiveViews();
}

if (typeof window !== "undefined") {
  window.addEventListener("oldtime-cloud-session-changed", () => maintainSignalConnection());
  window.addEventListener("online", () => maintainSignalConnection({ refresh: true }));
}
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) maintainSignalConnection({ refresh: true });
  });
}
