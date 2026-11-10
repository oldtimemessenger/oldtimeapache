import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { drawStatusStickers, ART_HOLES, STICKER_ART, loadStickerArt } from "./status-sticker-art.js";
import { PICKER_KINDS } from "./status-sticker-editor.js";

const captureSource = readFileSync(new URL("./status-capture.js", import.meta.url), "utf8");
const captureCss = readFileSync(new URL("./status-capture.css", import.meta.url), "utf8");
const interactionSource = readFileSync(new URL("./story-sticker-interactions.js", import.meta.url), "utf8");
const stickerArtSource = readFileSync(new URL("./status-sticker-art.js", import.meta.url), "utf8");

function recordingContext() {
  const calls = [];
  let ctx;
  const target = {
    canvas: { width: 540, height: 960 },
    getContext: null,
    measureText(value) {
      const size = Number(/([\d.]+)px/.exec(ctx.font)?.[1] || 12);
      return { width: [...String(value)].length * size * .52 };
    },
    fillText(value, x, y) {
      calls.push({ value: String(value), x, y, font: ctx.font, baseline: ctx.textBaseline, align: ctx.textAlign });
    },
    rotate(angle) { calls.push({ type: "rotate", angle }); },
    drawImage(image, ...args) { calls.push({ type: "image", image, args }); }
  };
  ctx = new Proxy(target, {
    get(object, key) {
      if (key in object) return object[key];
      return () => {};
    },
    set(object, key, value) { object[key] = value; return true; }
  });
  return { ctx, calls };
}

let artReady;
async function ensureArtLoaded() {
  if (artReady) return artReady;
  const originalImage = globalThis.Image;
  globalThis.Image = class {
    set src(value) { this._src = value; this.width = 1; this.height = 1; this.onload?.(); }
    get src() { return this._src; }
  };
  artReady = loadStickerArt(PICKER_KINDS, { required: true });
  try { await artReady; }
  finally {
    if (originalImage === undefined) delete globalThis.Image;
    else globalThis.Image = originalImage;
  }
}

async function assertPromptFits(kind, prompt) {
  await ensureArtLoaded();
  const { ctx, calls } = recordingContext();
  drawStatusStickers(ctx, [{
    id: "sticker", kind, x: .5, y: .5, width: .44, height: .25,
    rotation: 0, title: kind === "questions" ? "QUESTIONS" : "ADD YOUR OWN", prompt
  }], 540, 960);

  const textCalls = calls.filter(call => call.type !== "image");
  const actionIndex = textCalls.findIndex(call => call.value === "Join");
  const promptText = textCalls.slice(0, actionIndex < 0 ? undefined : actionIndex).map(call => call.value).join("");
  assert.ok(promptText.replace(/\s/g, "").includes(prompt.replace(/\s/g, "")), "the complete edited text is drawn inside the artwork");
  assert.ok(calls.some(call => call.type === "image"), "the original transparent artwork is drawn");
  if (kind !== "questions") assert.ok(actionIndex > 0, "Join follows the editable prompt");
  if (kind === "questions") assert.ok(!textCalls.some(call => call.value === "Send a question"));
}

test("long edited prompts fit the original templates and stay separate from Join", async () => {
  const prompt = "This is an edited Story prompt that should wrap cleanly and remain readable without colliding with its action button.";
  await assertPromptFits("questions", prompt);
  await assertPromptFits("trendsetters", prompt);
});

test("long unbroken edited text wraps instead of being cut at the artwork edge", async () => {
  await assertPromptFits("questions", "Question".repeat(15));
});

test("owners can tap a story addition once to edit its prompt without a title field", () => {
  assert.match(captureSource, /if \(s\) \{ selectSticker\(s\.id\); openStickerForm\(s\); return; \}/);
  assert.match(captureSource, /data-testid="input-sticker-prompt"/);
  assert.doesNotMatch(captureSource, /input-sticker-title|name="title"|form\.elements\.title|data-ed="stk-edit"/);
  assert.match(stickerArtSource, /return \{ main: prompt \|\| "Ask me anything", sub: "Drop a question…"/);
  assert.match(stickerArtSource, /return \{ main: prompt \|\| STICKER_LABELS\[s\.kind\], join: STICKER_JOIN \}/);
  assert.match(captureSource, /form\.addEventListener\("submit", event => \{ event\.preventDefault\(\); saveStickerForm\(\); \}\)/);
});

test("viewers can tap the question card itself to ask without a Send button", () => {
  assert.match(interactionSource, /button\.onclick = e => \{[\s\S]{0,220}sticker\.kind === "questions"[\s\S]{0,80}ask\(sticker\)/);
  assert.doesNotMatch(captureSource, /Send a question/);
  assert.doesNotMatch(stickerArtSource, /Send a question/);
});

test("Story additions use a box-free horizontal-swipe tray with the original artwork", () => {
  assert.match(captureSource, /aria-label="Add to your story"/);
  assert.match(captureSource, /<b>Add to your story<\/b>/);
  assert.doesNotMatch(captureSource, />Stickers</);
  assert.match(captureCss, /\.sc-stk-picker\{[^}]*background:transparent[^}]*border:0[^}]*box-shadow:none/);
  assert.match(captureCss, /\.sc-stk-row\{[^}]*overflow-x:auto[^}]*touch-action:pan-x/);
  assert.match(captureCss, /\.sc-root \.sc-stk-card\{[^}]*width:min\(144px,36vw\)/);
  assert.match(captureSource, /src="\$\{esc\(STICKER_ART\[kind\] \|\| ""\)\}"/);
  assert.equal(ART_HOLES.trendsetters.join[1], .74);
  assert.equal(ART_HOLES["hey-world"].join[3], .88);
  assert.ok(Object.values(STICKER_ART).every(Boolean));
});

test("template renderer aspect-fits original transparent art before laying editable text into its holes", async () => {
  await ensureArtLoaded();
  assert.match(stickerArtSource, /ctx\.drawImage\(entry\.img, box\.left, box\.top, box\.iw, box\.ih\)/);
  assert.match(stickerArtSource, /scale = box\.iw \/ aw/);
  assert.match(stickerArtSource, /holeText\(ctx, ART_HOLES\[s\.kind\]\.main/);
  assert.equal(ART_HOLES.questions.main[1], .36);
});

test("all editable template text stays level and centered within its artwork", async () => {
  await ensureArtLoaded();
  for (const kind of ["questions", "trendsetters", "hey-world"]) {
    const { ctx, calls } = recordingContext();
    drawStatusStickers(ctx, [{
      id: `alignment-${kind}`, kind, x: .5, y: .5, width: .44, height: .25,
      rotation: 0, title: "Ignored title", prompt: "A balanced prompt with even spacing",
    }], 540, 960);
    const text = calls.filter(call => typeof call.value === "string");
    assert.ok(text.length >= 2, `${kind} renders its prompt and action text`);
    assert.ok(text.every(call => call.x === 0 && call.align === "center"), `${kind} text lines share a centered baseline`);
    assert.ok(calls.filter(call => call.type === "rotate").every(call => Math.abs(call.angle) < .001),
      `${kind} text stays horizontal`);
  }
});
