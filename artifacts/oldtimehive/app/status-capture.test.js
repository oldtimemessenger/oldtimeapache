import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { statusAudiences, defaultAudience, recorderMime, mediaKind, friendlyError, STATUS_FONTS, nativeVideoStoryPayload } from "./status-capture.js";

const source = readFileSync(new URL("./status-capture.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("./status-capture.css", import.meta.url), "utf8");

test("private accounts cannot pick Everyone and default to close friends", () => {
  assert.deepEqual(statusAudiences(true).map(o => [o.value, o.allowed]), [["public", false], ["close-friends", true]]);
  assert.equal(defaultAudience(true, "public"), "close-friends");
  assert.equal(defaultAudience(true), "close-friends");
  assert.equal(defaultAudience(false), "public");
  assert.equal(defaultAudience(false, "close-friends"), "close-friends");
});

test("recorder mime picks first supported type", () => {
  assert.equal(recorderMime(t => t === "video/webm"), "video/webm");
  assert.equal(recorderMime(() => false), "");
});

test("media kind detection", () => {
  assert.equal(mediaKind({ type: "video/mp4" }), "video");
  assert.equal(mediaKind({ type: "image/png" }), "image");
  assert.equal(mediaKind({ type: "text/plain" }), "");
});

test("errors shown to users are friendly, raw text only to console", () => {
  const orig = console.error; console.error = () => {};
  try {
    assert.match(friendlyError({ name: "NotAllowedError" }), /gallery/);
    assert.equal(friendlyError(new Error("TypeError xyz stack"), "Fallback"), "Fallback");
    assert.equal(
      friendlyError(new Error("Add people to Close Friends before sharing privately.")),
      "Add people to Close Friends in Story settings before sharing privately. Your Status is still here.",
    );
  } finally { console.error = orig; }
});

test("uses existing renderer/export/emoji/story APIs and a single send action", () => {
  for (const needle of ["createProject", "createLayer", "CreativeAssets", "drawProject", "canvasBlob", "exportCreativeVideo", "openEmojiPicker", "createCloudStory", "mediaBlob", "syncCloudPrivacy"]) {
    assert.ok(source.includes(needle), needle);
  }
  assert.equal((source.match(/Send to Status<\/button>/g) || []).length, 1);
  assert.ok(!/localStorage|indexedDB/.test(source), "no fake draft storage");
  assert.ok(source.includes("URL.revokeObjectURL"));
  assert.ok(source.includes("getTracks()"));
  assert.ok(/audio: false/.test(source), "camera opens without mic");
  assert.deepEqual(STATUS_FONTS, ["Manrope", "Georgia", "system-ui", "monospace"]);
});

test("video Status preparation shows visual progress without a numeric counter", () => {
  const send = source.slice(source.indexOf("async function send()"), source.indexOf("// ---------------- Boot"));
  assert.match(send, /onProgress:\s*setVideoProgress/);
  assert.match(source, /function setVideoProgress\(fraction\)/);
  assert.match(styles, /\.sc-sendbtn::after/);
  assert.match(styles, /data-preparing-video="true"/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.doesNotMatch(send, /Math\.round/);
});

test("Story settings manage the audience and server-backed Close Friends list", () => {
  for (const needle of [
    'data-testid="button-story-audience-settings"',
    'data-testid="story-audience-sheet"',
    "refreshCloudCloseFriends()",
    "refreshCloudRelationships({ force: true })",
    "replaceCloudCloseFriends([...closeFriendsDraft])",
    "a.areFriends(me?.id, profile.id)",
    "Only confirmed Friends can be added.",
  ]) assert.ok(source.includes(needle), needle);
});

test("gallery source opens the native picker before any await", () => {
  const body = source.slice(source.indexOf("export function openStatusCapture"));
  const click = body.indexOf("fileInput.click()"), firstAwait = body.indexOf("await ");
  assert.ok(click > 0 && click < firstAwait);
});

import { seedProject, normalizeSeedKind } from "./status-capture.js";

test("seed kinds map photo/video onto renderer kinds", () => {
  assert.equal(normalizeSeedKind("photo"), "image");
  assert.equal(normalizeSeedKind("video"), "video");
  assert.equal(normalizeSeedKind("", "x.webm"), "video");
});

test("seedProject keeps one project with a single background and no pages", () => {
  const base = { width: 1080, height: 1920, duration: 5, background: { kind: "color", color: "#000", media: "" }, layers: [], audioTracks: [] };
  const initialProject = { ...base, background: { kind: "photo", media: "oldtime-media:abc", color: "#111" },
    layers: [{ id: "t", kind: "text", text: "Hi", startTime: 2, endTime: 3 }], pages: [{ layers: [] }] };
  const p = seedProject(structuredClone(base), { initialProject });
  assert.equal(p.pages, undefined);
  assert.equal(p.background.kind, "image");
  assert.equal(p.background.media, "oldtime-media:abc");
  assert.equal(p.layers[0].text, "Hi");
  assert.equal(p.layers[0].startTime, 0);
  assert.notEqual(initialProject.layers[0].startTime, 0, "caller project untouched");
  const b = seedProject(structuredClone(base), { background: { media: "blob:x", kind: "video" } });
  assert.deepEqual([b.background.kind, b.background.media], ["video", "blob:x"]);
});

test("native video shares keep a movable snapshot layer without embedding its bytes", () => {
  const postId = "123e4567-e89b-42d3-a456-426614174000";
  const video = "https://media.example/video.mp4";
  const overlay = "data:image/png;base64,c25hcHNob3Q=";
  const project = {
    version:1,width:1080,height:1920,duration:24,audioTracks:[],
    background:{kind:"video",media:video,color:"#17191c",fit:"cover",statusTransform:{x:0,y:0,scale:1}},
    layers:[
      {id:"snapshot",kind:"image",media:overlay,x:.5,y:.75,scale:.8,rotation:0,opacity:1,startTime:0,endTime:3600,width:1080,height:1920},
      {id:"caption",kind:"text",x:.5,y:.2,scale:1,rotation:0,opacity:1,startTime:0,endTime:3600,width:900,
        text:"Original caption",font:"Manrope",fontSize:48,color:"#fff",background:"transparent",backgroundOn:false,align:"center"},
    ],
  };
  const payload = nativeVideoStoryPayload(project, { sourcePostId:postId,nativeVideoSource:video,nativeVideoOverlayDataUrl:overlay });
  assert.equal(payload.sourcePostId, postId);
  assert.equal(payload.overlayDataUrl, overlay);
  assert.equal(payload.creativeProject.background.media, undefined, "client cannot choose the stored video reference");
  assert.equal(payload.creativeProject.layers[0].media, undefined, "image bytes are uploaded separately, not stored in D1");
  assert.equal(payload.creativeProject.layers[0].scale, .8);
  assert.equal(payload.creativeProject.layers[0].endTime, 24);
  assert.equal(payload.creativeProject.layers[1].text, "Original caption");
  project.background.statusTransform.scale = 1.4;
  assert.equal(nativeVideoStoryPayload(project, { sourcePostId:postId,nativeVideoSource:video,nativeVideoOverlayDataUrl:overlay }), null,
    "custom video transforms stay on the existing render path");
});

test("hold-release cancels a pending mic request (no ghost recording)", () => {
  assert.match(source, /if \(recordPending\) \{ recordToken\+\+/);
  assert.match(source, /token !== recordToken/);
  assert.ok(!/frameRate:\s*60/.test(source), "never claims 60fps");
});

import { statusTextStyle, fitTextLayout, STATUS_TEXT_STYLES } from "./status-capture.js";
const css = readFileSync(new URL("./status-capture.css", import.meta.url), "utf8");

test("only Classic/Plain/Box presets, always centered without transforms", () => {
  assert.deepEqual(STATUS_TEXT_STYLES, ["classic", "plain", "box"]);
  for (const s of STATUS_TEXT_STYLES) {
    const v = statusTextStyle(s);
    assert.deepEqual([v.x, v.y, v.scale, v.rotation, v.align], [.5, .5, 1, 0, "center"]);
  }
  assert.equal(statusTextStyle("box").backgroundOn, true);
  assert.equal(statusTextStyle("plain").shadow, false);
  assert.notEqual(statusTextStyle("box", "#17191c", "#17191c").color, "#17191c", "box text stays readable");
});

test("auto-size shrinks long text to fit and stays centered", () => {
  const ctx = { font: "", measureText: t => ({ width: t.length * (parseInt(/(\d+)px/.exec(ctx.font)[1]) * .55) }) };
  const textStyle = l => ({ font: `600 ${l.fontSize}px x`, lineHeight: l.fontSize * 1.35, text: l.text, family: "x" });
  const wrapLines = (c, text, width) => { const out = []; let line = ""; for (const w of text.split(" ")) { const n = line ? line + " " + w : w; if (c.measureText(n).width > width && line) { out.push(line); line = w; } else line = n; } out.push(line); return out; };
  const short = fitTextLayout(ctx, { textStyle, wrapLines }, { text: "Hi" }, true);
  const long = fitTextLayout(ctx, { textStyle, wrapLines }, { text: "word ".repeat(300).trim() }, true);
  assert.ok(short.fontSize > long.fontSize);
  assert.ok(long.fontSize >= 26);
  assert.deepEqual([long.x, long.y, long.rotation, long.scale], [.5, .5, 0, 1]);
  const box = fitTextLayout(ctx, { textStyle, wrapLines }, { text: "Hi", backgroundOn: true }, false);
  assert.ok(box.width < 920, "box hugs short text");
});

test("no selection box, handles, dragging, pinch, rotation or trash", () => {
  assert.match(source, /video\.currentTime : 0, null, \{ preview: true \}/);
  for (const banned of ["sc-trash", "touchstart", "\"wheel\"", "localPoint", "data-ed=\"font\"", "data-ed=\"style\"", "data-ed=\"bubble\""]) assert.ok(!source.includes(banned), banned);
  assert.ok(!css.includes("sc-trash"));
  assert.match(css, /sc-typing .sc-edit-top/);
  assert.match(source, /seq !== openSeq/, "stale opens can't stack controls");
});
