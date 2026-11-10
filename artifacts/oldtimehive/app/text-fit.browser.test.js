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
  throw new Error("Chromium is required for the responsive text-fit test.");
}

function notificationCard(title, detail) {
  return `<button class="notification-category" type="button">
    <span class="notification-category-icon" aria-hidden="true">Icon</span>
    <span><b>${title}</b><small>${detail}</small></span>
    <span class="notification-category-arrow" aria-hidden="true">›</span>
  </button>`;
}

test("shared mobile text safeguards remain enabled across app content", () => {
  const css = readFileSync(resolve(appRoot, "app/compact-interface.css"), "utf8");
  assert.match(css, /\.phone,\s*\.screen,[\s\S]*?min-width:0;/);
  assert.match(css, /\.phone :is\(p,small,b,strong,h1,h2,h3,label,span[\s\S]*?overflow-wrap:anywhere;/);
  assert.match(css, /\.phone :is\(\.notification-category,.notification-row,.chat-row,.search-result,.profile-row,.settings-entry\)\s*>\s*:not\(img\):not\(svg\)\s*\{\s*min-width:0;/);
});

test("notification copy stays between its icon and arrow from phone to desktop widths", async () => {
  const browser = await chromium.launch({
    executablePath: findChromium(),
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 874 } });
    const styles = ["styles.css", "compact-interface.css", "ordinary-white.css", "destination-landing-refinement.css"]
      .map(file => readFileSync(resolve(appRoot, "app", file), "utf8")).join("\n");
    const cards = [
      notificationCard("New followers", "12 recent"),
      notificationCard("Likes and reactions", "50 recent"),
      notificationCard("Comments, mentions and reposts", "22 recent"),
      notificationCard("Requests", "No pending requests"),
      notificationCard("From Oldtime", "Updates and your announcement preferences"),
    ].join("");
    await page.setContent(`<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>
      ${styles}
      html,body{margin:0;width:100%;min-height:100%;overflow-x:hidden}
      .phone,#app{width:100%;max-width:none;min-width:0;margin:0}
    </style></head><body><div class="phone"><div id="app">
      <section class="screen on notifications-screen"><div class="scroll page"><div class="notification-categories">${cards}</div></div></section>
    </div></div></body></html>`);

    for (const width of [320, 360, 402, 768, 1280]) {
      await page.setViewportSize({ width, height: 874 });
      const layout = await page.locator(".notification-category").evaluateAll(elements => elements.map(card => {
        const bounds = element => {
          const rect = element.getBoundingClientRect();
          return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
        };
        return {
          card: bounds(card),
          icon: bounds(card.querySelector(".notification-category-icon")),
          copy: bounds(card.querySelector(":scope > span:nth-child(2)")),
          title: bounds(card.querySelector("b")),
          detail: bounds(card.querySelector("small")),
          arrow: bounds(card.querySelector(".notification-category-arrow")),
          clientWidth: card.clientWidth,
          scrollWidth: card.scrollWidth,
        };
      }));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true,
        `page has no horizontal spill at ${width}px`);
      for (const [index, item] of layout.entries()) {
        assert.ok(item.icon.right <= item.copy.left + 1, `card ${index} icon does not touch text at ${width}px`);
        assert.ok(item.copy.right <= item.arrow.left + 1, `card ${index} text stays before arrow at ${width}px`);
        assert.ok(item.title.bottom <= item.detail.top + 1, `card ${index} title and detail do not overlap at ${width}px`);
        assert.ok(item.arrow.right <= item.card.right + 1, `card ${index} arrow stays inside its card at ${width}px`);
        assert.ok(item.scrollWidth <= item.clientWidth + 1, `card ${index} has no horizontal text spill at ${width}px`);
      }
    }
    await page.close();
  } finally {
    await browser.close();
  }
});
