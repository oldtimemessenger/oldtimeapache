import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { chromium } from "playwright-core";
import { createServer } from "vite";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const chromiumPath = [process.env.CHROMIUM_PATH, "/repl/tools/bin/chromium", "/usr/bin/chromium"].filter(Boolean).find(existsSync);
const cases = [
  { kind: "trendsetters", artWidth: 900, artHeight: 529, prompt: "Join the trend 🔥", x: .5, y: .84, rotation: 29 },
  { kind: "hey-world", artWidth: 601, artHeight: 648, prompt: "Say hello to the world", x: .5, y: .79, rotation: -17 },
];

test("viewer Join controls open a linked Status composition", {
  skip: !chromiumPath && "Chromium unavailable",
  timeout: 120_000,
}, async () => {
  const server = await createServer({
    configFile: resolve(packageRoot, "vite.config.ts"),
    logLevel: "silent",
    server: { host: "127.0.0.1", port: 0, strictPort: false },
  });
  let browser;
  try {
    await server.listen();
    const { port } = server.httpServer.address();
    browser = await chromium.launch({
      executablePath: chromiumPath, headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.route("**/api/**", route => route.fulfill({
      status: 200, contentType: "application/json", body: JSON.stringify({ participants: [] }),
    }));
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "domcontentloaded" });
    await page.setContent("<!doctype html><html><head></head><body style='margin:0'></body></html>");

    for (const [index, action] of cases.entries()) {
      const stickerId = `00000000-0000-4000-8000-00000000000${index + 1}`;
      const point = await page.evaluate(async ({ action, stickerId }) => {
        const { mountStoryStickerInteractions } = await import("/app/story-sticker-interactions.js");
        const view = document.createElement("div");
        view.id = "storyview";
        view.className = "storyview on";
        view.style.cssText = "display:block;position:relative;width:390px;height:844px;overflow:hidden";
        const stage = document.createElement("div");
        stage.className = "story-stage";
        stage.style.cssText = "position:relative;width:390px;height:844px";
        view.append(stage);
        document.body.replaceChildren(view);
        window.joinResult = null;
        mountStoryStickerInteractions(view, {
          id: "00000000-0000-4000-8000-000000000101",
          author: "another-member",
          hasMedia: true,
          stickers: [{
            id: stickerId, kind: action.kind, prompt: action.prompt,
            x: .5, y: .53, width: .78, height: .34, rotation: action.rotation,
          }],
        }, {
          onCreate: options => { window.joinResult = options; },
          toast: () => {},
          onOpenStory: () => {},
        });
        const button = view.querySelector(".ss-hit");
        const width = button.offsetWidth, height = button.offsetHeight;
        const aspect = width / height, artAspect = action.artWidth / action.artHeight;
        const fitWidth = Math.min(1, artAspect / aspect);
        const fitHeight = Math.min(1, aspect / artAspect);
        const frameX = (1 - fitWidth) / 2 + action.x * fitWidth;
        const frameY = (1 - fitHeight) / 2 + action.y * fitHeight;
        const localX = (frameX - .5) * width, localY = (frameY - .5) * height;
        const angle = action.rotation * Math.PI / 180;
        const bounds = button.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2, centerY = bounds.top + bounds.height / 2;
        return {
          x: centerX + localX * Math.cos(angle) - localY * Math.sin(angle),
          y: centerY + localX * Math.sin(angle) + localY * Math.cos(angle),
          stickerId,
          width, height, buttonCount: view.querySelectorAll(".ss-hit").length,
        };
      }, { action, stickerId });

      assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y) && point.width > 0 && point.height > 0,
        `Join target geometry is valid: ${JSON.stringify(point)}`);
      await page.mouse.click(point.x, point.y);
      await page.waitForFunction(() => window.joinResult !== null, null, { timeout: 4_000 });
      const joined = await page.evaluate(() => window.joinResult.initialStickers[0]);
      assert.equal(joined.kind, action.kind);
      assert.equal(joined.prompt, action.prompt);
      assert.equal(joined.sourceStickerId, point.stickerId);
    }
  } finally {
    await browser?.close();
    await server.close();
  }
});
