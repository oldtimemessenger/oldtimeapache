import { isDefaultAvatarMediaReference } from "./story-media.js";

const fallbackEsc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function safeUrl(url) {
  const u = String(url ?? "").trim();
  if (!u) return "";
  if (/^(https?:|blob:)/i.test(u)) return u;
  if (/^data:image\//i.test(u)) return u;
  if (/^[a-z][a-z0-9+.-]*:/i.test(u) || u.startsWith("//")) return "";
  return u;
}

const isLocalMediaReference = value => {
  const reference = String(value ?? "").trim();
  return reference.startsWith("oldtime-media:") && reference.length > "oldtime-media:".length && !/[\s"'<>]/.test(reference);
};

function mediaAttributes(url, ownerId, e) {
  const reference = String(url ?? "").trim();
  if (isLocalMediaReference(reference)) {
    return `data-local-media="${e(reference)}"${ownerId ? ` data-local-media-owner="${e(ownerId)}"` : ""}`;
  }
  const safe = safeUrl(reference);
  return safe ? `src="${e(safe)}"` : "";
}

function postOwnerId(post = {}) {
  const author = post.author;
  return String((author && typeof author === "object" ? author.id : "") || post.authorId || (typeof author === "string" ? author : ""));
}

function postImage(post) {
  const p = post || {};
  const m = Array.isArray(p.media) ? p.media[0] : null;
  const mediaImage = m && typeof m === "object"
    ? m.poster || m.thumbnailReference || m.thumbnail || m.reference || m.url || m.src
    : m;
  const image = p.thumbnail || p.poster || p.image || p.cover || p.url ||
    mediaImage || "";
  const reference = String(image ?? "").trim();
  return isDefaultAvatarMediaReference(reference) || (!isLocalMediaReference(reference) && !safeUrl(reference)) ? "" : reference;
}

function thumb(url, e, cls = "", ownerId = "") {
  const attributes = mediaAttributes(url, ownerId, e);
  return attributes ? `<img class="ss-thumb ${cls}" ${attributes} alt="" loading="lazy" decoding="async">` : `<span class="ss-thumb ${cls}" aria-hidden="true"></span>`;
}

export function relativePostAge(value) {
  const raw = String(value ?? "").trim();
  const parsed = typeof value === "number" ? value : /^\d+(?:\.\d+)?$/.test(raw) ? Number(raw) : Date.parse(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return "";
  const timestamp = parsed < 1e12 ? parsed * 1000 : parsed;
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

export function shareMetricCount(value, fallback) {
  const count = value == null ? (Array.isArray(fallback) ? fallback.length : null) : Number(value);
  return Number.isSafeInteger(count) && count >= 0 ? count.toLocaleString("en-US") : null;
}

export function renderSavedSheet({ post = {}, author = {}, saved = false, esc = fallbackEsc, icons = {} } = {}) {
  const e = esc || fallbackEsc;
  const id = e(post.id ?? "");
  return `<section class="panel saved-social-panel" role="dialog" aria-modal="true" aria-labelledby="saved-sheet-title" data-post-id="${id}">
    <div class="ss-grab" aria-hidden="true"></div>
    <header class="ss-head">
      ${thumb(postImage(post), e, "", postOwnerId(post))}
      <span class="ss-text"><b id="saved-sheet-title">Saved</b><small>Private</small></span>
      <button type="button" class="ss-save${saved ? " on" : ""}" data-saved-toggle aria-pressed="${!!saved}" aria-label="${saved ? "Remove from saved" : "Save"}">${saved ? (icons.mediaBookmarkOn || icons.bookmarkOn || "") : (icons.mediaBookmark || icons.bookmark || "")}</button>
      <button type="button" class="ss-close" data-social-sheet-close aria-label="Close">${icons.close || ""}</button>
    </header>
    <div class="ss-body">
      <p class="ss-description">Saved privately to your account.</p>
    </div>
  </section>`;
}

export function renderSharePeople({friends=[],selectedFriends=[],loading=false,failed=false,busy=false,esc=fallbackEsc,icons={}}={}) {
  const e=esc||fallbackEsc;
  const recipientList = friends.map(friend => {
    const unavailable = friend.unavailable === true;
    const name = String(friend.name || friend.username || "Friend");
    const username = String(friend.username || name);
    const selected = selectedFriends.map(String).includes(String(friend.id));
    const searchValue = `${name} ${username}`.toLowerCase();
    const avatar=mediaAttributes(isDefaultAvatarMediaReference(friend.avatar) ? "" : friend.avatar, friend.id, e);
    const face = `<span class="srp-avatar srp-initial" aria-hidden="true">${e(name.slice(0,1).toUpperCase())}</span>${avatar?`<img class="srp-avatar" ${avatar} alt="" width="64" height="64" loading="lazy" decoding="async">`:""}`;
    return `<li class="srp-cell" data-share-cell data-search="${e(searchValue)}">
      <label class="srp-friend ${unavailable ? "srp-off" : ""}">
        <input type="checkbox" data-share-friend value="${e(friend.id)}" aria-label="Share with @${e(username)}" ${selected ? "checked" : ""} ${unavailable||busy ? "disabled" : ""}>
        <span class="srp-face">${face}<span class="srp-badge">${icons.check || ""}</span></span>
        <span class="srp-name">${e(name)}</span>
      </label>
      ${unavailable ? `<small class="srp-reason">Can’t view this post</small>` : ""}
    </li>`;
  }).join("");
  const skeleton=loading&&!friends.length?Array.from({length:4},()=>`<li class="srp-placeholder" aria-hidden="true"><span></span><i></i></li>`).join(""):"";
  return `<ul class="srp-grid" aria-label="People to share with">${recipientList}${skeleton}</ul>
    <div class="srp-empty" ${friends.length||loading||failed?"hidden":""}><b>No contacts yet</b><span>Start a conversation to see people here.</span></div>
    <p class="srp-empty" data-share-no-matches hidden>No matching contacts.</p>
    ${failed?`<p class="srp-contacts-retry" role="status">${friends.length?"Some contacts couldn’t refresh.":"Couldn’t load contacts."}<button type="button" data-share-refresh>Try again</button></p>`:""}`;
}

export function renderShareSheet({
  post = {}, author = {}, friends = [], view = "share", friendsMode = false,
  selectedFriends = [], friendSearch = "", friendMessage="", reposted = false,
  canRepost = false, canStory=false, canCopy=false, canExternal=false,
  peopleLoading=false,peopleError=false,sending=false,viewerId="",communityPost=false,esc = fallbackEsc, icons = {}
} = {}) {
  const e=esc||fallbackEsc,id=e(post.id??"");
  const currentView=["messages","more"].includes(view)?view:"share";
  const image=postImage(post);
  const caption=String(post.caption||post.text||"").trim();
  const authorUsername=String(author.username||post.authorUsername||post.username||"").replace(/^@/,"");
  const authorName=String(author.name||authorUsername||"Oldtime member");
  const authorHandle=authorUsername?`@${authorUsername}`:"";
  const authorAvatar=mediaAttributes(
    isDefaultAvatarMediaReference(author.avatar)?"":author.avatar,
    author.id||postOwnerId(post),
    e
  );
  const creatorImage=authorAvatar
    ? `<img class="srp-share-avatar" ${authorAvatar} alt="" width="38" height="38" loading="lazy" decoding="async">`
    : `<span class="srp-share-avatar srp-share-avatar-empty" aria-hidden="true">${icons.user||""}</span>`;
  const textOnlyPost=!image&&post.kind!=="video"&&Boolean(caption);
  const communityTextSnapshot=communityPost&&textOnlyPost;
  const snapshotAge=relativePostAge(post.created||post.createdAt);
  const snapshotLikes=shareMetricCount(post.likeCount,post.likes);
  const snapshotReposts=shareMetricCount(post.repostCount??post.remixCount,post.reposts);
  const snapshotComments=shareMetricCount(post.commentCount,post.comments);
  const snapshotViews=Number.isSafeInteger(post.measuredViews)&&post.measuredViews>=0
    ? post.measuredViews.toLocaleString("en-US") : null;
  const isLiked=post.likedByMe===true||(viewerId&&Array.isArray(post.likes)&&post.likes.map(String).includes(String(viewerId)));
  const isReposted=post.repostedByMe===true||(viewerId&&Array.isArray(post.reposts)&&post.reposts.map(String).includes(String(viewerId)));
  const isSaved=post.savedByMe===true||(viewerId&&Array.isArray(post.saves)&&post.saves.map(String).includes(String(viewerId)));
  const snapshotMetric=(type,label,icon,count,active=false)=>{
    const spokenLabel=count===null?label:`${count} ${count==="1"?label.replace(/s$/,""):label}`;
    return icon
    ? `<span class="srp-snapshot-metric srp-snapshot-${type}${active?" is-active":""}" data-snapshot-metric="${type}" aria-label="${e(spokenLabel)}">${icon}${count===null?"":`<b>${e(count)}</b>`}</span>`
    : "";
  };
  const snapshotActions=[
    snapshotMetric("like","likes",isLiked?(icons.heartOn||icons.heart):(icons.heart||""),snapshotLikes,Boolean(isLiked)),
    snapshotMetric("repost","reposts",icons.repost||"",snapshotReposts,Boolean(isReposted)),
    snapshotMetric("comment","comments",icons.comment||"",snapshotComments),
    snapshotMetric("views","views",icons.viewBars||"",snapshotViews),
    snapshotMetric("save",isSaved?"Saved":"Save",isSaved?(icons.bookmarkOn||icons.bookmark):(icons.bookmark||""),null,Boolean(isSaved)),
    snapshotMetric("share","Share",icons.share||"",null),
  ].filter(Boolean).join("");
  const textSnapshot=communityTextSnapshot?`<div class="srp-text-snapshot" aria-label="Community post preview">
    <header class="srp-snapshot-author">${creatorImage}<span><b>${e(authorName)}</b><small>${e(authorHandle)}${snapshotAge?` · ${e(snapshotAge)}`:""}</small></span></header>
    <p class="srp-snapshot-copy">${e(caption)}</p>
    ${snapshotActions?`<div class="srp-snapshot-actions" aria-label="Post activity">${snapshotActions}</div>`:""}
  </div>`:"";
  const mediaPreview=image
    ? `<div class="srp-share-media">${thumb(image,e,"srp-share-image",postOwnerId(post))}${post.kind==="video"?`<span class="srp-share-media-type">${icons.play||""}Video</span>`:""}</div>`
    : post.kind==="video"
      ? `<div class="srp-share-media srp-share-media-empty">${icons.video||""}<span>Video post</span></div>`
      : caption
        ? `<div class="srp-share-text-card"><p>${e(caption)}</p></div>`
        : `<div class="srp-share-text-card"><p>Post on Oldtime</p></div>`;
  const preview=communityTextSnapshot
    ? `<article class="srp-share-preview srp-share-text-preview">${textSnapshot}</article>`
    : `<article class="srp-share-preview">
      ${mediaPreview}
      <div class="srp-share-detail">
        <div class="srp-share-creator">${creatorImage}<span><b>${e(authorName)}</b>${authorHandle?`<small>${e(authorHandle)}</small>`:""}</span></div>
        ${image&&caption?`<p class="srp-share-caption">${e(caption)}</p>`:""}
      </div>
    </article>`;
  const compactPreview=communityTextSnapshot?textSnapshot:`<div class="srp-share-compact">
    ${image?thumb(image,e,"srp-share-compact-thumb",postOwnerId(post)):`<span class="srp-share-compact-icon" aria-hidden="true">${post.kind==="video"?(icons.video||""):(icons.image||"")}</span>`}
    <span><b>${e(authorName)}</b><small>${e(authorHandle||"Post on Oldtime")}${caption?` · ${e(caption)}`:""}</small></span>
  </div>`;
  return `<section class="panel share-recipient-panel${currentView==="share"?" srp-main-view":""}${communityPost?" srp-community-share":""}" role="dialog" aria-modal="true" aria-labelledby="share-sheet-title" data-post-id="${id}">
    <div class="srp-grab" aria-hidden="true"></div>
    <header class="srp-head">
      <span class="srp-head-leading">
        ${currentView!=="share"?`<button type="button" class="srp-back" data-share-back aria-label="Back to sharing">${icons.back||""}</button>`:""}
      </span>
      <h2 id="share-sheet-title">${currentView==="messages"?"Send to people":currentView==="more"?"More options":"Share post"}</h2>
      <span class="srp-head-actions">
        ${currentView==="messages"?`<button type="button" class="srp-search-trigger" data-share-friends aria-label="${friendsMode?"Hide search":"Search people"}" aria-expanded="${friendsMode}">${icons.search||""}</button>`:""}
        <button type="button" class="srp-close" data-social-sheet-close aria-label="Close">${icons.close||""}</button>
      </span>
    </header>
    ${currentView==="share"?`<div class="srp-body srp-share-body">
      ${preview}
      <p class="srp-error" data-sheet-error role="alert"></p>
      <h3 class="srp-section-label">Share with</h3>
      <div class="srp-share-destinations" role="group" aria-label="Share options">
        <button type="button" class="srp-destination srp-destination-primary" data-share-messages>
          <span class="srp-destination-icon">${icons.messages||""}</span><span>Messages</span>
        </button>
        ${canStory?`<button type="button" class="srp-destination" data-share-story>
          <span class="srp-destination-icon">${icons.camera||""}</span><span>Add to Story</span>
        </button>`:""}
        ${canCopy?`<button type="button" class="srp-destination" data-share-copylink>
          <span class="srp-destination-icon"><svg class="navic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m9 15 6-6M7.5 10.5l-2 2a4.2 4.2 0 0 0 6 6l2-2M10.5 7.5l2-2a4.2 4.2 0 0 1 6 6l-2 2"/></svg></span><span>Copy link</span>
        </button>`:""}
        ${canExternal?`<button type="button" class="srp-destination" data-share-external>
          <span class="srp-destination-icon">${icons.share||""}</span><span>Other apps</span>
        </button>`:""}
        ${canRepost?`<button type="button" class="srp-destination" data-share-more>
          <span class="srp-destination-icon">${icons.more||""}</span><span>More</span>
        </button>`:""}
      </div>
    </div>`:currentView==="messages"?`<div class="srp-body srp-message-body">
      ${compactPreview}
      <h3 class="srp-section-label">People to share with</h3>
      <label class="srp-search" ${friendsMode?"":"hidden"}>
        <span class="srp-searchic" aria-hidden="true">${icons.search||""}</span>
        <input type="search" data-share-search placeholder="Search people" autocomplete="off" value="${e(friendSearch)}" aria-label="Search people">
      </label>
      <div class="srp-people" data-share-people aria-busy="${peopleLoading}">
        ${renderSharePeople({friends,selectedFriends,loading:peopleLoading,failed:peopleError,busy:sending,esc:e,icons})}
      </div>
      <p class="srp-error" data-sheet-error role="alert"></p>
    </div>`:`<div class="srp-body srp-more-body">
      ${compactPreview}
      <div class="srp-more-list" role="group" aria-label="More sharing options">
        ${canRepost?`<button type="button" class="srp-more-option" data-share-repost aria-pressed="${reposted}" aria-label="${reposted?"Remove repost":"Repost to followers"}">
          <span class="srp-more-icon">${icons.repost||""}</span><span><b>${reposted?"Remove repost":"Repost to followers"}</b><small>${reposted?"Undo your repost":"Share this post with your followers"}</small></span><span class="srp-more-chevron">${icons.chevronRight||""}</span>
        </button>`:""}
      </div>
      <p class="srp-error" data-sheet-error role="alert"></p>
    </div>`}
    <div class="srp-compose" ${currentView==="messages"&&selectedFriends.length?"":"hidden"}>
      <div class="srp-compose-field">
        <textarea data-share-message rows="1" maxlength="500" placeholder="Add a message (optional)" aria-label="Optional message">${e(friendMessage)}</textarea>
        <button type="button" class="srp-send" data-share-submit aria-label="${sending?"Sending message":selectedFriends.length?`Send via chat to ${selectedFriends.length} ${selectedFriends.length===1?"person":"people"}`:"Send via chat"}" ${!selectedFriends.length||sending?"disabled":""}>
          <span class="srp-send-icon" aria-hidden="true">${icons.send||""}</span>
        </button>
      </div>
    </div>
  </section>`;
}
