export const OPENFREEMAP_STYLE_URL = "https://tiles.openfreemap.org/styles/bright";
export const OPENFREEMAP_CREDITS =
  '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> · <a href="https://openmaptiles.org/" target="_blank" rel="noopener noreferrer">OpenMapTiles</a> · <a href="https://openfreemap.org/" target="_blank" rel="noopener noreferrer">OpenFreeMap</a>';
export const OPENFREEMAP_VIDEO_CREDIT =
  "OpenFreeMap © OpenMapTiles Data from OpenStreetMap";

const ROUTE_COLORS = { run: "#ed2339", walk: "#16864b", cycle: "#4765d5", hike: "#d96b21" };
export const sportsRouteColor = workout => ROUTE_COLORS[workout?.activityType] || "#ed2339";

const PALETTES = {
  light: {
    background: "#eaf1e8", land: "#eef0df", park: "#a9d99a", forest: "#72b77d",
    water: "#8bd5ee", waterLine: "#43a9d4", built: "#e4e5d8", road: "#fffef4",
    roadEdge: "#c4d1b8", majorRoad: "#fff8dc", label: "#344b3b", boundary: "#9aaf9d",
  },
  dark: {
    background: "#111c1b", land: "#192824", park: "#244d35", forest: "#326b43",
    water: "#163f54", waterLine: "#347f9b", built: "#27352f", road: "#46534a",
    roadEdge: "#15201b", majorRoad: "#68745d", label: "#e1eadb", boundary: "#607a69",
  },
};

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value && typeof value === "object" && !Array.isArray(value);

export function validateSportsVectorStyle(style) {
  if (!isObject(style) || style.version !== 8 || !isObject(style.sources) || !Array.isArray(style.layers)) {
    throw new Error("The map style is not a supported vector style.");
  }
  if (!Object.values(style.sources).some(source => source?.type === "vector" &&
      (typeof source.url === "string" || Array.isArray(source.tiles)))) {
    throw new Error("The map style has no usable vector-tile source.");
  }
  return style;
}

function setPaint(layer, key, value) {
  layer.paint ||= {};
  layer.paint[key] = value;
}

function styleLayer(layer, colors) {
  const id = String(layer.id || "").toLowerCase();
  const sourceLayer = String(layer["source-layer"] || "").toLowerCase();

  if (layer.type === "background") setPaint(layer, "background-color", colors.background);

  if (layer.type === "fill") {
    if (sourceLayer === "water" || id.includes("water")) setPaint(layer, "fill-color", colors.water);
    else if (sourceLayer === "park" || /park|grass|wood|forest/.test(id)) setPaint(layer, "fill-color", colors.park);
    else if (sourceLayer === "building" || id.includes("building")) setPaint(layer, "fill-color", colors.built);
    else if (sourceLayer === "landuse" || sourceLayer === "landcover") setPaint(layer, "fill-color", colors.land);
    if (sourceLayer === "park" || /park|grass|wood|forest/.test(id)) setPaint(layer, "fill-opacity", 0.82);
  }

  if (layer.type === "line" && (sourceLayer === "waterway" || id.includes("waterway"))) {
    setPaint(layer, "line-color", colors.waterLine);
  }
  if (layer.type === "line" && sourceLayer === "transportation") {
    const casing = id.includes("casing");
    const major = /motorway|trunk|primary/.test(id);
    setPaint(layer, "line-color", casing ? colors.roadEdge : major ? colors.majorRoad : colors.road);
    if (!casing) setPaint(layer, "line-opacity", 0.98);
  }
  if (layer.type === "fill" && sourceLayer === "transportation") {
    setPaint(layer, "fill-color", colors.roadEdge);
  }
  if (layer.type === "line" && sourceLayer === "boundary") {
    setPaint(layer, "line-color", colors.boundary);
    setPaint(layer, "line-opacity", 0.68);
  }
  if (layer.type === "symbol") {
    if (sourceLayer === "place" || sourceLayer === "poi" || sourceLayer === "transportation_name" ||
        sourceLayer === "water_name" || sourceLayer === "waterway") {
      setPaint(layer, "text-color", colors.label);
      setPaint(layer, "text-halo-color", colors.background);
      setPaint(layer, "text-halo-width", 1.25);
    }
    if (sourceLayer === "transportation_name") setPaint(layer, "text-color", colors.label);
  }
}

export function customizeSportsVectorStyle(input, theme = "light", { attribution = OPENFREEMAP_CREDITS } = {}) {
  validateSportsVectorStyle(input);
  const style = clone(input), colors = PALETTES[theme] || PALETTES.light;

  // Keep the basemap vector-based at every zoom, including any raster-derived
  // hillshade or image overlay a replacement style might include.
  const rasterSources = new Set(Object.entries(style.sources)
    .filter(([, source]) => ["raster", "raster-dem", "image", "video"].includes(source?.type))
    .map(([id]) => id));
  style.layers = style.layers.filter(layer => layer.type !== "raster" && layer.type !== "hillshade" &&
    !rasterSources.has(layer.source));
  for (const id of rasterSources) delete style.sources[id];

  const vectorSource = Object.values(style.sources).find(source => source?.type === "vector");
  if (vectorSource) vectorSource.attribution = attribution;
  style.layers.forEach(layer => styleLayer(layer, colors));
  return style;
}

export function createSportsMapStyleProvider({
  styleUrl = OPENFREEMAP_STYLE_URL,
  id = styleUrl === OPENFREEMAP_STYLE_URL ? "openfreemap" : "custom-vector",
  videoAttribution = id === "openfreemap" ? OPENFREEMAP_VIDEO_CREDIT : "",
  attribution = id === "openfreemap" ? OPENFREEMAP_CREDITS : videoAttribution || id,
  attributionLinks = id === "openfreemap" ? [
    { label: "OpenFreeMap", href: "https://openfreemap.org/" },
    { label: "OpenMapTiles", href: "https://openmaptiles.org/" },
    { label: "OpenStreetMap copyright", href: "https://www.openstreetmap.org/copyright" },
  ] : [],
  fetchImpl = (...args) => fetch(...args),
  validate = validateSportsVectorStyle,
} = {}) {
  let basePromise;
  return {
    id,
    videoAttribution,
    attributionLinks,
    async load(theme = "light", { signal } = {}) {
      if (!basePromise) {
        basePromise = fetchImpl(styleUrl, { signal, credentials: "omit", cache: "default" })
          .then(async response => {
            if (!response.ok) throw new Error(`Map style request failed (${response.status}).`);
            const style = await response.json();
            validate(style);
            return style;
          })
          .catch(error => { basePromise = null; throw error; });
      }
      const base = await basePromise;
      return customizeSportsVectorStyle(base, theme, { attribution });
    },
  };
}

export const openFreeMapProvider = createSportsMapStyleProvider();
