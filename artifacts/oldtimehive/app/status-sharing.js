import { api } from "./store.js";
import { findSharedComment } from "./shared-content.js";
import { relativePostAge, shareMetricCount } from "./saved-sheets.js";
import { mediaUrl } from "./local-media.js";

const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export function sharedStatusTarget(text) {
  try {
    const url = new URL(String(text).trim());
    if (!["https:", "http:"].includes(url.protocol)) return null;
    const postId = /^\/p\/([^/]+)\/?$/.exec(url.pathname)?.[1] || url.searchParams.get("post");
    const commentId = url.searchParams.get("comment") || "";
    return UUID.test(postId || "") && (!commentId || UUID.test(commentId)) ? { postId, commentId } : null;
  } catch { return null; }
}

export function validateStatusShare(postId, commentId = "") {
  const post = api.post(postId);
  if (!post || !api.canSeePost(post)) throw new Error("This post is no longer available.");
  if (!api.canSeePost(post, null)) throw new Error("Only public posts can be shared to Status.");
  if (commentId && !findSharedComment(post, commentId)) throw new Error("This comment is no longer available.");
  return post;
}

export function statusShareMedia(post, commentId = "") {
  if (commentId || !post || typeof post !== "object") return null;
  const candidates = Array.isArray(post.media)
    ? post.media
    : Array.isArray(post.photos)
      ? post.photos
      : post.media ? [post.media] : [];
  const asset = candidates[0];
  const media = typeof asset === "string"
    ? asset
    : typeof asset?.reference === "string" ? asset.reference
      : typeof asset?.url === "string" ? asset.url
        : typeof asset?.src === "string" ? asset.src : "";
  if (!media) return null;
  const contentType = String(post.mediaTypes?.[0] || asset?.contentType || asset?.mimeType || "").toLowerCase();
  const isVideo = post.kind === "video" || contentType.startsWith("video/") || /\.(mp4|webm|mov)(\?|#|$)/i.test(media);
  const posterCandidate = post.mediaPosters?.[0] || asset?.thumbnailReference || asset?.poster || asset?.thumbnail || "";
  const poster = typeof posterCandidate === "string" ? posterCandidate : "";
  return { media, kind: isVideo ? "video" : "image", poster };
}

function wrapSnapshotText(context, text, maxWidth) {
  const lines = [];
  let line = "";
  for (const word of String(text || "").replace(/\n/g, " \n ").split(/\s+/).filter(Boolean)) {
    if (word === "\n") {
      if (line) lines.push(line);
      line = "";
      continue;
    }
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else line = candidate;
  }
  if (line) lines.push(line);
  const clipped = lines.length > 5;
  const visible = lines.slice(0, 5);
  if (clipped && visible.length) visible[visible.length - 1] = `${visible.at(-1).replace(/…$/, "")}…`;
  return visible;
}

async function snapshotIcon(svg, color) {
  if (!svg || typeof Image === "undefined") return null;
  const markup = String(svg).replace(/<svg\b/, '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"')
    .replaceAll("currentColor", color)
    .replace(/\sclass="[^"]*"/, "");
  const image = new Image();
  const decoded = new Promise(resolve => {
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener("error", () => resolve(null), { once: true });
  });
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  return decoded;
}

function roundedRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

async function drawCommunityPostSnapshot(post, author, avatar, viewerId, icons) {
  const width = 960, padding = 36, avatarSize = 100, gap = 32;
  const bodyTop = padding + avatarSize + gap, lineHeight = 60, iconSize = 50;
  const canvas = document.createElement("canvas");
  const measure = canvas.getContext("2d");
  if (!measure) throw new Error("Couldn't prepare the post preview.");
  measure.font = "400 42px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  const body = String(post.caption || post.text || "").trim().slice(0, 320) || "Post on Oldtime";
  const lines = wrapSnapshotText(measure, body, width - padding * 2);
  const viewer = String(viewerId || "");
  const isLiked = post.likedByMe === true || Boolean(viewer && Array.isArray(post.likes) && post.likes.map(String).includes(viewer));
  const isReposted = post.repostedByMe === true || Boolean(viewer && Array.isArray(post.reposts) && post.reposts.map(String).includes(viewer));
  const isSaved = post.savedByMe === true || Boolean(viewer && Array.isArray(post.saves) && post.saves.map(String).includes(viewer));
  const specs = [
    { icon: isLiked ? icons.heartOn || icons.heart : icons.heart, count: shareMetricCount(post.likeCount, post.likes), color: isLiked ? "#d91f5b" : "#707782" },
    { icon: icons.repost, count: shareMetricCount(post.repostCount ?? post.remixCount, post.reposts), color: "#707782" },
    { icon: icons.comment, count: shareMetricCount(post.commentCount, post.comments), color: "#707782" },
    { icon: icons.viewBars, count: Number.isSafeInteger(post.measuredViews) && post.measuredViews >= 0 ? post.measuredViews.toLocaleString("en-US") : null, color: "#707782" },
    { icon: isSaved ? icons.bookmarkOn || icons.bookmark : icons.bookmark, count: null, color: isSaved ? "#1456d9" : "#707782" },
    { icon: icons.share, count: null, color: "#707782" },
  ];
  const metrics = (await Promise.all(specs.map(async metric => ({
    ...metric,
    image: await snapshotIcon(metric.icon, metric.color),
  })))).filter(metric => metric.image);
  const height = Math.max(340, bodyTop + lines.length * lineHeight + gap + iconSize + padding);
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Couldn't prepare the post preview.");
  context.fillStyle = "#ffffff";
  roundedRect(context, 1, 1, width - 2, height - 2, 42);
  context.fill();
  context.strokeStyle = "#e1e4e8";
  context.lineWidth = 2;
  context.stroke();

  const avatarX = padding, avatarY = padding;
  context.save();
  context.beginPath();
  context.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  context.clip();
  if (avatar && (avatar.naturalWidth || avatar.width)) {
    context.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
  } else {
    context.fillStyle = "#edf0f4";
    context.fillRect(avatarX, avatarY, avatarSize, avatarSize);
    context.fillStyle = "#68717d";
    context.font = "700 34px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(String(author.name || author.username || "O").trim().slice(0, 1).toUpperCase(), avatarX + avatarSize / 2, avatarY + avatarSize / 2);
  }
  context.restore();
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.fillStyle = "#17191d";
  context.font = "700 35px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  const textX = padding + avatarSize + 25;
  context.fillText(String(author.name || author.username || "Oldtime member"), textX, padding + 49, width - padding - textX);
  context.fillStyle = "#747b85";
  context.font = "400 30px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  const handle = author.username ? `@${String(author.username).replace(/^@/, "")}` : "Oldtime member";
  const age = relativePostAge(post.created || post.createdAt);
  context.fillText(`${handle}${age ? ` · ${age}` : ""}`, textX, padding + 82, width - padding - textX);

  context.fillStyle = "#17191d";
  context.font = "400 42px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  context.textBaseline = "top";
  lines.forEach((line, index) => context.fillText(line, padding, bodyTop + index * lineHeight, width - padding * 2));
  context.textBaseline = "middle";
  context.font = "500 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  const metricWidths = metrics.map(metric => iconSize + (metric.count === null ? 0 : 12 + context.measureText(metric.count).width));
  const totalMetricWidth = metricWidths.reduce((sum, item) => sum + item, 0);
  const metricGap = metrics.length > 1 ? Math.max(9, (width - padding * 2 - totalMetricWidth) / (metrics.length - 1)) : 0;
  let metricX = padding;
  const metricY = height - padding - iconSize;
  metrics.forEach((metric, index) => {
    context.drawImage(metric.image, metricX, metricY, iconSize, iconSize);
    metricX += iconSize;
    if (metric.count !== null) {
      context.fillStyle = metric.color;
      context.fillText(metric.count, metricX + 12, metricY + iconSize / 2, width - padding - metricX);
      metricX += 12 + context.measureText(metric.count).width;
    }
    if (index < metrics.length - 1) metricX += metricGap;
  });
  return canvas;
}

// Reuse the existing renderer for attribution and comment cards. Flatten only
// the card, not the source video: Status keeps the original moving background.
export async function prepareStatusShare(postId, commentId = "", { communityPost = false, viewerId = "", icons = {} } = {}) {
  const post = validateStatusShare(postId, commentId);
  const [{ createProject, createLayer }, { CreativeAssets, drawProject }, { commentSource, resolveCommentSource }] = await Promise.all([
    import("./creative-project.js"), import("./creative-renderer.js"), import("./creative-content.js"),
  ]);
  const source = commentId ? commentSource(postId, commentId) : null;
  const authorSource = post.author && typeof post.author === "object" ? post.author : {};
  const authorId = source?.commentAuthorId || authorSource.id || post.authorId
    || (typeof post.author === "string" ? post.author : "");
  const author = (authorId && api.user(authorId)) || {
    ...authorSource,
    username: authorSource.username || post.authorUsername || "",
    name: authorSource.name || authorSource.displayName || post.authorName || "",
    avatar: authorSource.avatar || authorSource.avatarReference || post.authorAvatar || "",
  };
  const sourceMedia = statusShareMedia(post, commentId);
  const media = sourceMedia?.media || "";
  const assets = new CreativeAssets();
  let canvas = null;
  try {
    let avatarReference = author.avatar || author.avatarReference || author.avatarUrl || "";
    if (/^oldtime-media:[\w-]+$/i.test(String(avatarReference))) {
      avatarReference = await mediaUrl(avatarReference).catch(() => "");
    }
    const avatar = avatarReference ? await assets.load(avatarReference).catch(() => null) : null;
    const project = createProject();
    if (communityPost && !commentId && !media && post.kind !== "video") {
      canvas = await drawCommunityPostSnapshot(post, author, avatar, viewerId, icons);
      project.background = { kind: "color", color: "#ffffff", media: "" };
      project.layers = [createLayer("image", {
        media: canvas.toDataURL("image/png"),
        width: canvas.width,
        height: canvas.height,
        x: .5,
        y: .5,
        scale: 1,
        statusOverlay: true,
      })];
      return { initialProject: project, validateSource: () => validateStatusShare(postId, commentId) };
    }

    const card = createProject(source);
    card.background.color = "rgba(0,0,0,0)";
    if (source) {
      Object.assign(card.layers[0], { x: .5, y: .5, scale: 1, width: 880 });
    } else {
      const caption = String(post.caption || "").slice(0, 320);
      card.layers = [
        createLayer("text", { text: author.username ? `@${String(author.username).replace(/^@/, "")}` : (author.name || "Oldtime member"), x: .5, y: .13, width: 900, fontSize: 48, bold: true, shadow: !!media, color: media ? "#ffffff" : "#17191c" }),
        ...(caption ? [createLayer("text", { text: caption, x: .5, y: media ? .82 : .5, width: 900,
          fontSize: media ? 40 : 52, shadow: !!media, color: media ? "#ffffff" : "#17191c" })] : []),
      ];
    }
    canvas = document.createElement("canvas");
    canvas.width = card.width; canvas.height = card.height;
    drawProject(canvas, card, assets, resolveCommentSource, 0, null);
    const overlay = canvas.toDataURL("image/png");
    project.background = media
      ? { kind: sourceMedia.kind, media, ...(sourceMedia.poster ? { poster: sourceMedia.poster } : {}), color: "#17191c" }
      : { kind: "color", color: "#f2f3f5", media: "" };
    project.layers = [createLayer("image", { media: overlay, width: project.width, height: project.height, x: .5, y: .5, scale: 1 })];
    const nativeVideoShare = !commentId && post.cloud === true && sourceMedia?.kind === "video";
    return {
      initialProject: project,
      validateSource: () => validateStatusShare(postId, commentId),
      ...(nativeVideoShare ? { sourcePostId: postId, nativeVideoSource: media, nativeVideoOverlayDataUrl: overlay } : {}),
    };
  } finally {
    assets.dispose();
    if (canvas) canvas.width = canvas.height = 0;
  }
}
