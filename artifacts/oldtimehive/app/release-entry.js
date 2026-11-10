import { publicDocumentRoute } from "./legal-documents.js";

// Clear only Oldtime's device-local user data, once, when the fresh Cloudflare
// launch marker is confirmed. Never run this during ordinary app reloads.
const freshStartMarker = "oldtime-cloudflare-reset-v1";
const legacyDatabaseNames = [
  "oldtime-camera-recents",
  "oldtime-creative-drafts",
  "oldtime-created-media",
  "oldtime-blast-video-media-v1",
];

function deleteDatabase(name) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error("Oldtime device data could not be cleared."));
    request.onblocked = () => reject(new Error("Close other Oldtime tabs before clearing old device data."));
  });
}

async function clearOldtimeDeviceData() {
  const databaseNames = typeof globalThis.indexedDB?.databases === "function"
    ? (await indexedDB.databases()).map(database => database.name)
      .filter(name => name && /^oldtime(?:[-.].*)?$/i.test(name))
    : legacyDatabaseNames;
  for (const name of new Set([...databaseNames, ...legacyDatabaseNames])) {
    await deleteDatabase(name);
  }
  for (const storage of [localStorage, sessionStorage]) {
    for (const key of Array.from({ length: storage.length }, (_, index) => storage.key(index)).filter(Boolean)) {
      if (/^oldtime(?:[-.].*)?$/i.test(key)) storage.removeItem(key);
    }
  }
  if (typeof globalThis.caches?.keys === "function") {
    for (const name of await caches.keys()) {
      if (/^oldtime(?:[-.].*)?$/i.test(name)) await caches.delete(name);
    }
  }
}

async function startOldtime() {
  // Public documents must work without authentication, storage or health checks.
  const documentId = publicDocumentRoute(location.pathname, import.meta.env.BASE_URL);
  if (documentId) {
    const { mountLegalPage } = await import("./legal-page.js");
    mountLegalPage(documentId, import.meta.env.BASE_URL);
    return;
  }
  if (localStorage.getItem(freshStartMarker) !== "done") {
    let status = null;
    try {
      const response = await fetch("/api/healthz", { cache: "no-store", credentials: "same-origin" });
      status = response.ok ? await response.json() : null;
    } catch {
      // Keep the app's normal offline/retry screen; never clear data on a failed check.
    }
    if (status?.provider === "cloudflare" && status.freshStart === "oldtime-cloudflare-v1") {
      await clearOldtimeDeviceData();
      localStorage.setItem(freshStartMarker, "done");
    }
  }
  await import("./app.js");
}

startOldtime().catch(error => {
  const label = document.getElementById("oldtime-startup-label");
  const status = document.getElementById("oldtime-startup-status");
  const retry = document.getElementById("oldtime-startup-retry");
  if (label) label.textContent = error.message || "Oldtime could not clear old device data.";
  if (status) status.hidden = false;
  if (retry) retry.hidden = false;
});
