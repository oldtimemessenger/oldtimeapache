import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = path => readFile(new URL(path, import.meta.url), "utf8");

test("Sports loads the premium map experience without replacing its recorder or map engine", async () => {
  const [sports, css, maps, imagery] = await Promise.all([
    read("./sports-mode.js"), read("./sports-world-map-premium.css"),
    read("./sports-maps.js"), read("./sports-imagery.js"),
  ]);
  assert.match(sports, /import "\.\/sports-world-map-premium\.css"/);
  assert.match(css, /\.sp-replay-map-wrap/);
  assert.match(css, /\.sp-replay-map-stats/);
  assert.match(css, /\.sp-privacy-panel/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(maps, /journeyCamera/);
  assert.match(maps, /flyoverRouteProgress/);
  assert.match(imagery, /OpenStreetMap contributors/);
  assert.match(imagery, /USGS/);
});

test("Sports header entry is feature-gated and routes through the existing Sports launcher", async () => {
  const [app, clientGate, serverGate] = await Promise.all([
    read("./app.js"),
    read("../../../lib/sports/feature-state.ts"),
    read("../../api-server/src/lib/sports-feature-state.ts"),
  ]);
  assert.match(app, /SPORTS_MODE_ENABLED \? `<button[^>]*app-sports-shortcut/);
  assert.match(app, /data-sports-launch/);
  assert.match(app, /navigateFromDrawer\("sports"\)/);
  assert.match(app, /"settings", "sports"\]\.includes\(route\)/);
  assert.match(clientGate, /SPORTS_MODE_ENABLED = false/);
  assert.match(serverGate, /SPORTS_MODE_ENABLED = false/);
  assert.match(serverGate, /sportsMutationDisabled/);
});
