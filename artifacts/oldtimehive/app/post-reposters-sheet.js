import { api, requestCloudApi } from "./store.js";

export const REPOSTERS_PAGE = 20;
export const REPOSTERS_MAX = 1000;

export function mergeReposters(current, page) {
  const seen = new Set(current.map(person => person.id));
  const merged = [...current];
  for (const person of Array.isArray(page) ? page : []) {
    if (!person?.id || seen.has(person.id) || merged.length >= REPOSTERS_MAX) continue;
    seen.add(person.id);
    merged.push(person);
  }
  return merged;
}

export const canLoadMoreReposters = (people, hasMore) =>
  hasMore === true && people.length < REPOSTERS_MAX;

function initials(person) {
  return String(person.displayName || person.username || "")
    .split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
}

export function openPostReposters(postId, {
  sheet, esc, icons, count = 0, onProfile, onClose,
} = {}) {
  if (!sheet || !postId) return;
  const ownerId = api.me()?.id;
  const returnFocus = document.activeElement;
  let live = true, people = [], offset = 0, total = Number(count) || 0;
  let hasMore = false, loading = false, error = "";
  const current = () => live && sheet.querySelector("[data-reposters-sheet]");
  const close = () => {
    if (!live) return;
    live = false;
    sheet.classList.remove("on");
    sheet.innerHTML = "";
    sheet.onclick = sheet.onkeydown = null;
    onClose?.();
    if (returnFocus?.isConnected) returnFocus.focus?.();
  };

  sheet.classList.add("on");
  sheet.innerHTML = `<section class="panel comment-panel likes-panel reposters-panel" data-reposters-sheet="${esc(postId)}" role="dialog" aria-modal="true" aria-label="People who reposted" tabindex="-1">
    <div class="grab" aria-hidden="true"></div>
    <div class="comment-toolbar likes-head"><b>Reposts</b><span class="likes-total" data-reposters-total>${total ? `${esc(String(total))} ${total === 1 ? "repost" : "reposts"}` : ""}</span>
      <button type="button" class="comment-close" data-reposters-close aria-label="Close reposts">${icons.close}</button></div>
    <div class="comment-list likes-list" data-reposters-list aria-live="polite"></div></section>`;
  sheet.querySelector("[data-reposters-close]").onclick = close;
  sheet.onclick = event => { if (event.target === sheet) close(); };
  sheet.onkeydown = event => { if (event.key === "Escape") close(); };
  sheet.querySelector("[data-reposters-sheet]").focus();

  const draw = () => {
    if (!current()) return;
    const list = sheet.querySelector("[data-reposters-list]");
    const rows = people.map(person => {
      const localId = api.cloudAuthorId(person);
      const avatar = person.avatar
        ? `<img class="comment-avatar" src="${esc(person.avatar)}" alt="" loading="lazy" />`
        : `<span class="comment-avatar reposters-avatar-fallback" aria-hidden="true">${esc(initials(person))}</span>`;
      return `<button type="button" class="likes-row reposters-row" data-reposters-profile="${esc(localId)}">
        ${avatar}<span><b>${esc(person.displayName || person.username)}</b><small>@${esc(person.username)}</small></span></button>`;
    }).join("");
    const tail = loading
      ? `<div class="likes-skel" aria-hidden="true"></div><div class="likes-skel" aria-hidden="true"></div>`
      : error
        ? `<div class="comment-status" role="alert">${esc(error)}</div><button type="button" class="comment-retry" data-reposters-retry>Try again</button>`
        : canLoadMoreReposters(people, hasMore)
          ? `<button type="button" class="comment-retry" data-reposters-more>View more</button>`
          : "";
    list.innerHTML = rows + tail || `<div class="comment-empty">No reposts to show.</div>`;
    list.querySelectorAll("[data-reposters-profile]").forEach(button => {
      button.onclick = () => {
        const id = button.dataset.repostersProfile;
        close();
        onProfile?.(id);
      };
    });
    list.querySelector("[data-reposters-more]")?.addEventListener("click", load);
    list.querySelector("[data-reposters-retry]")?.addEventListener("click", load);
  };

  async function load() {
    if (loading || !current()) return;
    loading = true;
    error = "";
    draw();
    try {
      const response = await requestCloudApi(
        `/api/posts/${encodeURIComponent(postId)}/reposts?limit=${REPOSTERS_PAGE}&offset=${offset}`,
      );
      if (!current()) return;
      if (api.me()?.id !== ownerId) { close(); return; }
      if (!Array.isArray(response?.reposts)) throw new Error("The repost list response was invalid.");
      const page = response.reposts
        .filter(person => person?.id && person?.username)
        .map(person => ({ ...person, localId: api.cloudAuthorId(person) }));
      people = mergeReposters(people, page);
      total = Number.isInteger(response.total) && response.total >= 0 ? response.total : total;
      hasMore = response.hasMore === true;
      offset = Number.isInteger(response.nextOffset) && response.nextOffset > offset
        ? response.nextOffset
        : offset + page.length;
      if (!page.length) hasMore = false;
      sheet.querySelector("[data-reposters-total]").textContent =
        `${total} ${total === 1 ? "repost" : "reposts"}`;
    } catch (failure) {
      if (current()) error = failure?.message || "Reposts could not load.";
    } finally {
      loading = false;
      draw();
    }
  }

  void load();
}
