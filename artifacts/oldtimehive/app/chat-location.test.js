import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { encodeSharedCoordinates, isLocationRequest, LOCATION_REQUEST_BODY, parseSharedCoordinates } from "./chat-location.js";

const read = name => readFileSync(new URL(name, import.meta.url), "utf8");

test("one-time shared coordinates are bounded, rounded and normalized", () => {
  assert.equal(encodeSharedCoordinates(37.4219999, -122.0840575), "37.422,-122.08406");
  assert.equal(encodeSharedCoordinates(-0.000001, 0), "0,0");
  assert.throws(() => encodeSharedCoordinates(90.01, 0), /coordinates are invalid/i);
  assert.throws(() => encodeSharedCoordinates(0, Number.NaN), /coordinates are invalid/i);
});

test("shared coordinates render as validated in-app map points", () => {
  assert.deepEqual(parseSharedCoordinates("37.422,-122.08406"), {
    latitude: 37.422,
    longitude: -122.08406,
  });
  for (const invalid of ["", "Home", "91,0", "0,181", "0,0<script>", "1.123456,2"]) {
    assert.equal(parseSharedCoordinates(invalid), null, invalid);
  }
});

test("location requests are distinct from coordinates and contain no location data", () => {
  assert.equal(LOCATION_REQUEST_BODY, "oldtime-location-request:v1");
  assert.equal(isLocationRequest(LOCATION_REQUEST_BODY), true);
  assert.equal(isLocationRequest(` ${LOCATION_REQUEST_BODY} `), true);
  assert.equal(isLocationRequest("37.422,-122.08406"), false);
  assert.equal(parseSharedCoordinates(LOCATION_REQUEST_BODY), null);
});

test("chat location requires device permission and explicit confirmation before sending", () => {
  const chat = read("chat.js");
  assert.match(chat, /navigator\.geolocation\.getCurrentPosition/);
  assert.match(chat, /enableHighAccuracy: true, maximumAge: 0, timeout: 15000/);
  assert.match(chat, /Your location is only sent after you confirm\. Oldtime won’t track you\./);
  assert.match(chat, /class="chat-location-confirm"/);
  assert.match(chat, /pushMsg\(id, \{ kind: "location", body: encodedCoordinates \}\)/);
  assert.match(chat, /class="chat-location-map-link" data-open-chat-location="true"/);
  assert.match(chat, /openSharedLocationMap\(ctx, button\.dataset\.latitude, button\.dataset\.longitude\)/);
  assert.match(chat, /class="panel chat-location-map-panel" role="dialog"/);
  assert.doesNotMatch(chat, /class="chat-location-map-link" href=/);
  assert.match(chat, /data-chat-location-map data-latitude="\$\{location\.latitude\}" data-longitude="\$\{location\.longitude\}"/);
  assert.match(chat, /mountChatLocationMaps\(ctx\.\$\("#msgs"\)\)/);
  assert.match(chat, /mountChatLocationMaps\(sheet\)/);
  const map = read("chat-location.js");
  assert.match(map, /import\("maplibre-gl"\)/);
  assert.match(map, /openFreeMapProvider\.load\("dark"\)/);
  assert.match(map, /interactive,/);
  assert.match(map, /data-chat-location-map-interactive/);
  assert.match(map, /new maplibre\.NavigationControl/);
});

test("location actions share the conversation settings section and attachments stay unchanged", () => {
  const chat = read("chat.js");
  const choices = chat.slice(chat.indexOf("function openAttachmentSheet"), chat.indexOf("function openLocationShareSheet"));
  const composer = chat.slice(chat.indexOf('id="chat-compose-tools"'), chat.indexOf("</form>", chat.indexOf('id="chat-compose-tools"')));
  for (const choice of ["Photos and attachments", "Emoji"]) {
    assert.ok(composer.includes(choice), `Missing original composer action: ${choice}`);
  }
  for (const choice of ["Photos and videos", "Document", "Contact", "View once"]) {
    assert.ok(choices.includes(choice), `Missing attachment choice: ${choice}`);
  }
  assert.doesNotMatch(choices, /data-attachment-choice="Location"|Share your current location once/,
    "location sharing is not added to the attachment sheet");
  assert.doesNotMatch(composer, /Share location|Request location|data-chat-location-action/,
    "location actions do not replace the existing composer options");
  assert.match(chat, /<b>Share location<\/b>/);
  assert.match(chat, /<b>Request location<\/b>/);
  assert.match(chat, /id="location-share"[\s\S]*?shareLocationFromDetails\(ctx, id\)/);
  assert.match(chat, /id="location-request"[\s\S]*?ui\.screen = "thread"; requestLocation\(ctx, id\)/);
  assert.match(chat, /function shareLocationFromDetails\(ctx, id\)[\s\S]*?openLocationShareSheet\(ctx, id\)/);
  assert.match(chat, /pushMsg\(id, \{ kind: "location", body: LOCATION_REQUEST_BODY \}\)/);
  assert.match(chat, /data-location-request="\$\{ctxEsc\(m\.id\)\}"/);
  assert.match(chat, /ctx\.app\.querySelectorAll\("\[data-location-request\]"\)/);
  assert.match(chat, /They asked for your location/);
  assert.match(chat, /void deliverMessage\(id, msg\)/);
  assert.doesNotMatch(choices, />GIF</i);
  assert.doesNotMatch(choices, />Poll</i);
  assert.doesNotMatch(choices, />Sticker</i);
  assert.doesNotMatch(choices, /data-mode="stickers"|chat-emoji-modebar/);
});

test("location messages show the sender's uploaded avatar or a personal initial", () => {
  const chat = read("chat.js");
  assert.match(chat, /function locationAvatar\(user\)/);
  assert.match(chat, /mediaSource\(\{ media: avatar, author: user\?\.id \|\| "" \}\)/);
  assert.match(chat, /api\.user\(m\.author\) \|\| \(mine \? api\.me\(\) : null\)/);
  assert.match(read("avatar-fallback.js"), /chat-location-avatar img/);
});
