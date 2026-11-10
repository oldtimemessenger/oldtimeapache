import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { __openMicTest } from "../src/cloudflare/open-mic.js";

test("Open Mic keeps peer-to-peer rooms deliberately small", () => {
  assert.equal(__openMicTest.MAX_PEERS, 8);
  assert.equal(__openMicTest.PRESENCE_MS, 90_000);
  assert.equal(__openMicTest.ROOM_TTL_MS, 6 * 60 * 60 * 1000);
});

test("Open Mic schema constrains visibility, room state, roles, and ownership", async () => {
  const migration = await readFile(new URL("../migrations/0040_open_mic_rooms.sql", import.meta.url), "utf8");
  assert.ok(migration.includes("visibility IN ('public','unlisted')"));
  assert.ok(migration.includes("status IN ('live','ended')"));
  assert.ok(migration.includes("role IN ('host','listener')"));
  assert.ok(migration.includes("REFERENCES users(id) ON DELETE CASCADE"));
  assert.ok(migration.includes("REFERENCES open_mic_rooms(id) ON DELETE CASCADE"));
  assert.ok(migration.includes("PRIMARY KEY (room_id, user_id)"));
});
