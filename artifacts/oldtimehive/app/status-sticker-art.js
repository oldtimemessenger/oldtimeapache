// Draws editable Story additions into the preview and every exported frame.
// Original transparent artwork supplies the templates; text stays editable.
import { STICKER_LABELS, STICKER_JOIN, ART_SIZE } from "./status-sticker-editor.js";

const assetUrl = make => { try { return make(); } catch { return ""; } };
const graphemeSegmenter = typeof Intl.Segmenter === "function"
  ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
  : null;
// These workspace PNGs already have transparent exteriors; preserve their alpha.
export const STICKER_ART = {
  questions: assetUrl(() => new URL("./assets/status-stickers/questions.png", import.meta.url).href),
  trendsetters: assetUrl(() => new URL("./assets/status-stickers/trendsetters.png", import.meta.url).href),
  "hey-world": assetUrl(() => new URL("./assets/status-stickers/hey-world.png", import.meta.url).href),
};
// Text and Join action positions match the blank areas in the original artwork.
export const ART_HOLES = {
  questions: { main: [.08, .36, .92, .47], sub: [.08, .48, .92, .59] },
  trendsetters: { main: [.12, .63, .88, .74], join: [.20, .74, .80, .96] },
  "hey-world": { main: [.10, .50, .90, .70], join: [.12, .70, .88, .88] },
};
const PALETTE = { white: "#fbfaff", ink: "#16141c", purple: "#6a3fd8", purpleSoft: "#efe9fd", muted: "#5d5870" };
const art = new Map(); // kind -> { img, ready, failed }


/** Starts (or reuses) loading of sticker art. Resolves when loaded or failed; never rejects. */
export function loadStickerArt(kinds = ["questions"], { required = false } = {}) {
  kinds = [...new Set(kinds.map(kind => kind === "answer" ? "questions" : kind))];
  if (typeof Image === "undefined") return Promise.resolve();
  return Promise.all(kinds.filter(k => STICKER_ART[k]).map(kind => {
    let entry = art.get(kind);
    if (!entry) {
      const img = new Image();
      img.decoding = "async";
      entry = { img, ready: false, failed: false };
      entry.promise = new Promise(resolve => {
        img.onload = () => { entry.ready = true; resolve(); };
        img.onerror = () => { entry.failed = true; resolve(); };
      });
      img.src = STICKER_ART[kind];
      art.set(kind, entry);
    }
    return entry.promise;
  })).then(() => {
      if (required && kinds.some(kind => !art.get(kind)?.ready)) throw new Error("Couldn't load the Story artwork. Your Status is still here; try again.");
  });
}

function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

/** Word-wraps into at most maxLines; shrinks font down to minSize first, then ellipsizes. */
function fitText(ctx, value, maxWidth, maxLines, size, minSize, weight = 800) {
  const words = String(value || "").split(/\s+/).filter(Boolean);
  for (let s = size; s >= minSize; s -= 1) {
    ctx.font = `${weight} ${s}px Manrope, system-ui, sans-serif`;
    const lines = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width <= maxWidth) line = next;
      else {
        if (line) { lines.push(line); line = ""; }
        if (ctx.measureText(word).width <= maxWidth) { line = word; continue; }
        const parts = graphemeSegmenter
          ? [...graphemeSegmenter.segment(word)].map(item => item.segment)
          : [...word];
        for (const part of parts) {
          if (line && ctx.measureText(line + part).width > maxWidth) { lines.push(line); line = ""; }
          line += part;
        }
      }
    }
    if (line) lines.push(line);
    if (lines.length <= maxLines && lines.every(l => ctx.measureText(l).width <= maxWidth)) return { lines, size: s, truncated: false };
    if (s === minSize) {
      const kept = lines.slice(0, maxLines);
      let last = kept[kept.length - 1] || "";
      while (last && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
      if (lines.length > maxLines || last !== kept[kept.length - 1]) kept[kept.length - 1] = `${last.trimEnd()}…`;
      return { lines: kept, size: s, truncated: true };
    }
  }
  return { lines: [], size: minSize };
}

