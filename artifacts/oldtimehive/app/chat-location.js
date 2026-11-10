const MAX_LATITUDE = 90;
const MAX_LONGITUDE = 180;
export const LOCATION_REQUEST_BODY = "oldtime-location-request:v1";

export function isLocationRequest(value) {
  return String(value || "").trim() === LOCATION_REQUEST_BODY;
}

function cleanCoordinate(value, maximum) {
  if (!Number.isFinite(value) || value < -maximum || value > maximum) {
    throw new TypeError("Location coordinates are invalid.");
  }
  const rounded = Math.round(value * 100_000) / 100_000;
  return Object.is(rounded, -0) ? 0 : rounded;
}

export function encodeSharedCoordinates(latitude, longitude) {
  const lat = cleanCoordinate(latitude, MAX_LATITUDE);
  const lon = cleanCoordinate(longitude, MAX_LONGITUDE);
  return `${lat},${lon}`;
}

export function parseSharedCoordinates(value) {
  const match = /^(-?(?:\d{1,2}(?:\.\d{1,5})?|90(?:\.0{1,5})?)),(-?(?:\d{1,3}(?:\.\d{1,5})?|180(?:\.0{1,5})?))$/.exec(String(value || "").trim());
  if (!match) return null;
  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
      Math.abs(latitude) > MAX_LATITUDE || Math.abs(longitude) > MAX_LONGITUDE) return null;
  return {
    latitude,
    longitude,
  };
}

let mapRuntimePromise;
const mapRoots = new Map();

async function locationMapRuntime() {
  if (!mapRuntimePromise) {
    mapRuntimePromise = Promise.all([
      import("maplibre-gl"),
      import("maplibre-gl/dist/maplibre-gl.css"),
      import("maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url"),
      import("./sports-vector-style.js"),
    ]).then(([module, , worker, { openFreeMapProvider }]) => {
      const maplibre = module.default || module;
      if (worker?.default && maplibre.setWorkerUrl) maplibre.setWorkerUrl(worker.default);
      return Promise.all([maplibre, openFreeMapProvider.load("dark")]);
    }).catch(error => {
      mapRuntimePromise = null;
      throw error;
    });
  }
  return mapRuntimePromise;
}

export async function mountChatLocationMap(host, { interactive = false } = {}) {
  const point = parseSharedCoordinates(`${host?.dataset?.latitude},${host?.dataset?.longitude}`);
  if (!host || !point) throw new TypeError("Location map coordinates are invalid.");
  const [maplibre, style] = await locationMapRuntime();
  if (!host.isConnected) return () => {};
  host.replaceChildren();
  host.removeAttribute("data-map-error");
  const map = new maplibre.Map({
    container: host,
    style,
    center: [point.longitude, point.latitude],
    zoom: 15,
    minZoom: interactive ? 2 : 15,
    maxZoom: interactive ? 19 : 15,
    interactive,
    attributionControl: false,
    dragRotate: false,
    pitchWithRotate: false,
    fadeDuration: 0,
  });
  if (interactive && maplibre.NavigationControl) {
    map.addControl(new maplibre.NavigationControl({ showCompass: false }), "top-right");
  }
  let settled = false;
  let destroyed = false;
  let timeout;
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    clearTimeout(timeout);
    map.remove();
  };
  return new Promise((resolve, reject) => {
    const fail = () => {
      if (settled) return;
      settled = true;
      destroy();
      if (host.isConnected) host.dataset.mapError = "true";
      reject(new Error("The map preview could not be loaded."));
    };
    timeout = setTimeout(fail, 10_000);
    map.once("load", () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (!host.isConnected) {
        destroy();
        resolve(() => {});
        return;
      }
      const marker = document.createElement("span");
      marker.className = "chat-location-map-pin";
      marker.setAttribute("aria-hidden", "true");
      new maplibre.Marker({ element: marker, anchor: "center" })
        .setLngLat([point.longitude, point.latitude])
        .addTo(map);
      host.dataset.mapReady = "true";
      requestAnimationFrame(() => { if (!destroyed) map.resize(); });
      resolve(destroy);
    });
    map.on("error", event => {
      if (!settled && event?.error) fail();
    });
  });
}

export function mountChatLocationMaps(root) {
  if (!root) return;
  for (const [oldRoot, state] of mapRoots) {
    if (oldRoot.isConnected) continue;
    state.observer?.disconnect();
    state.lifecycleObserver?.disconnect();
    state.maps.forEach(destroy => destroy());
    mapRoots.delete(oldRoot);
  }
  let state = mapRoots.get(root);
  if (!state) {
    state = { observer: null, maps: new Map(), pending: new Set() };
    if ("IntersectionObserver" in globalThis) {
      state.observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          state.observer.unobserve(entry.target);
          load(entry.target);
        }
      }, { root: root.matches?.("#msgs") ? root : null, rootMargin: "180px 0px" });
    }
    if ("MutationObserver" in globalThis && document.body) {
      state.lifecycleObserver = new MutationObserver(() => {
        if (!root.isConnected) {
          state.observer?.disconnect();
          state.lifecycleObserver?.disconnect();
          state.maps.forEach(destroy => destroy());
          mapRoots.delete(root);
          return;
        }
        for (const [host, destroy] of state.maps) {
          if (host.isConnected) continue;
          destroy();
          state.maps.delete(host);
        }
      });
      state.lifecycleObserver.observe(document.body, { childList: true, subtree: true });
    }
    mapRoots.set(root, state);
  }
  for (const [host, destroy] of state.maps) {
    if (host.isConnected) continue;
    destroy();
    state.maps.delete(host);
  }
  for (const host of root.querySelectorAll("[data-chat-location-map]")) {
    if (state.maps.has(host) || state.pending.has(host) || host.dataset.mapError) continue;
    if (state.observer) state.observer.observe(host);
    else load(host);
  }

  function load(host) {
    if (!host.isConnected || state.pending.has(host) || state.maps.has(host)) return;
    state.pending.add(host);
    void mountChatLocationMap(host, {
      interactive: host.hasAttribute("data-chat-location-map-interactive"),
    }).then(destroy => {
      state.pending.delete(host);
      if (!host.isConnected || mapRoots.get(root) !== state) destroy();
      else state.maps.set(host, destroy);
    }).catch(() => {
      state.pending.delete(host);
      if (host.isConnected) {
        host.dataset.mapError = "true";
        host.textContent = "Map preview unavailable";
      }
    });
  }
}
