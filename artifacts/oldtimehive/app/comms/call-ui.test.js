import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const chat = read("../chat.js");
const calls = read("./calls.js");
const comms = read("./index.js");
const styles = read("../styles.css");
const callStyles = styles.slice(styles.indexOf("/* Calls use the other person's photo"));

test("one-to-one chats have one call action and can add video during the call", () => {
  assert.match(chat, /id="vcall"[^>]*aria-label="Start voice call"/);
  assert.doesNotMatch(chat, /id="vid"/);
  assert.match(chat, /c\.members\.length === 2/);
  assert.match(calls, /pc\.addTransceiver\("video", \{ direction: "sendrecv" \}\)/);
  assert.match(calls, /export async function addVideo\(\)/);
  assert.match(comms, /aria-label="Turn video on"><span>\$\{ic\.videoCall\}/);
  assert.match(comms, /aria-label="\$\{call\.cameraOn \? "Turn camera off" : "Turn camera on"\}"[^>]*><span>\$\{ic\.videoCall\}/);
});

test("call screen uses a photo backdrop and has no boxes around the action row", () => {
  assert.match(comms, /class="ot-call-backdrop" aria-hidden="true"><img src="\$\{avatar\}"/);
  assert.match(comms, /<img class="ot-call-avatar" src="\$\{avatar\}" alt="" \/>/);
  assert.doesNotMatch(comms, /<div class="ot-call-avatar">/);
  assert.match(callStyles, /\.ot-call-backdrop\s*\{[^}]*display:block!important/);
  assert.match(callStyles, /\.ot-call-backdrop img\s*\{[^}]*filter:blur\(/);
  assert.match(callStyles, /\.ot-call-actions\s*\{[^}]*border:0[^}]*background:transparent/);
  assert.match(callStyles, /\.ot-control\s*\{[^}]*border:0[^}]*background:transparent/);
  assert.match(callStyles, /\.ot-control > span\s*\{[^}]*border-radius:50%[^}]*backdrop-filter:blur/);
  assert.match(callStyles, /#ot-self-view > video#ot-local\s*\{[^}]*inset:0[^}]*width:100%[^}]*height:100%[^}]*object-fit:cover/);
});