function drawLines(ctx, { lines, size }, cx, top, color, lineHeight = 1.18) {
  ctx.fillStyle = color; ctx.textAlign = "center"; ctx.textBaseline = "top";
  lines.forEach((l, i) => ctx.fillText(l, cx, top + i * size * lineHeight));
  return lines.length * size * lineHeight;
}

function drawAnswer(ctx, s, w, h, u) {
  const entry = art.get("questions");
  if (!entry?.ready) return;
  // Extend only the card's empty middle areas. The crown, logo, rounded ends
  // and signature stay at their original proportions instead of stretching.
  const nw = 631, nh = 578, targetHeight = Math.max(760, nw * h / w);
  const scale = Math.min(w / nw, h / targetHeight), extra = targetHeight - nh;
  const answered = Boolean(String(s.answer || "").trim());
  const questionExtra = extra * (answered ? .45 : 1), answerExtra = extra - questionExtra;
  ctx.save();
  ctx.translate(-nw * scale / 2, -targetHeight * scale / 2); ctx.scale(scale, scale);
  ctx.save();
  ctx.shadowColor = "rgba(255,255,255,.24)"; ctx.shadowBlur = 26;
  roundRect(ctx, 0, 0, nw, targetHeight, 36); ctx.fillStyle = "#fff"; ctx.fill();
  ctx.restore();
  ctx.filter = "grayscale(1)";
  for (const [sy, sh, dy, dh] of [
    [0, 320, 0, 320], [320, 1, 320, 1 + questionExtra],
    [321, 98, 321 + questionExtra, 98], [419, 1, 419 + questionExtra, 1 + answerExtra],
    [420, 158, 420 + extra, 158],
  ]) ctx.drawImage(entry.img, 0, sy, nw, sh, 0, dy, nw, dh);
  // Replace the old "Type something" / send artwork only inside its field.
  ctx.save();
  ctx.translate(330, 428 + questionExtra + answerExtra / 2); ctx.rotate(-5 * Math.PI / 180);
  roundRect(ctx, -277, -(155 + answerExtra) / 2, 554, 155 + answerExtra, 65);
  ctx.fillStyle = answered ? "#d7d7e0" : "#f0eff5"; ctx.fill(); ctx.restore();
  const block = (value, x, y, width, height, size, weight, color) => {
    ctx.save(); ctx.translate(x + width / 2, y + height / 2); ctx.rotate(-5 * Math.PI / 180);
    ctx.beginPath(); ctx.rect(-width / 2, -height / 2, width, height); ctx.clip();
    const fitted = fitHole(ctx, value, width * .94, height * .9, size, 12, weight);
    ctx.font = `${weight} ${fitted.size}px Manrope, system-ui, sans-serif`;
    drawLines(ctx, fitted, 0, -fitted.lines.length * fitted.size * 1.18 / 2, color);
    ctx.restore();
  };
  block(s.title || "Your question", 100, 202, 460, 45, 32, 800, PALETTE.ink);
  block(s.prompt, 92, 250, 465, answered ? 90 + questionExtra : 235 + extra, 33, 700, PALETTE.ink);
  if (answered) block(s.answer, 88, 368 + questionExtra, 475, 110 + answerExtra, 36, 700, PALETTE.ink);
  ctx.restore();
  void u;
}

