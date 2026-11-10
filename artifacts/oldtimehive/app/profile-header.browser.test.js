import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { chromium } from "playwright-core";
import { createServer } from "vite";

// Isolated owner/visitor profile layout fixture. Fake local data only; every /api request is blocked.
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const shotDir = resolve(tmpdir(), "oldtime-profile-header");
const chromiumPath = [process.env.CHROMIUM_PATH, "/repl/tools/bin/chromium", "/usr/bin/chromium"].filter(Boolean).find(existsSync);
const profileHeaderCss = readFileSync(new URL("./profile-header-refinement.css", import.meta.url), "utf8");

test("profile refinement leaves built-in avatar artwork visible", () => {
  assert.doesNotMatch(profileHeaderCss, /img\[src\*="\/brand\/avatars\/"\][^{]*\{[^}]*visibility\s*:\s*hidden/i);
  assert.doesNotMatch(profileHeaderCss, /linearGradient[^}]*visibility\s*:\s*hidden/i);
});

const person = (id, extra = {}) => ({
  id, username: id.replace(/-/g, ""), name: id.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" "),
  avatar: "/app/avatar.svg", private: false, followers: [], following: [], friends: [], closeFriends: [],
  interests: [], profileVisibility: { city: true, interests: true }, ...extra,
});
const fixture = {
  session: "fixture-owner",
  settings: { readReceipts: true, lastSeen: "everyone" },
  users: [
    person("fixture-owner", { name: "Fixture Owner With A Longer Display Name", city: "Philadelphia, US",
      interests: ["basketball", "music", "photography"], followers: ["fan-one", "fan-two", "fan-three", "fan-four"],
      following: ["fan-one", "fan-two", "fan-three"], bio: "Fixture bio for layout checks.", cover: "/app/test-profile-cover.svg",
       stats: { followerCount: 1284, followingCount: 317, viewCount: 9, postCount: 6 } }),
       person("visitor-target", { city: "Lisbon", interests: ["travel"], followers: [], following: [], cover: null,
        stats: { followerCount: 0 }, statsFetchedAt: Date.now() }),
    person("fan-one"), person("fan-two"), person("fan-three"), person("fan-four"),
  ],
  posts: Array.from({ length: 6 }, (_, index) => ({
    id: `fixture-owner-post-${index}`, author: "fixture-owner", kind: "image",
    media: ["/app/avatar.svg"], caption: `Profile grid item ${index + 1}`,
    destination: "main", visibility: "public", likes: [], comments: [], reposts: [], saves: [], views: index + 1,
    created: 1_700_000_000_000 + index,
  })),
  stories: [], chats: [], requests: [], friendRequests: [], notifications: [],
};

