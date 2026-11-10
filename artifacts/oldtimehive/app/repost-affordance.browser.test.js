import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { chromium } from "playwright-core";
import { renderRepostAffordance } from "./repost-affordance.js";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function findChromium() {
  const candidates = [process.env.CHROMIUM_PATH, "/repl/tools/bin/chromium", "/usr/bin/chromium",
    "/usr/bin/chromium-browser", "/usr/bin/google-chrome"].filter(Boolean);
  const installed = candidates.find(path => existsSync(path));
  if (installed) return installed;
  for (const command of ["chromium", "chromium-browser", "google-chrome"]) {
    try { return execFileSync("which", [command], { encoding: "utf8" }).trim(); } catch {}
  }
  throw new Error("Chromium is required for repost surface consistency checks.");
}

const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
})[char]);
const account = {
  me: () => ({ id: "viewer", username: "viewer", name: "Viewer", avatar: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" }),
  user: () => null,
  canSee: () => true,
};

test("repost pill, text contrast, spacing and icon size match in Home and the media viewer", async () => {
  const browser = await chromium.launch({
    executablePath: findChromium(),
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 874 } });
    const styles = [
      "styles.css",
      "post-detail.css",
      "post-viewer-immersive.css",
      "repost-affordance.css",
      "compact-interface.css",
    ].map(file => readFileSync(resolve(appRoot, "app", file), "utf8")).join("\n");
    const owned = renderRepostAffordance({
      id: "owned", author: "creator", repostCount: 1, repostedByMe: true, reposts: ["viewer"],
    }, { esc, account });
    const available = renderRepostAffordance({
      id: "available", author: "creator", repostCount: 0, reposts: [], repostedByFriends: [],
    }, { esc, account });

    await page.setContent(`<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>
      ${styles}
      html,body{margin:0;width:100%;height:100%;overflow:hidden}
      #app{position:relative;width:100%;min-height:100dvh}
      #feed,.post-viewer-screen.post-viewer-media{position:relative!important;width:min(100%,360px);height:150px!important;margin:0!important;padding:0!important;overflow:hidden}
      #feed .clip:not(.post-detail),.post-viewer-media .clip.post-detail{position:relative!important;inset:auto!important;width:100%!important;height:150px!important;min-height:0!important}
      #feed .clip .meta,.post-viewer-media .post-viewer-media-info .meta{position:relative!important;inset:auto!important;display:block!important;width:100%!important;max-height:none!important;margin:0!important;padding:0!important;overflow:visible!important}
      .post-viewer-media .post-viewer-feed{position:relative!important;inset:auto!important;width:100%!important;height:100%!important}
      .post-viewer-media-info{position:relative!important;inset:auto!important;width:100%!important;max-height:none!important;overflow:visible!important}
    </style></head><body><div id="app">
      <div id="feed"><article class="clip"><div class="meta">${owned}${available}</div></article></div>
      <section class="post-viewer-screen post-viewer-media"><div class="post-viewer-feed">
        <article class="clip post-detail"><div class="post-viewer-media-info"><div class="meta">${owned}${available}</div></div></article>
      </div></section>
    </div></body></html>`);

    for (const width of [320, 360, 402, 768, 1280]) {
      await page.setViewportSize({ width, height: 874 });
      const surfaces = await page.evaluate(() => ["#feed", ".post-viewer-media-info"].map(surface => ({
        name: surface,
        items: [...document.querySelectorAll(`${surface} .rp-aff`)].map(aff => {
          const summary = aff.querySelector(".rp-summary");
          const count = aff.querySelector(".rp-count");
          const action = aff.querySelector(".rp-action-icon-only");
          const face = aff.querySelector(".rp-face-compact");
          const icon = action?.querySelector(".navic");
          const rect = element => {
            const box = element.getBoundingClientRect();
            return { width: box.width, height: box.height };
          };
          return {
            id: aff.dataset.rpPost,
            label: count?.textContent.trim(),
            pill: { ...rect(summary), background: getComputedStyle(summary).backgroundColor, color: getComputedStyle(summary).color },
            labelColor: getComputedStyle(count).color,
            gapAfter: getComputedStyle(aff).marginBottom,
            avatar: rect(face),
            action: rect(action),
            icon: rect(icon),
            labelFits: count.scrollWidth <= count.clientWidth + 1,
          };
        }),
      })));

      assert.deepEqual(surfaces[0].items, surfaces[1].items,
        `Home and media-viewer repost treatments match at ${width}px`);
      for (const item of surfaces[0].items) {
        assert.equal(item.pill.color, "rgb(23, 25, 28)", `${item.id} pill text has dark contrast at ${width}px`);
        assert.equal(item.labelColor, "rgb(23, 25, 28)", `${item.id} label is readable at ${width}px`);
        assert.equal(item.pill.background, "rgba(255, 255, 255, 0.97)", `${item.id} keeps the white pill at ${width}px`);
        assert.equal(item.gapAfter, "4px", `${item.id} has the same compact spacing at ${width}px`);
        assert.equal(item.labelFits, true, `${item.id} label fits without clipping at ${width}px`);
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `comparison fixture has no horizontal spill at ${width}px`);
    }
    await page.close();
  } finally {
    await browser.close();
  }
});