/** Lines that fit the hole: shrink first, then ellipsize. Line count follows the hole height. */
function fitHole(ctx, value, hw, hh, size, min, weight) {
  for (let s0 = size; s0 >= min; s0 -= 1) {
    const lines = Math.max(1, Math.floor(hh / (s0 * 1.15)));
    const f = fitText(ctx, value, hw, lines, s0, s0, weight);
    if (!f.truncated || s0 === min) return f;
  }
  return fitText(ctx, value, hw, 1, min, min, weight);
}
function holeText(ctx, hole, box, value, color, weight, maxSize, tilt = 0) {
  const [x0, y0, x1, y1] = hole, { left, top, iw, ih } = box;
  const hx = left + x0 * iw, hy = top + y0 * ih, hw = (x1 - x0) * iw, hh = (y1 - y0) * ih;
  ctx.save();
  ctx.translate(hx + hw / 2, hy + hh / 2);
  ctx.rotate(tilt * Math.PI / 180);
  ctx.beginPath(); ctx.rect(-hw / 2, -hh / 2, hw, hh); ctx.clip();
  const f = fitHole(ctx, value, hw * .96, hh * .92, Math.min(maxSize, hh * .78), Math.max(6, hh * .2), weight);
  const th = f.lines.length * f.size * 1.15;
  ctx.font = `${weight} ${f.size}px Manrope, system-ui, sans-serif`;
  ctx.fillStyle = color; ctx.textAlign = "center"; ctx.textBaseline = "top";
  f.lines.forEach((l, i) => ctx.fillText(l, 0, -th / 2 + i * f.size * 1.15 + f.size * .04));
  ctx.restore();
}
/** Full original art aspect-fit (contain) into the sticker box; no card, no header. */
export function artBox(kind, w, h) {
  const [aw, ah] = ART_SIZE[kind] || [1, 1], k = Math.min(w / aw, h / ah);
  const iw = aw * k, ih = ah * k;
  return { left: -iw / 2, top: -ih / 2, iw, ih };
}
export function stickerWording(s) {
  const prompt = String(s.prompt || "").trim();
  if (s.kind === "questions") {
    return { main: prompt || "Ask me anything", sub: "Drop a question…" };
  }
  return { main: prompt || STICKER_LABELS[s.kind], join: STICKER_JOIN };
}
function drawArt(ctx, s, w, h) {
  const entry = art.get(s.kind), [aw, ah] = ART_SIZE[s.kind] || [1, 1];
  if (!entry?.ready) return;
  const box = artBox(s.kind, w, h), scale = box.iw / aw;
  ctx.drawImage(entry.img, box.left, box.top, box.iw, box.ih);
  ctx.save();
  ctx.translate(box.left, box.top);
  ctx.scale(scale, scale);
  const artFrame = { left: 0, top: 0, iw: aw, ih: ah };
  const wording = stickerWording(s);
  if (s.kind === "questions") {
    holeText(ctx, ART_HOLES.questions.main, artFrame, wording.main, PALETTE.ink, 800, 43);
    holeText(ctx, ART_HOLES.questions.sub, artFrame, wording.sub, PALETTE.muted, 650, 28);
  } else {
    const mainColor = s.kind === "trendsetters" ? PALETTE.white : PALETTE.ink;
    const joinColor = s.kind === "hey-world" ? PALETTE.purple : PALETTE.ink;
    holeText(ctx, ART_HOLES[s.kind].main, artFrame, wording.main, mainColor, 800, s.kind === "trendsetters" ? 28 : 30);
    holeText(ctx, ART_HOLES[s.kind].join, artFrame, wording.join, joinColor, 800, 31);
  }
  ctx.restore();
}

/**
 * drawStatusStickers(canvasOrCtx, stickers, width, height, { selectedId })
 * Draws in canvas pixel space (identity transform). selectedId adds a thin outline (preview only).
 */
export function drawStatusStickers(target, stickers = [], width, height, { selectedId = null } = {}) {
  const ctx = target?.getContext ? target.getContext("2d") : target;
  if (!ctx || !stickers?.length) return;
  const W = width ?? ctx.canvas?.width, H = height ?? ctx.canvas?.height;
  const u = W / 540;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.filter = "none";
  for (const s of stickers) {
    const w = s.width * W, h = s.height * H;
    ctx.save();
    ctx.translate(s.x * W, s.y * H); ctx.rotate(s.rotation * Math.PI / 180);
    if (s.kind === "answer") {
      drawAnswer(ctx, s, w, h, u);
    } else drawArt(ctx, s, w, h); // original transparent template artwork
    if (selectedId && s.id === selectedId) {
      ctx.setLineDash([10 * u, 7 * u]); ctx.lineWidth = 2.5 * u; ctx.strokeStyle = "#ffffff";
      roundRect(ctx, -w / 2 - 6 * u, -h / 2 - 6 * u, w + 12 * u, h + 12 * u, 26 * u); ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
}
