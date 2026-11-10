import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { chromium } from "playwright-core";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function findChromium() {
  const candidates = [process.env.CHROMIUM_PATH, "/repl/tools/bin/chromium", "/usr/bin/chromium",
    "/usr/bin/chromium-browser", "/usr/bin/google-chrome"].filter(Boolean);
  const installed = candidates.find(path => existsSync(path));
  if (installed) return installed;
  for (const command of ["chromium", "chromium-browser", "google-chrome"]) {
    try { return execFileSync("which", [command], { encoding: "utf8" }).trim(); } catch {}
  }
  throw new Error("Chromium is required for the Story text-fit test.");
}

test("Story activity tabs and summaries stay separate from phone through desktop widths", async () => {
  const browser = await chromium.launch({
    executablePath: findChromium(),
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 874 } });
    const styles = [
      "styles.css",
      "story-interactions.css",
      "story-visual-refinement.css",
      "ecosystem-consistency.css",
      "story-immersive-redesign.css",
      "compact-interface.css",
    ].map(file => readFileSync(resolve(appRoot, "app", file), "utf8")).join("\n");

    await page.setContent(`<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>
      ${styles}
      html,body{margin:0;width:100%;height:100%;overflow:hidden}
      .phone,#app{width:100%;height:100%;max-width:none;min-width:0;margin:0}
    </style></head><body><div class="phone"><div id="app">
      <section id="storyview" class="storyview on">
        <div class="story-more-menu story-sheet is-open" role="dialog" aria-label="Story activity and options">
          <div class="story-panel-handle"></div>
          <header class="story-panel-head">
            <div class="story-panel-tabs" role="tablist" aria-label="Story controls">
              <button type="button" class="story-activity-open story-panel-tab" role="tab" aria-selected="true">
                <svg class="navic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle></svg><span>Views</span>
              </button>
              <button type="button" class="story-options-open story-panel-tab" role="tab" aria-selected="false">Options</button>
            </div>
            <button type="button" class="story-panel-close" aria-label="Close Story controls">×</button>
          </header>
          <section class="story-insights" role="tabpanel">
            <span class="story-insights-summary">0 views · 0 reactions</span>
            <ul class="story-insights-list"><li class="story-insights-empty">No views yet.</li></ul>
          </section>
        </div>
      </section>
    </div></div></body></html>`);

    for (const width of [320, 360, 402, 768, 1280]) {
      await page.setViewportSize({ width, height: 874 });
      const layout = await page.evaluate(() => {
        const rect = selector => {
          const value = document.querySelector(selector).getBoundingClientRect();
          return { left: value.left, right: value.right, top: value.top, bottom: value.bottom };
        };
        const panel = document.querySelector(".story-more-menu");
        const tab = document.querySelector(".story-activity-open");
        return {
          pageWidth: document.documentElement.scrollWidth,
          panel: rect(".story-more-menu"),
          panelWidth: panel.clientWidth,
          panelScrollWidth: panel.scrollWidth,
          header: rect(".story-panel-head"),
          tabs: rect(".story-panel-tabs"),
          tab: rect(".story-activity-open"),
          tabDisplay: getComputedStyle(tab).display,
          icon: rect(".story-activity-open .navic"),
          label: rect(".story-activity-open span"),
          summary: rect(".story-insights-summary"),
          list: rect(".story-insights-list"),
        };
      });

      assert.ok(layout.pageWidth <= width + 1, `page does not spill horizontally at ${width}px`);
      assert.ok(layout.panelWidth > 0 && layout.panelScrollWidth <= layout.panelWidth + 1,
        `Story panel fits its width at ${width}px`);
      assert.ok(layout.panel.left >= 0 && layout.panel.right <= width + 1,
        `Story panel stays within the screen at ${width}px`);
      assert.equal(layout.tabDisplay, "flex", `Views remains a horizontal tab at ${width}px`);
      assert.ok(layout.icon.right <= layout.label.left + 1, `Views icon does not collide with its label at ${width}px`);
      assert.ok(Math.abs(layout.icon.top - layout.label.top) < 8, `Views icon and label stay on one line at ${width}px`);
      assert.ok(layout.label.bottom <= layout.header.bottom + 1,
        `tab label stays inside the header at ${width}px`);
      assert.ok(layout.summary.top >= layout.header.bottom - 1,
        `activity summary begins below the tabs at ${width}px`);
      assert.ok(layout.summary.bottom <= layout.list.top + 1,
        `activity summary does not collide with the viewer list at ${width}px`);
    }
    await page.close();
  } finally {
    await browser.close();
  }
});