test("profile header owner and visitor layouts at phone, tablet, and desktop widths", { skip: !chromiumPath && "Chromium unavailable", timeout: 240_000 }, async () => {
  process.env.PORT ||= "5173"; process.env.BASE_PATH ||= "/";
  const server = await createServer({ configFile: resolve(packageRoot, "vite.config.ts"), logLevel: "silent", server: { host: "127.0.0.1", port: 0, strictPort: false } });
  let browser;
  try {
    await server.listen();
    const { port } = server.httpServer.address();
    browser = await chromium.launch({ executablePath: chromiumPath, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
    mkdirSync(shotDir, { recursive: true });
    const writes = [];
    for (const width of [320, 390, 768, 1280]) {
      const context = await browser.newContext({ serviceWorkers: "block", viewport: { width, height: 844 } });
      await context.route("**/api/**", route => {
        if (route.request().method() !== "GET") writes.push(route.request().url());
        const stats = { fixtureowner: ["fixture-owner", 1284, 317], visitortarget: ["visitor-target", 7, 5] };
        const profilePath = new URL(route.request().url()).pathname;
        const hit = Object.entries(stats).find(([name]) => profilePath.endsWith(`/api/profiles/${name}`));
        if (hit && route.request().method() === "GET") {
          const [, [id, followerCount, followingCount]] = hit;
          const user = fixture.users.find(person => person.id === id);
          const followerPreviews = id === "fixture-owner"
            ? ["fan-one", "fan-two", "fan-three"].map(memberId => fixture.users.find(person => person.id === memberId))
            : [];
          const followingPreviews = id === "fixture-owner"
            ? ["fan-one", "fan-two", "fan-three"].map(memberId => fixture.users.find(person => person.id === memberId))
            : id === "visitor-target" ? [fixture.users.find(person => person.id === "fixture-owner")] : [];
          return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
            profile: {
              id, username: hit[0], displayName: user.name, avatar: user.avatar,
              cover: user.cover || null, bio: user.bio || "", profileNote: user.profileNote || "",
              city: user.city || "", interests: user.interests || [],
              profileVisibility: user.profileVisibility,
             }, stats: { followerCount, followingCount, viewCount: 9, followerPreviews, followingPreviews },
             postCount: id === "fixture-owner" ? 6 : 3,
            posts: fixture.posts.filter(post => post.author === id),
          }) });
        }
        return route.fulfill({ status: 503, contentType: "application/json", body: '{"error":"blocked in fixture"}' });
      });
      await context.addInitScript(state => {
        const initial = structuredClone(state);
        const visitor = initial.users.find(person => person.id === "visitor-target");
        visitor.stats = { followerCount: 0 };
        visitor.statsFetchedAt = Date.now();
        if (!localStorage.getItem("oldtime-v1")) localStorage.setItem("oldtime-v1", JSON.stringify(initial));
        sessionStorage.clear();
        sessionStorage.setItem("oldtime-cloud-session-v1", JSON.stringify({ account: { id: initial.session }, accessToken: "a".repeat(43), expiresAt: Date.now() + 600_000 }));
      }, fixture);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", e => errors.push(e.message));
      await page.goto(`http://127.0.0.1:${port}/`);
      await page.waitForFunction(() => typeof window.__oldtimeOpenProfilePreview === "function", null, { timeout: 60_000 });
      for (const [label, id] of [["owner", "fixture-owner"], ["visitor", "visitor-target"]]) {
        await page.evaluate(target => window.__oldtimeOpenProfilePreview(target), id);
        await page.locator(".profile-screen .profile-stats").waitFor({ state: "visible" });
        await page.waitForFunction(expected => {
          const stats = document.querySelector(".profile-stats")?.innerText || "";
          const posts = document.querySelector("[data-testid='profile-post-count']")?.innerText || "";
          return expected === "owner" ? /1\.2k/i.test(stats) && /317/.test(stats) && /^6\s+Posts$/i.test(posts)
            : /7/.test(stats) && /5/.test(stats) && /^3\s+Posts$/i.test(posts);
        }, label, { timeout: 15_000 });
        await page.waitForTimeout(1200); // let entrance motion and stats refresh settle
        if (label === "owner") {
          await page.evaluate(() => {
            const panel = document.querySelector("#profile-content-grid");
            let grid = panel?.querySelector(".profile-post-grid");
            if (!panel || grid?.querySelector(".profile-post-card")) return;
            if (!grid) {
              grid = document.createElement("div");
              grid.className = "profile-post-grid";
              panel.append(grid);
            }
            for (let index = 0; index < 6; index += 1) {
              const card = document.createElement("article");
              card.className = "profile-post-card";
              card.innerHTML = `<button type="button" class="profile-post-media" aria-label="Layout fixture tile ${index + 1}"><img src="/app/avatar.svg" alt=""></button><div class="profile-post-detail"><div class="profile-post-byline"><span class="profile-post-author"><img src="/app/avatar.svg" alt=""><span>Layout fixture creator</span></span></div></div>`;
              grid.append(card);
            }
            panel.querySelectorAll(".empty,#profile-posts-retry").forEach(element => element.remove());
            panel.prepend(grid);
          });
        }
        const m = await page.evaluate(() => {
          const r = s => { const el = document.querySelector(s); if (!el) return null; const b = el.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top, b: b.bottom, w: b.width, h: b.height }; };
          return {
            vw: document.documentElement.clientWidth, docW: document.documentElement.scrollWidth,
            cards: [...document.querySelectorAll(".profile-count-card[data-profile-list]")].map(c => { const b = c.getBoundingClientRect(); return { kind: c.dataset.profileList, l: b.left, r: b.right, t: b.top, b: b.bottom, w: b.width, h: b.height, faces: c.querySelectorAll(".profile-count-faces img").length, text: c.innerText }; }),
            stats: document.querySelector(".profile-stats").innerText,
            postCount: document.querySelector("[data-testid='profile-post-count']")?.innerText,
            intro: r(".profile-intro"), overview: r(".profile-overview-row"), statsRow: r(".profile-stats"),
            meta: r(".profile-meta-row"), actions: r(".profile-primary-actions"), name: r(".profile-name"),
            nameRow: r(".profile-name-row"), avatar: r(".profile-avatar"), topbar: r(".profile-topbar"),
            handle: document.querySelector(".profile-handle")?.innerText,
            note: r(".profile-note-inline"),
            more: r("#profile-actions-open"),
            moreIcon: r("#profile-actions-open .navic"),
             moreDisplay: document.querySelector("#profile-actions-open") ? getComputedStyle(document.querySelector("#profile-actions-open")).display : null,
            topShareAction: !!document.querySelector(".profile-topbar #sharep"),
            menuShareAction: !!document.querySelector("[data-profile-share]"),
            nameColor: getComputedStyle(document.querySelector(".profile-name")).color,
             hasUploadedCover: !document.querySelector(".profile-simple-hero")?.classList.contains("profile-no-cover"),
             coverDisplay: document.querySelector(".profile-cover") ? getComputedStyle(document.querySelector(".profile-cover")).display : "missing",
             profileSurface: getComputedStyle(document.querySelector(".profile-simple-hero")).backgroundColor,
            avatarLoaded: [...document.querySelectorAll(".profile-avatar")].every(img => img.complete && img.naturalWidth > 0),
            edit: r("#edit"), follow: r("#pfollow"), msg: r("#pmsg"), cover: r(".profile-cover"),
            coverImageLoaded: (() => {
              const image = document.querySelector(".profile-cover-landscape");
              return !!image && image.complete && image.naturalWidth > 0;
            })(),
            settingsAction: !!document.querySelector("#profile-actions-open"),
            menuLabel: document.querySelector("#profile-actions-open")?.getAttribute("title"),
            shareAction: !!document.querySelector("#sharep, [data-profile-share]"),
            shareButton: r("#sharep"),
            tabCount: document.querySelectorAll(".profile-section-tab").length,
            grid: (() => {
              const el = document.querySelector(".profile-post-grid");
              if (!el) return null;
              return {
                width: el.clientWidth,
                columns: getComputedStyle(el).gridTemplateColumns.split(" ").length,
                count: el.querySelectorAll(".profile-post-card").length,
                tiles: [...el.querySelectorAll(".profile-post-card")].map(card => {
                  const b = card.getBoundingClientRect();
                  return { left: b.left, top: b.top, width: b.width, height: b.height, position: getComputedStyle(card).position, style: card.getAttribute("style") };
                }),
              };
            })(),
            overflow: [...document.querySelectorAll(".profile-intro *")].filter(el => { const b = el.getBoundingClientRect(); return b.width && (b.right > innerWidth + 1 || b.left < -1); }).map(el => el.className || el.tagName).slice(0, 5),
          };
        });
        await page.screenshot({ path: resolve(shotDir, `${label}-${width}.png`) });
        assert.equal(m.cards.length, 2, `${label}@${width}: relationship totals`);
        assert.match(m.stats, /following[\s\S]*followers[\s\S]*posts/i);
        assert.match(m.postCount || "", label === "owner" ? /^6\s+Posts$/i : /^3\s+Posts$/i, `${label}@${width}: server post count`);
        assert.ok(m.cards[1].r <= m.vw + 0.5 && m.docW <= m.vw, `${label}@${width}: no horizontal overflow`);
         assert.ok(Math.abs((m.avatar.l + m.avatar.r) / 2 - m.vw / 2) < 2, `${label}@${width}: avatar is centered`);
         assert.ok(m.statsRow.t >= m.avatar.b, `${label}@${width}: stats sit beneath the avatar`);
         if (label === "owner") {
           assert.ok(m.avatar.t < m.cover.b && m.avatar.b < m.cover.b,
             `${label}@${width}: centered avatar sits within the existing uploaded cover area`);
           assert.ok(m.actions.b <= m.cover.b + 1,
             `${label}@${width}: profile actions remain over the uploaded cover`);
           assert.equal(m.hasUploadedCover, true);
           assert.equal(m.coverDisplay, "block");
         } else {
           assert.equal(m.hasUploadedCover, false, `${label}@${width}: no cover is fabricated`);
           assert.equal(m.coverDisplay, "none", `${label}@${width}: no-cover state keeps the cover hidden`);
           assert.equal(m.profileSurface, "rgb(255, 255, 255)", `${label}@${width}: no-cover profile remains clean white`);
         }
        assert.ok(m.cards.every(card => Math.abs(card.t - m.cards[0].t) < 1), `${label}@${width}: relationship totals stay on one line`);
        assert.ok(m.name.t >= m.overview.b, `${label}@${width}: display name follows the avatar and totals`);
         assert.equal(m.handle, label === "owner" ? "@fixtureowner" : "@visitortarget", `${label}@${width}: handle sits under the profile name`);
          assert.ok(Math.abs((m.name.l + m.name.r) / 2 - m.vw / 2) < 2, `${label}@${width}: profile name is centered under the avatar`);
         assert.ok(m.more && m.more.w >= 38 && m.moreIcon?.w >= 16 && m.moreDisplay !== "none",
           `${label}@${width}: existing profile actions menu remains visible and tappable`);
         assert.equal(m.topShareAction, false, `${label}@${width}: header share icon is removed`);
         assert.equal(m.nameColor, label === "owner" ? "rgb(255, 255, 255)" : "rgb(23, 25, 29)",
           `${label}@${width}: profile name remains legible for its cover state`);
        assert.deepEqual(m.overflow, [], `${label}@${width}: no header element escapes the viewport`);
        assert.ok(m.cards.every(c => c.h >= 54), `${label}@${width}: compact count cards`);
        assert.equal(m.avatarLoaded, true, `${label}@${width}: primary avatar loads and is visible`);
         if (label === "owner") {
           assert.ok(m.cover.h > 0, `${label}@${width}: stored cover remains visible behind the profile header`);
           assert.equal(m.coverImageLoaded, true, `${label}@${width}: uploaded cover image is displayed`);
         } else {
           assert.equal(m.cover.h, 0, `${label}@${width}: no-cover header has no visible cover frame`);
         }
         if (label === "owner") {
           assert.ok(m.note && m.note.b <= m.avatar.t + 1, `${label}@${width}: existing note appears as a bubble above the avatar`);
         }
        assert.doesNotMatch(m.stats, /likes|saves|views/i, `${label}@${width}: no aggregate engagement metrics`);
        assert.equal(m.tabCount, 4, `${label}@${width}: existing profile tabs remain available`);
        if (label === "owner") {
          assert.deepEqual(m.cards.map(c => c.faces), [0, 0], "owner relation preview faces are intentionally omitted");
          assert.ok(m.edit && m.edit.w > 0, "owner retains Edit profile");
           assert.ok(m.actions.t >= m.statsRow.b, "owner Edit and Share buttons sit directly under the counts");
           assert.ok(m.edit.t >= m.actions.t && m.edit.b <= m.actions.b, "Edit profile sits in the owner action row");
           assert.ok(m.shareButton && m.shareButton.t >= m.actions.t && m.shareButton.b <= m.actions.b, "Share profile sits beside Edit profile");
           assert.equal(await page.locator("#sharep .navic").count(), 0, "owner Share profile button is text-only");
          assert.equal(m.follow, null, "owner has no visitor Follow action");
          assert.equal(m.msg, null, "owner has no visitor Message action");
           assert.equal(m.menuShareAction, false, "owner share button is not duplicated in the settings menu");
          assert.equal(m.menuLabel, "Settings", "owner retains Settings action");
          const expectedColumns = width < 700 ? 2 : width < 1100 ? 3 : 4;
          assert.equal(m.grid?.columns, expectedColumns, `${label}@${width}: gallery columns adapt to available width`);
          assert.equal(m.grid?.count, 6, `${label}@${width}: all fixture media tiles render`);
          assert.ok(m.grid.tiles.every(tile => tile.width > 0 && tile.height > 0), `${label}@${width}: every masonry tile has visible media and details`);
          assert.notEqual(m.grid.tiles[0].left, m.grid.tiles[1].left,
            `${label}@${width}: the first pair spans separate masonry columns; ${JSON.stringify(m.grid.tiles)}`);
        } else {
          assert.deepEqual(m.cards.map(c => c.faces), [0, 0], "visitor totals do not depend on relation previews");
          assert.match(m.cards.find(c => c.kind === "followers")?.text || "", /^7\s+Followers$/i, `${label}@${width}: visitor follower count replaces incomplete cached totals`);
          assert.match(m.cards.find(c => c.kind === "following")?.text || "", /^5\s+Following$/i, `${label}@${width}: visitor following count replaces incomplete cached totals`);
          assert.ok(m.follow && m.msg && m.follow.t === m.msg.t, "Follow and Message sit on one row");
          assert.equal(m.edit, null, "visitor does not see Edit profile");
           assert.equal(m.shareButton, null, "visitor has no top-level share icon");
           assert.ok(m.shareAction && m.menuShareAction, "visitor retains Share profile in the existing menu");
          assert.equal(m.menuLabel, "Profile actions", "visitor retains the profile actions menu");
          assert.match(await page.locator("#pfollow").innerText(), /^Follow$/i, "visitor sees Follow state");
           assert.ok(m.actions.t > m.meta.b, `${label}@${width}: visitor actions follow their interest/details row`);
          assert.ok(Math.abs(m.follow.w - m.msg.w) < 1.5, `${label}@${width}: visitor actions share the owner action row evenly (${JSON.stringify({ follow: m.follow, message: m.msg, row: m.actions })})`);
          assert.ok(m.follow.h >= 48 && m.msg.h >= 48, `${label}@${width}: visitor actions remain easy to tap`);
           await page.locator("#profile-actions-open").click();
           await page.locator("[data-profile-share]").waitFor({ state: "visible" });
            if (width === 390) {
              await page.locator("[data-profile-share]").click();
              await page.locator(".ps-card").waitFor({ state: "visible" });
              const codeCard = await page.evaluate(() => {
                const avatar = document.querySelector(".ps-avatar img");
                const identity = document.querySelector(".ps-ident");
                const share = document.querySelector('[data-act="share"]');
                return {
                  avatarSrc: avatar?.getAttribute("src") || "",
                  avatarLoaded: (avatar?.naturalWidth || 0) > 0,
                  identityDisplay: identity ? getComputedStyle(identity).display : "",
                  identityAlignment: identity ? getComputedStyle(identity).justifyItems : "",
                  hasShareArrow: !!share?.querySelector("svg"),
                  shareText: share?.textContent?.trim() || "",
                };
              });
              assert.ok(codeCard.avatarSrc.endsWith("/app/avatar.svg") && codeCard.avatarLoaded,
                "the profile code uses the account's actual avatar");
              assert.equal(codeCard.identityDisplay, "grid");
              assert.equal(codeCard.identityAlignment, "center");
              assert.equal(codeCard.hasShareArrow, false, "Share has no stray arrow icon");
              assert.equal(codeCard.shareText, "Share");
              await page.screenshot({ path: "/tmp/oldtime-profile-code-390.png" });
              await page.locator('.ps-icon-btn[data-act="back"]').click();
              await page.locator(".ps-dialog").waitFor({ state: "detached" });
            }
        }
        assert.ok(!m.meta || m.meta.t > m.cards[0].b, `${label}@${width}: optional profile details follow the totals`);
      }
      assert.deepEqual(errors, [], "no page errors");
      await context.close();
    }
    // Every non-GET was intercepted with 503 (nothing reached a server). Analytics collection and realtime tickets are expected.
    assert.deepEqual([...new Set(writes.map(u => new URL(u).pathname))]
      .filter(path => !["/api/realtime/ticket", "/api/analytics/resources"].includes(path)), [], "no profile/relationship writes attempted");
  } finally {
    await browser?.close();
    await server.close();
  }
});
