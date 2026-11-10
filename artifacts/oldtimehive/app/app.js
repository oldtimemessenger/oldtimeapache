import "./discovery-professional.css";
import "./quiet-interface.css";
import { retainNavigation, installStableDataRefresh } from "./stable-ui.js";
import { unreadInboxCount } from "./inbox-unread.js";
import { openAccountDeletion } from "./account-deletion.js";
import { reconcileActiveScreen } from "./keyed-ui.js";
import { releasePostVideos } from "./media-release.js";
import { feedPaginationRootMargin } from "./feed-pagination.js";
import { selectFeedVideoCandidate } from "./feed-video-focus.js";
import { installAvatarFallbacks } from "./avatar-fallback.js";
import { feedFollowButton } from "./feed-follow.js";
import { tipIllustration } from "./tip-illustrations.js";
import "./like-motion.js";
import "./release-interface.css";
import { installPageTopControl } from "./page-top-control.js";
import "./page-top-control.css";
import { interestContext } from "./interests.js";
import "./styles.css";
import "./focus-policy.css";
import "./profile-editor-refinement.css";
import "./interest-entry.css";
import { bindInterestEntry } from "./interest-entry.js";
import "./community-screen.css";
import "./search-discovery.css";
import "./community-feeds.css";
import "./explore-ecosystem.css";
import { createExploreEcosystem } from "./explore-ecosystem.js";
import "./gold-save.css";
import { bindSectionSwipes } from "./section-swipes.js";
import { bindMentionAutocomplete, renderMentionText } from "./mention-autocomplete.js";
import "./mention-autocomplete.css";
import "./post-detail.css";
import "./post-viewer-immersive.css";
import { createTransientComments } from "./transient-comments.js";
import { isCommunitySurfacePost, isFeedHomePost, isProfileSurfacePost } from "./post-surfaces.js";
import { renderPostActionsMenu } from "./post-actions-menu.js";
import { followingPosts, followedAuthorPosts, relationshipPosts } from "./feed-posts.js";
import "./service-worker-registration.js";
import { installVideoMediaSession } from "./media-session.js";
import { mountStoryInteractions } from "./story-interactions.js";
import "./story-interactions.css";
import "./story-visual-refinement.css";
import "./ecosystem-consistency.css";
import "./story-immersive-redesign.css";
import "./story-identity.css";
import { isStoryActive } from "./story-lifecycle.js";
import { isDefaultAvatarMediaReference, resolveStoryMedia } from "./story-media.js";
import { storyStageAppearance, sharedStatusLayerHitbox } from "./story-presentation.js";
import { mountStoryStickerInteractions } from "./story-sticker-interactions.js";
import { postMediaReferences } from "./post-media.js";
import { COMMUNITY_MAX_ATTACHMENTS, communityMediaItems, postHasVideo, communityMediaLayout, communityGridMarkup, commentPromptLabel, addComposerFiles, rejectionMessage, moveAttachment } from "./community-post-media.js";
import { api, mutate, notify, profileEmailValidationMessage, requestCloudApi } from "./store.js";
import { shouldMeasureClientPerformance, readFeedServerTimings, reportClientPerformance } from "./performance-telemetry.js";
import { accountNotifications, notificationState, loadAccountNotifications, readAccountNotifications } from "./notifications-api.js";
import { NOTIFICATION_GROUPS, filterNotificationGroup, notificationGroupCounts } from "./notification-groups.js";
import { subscribeNotificationUpdates } from "./comms/signaling.js";
import { mountComms, closeVoiceNote } from "./comms/index.js";
import { icons as ic, icon } from "./icons.js";
import { LEGAL_DOCUMENTS, legalDocumentMarkup, legalNavigation } from "./legal-documents.js";
import "./legal.css";
import { openEmojiPicker, closeEmojiPicker } from "./emoji.js";
import { extraScreen, settingGroups } from "./experiences.js";
import { isBlastGuidanceSafe } from "./blast-guidance-state.js";
import { openSocialSheet } from "./social-sheets-controller.js";
import { openRepostNote } from "./repost-note.js";
import { findSharedComment } from "./shared-content.js";
import { sharedStatusTarget } from "./status-sharing.js";
import { listSavedPosts, setPostSaved } from "./saved-collections.js";
import { audioTitle } from "./audio-library.js";
import { isLocalMedia, renderMediaUrl, hydrateLocalMedia, observeCloudMedia, mediaUrl, loadFeedVideo, putLocalMedia, deleteLocalMedia } from "./local-media.js";
import { FEED_VIDEO_PREFETCH_ROOT_MARGIN, prefetchFeedVideoMetadata, shouldPrefetchFeedVideo } from "./feed-video-prefetch.js";
import { rankHomeRecommendations } from "./home-feed-ranking.js";
import { readFeedSoundMuted, saveFeedSoundMuted } from "./feed-sound-preference.js";
import { finishStartup } from "./startup.js";
import {
  loginMarkup,
  passwordRecoveryRequestMarkup,
  passwordRecoveryResetMarkup,
  signupMarkup,
} from "./auth-design.js";
import { SIGNUP_INTERESTS_MIN, SIGNUP_INTERESTS_MAX, normalizeSignupInterests, signupInterestsError, signupInterestsCountLabel } from "./signup-interests.js";
import { signupAgeError } from "./signup-age.js";
import { completeCognitoSignIn, mountCognitoAction, beginCognitoSignIn, logoutAccount } from "./cognito-auth.js";
import "./brand-selection.css";
import { openCreativeEditor } from "./open-creative-editor.js";
import { purgeAllCreativeDrafts } from "./creative-drafts.js";
import { SPORTS_MODE_ENABLED } from "../../../lib/sports/feature-state.js";
import { creativeMediaMarkup, creativeAttribution } from "./creative-markup.js";
import { CREATOR_TOOL_ROUTES, renderCreatorScreen, resetCreatorScreenState, blueBadgeMarkup, hydrateBlueBadges } from "./creator-center.js";
import { ACCOUNT_TOOL_ROUTES,getAccountTools,loadAccountTools,resetAccountTools,renderAccountToolsScreen } from "./account-professional.js";
import { registerOwnActivityContent,trackQualifiedView,recordActivity,recordProfileVisit } from "./activity-tracking.js";
import { scheduleCreatorAnnouncement, resetCreatorAnnouncements, showHelpfulWalkthrough } from "./creator-announcement.js";
import { mountCommunityAnnouncementCards } from "./feed-announcement-cards.js";
import "./feed-announcement-cards.css";
import { renderGuideLibrary, bindGuideLibrary } from "./guide-library.js";
import { renderPostLikesRow } from "./post-likes-row.js";
import { openPostLikes } from "./post-likes-sheet.js";
import { openPostReposters } from "./post-reposters-sheet.js";
import "./post-likes-row.css";
import { getRepostView } from "./repost-state.js";
import { compactRepostSummary } from "./community-repost-attribution.js";
import { renderRepostAffordance, mountRepostAffordances } from "./repost-affordance.js";
import "./repost-affordance.css";
import { renderPlacesBrowse, renderPlaceDetail, renderDiscoveryPlaces, placeFeedCard } from "./places-view.js";
import { mappedPlaceSuggestions, mergePlaceResults } from "./place-suggestions.js";
import "./status-capture.css";
import { publicNotice } from "../../../lib/public-copy/index.js";
import {postPublicLink,placePublicLink} from "./public-links.js";
import "./moderation-queue.css";
import {
  matchesDiscoveryPost,
} from "./discovery-classifier.js";
import { capturePreservedScroll, restorePreservedScroll } from "./scroll-preservation.js";
import "./flat-surfaces.css";
import { AVATAR_CHOICES, avatarImage, automaticAvatar, resolveProfileAvatar } from "./profile-avatars.js";
import "./profile-avatars.css";
import "./compact-interface.css";
import "./profile-presentations.css";
import "./button-palette.css";
import "./ordinary-white.css";
import { formatCount } from "./format-count.js";
import "./automatic-topics.css";
import { listVisibilityOf, canSeeProfileList, hiddenListMessage, fetchListVisibility, saveListVisibility, DEFAULT_LIST_VISIBILITY } from "./profile-list-visibility.js";
import { mountEmailVerificationReminder, openEmailVerificationSheet, emailManualActionAvailable } from "./email-verification-ui.js";
import { openProfileListSheet } from "./profile-list-sheet.js";
import "./email-verification.css";
import "./media-style-consistency.css";
import { createInsightLoader, createSearchPlaybackTracker, renderVideoSearchInsightPill } from "./search-insights.js";
import "./ui-foundations.css";
import "./app-wide-visual-language.css";
import "./unboxed-interface.css";
import "./destination-landing-refinement.css";
import "./profile-header-refinement.css";
/* Last-loaded, color-only correction layer for verified light-surface text. */
import "./foreground-consistency.css";
import "./editorial-compact-redesign.css";
import "./full-app-surface-unification.css";
import "./create-actions-premium-polish.css";
import "./profile-account-auth-premium.css";

const $ = (s, r = document) => r.querySelector(s);
const app = $("#app");
installAvatarFallbacks(app);
installVideoMediaSession();
// Opens the bounded likes list from the "Liked by" row only; the heart toggle is untouched.
app?.addEventListener("click", e => {
  const b = e.target.closest?.("[data-likes-open]");
  if (!b || !api.cloudPost(b.dataset.likesOpen)) return;
  e.stopPropagation(); e.preventDefault();
  const trigger = b;
  openPostLikes(b.dataset.likesOpen, { sheet: $("#sheet"), esc, icons: ic, count: api.cloudPost(b.dataset.likesOpen)?.likeCount, onProfile: id => navigateToProfile(id), onClose: () => trigger.focus?.() });
}, true);
app?.addEventListener("click", e => {
  const b = e.target.closest?.("[data-reposters-open]");
  if (!b) return;
  e.stopPropagation();
  e.preventDefault();
  const post = api.cloudPost(b.dataset.repostersOpen);
  if (!post) return toast("Reposts are unavailable for this post.");
  openPostReposters(b.dataset.repostersOpen, {
    sheet: $("#sheet"), esc, icons: ic, count: post.repostCount,
    onProfile: id => navigateToProfile(id), onClose: () => b.focus?.(),
  });
}, true);
function deferredModule(importer) {
  let pending = null;
  return () => {
    pending ??= importer().catch(error => {
      pending = null;
      throw error;
    });
    return pending;
  };
}
const loadCreativeViewerModule = deferredModule(() => import("./creative-viewer.js"));
function mountCreativeViewers(root, options) {
  if (!root?.isConnected || !root.querySelector?.("canvas[data-creative-id]")) return;
  void loadCreativeViewerModule().then(module => {
    if (root.isConnected) module.mountCreativeViewers(root, options);
  }).catch(error => console.warn("[Oldtime creative viewer]", error));
}
const loadProfileImageCropper = deferredModule(() => import("./profile-image-cropper.js"));
const loadPlacePicker = deferredModule(() => import("./place-picker.js"));
const loadAudioPanel = deferredModule(() => import("./audio-panel.js"));
let loadedChatModule = null;
const loadChatModule = deferredModule(() => import("./chat.js").then(module => {
  loadedChatModule = module;
  return module;
}));
let chatRenderGeneration = 0;
function closeChatTimers() {
  loadedChatModule?.closeChatTimers();
}
function openProfileImageCropper(...args) {
  return loadProfileImageCropper().then(module => module.openProfileImageCropper(...args));
}
function openPlacePicker(options = {}) {
  return loadPlacePicker().then(module => module.openPlacePicker(options)).catch(error => {
    options.toast?.(error.message || "The place picker could not be opened.");
  });
}
function openAudioPanel(options = {}) {
  void loadAudioPanel().then(module => module.openAudioPanel(options)).catch(error => {
    options.toast?.(error.message || "Audio tools could not be opened.");
  });
}
const COMMUNITY_DISCOVERY_CACHE_MS = 10 * 60_000;
observeCloudMedia(document.body);
let inlineMentionCleanup = () => {};
document.addEventListener("focusin", event => {
  const field = event.target;
  if (!field.matches?.(".comment-input,.detail-comment-input,[data-online-input],#cbody,input[placeholder^='Add a comment'],textarea[placeholder^='Add a comment']")) return;
  inlineMentionCleanup();
  inlineMentionCleanup = bindMentionAutocomplete(field, { api });
});
document.addEventListener("click", event => {
  const link = event.target.closest?.("[data-mention-handle]");
  if (!link) return;
  event.preventDefault();
  event.stopPropagation();
  const handle = String(link.dataset.mentionHandle || "").toLowerCase();
  const storyView = document.getElementById("storyview");
  if (storyView?.contains(link)) storyView.querySelector("#sclose")?.click();
  if (api.authMode() !== "cloud" || !handle) return;
  void api.searchCloudUsers(handle).then(profiles => {
    const person = profiles.find(profile => profile.username?.toLowerCase() === handle);
    if (person?.localId) navigateToProfile(person.localId);
  }).catch(error => toast(error.message || "That profile could not be opened."));
}, true);
const brandArtUrl = `${import.meta.env.BASE_URL}brand/oldtime-feather.png`;
let floatingVideoCleanup = null;
let floatingVideoOwner = null;
installPageTopControl(app, { onScreenChange: () => {
  if (floatingVideoCleanup && floatingVideoOwner !== api.me()?.id) floatingVideoCleanup();
} });
document.addEventListener("error", event => {
  const media = event.target;
  if (isLocalMedia(media.getAttribute?.("src"))) {
    void hydrateLocalMedia(media);
    return;
  }
  if (media.dataset?.localMedia) return; // The cloud loader owns retry/access errors.
  if (media.tagName === "IMG" && !media.dataset.fallback) {
    media.dataset.fallback = "true";
    media.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  }
  if ((media.tagName === "VIDEO" || media.classList?.contains("fullimg")) && media.closest(".clip") && !media.parentElement.querySelector(".media-fallback")) {
    const notice = document.createElement("div");
    notice.className = "media-fallback";
    const message = document.createElement("span");
    message.textContent = media.error?.code === 4 ? "This browser could not play this media."
      : media.error?.code === 3 ? "This media could not be decoded." : "Media could not load.";
    const retry = document.createElement("button");
    retry.type = "button"; retry.textContent = "Retry";
    retry.onclick = event => {
      event.preventDefault(); event.stopPropagation();
      notice.remove();
      if (media.tagName === "VIDEO") {
        media.load();
        void media.play().catch(() => {});
      } else {
        media.dataset.fallback = "";
        media.src = media.currentSrc || media.src;
      }
    };
    notice.append(message, retry);
    media.addEventListener("loadeddata", () => notice.remove(), { once: true });
    media.parentElement.appendChild(notice);
  }
}, true);
app.addEventListener("click", event => {
  const target = event.target instanceof Element ? event.target.closest("[data-video-float]") : null;
  if (!target) return;
  event.preventDefault();
  event.stopPropagation();
  detachFeedVideo(target.dataset.videoFloat, target);
}, true);
let tab = "updates";
let creatorSessionAccount = null;
let closeProfileShare = null;
let homeView = "explore";
let homeCloseFriendsOwnerId = "";
let homeCloseFriendsIds = [];
let homeCloseFriendsRequestOwnerId = "";
let homeCloseFriendsRequest = null;
let homeSessionOwnerId = null;
let homeFeedFeedbackLoadedOwner = "";
let homeFeedFeedbackRequestOwner = "";
let homeFeedFeedbackRequest = null;
let homeIgnoredPostIds = new Set();
let homeIgnoredCreatorIds = new Set();
function defaultHomeView(me) {
  return me?.following?.length ? "following" : "explore";
}
let homeTopic = "all";
let communityView = "for-you";
let communityFeedsModule = null;
let communityFeedsLoading = null;
let communityFeedsLoadError = "";
let communityFeedsUnavailableFor = "";
let communityTopic = "";
let communityTopicOwner = "";
let communityDiscovery = {
  ownerId: null, loading: false, videos: [], people: [], posts: [], topics: [], emergingTopics: [], trends: [],
  videosError: "", peopleError: "", recommendationsError: "", trendsError: "", fetchedAt: 0,
};
let communityDiscoveryRequestId = 0;
let nearbyCity = "all";
let nearbyLocationStatus = "idle";
let nearbyLocationRequestId = 0;
let placesBrowse = { status: "idle", places: [], error: "", attribution: null, locationLabel: "" };
let placesSearch = { query: "", status: "idle", results: [], error: "" };
let placesFeedQuery = "";
let placesMapVisible = false;
let placeMapClickSuppressionUntil = 0;
let placeReturnTo = "home";
let selectedPlace = null;
let placeProfile = { key: "", owner: "", status: "idle", data: null, error: "" };
let placeProfileRequestId = 0;
let placeProfileTab = "top";
let placeReviewSaving = false;
let placeReviewDraft = null;
let placeFeed = { key: "", status: "idle", posts: [], hasMore: false, nextOffset: 0, attribution: null, error: "" };
let placesRequestId = 0;
let placesSearchRequestId = 0;
let placeFeedRequestId = 0;
let placeDetailMapHost = null;
let placeDetailMapController = null;
let placeDetailMapGeneration = 0;
let placesSearchTimer = null;
let profileId = null;
let profileMode = "posts";
let profileRelationsRequestedFor = "";
// Profile Community tab: server-backed only (GET /api/community/profile/:id), never the local blast cache.
let profileCommunity = { owner: "", userId: "", status: "idle", posts: [], hasMore: false, nextOffset: 0, error: "", request: 0 };
function loadProfileCommunity(userId, { append = false } = {}) {
  const owner = api.cloudAccountId() || "";
  if (!owner || !userId) return;
  if (profileCommunity.owner !== owner || profileCommunity.userId !== userId) {
    profileCommunity = { owner, userId, status: "idle", posts: [], hasMore: false, nextOffset: 0, error: "", request: profileCommunity.request };
  }
  if (profileCommunity.status === "loading") return;
  const request = ++profileCommunity.request;
  const offset = append ? profileCommunity.nextOffset : 0;
  profileCommunity = { ...profileCommunity, status: "loading", error: "" };
  const cloudUserId = api.user(userId)?.cloudAccountId || userId;
  requestCloudApi(`/api/community/profile/${encodeURIComponent(cloudUserId)}?limit=20&offset=${offset}`, { timeoutMs: 15_000 }).then(result => {
    if (request !== profileCommunity.request || api.cloudAccountId() !== owner || profileCommunity.userId !== userId) return;
    if (!result || !Array.isArray(result.posts)) throw new Error("Community posts returned an invalid response.");
    const incoming = api.cacheCloudExplorePosts(result.posts);
    const seen = new Set(append ? profileCommunity.posts.map(post => post.id) : []);
    const posts = (append ? profileCommunity.posts : []).concat(incoming.filter(post => post && !seen.has(post.id) && seen.add(post.id)));
    profileCommunity = { ...profileCommunity, status: "success", posts, hasMore: result.hasMore === true,
      nextOffset: Number(result.nextOffset) || posts.length, error: "" };
  }).catch(error => {
    if (request !== profileCommunity.request || api.cloudAccountId() !== owner || profileCommunity.userId !== userId) return;
    profileCommunity = { ...profileCommunity, status: "error", error: error?.message || "Community posts could not be loaded." };
  }).finally(() => {
    if (request === profileCommunity.request && profileId === userId && profileMode === "community") render();
  });
}
let storyTimer = null, storyUi = null;
let createKind = "photo";
let pending = [];
let chatId = null;
let profileReturnChatId = null;
let searchQ = "";
let searchSection = "trending";
let searchExploreAllExpanded = false;
let localSearchType = "all";
let searchExploreFeeds = { owner: "", status: "idle", lists: [], pinned: [], error: "", fetchedAt: 0 };
let searchExploreFeedsRequestId = 0;
let discoveryFeedQuery = "";
let discoveryHomeTopic = "all";
let discoveryFeedRequestId = 0;
let discoveryPeopleQuery = "";
let discoveryPeopleCategory = "";
let discoveryPeopleTimer = null;
let discoveryPeopleRequestId = 0;
let discoveryPlaceQuery = "";
let discoveryPlaceMapVisible = false;
let discoveryPlacesTimer = null;
let discoveryPlacesRequestId = 0;
let discoveryPlaceFeedTimer = null;
let discoveryPlaceFeedRequestId = 0;
let discoveryOwner = "";
let discoveryTrends = { status: "idle", topics: [], error: "", fetchedAt: 0 };
let discoveryPeople = { key: "", status: "idle", suggestions: [], hasMore: false, nextOffset: 0, error: "", fetchedAt: 0 };
let discoveryPlaces = { key: "", status: "idle", places: [], error: "", fetchedAt: 0 };
let discoveryPlaceFeed = { key: "", status: "idle", posts: [], hasMore: false, nextOffset: 0, error: "", moreError: false, fetchedAt: 0 };
let discoveryTrendFilter = "";
let discoveryTopic = "";
let discoveryTopicPosts = { topic: "", status: "idle", posts: [], hasMore: false, nextOffset: 0, error: "" };
let discoveryTrendRequestId = 0;
let discoveryTopicRequestId = 0;
let peopleSearch = { query: "", status: "idle", profiles: [], error: "" };
let peopleSearchTimer = null;
let peopleSearchRequestId = 0;
let carouselIndex = {};
let expandedCaptions = {};
function feedPreferenceOwnerId() {
  return api.cloudAccountId() || api.me()?.id || "";
}
let muted = readFeedSoundMuted(feedPreferenceOwnerId());
const feedSoundGlyph = isMuted => isMuted
  ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 9 5 6m0-6-5 6"/></svg>`
  : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13"/></svg>`;
function syncFeedSoundControls() {
  document.querySelectorAll("#feed [data-feed-sound-toggle], .post-viewer-feed [data-feed-sound-toggle]").forEach(button => {
    button.setAttribute("aria-pressed", String(!muted));
    button.setAttribute("aria-label", muted ? "Turn sound on" : "Mute sound");
    button.innerHTML = feedSoundGlyph(muted);
  });
}
let viewer = null;
let viewerSource = "";
let viewerSearchQuery = "";
let placesViewerReturnState = null;
let placesViewerReturnStackDepth = null;
let unbindSearchPlayback = null;
let profileMore = false;
let settingsView = "home";
let hasPendingSettingsChanges = false;
let selectedCampaignId = null;
let feedObserver = null;
let feedMetadataObserver = null;
let activeFeedVideo = null;
let videoPerformanceSampleReported = false;
let feedPageObserver = null;
let homeFeedMorePending = false;
let cameraStream = null;
let cameraFacing = "environment";
let cameraMode = "post";
let cameraGeneration = 0;
let cameraFlashOn = false;
let notificationsOrigin = null;
let notificationsReturnStack = [];
let notificationFilter = "all";
subscribeNotificationUpdates(() => {
  const owner = api.cloudAccountId();
  if (!owner) return;
  void Promise.all([
    loadAccountNotifications({ force: true }),
    api.refreshCloudRelationships({ force: true }),
  ]).then(() => {
    if (owner !== api.cloudAccountId()) return;
    const me = api.me();
    const bell = app.querySelector("#notifications-open");
    if (me && bell) {
      const hasUnread = accountNotifications().some(note => note.user === me.id && !note.read)
        || api.db().requests.some(request => request.to === me.id)
        || (api.db().friendRequests || []).some(request => request.to === me.id);
      const dot = bell.querySelector(".home-notification-dot");
      if (hasUnread && !dot) {
        const marker = document.createElement("span");
        marker.className = "home-notification-dot";
        marker.setAttribute("aria-label", "Unread notifications");
        bell.append(marker);
      } else if (!hasUnread) dot?.remove();
    }
    if (tab === "notes") render();
  }).catch(() => { if (tab === "notes") render(); });
});
const navigationStack = [];
const settingsViewStack = [];
let pendingNavigationScrollRestore = null;
let deferredEmojiRender = false;
const screenScrollCache = new Map();
const watchedPosts = new Set();
let drawerEscapeHandler = null;
let drawerReturnFocus = null;

const HOME_VIEWS = [
  { id: "following", label: "Following" },
  { id: "explore", label: "For You" }
];
const HOME_TOPICS = [
  { id: "all", label: "For You" },
  { id: "interests", label: "Interests" },
  { id: "world", label: "Around the World" },
  { id: "culture", label: "Culture" },
  { id: "comedy", label: "Comedy" },
  { id: "fashion", label: "Fashion" },
  { id: "food", label: "Food" },
  { id: "travel", label: "Travel" },
  { id: "music", label: "Music" },
  { id: "beauty", label: "Beauty" },
  { id: "art", label: "Art & Design" },
  { id: "pets", label: "Pets" },
  { id: "gaming", label: "Gaming" },
  { id: "learning", label: "Learning" }
];
const PROFILE_INTERESTS = [
  { id: "fitness", label: "Fitness" },
  { id: "running", label: "Running" },
  { id: "basketball", label: "Basketball" },
  { id: "yoga", label: "Yoga" },
  { id: "college", label: "College life" },
  { id: "nursing", label: "Nursing" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "study-groups", label: "Study groups" },
  { id: "gaming", label: "Gaming" },
  { id: "cars", label: "Cars" },
  { id: "music", label: "Music" },
  { id: "photography", label: "Photography" },
  { id: "fashion", label: "Fashion" },
  { id: "food", label: "Food" },
  { id: "tech", label: "Tech" },
  { id: "travel", label: "Travel" },
  { id: "art", label: "Art & design" },
  { id: "pets", label: "Pets" },
  { id: "beauty", label: "Beauty" }
];
const profileInterestName = id => PROFILE_INTERESTS.find(interest => interest.id === id)?.label || id;
const cityMatchKey = value => String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase();
const HOME_TOPIC_TERMS = {
  world: ["world", "global", "international", "country", "culture", "language", "travel", "heritage"],
  culture: ["culture", "history", "language", "tradition", "festival", "heritage", "community"],
  comedy: ["comedy", "funny", "humor", "humour", "meme", "joke", "laugh", "prank", "standup", "parody"],
  fashion: ["fashion", "style", "outfit", "fit check", "fitcheck", "streetwear", "wardrobe", "clothes"],
  food: ["food", "recipe", "cook", "cooking", "meal", "restaurant", "cafe", "coffee", "noodles", "brunch", "baking"],
  travel: ["travel", "trip", "roadtrip", "road trip", "coast", "tourism", "vacation", "destination", "landscape"],
  music: ["music", "song", "singer", "band", "concert", "dance", "audio", "chorus"],
  beauty: ["beauty", "makeup", "skincare", "hair", "nails"],
  sports: ["sport", "sports", "fitness", "workout", "running", "soccer", "football", "basketball"],
  art: ["art", "design", "drawing", "illustration", "photography", "craft", "creative"],
  pets: ["pet", "pets", "dog", "cat", "animal", "puppy", "kitten"],
  gaming: ["game", "gaming", "gamer", "console", "esports"],
  learning: ["learn", "lesson", "tutorial", "education", "study", "skill"]
};
const PROFILE_INTEREST_TERMS = {
  fitness: ["fitness", "workout", "gym", "exercise"],
  running: ["running", "run", "runner"],
  basketball: ["basketball", "hoops", "nba"],
  yoga: ["yoga"],
  college: ["college", "campus", "university", "school"],
  nursing: ["nursing", "nurse"],
  cybersecurity: ["cybersecurity", "cyber security", "infosec"],
  "study-groups": ["study group", "study", "learning", "learn"],
  gaming: ["gaming", "game", "gamer"],
  cars: ["cars", "car", "drive", "driving", "automotive"],
  music: ["music", "song", "singer", "band", "concert"],
  photography: ["photography", "photo", "camera"],
  fashion: ["fashion", "style", "outfit"],
  food: ["food", "recipe", "cooking", "restaurant", "cafe"],
  tech: ["tech", "technology", "software", "gadgets"],
  travel: ["travel", "trip", "roadtrip", "vacation"],
  art: ["art", "design", "drawing", "illustration"],
  pets: ["pets", "pet", "dog", "cat", "animal"],
  beauty: ["beauty", "makeup", "skincare", "hair"]
};
const DISCOVERY_AREAS = [
  { name: "Miami", lat: 25.7617, lon: -80.1918 },
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { name: "Chicago", lat: 41.8781, lon: -87.6298 }
];

const esc = (s = "") => String(s).replace(/&/g, "&" + "amp;").replace(/</g, "&" + "lt;").replace(/>/g, "&" + "gt;").replace(/"/g, "&" + "quot;");
const fmt = formatCount;
const ago = (t) => { const s = Math.max(1, (Date.now() - (t || Date.now())) / 1000); if (s < 60) return "now"; if (s < 3600) return Math.floor(s / 60) + "m"; if (s < 86400) return Math.floor(s / 3600) + "h"; return Math.floor(s / 86400) + "d"; };
const videoFloatIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"></rect><path d="M13 13h6v5h-6z"></path></svg>';
const normalizeFeedText = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function detachFeedVideo(postId, trigger) {
  if (!trigger?.matches?.("[data-video-float]")) return;
  const surface = trigger?.closest(".clip,.community-post-card,.profile-play-media");
  const video = trigger.hasAttribute("data-video-profile")
    ? trigger.parentElement?.querySelector(".profile-play-media video")
    : surface?.querySelector("video");
  if (!video || video.tagName !== "VIDEO") { toast("This video is no longer available in the feed."); return; }
  if (floatingVideoCleanup) floatingVideoCleanup();

  const placeholder = document.createElement("span");
  placeholder.className = "video-float-placeholder";
  video.before(placeholder);
  feedObserver?.unobserve(video);
  if (activeFeedVideo === video) activeFeedVideo = null;
  app.querySelectorAll("video").forEach(other => { if (other !== video) other.pause(); });
  if (trigger?.hasAttribute("data-video-profile")) clearInterval(storyTimer);

  const originalControls = video.controls;
  const originalLoop = video.loop;
  video.loop = true;
  const floating = document.createElement("section");
  floating.className = "ot-video-float";
  floating.setAttribute("role", "region");
  floating.setAttribute("aria-label", "Floating video player");
  floating.dataset.testid = "floating-video-player";
  floating.innerHTML = `
    <div class="ot-video-float-controls">
      <button type="button" class="ot-video-float-button ot-video-float-drag" data-video-drag aria-label="Move floating video; use arrow keys to reposition" title="Drag to move video">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14M5 12h14M5 16h14"></path></svg>
      </button>
      <button type="button" class="ot-video-float-button" data-video-expand aria-label="Expand video" title="Expand video">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M3 3l7 7M16 21h5v-5m0 5-7-7"></path></svg>
      </button>
      <button type="button" class="ot-video-float-button" data-video-close aria-label="Close floating video" title="Close video">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg>
      </button>
      <button type="button" class="ot-video-float-button" data-video-pip aria-label="Watch outside the browser" title="Picture in picture" hidden>${videoFloatIcon}</button>
    </div>
    <button type="button" class="ot-video-float-button ot-video-float-play" data-video-play aria-label="Pause video" title="Pause video">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"></path></svg>
    </button>`;
  video.classList.add("ot-video-float-media");
  video.controls = false;
  floating.append(video);
  document.body.append(floating);
  let videoRatio = 9 / 16;
  let compactSize = null;
  const fitCompactSize = () => {
    if (video.videoWidth && video.videoHeight) videoRatio = video.videoWidth / video.videoHeight;
    const availableHeight = Math.max(120, window.innerHeight - 32);
    const width = Math.min(window.innerWidth * .48, 220, availableHeight * videoRatio);
    const height = width / videoRatio;
    compactSize = { width, height };
    if (floating.classList.contains("is-expanded")) return;
    floating.style.width = `${width}px`;
    floating.style.height = `${height}px`;
  };
  fitCompactSize();
  video.addEventListener("loadedmetadata", fitCompactSize);
  let sourcePending = null;
  const playVideo = () => {
    const reference = video.dataset.localMedia;
    if (isLocalMedia(reference) && !video.src) {
      sourcePending ||= mediaUrl(reference).then(url => {
        if (floating.isConnected) {
          video.src = url;
          video.dataset.loadedMedia = reference;
        }
      }).finally(() => { sourcePending = null; });
      return sourcePending.then(() => { if (floating.isConnected) return video.play(); });
    }
    return video.play();
  };

  let expanded = false;
  const expand = floating.querySelector("[data-video-expand]");
  const close = floating.querySelector("[data-video-close]");
  const play = floating.querySelector("[data-video-play]");
  const pip = floating.querySelector("[data-video-pip]");
  const dragHandle = floating.querySelector("[data-video-drag]");
  pip.hidden = !(document.pictureInPictureEnabled && video.requestPictureInPicture)
    && !(typeof video.webkitSupportsPresentationMode === "function"
      && video.webkitSupportsPresentationMode("picture-in-picture"));
  pip.onclick = async () => {
    try {
      await playVideo();
      if (video.requestPictureInPicture && document.pictureInPictureEnabled) await video.requestPictureInPicture();
      else video.webkitSetPresentationMode?.("picture-in-picture");
    } catch { toast("Picture in picture isn’t available here. You can still use the floating player."); }
  };
  const updatePlay = () => {
    const paused = video.paused;
    play.setAttribute("aria-label", paused ? "Play video" : "Pause video");
    play.title = paused ? "Play video" : "Pause video";
    play.innerHTML = paused
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 12 7-12 7z"></path></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"></path></svg>';
  };
  video.addEventListener("play", updatePlay);
  video.addEventListener("pause", updatePlay);
  const renderExpandIcon = () => {
    expand.classList.toggle("is-expanded", expanded);
    expand.setAttribute("aria-label", expanded ? "Minimize video" : "Expand video");
    expand.title = expanded ? "Minimize video" : "Expand video";
    expand.innerHTML = expanded
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3v5H3m0-5 7 7M16 21v-5h5m0 5-7-7"></path></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M3 3l7 7M16 21h5v-5m0 5-7-7"></path></svg>';
  };
  let compactPosition = null;
  let dragStart = null;
  const setCompactPosition = (left, top) => {
    const rect = floating.getBoundingClientRect();
    const width = rect.width || floating.offsetWidth;
    const height = rect.height || floating.offsetHeight;
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 8;
    const maxLeft = Math.max(margin, viewportWidth - width - margin);
    const maxTop = Math.max(margin, viewportHeight - height - margin);
    const next = {
      left: Math.max(margin, Math.min(left, maxLeft)),
      top: Math.max(margin, Math.min(top, maxTop)),
    };
    floating.style.left = `${next.left}px`;
    floating.style.top = `${next.top}px`;
    floating.style.right = "auto";
    floating.style.bottom = "auto";
    compactPosition = next;
  };
  const setExpanded = next => {
    if (expanded === next) return;
    if (next) {
      const rect = floating.getBoundingClientRect();
      compactPosition = { left: rect.left, top: rect.top };
      floating.style.removeProperty("left");
      floating.style.removeProperty("top");
      floating.style.removeProperty("right");
      floating.style.removeProperty("bottom");
      floating.style.removeProperty("width");
      floating.style.removeProperty("height");
    }
    expanded = next;
    floating.classList.toggle("is-expanded", expanded);
    if (!expanded) {
      fitCompactSize();
      if (compactPosition) setCompactPosition(compactPosition.left, compactPosition.top);
    }
    renderExpandIcon();
  };
  const onDragStart = event => {
    if (expanded || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    event.preventDefault();
    const rect = floating.getBoundingClientRect();
    dragStart = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
    compactPosition = { left: rect.left, top: rect.top };
    dragHandle.setPointerCapture(event.pointerId);
    floating.classList.add("is-dragging");
  };
  const onDragMove = event => {
    if (!dragStart || event.pointerId !== dragStart.pointerId) return;
    setCompactPosition(dragStart.left + event.clientX - dragStart.x, dragStart.top + event.clientY - dragStart.y);
  };
  const onDragEnd = event => {
    if (!dragStart || event.pointerId !== dragStart.pointerId) return;
    dragStart = null;
    floating.classList.remove("is-dragging");
    if (dragHandle.hasPointerCapture(event.pointerId)) dragHandle.releasePointerCapture(event.pointerId);
  };
  const onDragKey = event => {
    if (expanded || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const rect = floating.getBoundingClientRect();
    const step = event.shiftKey ? 32 : 12;
    const horizontal = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
    const vertical = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
    setCompactPosition(rect.left + horizontal, rect.top + vertical);
  };
  const onResize = () => {
    if (expanded) return;
    fitCompactSize();
    if (compactPosition) setCompactPosition(compactPosition.left, compactPosition.top);
  };
  dragHandle.addEventListener("pointerdown", onDragStart);
  dragHandle.addEventListener("pointermove", onDragMove);
  dragHandle.addEventListener("pointerup", onDragEnd);
  dragHandle.addEventListener("pointercancel", onDragEnd);
  dragHandle.addEventListener("keydown", onDragKey);
  window.addEventListener("resize", onResize);
  const onKey = event => {
    if (event.key === "Escape" && expanded) {
      setExpanded(false);
    }
  };
  const restore = () => {
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", onResize);
    video.removeEventListener("loadedmetadata", fitCompactSize);
    dragHandle.removeEventListener("pointerdown", onDragStart);
    dragHandle.removeEventListener("pointermove", onDragMove);
    dragHandle.removeEventListener("pointerup", onDragEnd);
    dragHandle.removeEventListener("pointercancel", onDragEnd);
    dragHandle.removeEventListener("keydown", onDragKey);
    video.pause();
    video.controls = originalControls;
    video.loop = originalLoop;
    video.removeEventListener("play", updatePlay);
    video.removeEventListener("pause", updatePlay);
    if (document.pictureInPictureElement === video) void document.exitPictureInPicture?.().catch(() => {});
    video.classList.remove("ot-video-float-media");
    if (placeholder.isConnected) placeholder.replaceWith(video);
    else video.remove();
    floating.remove();
    floatingVideoCleanup = null;
    floatingVideoOwner = null;
    if (app.querySelector(".clip")) observeVideos();
  };
  expand.onclick = () => setExpanded(!expanded);
  close.onclick = restore;
  play.onclick = () => {
    if (video.paused) {
      void playVideo().catch(() => { updatePlay(); toast("Video couldn’t play. Try Play again."); });
    } else {
      video.pause();
      updatePlay();
    }
  };
  document.addEventListener("keydown", onKey);
  floatingVideoCleanup = restore;
  floatingVideoOwner = api.me()?.id;
  updatePlay();
  void playVideo().catch(() => { updatePlay(); toast("Tap Play to start this video."); });
}

function homePosts() {
  const me = api.me();
  if (api.authMode() === "cloud") {
    const feedbackOwner = api.cloudAccountId();
    if (feedbackOwner && feedbackOwner !== homeFeedFeedbackLoadedOwner &&
        feedbackOwner !== homeFeedFeedbackRequestOwner) {
      homeFeedFeedbackRequestOwner = feedbackOwner;
      homeFeedFeedbackRequest = import("./store.js").then(({ requestCloudApi }) =>
        requestCloudApi("/api/feed/feedback", { method: "GET" })).then(feedback => {
        if (api.cloudAccountId() !== feedbackOwner) return;
        homeIgnoredPostIds = new Set(Array.isArray(feedback?.postIds) ? feedback.postIds : []);
        homeIgnoredCreatorIds = new Set(Array.isArray(feedback?.authorIds) ? feedback.authorIds : []);
        homeFeedFeedbackLoadedOwner = feedbackOwner;
        if (tab === "updates" && settingsView === "home") render();
      }).catch(() => {
        if (api.cloudAccountId() === feedbackOwner) homeFeedFeedbackLoadedOwner = feedbackOwner;
      }).finally(() => {
        if (homeFeedFeedbackRequestOwner === feedbackOwner) {
          homeFeedFeedbackRequestOwner = "";
          homeFeedFeedbackRequest = null;
        }
      });
    }
    const wantedSurface = homeView === "following" ? "following" : "main";
    const status = api.cloudFeedStatus();
    if (!status.loading && !status.error && (!status.loaded || status.surface !== wantedSurface)) {
      void api.refreshCloudFeed(wantedSurface).then(() => {
        if (tab === "updates" && settingsView === "home") render();
      }).catch(() => {
        if (tab === "updates" && settingsView === "home") render();
      });
    }
    const ownerId = api.cloudAccountId();
    if (homeView === "close-friends" && ownerId && ownerId !== homeCloseFriendsOwnerId &&
        homeCloseFriendsRequestOwnerId !== ownerId) {
      homeCloseFriendsRequestOwnerId = ownerId;
      homeCloseFriendsRequest = api.refreshCloudCloseFriends().then(ids => {
        if (api.cloudAccountId() !== ownerId) return;
        homeCloseFriendsOwnerId = ownerId;
        homeCloseFriendsIds = [...ids];
        render();
      }).catch(() => {
        if (api.cloudAccountId() === ownerId) toast("Close Friends could not be loaded.");
      }).finally(() => {
        if (homeCloseFriendsRequestOwnerId === ownerId) {
          homeCloseFriendsRequestOwnerId = "";
          homeCloseFriendsRequest = null;
        }
      });
    }
  }
  let posts = api.ranked(homeView === "following" ? "following" : "foryou")
    .filter(isFeedHomePost);
  if (homeView === "following") posts = followingPosts(posts, me);
  else posts = posts.filter(post => !homeIgnoredPostIds.has(post.id) && !homeIgnoredCreatorIds.has(post.author));
  // Home Following shows only confirmed followed authors; shared Discovery/repost cache entries cannot leak in.
  if (homeView === "following") posts = followedAuthorPosts(posts, me);
  if (homeView === "close-friends") {
    const ids = new Set(api.authMode() === "cloud" ? api.cloudCloseFriends() : (me?.closeFriends || []));
    posts = posts.filter(post => ids.has(post.author));
  }
  if (homeView === "explore") {
    posts = rankHomeRecommendations(posts, me?.interests || [], PROFILE_INTEREST_TERMS);
  }
  if (homeView === "nearby") {
    const city = nearbyCity === "all" ? "" : normalizeFeedText(nearbyCity || me?.city);
    posts = city ? posts.filter(post => {
      const location = normalizeFeedText(post.location || api.user(post.author)?.city);
      return location === city || location.startsWith(`${city} `);
    }) : posts;
  }
  if (homeTopic === "interests") {
    const selected = new Set(Array.isArray(me?.interests) ? me.interests : []);
    const terms = [...selected]
      .flatMap(id => PROFILE_INTEREST_TERMS[id] || [id])
      .map(normalizeFeedText)
      .filter(Boolean);
    posts = terms.length ? posts.filter(post => {
      const text = ` ${normalizeFeedText([post.caption, post.sound, ...(post.tags || [])].join(" "))} `;
      return terms.some(term => text.includes(` ${term} `));
    }) : [];
  } else if (homeTopic !== "all") {
    const terms = HOME_TOPIC_TERMS[homeTopic] || [];
    posts = posts.filter(post => {
      const text = ` ${normalizeFeedText([post.caption, post.sound, ...(post.tags || [])].join(" "))} `;
      return terms.some(term => text.includes(` ${normalizeFeedText(term)} `));
    });
  }
  return posts;
}

function matchesHomeTopicPost(post, topic, user = api.me()) {
  if (!topic || topic === "all") return true;
  let terms = HOME_TOPIC_TERMS[topic] || [];
  if (topic === "interests") {
    terms = (Array.isArray(user?.interests) ? user.interests : [])
      .flatMap(id => PROFILE_INTEREST_TERMS[id] || [id]);
  }
  if (!terms.length) return false;
  const text = ` ${normalizeFeedText([post?.caption, post?.text, post?.sound, ...(post?.tags || [])].join(" "))} `;
  return terms.some(term => text.includes(` ${normalizeFeedText(term)} `));
}

function nearbyAreas() {
  const counts = new Map();
  api.posts().filter(isFeedHomePost).forEach(post => {
    const rawLocation = postPlaceValue(post);
    const normalized = normalizeFeedText(rawLocation);
    if (!normalized) return;
    const curated = DISCOVERY_AREAS.find(area => {
      const key = normalizeFeedText(area.name);
      return normalized === key || normalized.startsWith(`${key} `);
    });
    const name = curated?.name || String(rawLocation).trim();
    counts.set(name, (counts.get(name) || 0) + 1);
  });
  return [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => {
    const ai = DISCOVERY_AREAS.findIndex(area => area.name === a.name);
    const bi = DISCOVERY_AREAS.findIndex(area => area.name === b.name);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || a.name.localeCompare(b.name);
  });
}

function distanceKm(lat1, lon1, lat2, lon2) {
  const radians = degrees => degrees * Math.PI / 180;
  const dLat = radians(lat2 - lat1);
  const dLon = radians(lon2 - lon1);
  const value = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function requestNearbyLocation() {
  if (nearbyLocationStatus === "requesting") return;
  if (!navigator.geolocation) {
    nearbyLocationStatus = "unavailable";
    render();
    toast("Location isn’t available. Browse the areas below.");
    return;
  }
  const requestId = ++nearbyLocationRequestId;
  nearbyLocationStatus = "requesting";
  render();
  try {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      if (requestId !== nearbyLocationRequestId) return;
      const closest = DISCOVERY_AREAS.map(area => ({
        ...area,
        distance: distanceKm(coords.latitude, coords.longitude, area.lat, area.lon)
      })).sort((a, b) => a.distance - b.distance)[0];
      if (closest?.distance <= 100) {
        nearbyCity = closest.name;
        nearbyLocationStatus = "located";
        toast(`Showing posts near ${closest.name}`);
      } else {
        nearbyCity = "all";
        nearbyLocationStatus = "available";
        toast("No nearby area yet. Explore the available areas below.");
      }
      render();
    }, error => {
      if (requestId !== nearbyLocationRequestId) return;
      nearbyCity = "all";
      nearbyLocationStatus = error?.code === 1 ? "denied" : "unavailable";
      render();
      toast("Location off. Browse the available areas below.");
    }, { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 });
  } catch {
    if (requestId !== nearbyLocationRequestId) return;
    nearbyLocationStatus = "unavailable";
    nearbyCity = "all";
    render();
    toast("Location isn’t available. Browse the areas below.");
  }
}

function isPlacesScreen() {
  return tab === "updates" && settingsView === "home" && homeView === "nearby";
}
function placeKey(place) {
  return place ? `${String(place.id || "")}\u0000${String(place.label || "")}` : "";
}
function activePlaceFeedKey() {
  return selectedPlace
    ? placeKey(selectedPlace)
    : `all\u0000${String(placesFeedQuery || "").trim().toLowerCase()}`;
}
function safePlaceCoordinates(place) {
  const validValue = value => value !== null && value !== undefined &&
    !(typeof value === "string" && !value.trim());
  if (!validValue(place?.lat) || !validValue(place?.lon)) return null;
  const lat = Number(place.lat), lon = Number(place.lon);
  return Number.isFinite(lat) && lat >= -90 && lat <= 90 &&
    Number.isFinite(lon) && lon >= -180 && lon <= 180 ? { lat, lon } : null;
}
function placesForDiscoveryMap() {
  const candidates = [
    ...placesBrowse.places.map(item => item?.place ? { ...item.place, postCount: item.postCount } : item),
    ...placeFeed.posts.map(post => post?.place ? { ...post.place, postCount: 1 } : null),
  ];
  const unique = new Map();
  for (const place of candidates) {
    const coordinates = safePlaceCoordinates(place);
    if (!coordinates || !place?.id || !place?.label) continue;
    const id = String(place.id);
    const existing = unique.get(id);
    unique.set(id, {
      ...existing,
      ...place,
      ...coordinates,
      postCount: Math.max(Number(existing?.postCount) || 0, Number(place.postCount) || 0),
    });
  }
  return [...unique.values()];
}
function loadPlacesDiscovery({ force = false } = {}) {
  if (!force && ["loading", "ready"].includes(placesBrowse.status)) return;
  const requestId = ++placesRequestId;
  placesBrowse = { ...placesBrowse, status: "loading", error: "" };
  void requestCloudApi("/api/places/landing").then(result => {
    if (requestId !== placesRequestId) return;
    placesBrowse = {
      ...placesBrowse,
      status: "ready",
      places: Array.isArray(result?.places) ? result.places : [],
      landing: result?.landing || null,
      attribution: result?.attribution || null,
      error: "",
    };
  }).catch(error => {
    if (requestId !== placesRequestId) return;
    placesBrowse = { ...placesBrowse, status: "error", error: error.message || "Places could not be loaded." };
  }).finally(() => {
    if (requestId === placesRequestId && isPlacesScreen()) render();
  });
}
function placeCardPost(post){
  const cached=api.cloudPost(post.id);
  return cached?{...post,...cached,placeRating:cached.placeRating??post.placeRating,
    liked:cached.likes?.includes(api.me()?.id)||false}:post;
}
function placeCardPerson(post){
  const id=typeof post.author==="string"?post.author:post.authorId||post.author?.id;
  const person=api.user(id)||(typeof post.author==="object"?post.author:null);
  return person?{...person,displayName:person.displayName||person.name||person.username}:null;
}
function loadPlaceFeed({ append = false } = {}) {
  const place = selectedPlace;
  const key = activePlaceFeedKey();
  if (append && (placeFeed.status === "loadingMore" || !placeFeed.hasMore)) return;
  const requestId = ++placeFeedRequestId;
  const offset = append ? placeFeed.nextOffset : 0;
  placeFeed = {
    ...placeFeed,
    key,
    status: append ? "loadingMore" : "loading",
    error: "",
    moreError: false,
    ...(append ? {} : { posts: [], nextOffset: 0, hasMore: false }),
  };
  if (isPlacesScreen()) render();
  const query = new URLSearchParams({ offset: String(offset), limit: "18" });
  if (place) query.set("sort", placeProfileTab === "recent" ? "recent" : "top");
  if (place?.id && place?.label) {
    query.set("placeId", place.id);
    query.set("label", place.label);
  } else if (String(placesFeedQuery || "").trim().length >= 2) {
    query.set("q", String(placesFeedQuery).trim());
  }
  void requestCloudApi(`/api/places/feed?${query}`).then(result => {
    if (requestId !== placeFeedRequestId || activePlaceFeedKey() !== key) return;
    const posts = (Array.isArray(result?.posts) ? result.posts : []).map(post => {
      const media = Array.isArray(post.media) ? post.media : [];
      const video = media.some(item => String(item?.contentType || "").startsWith("video/"));
      return {
        ...post,
        caption: post.text || "",
        location: post.place?.label || "",
        created: post.createdAt,
        kind: media.length > 1 ? "carousel" : video ? "video" : media.length ? "photo" : "text",
        media: postMediaReferences({ media }),
        mediaPosters: media.map(item => {
          const poster = item?.thumbnailReference || item?.thumbnailUrl || null;
          return poster && !isDefaultAvatarMediaReference(poster) ? poster : null;
        }),
        author: post.author ? {
          ...post.author,
          avatar: post.author.avatar || "",
        } : null,
      };
    });
    const combined = append
      ? [...placeFeed.posts, ...posts.filter(post => !placeFeed.posts.some(old => old.id === post.id))]
      : posts;
    placeFeed = {
      key,
      status: "ready",
      posts: combined,
      hasMore: result?.hasMore === true,
      nextOffset: Number.isSafeInteger(result?.nextOffset) ? result.nextOffset : offset + posts.length,
      attribution: result?.attribution || placesBrowse.attribution,
      error: "",
      moreError: false,
    };
  }).catch(error => {
    if (requestId !== placeFeedRequestId || activePlaceFeedKey() !== key) return;
    placeFeed = {
      ...placeFeed,
      status: placeFeed.posts.length ? "ready" : "error",
      error: "We couldn’t load posts from this place. Please try again.",
      moreError: append,
    };
  }).finally(() => {
    if (requestId === placeFeedRequestId && isPlacesScreen() && activePlaceFeedKey() === key) render();
  });
}
function openPlacesLanding(query = "") {
  navigationStack.push(captureNavigationState());
  tab = "updates";
  settingsView = "home";
  profileId = null;
  viewer = null;
  viewerSource = "";
  homeView = "nearby";
  homeTopic = "all";
  selectedPlace = null;
  placesMapVisible = false;
  placeReturnTo = "places";
  placesFeedQuery = String(query || "").trim().slice(0, 120);
  clearTimeout(placesSearchTimer);
  placesSearchRequestId++;
  placesSearch = { query: placesFeedQuery, status: "idle", results: [], error: "" };
  placeFeedRequestId++;
  placeFeed = { key:"", status:"idle", posts:[], hasMore:false, nextOffset:0, attribution:null, error:"", moreError:false };
  loadPlacesDiscovery();
  render();
  if (placesFeedQuery) void searchPlaces(placesFeedQuery);
  else loadPlaceFeed();
}
function openSearchPlaces(query = "") {
  searchSection = "places";
  discoveryPlaceQuery = String(query || "").trim().slice(0, 120);
  discoveryPlaceMapVisible = false;
  discoveryTopic = "";
  render();
  requestAnimationFrame(() => $("#q")?.blur());
}
function selectPlace(place) {
  if (!place?.id || !place?.label) return;
  disposePlaceDetailMap();
  discoveryPlaceMapVisible = false;
  placeReturnTo = isPlacesScreen() ? "places" : "home";
  placesMapVisible = false;
  tab = "updates";
  settingsView = "home";
  profileId = null;
  viewer = null;
  viewerSource = "";
  selectedPlace = {
    id: String(place.id),
    label: String(place.label),
    source: place.source === "osm" ? "osm" : "custom",
    ...(place.category ? { category: String(place.category) } : {}),
    ...(place.city ? { city: String(place.city) } : {}),
    ...(place.kind ? { kind: String(place.kind) } : {}),
    ...(place.address ? { address: String(place.address) } : {}),
    ...(safePlaceCoordinates(place) || {}),
  };
  homeView = "nearby";
  placeProfileTab = "top";
  placeProfile = { key: placeKey(selectedPlace), owner: api.me()?.id, status: "loading", data: null, error: "" };
  homeTopic = "all";
  placeFeedRequestId++;
  placeFeed = {
    key: activePlaceFeedKey(), status: "loading", posts: [], hasMore: false,
    nextOffset: 0, attribution: placesBrowse.attribution, error: "", moreError: false,
  };
  loadPlacesDiscovery();
  render();
  loadPlaceFeed();
  void loadPlaceProfile();
}
async function loadPlaceProfile({ more = "" } = {}) {
  if (!selectedPlace) return;
  if (more && placeProfile.status === "loading") return;
  const place = { ...selectedPlace }, key = placeKey(place), owner = api.me()?.id;
  const requestId = ++placeProfileRequestId;
  const prior = placeProfile.key === key && placeProfile.owner === owner ? placeProfile.data : null;
  placeProfile = { key, owner, status: "loading", data: prior, error: "" };
  const params = new URLSearchParams({ placeId: place.id, label: place.label });
  if (more === "people") params.set("peopleOffset", String(prior?.peopleNextOffset || 0));
  if (more === "tips") params.set("reviewsOffset", String(prior?.reviewsNextOffset || 0));
  try {
    const data = await requestCloudApi(`/api/places/profile?${params}`);
    if (requestId !== placeProfileRequestId || key !== placeKey(selectedPlace) || owner !== api.me()?.id) return;
    if (more === "people" && prior) {
      data.people = [...prior.people, ...data.people.filter(p => !prior.people.some(old => old.id === p.id))];
      data.reviews = prior.reviews; data.reviewsHasMore = prior.reviewsHasMore; data.reviewsNextOffset = prior.reviewsNextOffset;
    } else if (more === "tips" && prior) {
      data.reviews = [...prior.reviews, ...data.reviews.filter(r => !prior.reviews.some(old => old.id === r.id))];
      data.people = prior.people; data.peopleHasMore = prior.peopleHasMore; data.peopleNextOffset = prior.peopleNextOffset;
    }
    selectedPlace = { ...selectedPlace, category: data.place.category, address: data.place.address,
      ...(safePlaceCoordinates(data.place) || {}) };
    placeProfile = { key, owner, status: "ready", data, error: "" };
  } catch (error) {
    if (requestId !== placeProfileRequestId || key !== placeKey(selectedPlace) || owner !== api.me()?.id) return;
    console.warn("Place profile unavailable", error);
    placeProfile = { key, owner, status: "error", data: prior, error: "We couldn’t load this place right now. Please try again." };
  }
  if (requestId === placeProfileRequestId && isPlacesScreen()) render();
}
function disposePlaceDetailMap() {
  placeDetailMapGeneration++;
  placeDetailMapController?.destroy();
  placeDetailMapController = null;
  placeDetailMapHost = null;
}
function mountPlaceDetailMap(host) {
  if (!host) {
    disposePlaceDetailMap();
    return;
  }
  if (host === placeDetailMapHost) return;
  disposePlaceDetailMap();
  placeDetailMapHost = host;
  const generation = placeDetailMapGeneration;
  const isDiscoveryMap = host.hasAttribute("data-place-discovery-map");
  const isSearchPlaceMap = host.hasAttribute("data-search-place-map");
  const place = selectedPlace ? { ...selectedPlace } : null;
  const places = (isDiscoveryMap
    ? (isSearchPlaceMap ? discoveryPlaces.places.filter(item => Number(item?.postCount) > 0)
      .map(item => item?.place ? { ...item.place, postCount: item.postCount } : item) : placesForDiscoveryMap())
    : place ? [place] : []).filter(item => safePlaceCoordinates(item));
  if (!places.length) return;
  const mount = async () => {
    try {
      const { mountPlacesMap } = await import("./places-map.js");
      if (generation !== placeDetailMapGeneration || !host.isConnected) return;
      const controller = await mountPlacesMap(host, {
        places,
        selectedId: isDiscoveryMap ? undefined : place?.id,
        onSelect: isDiscoveryMap ? place => selectPlace(place) : undefined,
      });
      if (generation !== placeDetailMapGeneration || !host.isConnected) {
        controller.destroy();
        return;
      }
      placeDetailMapController = controller;
      const status = host.parentElement?.querySelector("[data-place-map-status]");
      if (status) status.hidden = true;
    } catch {
      if (generation !== placeDetailMapGeneration || !host.isConnected) return;
      const status = host.parentElement?.querySelector("[data-place-map-status]");
      if (status) status.textContent = "The map is unavailable right now. The place and posts are still available.";
    }
  };
  // The caller passes this host only after the user reveals the optional map.
  // Mount now instead of waiting on a second observer inside a transformed sheet.
  void mount();
}
let placesLocationCoordinates=null;
function usePlacesLocation() {
  if (nearbyLocationStatus === "requesting") return;
  if (!navigator.geolocation) {
    nearbyLocationStatus = "unavailable";
    placesBrowse = { ...placesBrowse, locationLabel: "Location is not available in this browser." };
    render();
    return;
  }
  const requestId = ++nearbyLocationRequestId;
  nearbyLocationStatus = "requesting";
  placesBrowse = { ...placesBrowse, locationLabel: "Finding shared places nearby…" };
  render();
  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    if (requestId !== nearbyLocationRequestId) return;
    placesLocationCoordinates={lat:coords.latitude,lon:coords.longitude};
    try{
      const result=await requestCloudApi(`/api/places/landing?${new URLSearchParams(placesLocationCoordinates)}`);
      if(requestId!==nearbyLocationRequestId)return;
      placesBrowse={...placesBrowse,landing:result.landing,places:result.places||[],locationLabel:"you"};
      if(!discoveryPlaceQuery.trim())discoveryPlaces={...discoveryPlaces,landing:result.landing,places:result.places||[],status:"success",fetchedAt:Date.now()};
      nearbyLocationStatus="located";
    }catch{
      nearbyLocationStatus="unavailable";
      placesBrowse={...placesBrowse,locationLabel:"Nearby places couldn’t be loaded. You can still browse other places."};
    }
    render();
  }, error => {
    if (requestId !== nearbyLocationRequestId) return;
    nearbyLocationStatus = error?.code === 1 ? "denied" : "unavailable";
    placesBrowse = { ...placesBrowse, locationLabel: "Location is off. You can still browse shared places." };
    render();
  }, { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 });
}
const placeCardActionKey=Symbol.for("oldtime.placeCardActions");
if(document[placeCardActionKey])document.removeEventListener("click",document[placeCardActionKey],true);
document[placeCardActionKey]=async event=>{
  const mapHandle=event.target.closest?.("[data-place-map-handle]");
  if(mapHandle){
    event.preventDefault();event.stopPropagation();
    if(Date.now()<=placeMapClickSuppressionUntil){placeMapClickSuppressionUntil=0;return}
    placesMapVisible=!placesMapVisible;
    render();
    return;
  }
  const button=event.target.closest?.("[data-places-nearby],[data-place-post-like],[data-place-post-comment],[data-place-post-share]");
  if(!button)return;
  event.preventDefault();event.stopPropagation();
  if(button.hasAttribute("data-places-nearby")){usePlacesLocation();return}
  const id=button.dataset.placePostLike||button.dataset.placePostComment||button.dataset.placePostShare;
  if(!id||button.disabled)return;
  button.disabled=true;
  try{
    if(!api.cloudPost(id)&&api.authMode()==="cloud")await api.loadCloudPost(id);
    if(button.hasAttribute("data-place-post-like")){
      await like(id,null,false);
      const post=api.cloudPost(id);
      if(post)placeFeed={...placeFeed,posts:placeFeed.posts.map(old=>old.id===id?{...old,...post,liked:post.likes.includes(api.me().id)}:old)};
      if(post)discoveryPlaceFeed={...discoveryPlaceFeed,posts:discoveryPlaceFeed.posts.map(old=>old.id===id?{...old,...post,liked:post.likes.includes(api.me().id)}:old)};
      render();
    }else if(button.hasAttribute("data-place-post-comment"))comments(id);
    else await sharePostExternally(id);
  }catch{toast("We couldn’t open that right now. Please try again.")}
  finally{if(button.isConnected)button.disabled=false}
};
document.addEventListener("click",document[placeCardActionKey],true);
async function searchPlaces(query) {
  const normalized = String(query || "").trim();
  placesFeedQuery = normalized;
  loadPlaceFeed();
  if (normalized.length < 2) {
    placesSearch = { query: normalized, status: "idle", results: [], error: "" };
    render();
    return;
  }
  const requestId = ++placesSearchRequestId;
  placesSearch = { query: normalized, status: "loading", results: [], error: "" };
  render();
  try {
    const [tagged, mapped] = await Promise.allSettled([
      requestCloudApi(`/api/places/discovery?q=${encodeURIComponent(normalized)}`),
      mappedPlaceSuggestions(normalized, requestCloudApi).then(places=>({places})),
    ]);
    if (requestId !== placesSearchRequestId || !isPlacesScreen()) return;
    if (tagged.status === "rejected" && mapped.status === "rejected") throw mapped.reason;
    const result = tagged.status === "fulfilled" ? tagged.value : mapped.value;
    const taggedResults = Array.isArray(result?.places) ? result.places.map(item => ({ ...item.place, ...item })) : [];
    const mapResults = mapped.status === "fulfilled" && Array.isArray(mapped.value?.places) ? mapped.value.places : [];
    const results = [...taggedResults, ...mapResults.filter(item => !taggedResults.some(old => old.id === item.id))];
    placesSearch = {
      query: normalized,
      status: "ready",
      results: results.map(item => ({ ...item.place, ...item })),
      error: mapped.status === "rejected" ? "Map search is temporarily unavailable. Showing matching tagged places." : "",
    };
    placesBrowse = { ...placesBrowse, attribution: result?.attribution || placesBrowse.attribution };
  } catch (error) {
    if (requestId !== placesSearchRequestId) return;
    placesSearch = { query: normalized, status: "error", results: [], error: error.message || "Place search is unavailable." };
  }
  if (isPlacesScreen()) render();
}
function bindPlacesActions() {
  const root = app;
  if (!root) return;
  if (!root.dataset.placeExploreBound) {
    root.dataset.placeExploreBound = "true";
    root.addEventListener("click", event => {
      const button = event.target.closest?.(".clip [data-place-explore]");
      if (!button || !root.contains(button)) return;
      event.preventDefault();
      event.stopPropagation();
      selectPlace({
        id: button.dataset.placeId || `custom:${cityMatchKey(button.dataset.placeExplore)}`,
        label: button.dataset.placeExplore,
        source: button.dataset.placeSource,
        category: button.dataset.placeCategory,
        address: button.dataset.placeAddress,
        lat: button.dataset.placeLat,
        lon: button.dataset.placeLon,
      });
    }, true);
  }
  root.querySelectorAll('[data-action="select-place"]').forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      const place = {
        id: button.dataset.placeId,
        label: button.dataset.placeLabel,
        source: button.dataset.placeSource,
        category: button.dataset.placeCategory,
        address: button.dataset.placeAddress,
        lat: button.dataset.placeLat,
        lon: button.dataset.placeLon,
      };
      selectPlace(place);
    });
  });
  const search = root.querySelector('[data-action="search"]');
  if (search) {
    const runSearch = () => {
      const query = search.value.trim();
      if (placesSearch.status === "loading" && query === placesSearch.query) return;
      void searchPlaces(query);
    };
    search.addEventListener("search", runSearch);
    search.addEventListener("input", () => {
      clearTimeout(placesSearchTimer);
      placesSearchTimer=setTimeout(()=> {
        if(search.isConnected && search.value.trim().length>=3)runSearch();
      },500);
    });
    search.addEventListener("keydown", event => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      runSearch();
    });
  }
  root.querySelector("[data-places-search-form]")?.addEventListener("submit", event => {
    event.preventDefault();
    const search = root.querySelector('[data-action="search"]');
    if (search) void searchPlaces(search.value);
  });
  root.querySelectorAll("[data-place-map-handle]").forEach(handle => {
    let startY = null;
    handle.addEventListener("pointerdown", event => {
      if (event.isPrimary === false) return;
      startY = event.clientY;
      try { handle.setPointerCapture(event.pointerId); } catch {}
    });
    handle.addEventListener("pointerup", event => {
      if (startY === null) return;
      const deltaY = event.clientY - startY;
      startY = null;
      if (Math.abs(deltaY) < 42) return;
      event.preventDefault();
      event.stopPropagation();
      placeMapClickSuppressionUntil = Date.now() + 500;
      const visible = deltaY > 0;
      if (placesMapVisible !== visible) {
        placesMapVisible = visible;
        render();
      }
    });
    handle.addEventListener("pointercancel", () => { startY = null; });
  });
  root.querySelector('[data-action="retry-place-feed"]')?.addEventListener("click", () => loadPlaceFeed({ append: placeFeed.moreError }));
  root.querySelector('[data-action="load-more"]')?.addEventListener("click", () => loadPlaceFeed({ append: true }));
  root.querySelector('[data-action="back-to-places"]')?.addEventListener("click", () => {
    selectedPlace = null;
    placesMapVisible = false;
    placeFeedRequestId++;
    placeFeed = {
      key: "", status: "idle", posts: [], hasMore: false, nextOffset: 0,
      attribution: placeFeed.attribution || placesBrowse.attribution, error: "", moreError: false,
    };
    disposePlaceDetailMap();
    render();
  });
  root.querySelector('[data-action="back-to-home"]')?.addEventListener("click", () => {
    selectedPlace = null;
    homeView = "following";
    homeTopic = "all";
    tab = "updates";
    settingsView = "home";
    profileId = null;
    placeFeedRequestId++;
    disposePlaceDetailMap();
    render();
  });
  root.querySelectorAll("[data-place-profile]").forEach(button => button.addEventListener("click", () => {
    if (button.dataset.placeProfile) navigateToProfile(button.dataset.placeProfile);
  }));
  root.querySelectorAll("[data-place-tab]").forEach(button => button.addEventListener("click", () => {
    const next = button.dataset.placeTab;
    if (!["top", "recent", "people", "tips"].includes(next) || next === placeProfileTab) return;
    placeProfileTab = next;
    if (next === "top" || next === "recent") loadPlaceFeed();
    else render();
  }));
  root.querySelector("[data-place-save]")?.addEventListener("click",async event=>{
    const button=event.currentTarget,profile=placeProfile.data,owner=api.me()?.id;
    if(!profile||button.disabled)return;
    button.disabled=true;
    try{
      const result=await requestCloudApi("/api/places/saved",{method:profile.saved?"DELETE":"PUT",body:{place:profile.place}});
      if(api.me()?.id!==owner||placeProfile.data!==profile)return;
      profile.saved=result.saved===true;
      button.setAttribute("aria-pressed",String(profile.saved));
      button.textContent=profile.saved?"Saved":"Save place";
    }catch(error){console.warn("Save place failed",error);toast("We couldn’t save this change. Please try again.");}
    finally{if(button.isConnected)button.disabled=false;}
  });
  root.querySelector("[data-place-directions]")?.addEventListener("click",event=>{
    const point=safePlaceCoordinates(selectedPlace);if(!point)return;
    event.preventDefault();
    const destination=`${point.lat},${point.lon}`;
    const url=/iPad|iPhone|iPod/.test(navigator.userAgent)
      ?`https://maps.apple.com/?daddr=${destination}`
      :`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(url,"_blank","noopener,noreferrer");
  });
  root.querySelector("[data-place-share]")?.addEventListener("click",async()=>{
    const place=selectedPlace;if(!place)return;
    const url=placePublicLink(place);
    try{
      if(navigator.share)await navigator.share({title:place.label,text:`${place.label} on Oldtime`,url:url.href});
      else{await navigator.clipboard.writeText(url.href);toast("Place link copied");}
    }catch(error){if(error.name!=="AbortError")toast("We couldn’t share this place. Please try again.");}
  });
  root.querySelector("[data-place-profile-retry]")?.addEventListener("click", () => void loadPlaceProfile());
  root.querySelector("[data-place-people-more]")?.addEventListener("click", () => void loadPlaceProfile({ more: "people" }));
  root.querySelector("[data-place-tips-more]")?.addEventListener("click", () => void loadPlaceProfile({ more: "tips" }));
  root.querySelector("[data-place-post]")?.addEventListener("click", () => {
    if (!selectedPlace) return;
    const place = { ...selectedPlace };
    openUniversalCreation({ destination: "post", initialProject: { place }, location: place.label });
  });
  root.querySelector("[data-place-review-form]")?.addEventListener("input", event => {
    const fields = new FormData(event.currentTarget);
    placeReviewDraft = { placeId: selectedPlace?.id, owner: api.me()?.id,
      rating: Number(fields.get("rating")), tip: String(fields.get("tip") || ""), tags: fields.getAll("tags") };
  });
  root.querySelector("[data-place-review-form]")?.addEventListener("submit", async event => {
    event.preventDefault();
    if (placeReviewSaving || !selectedPlace || !placeProfile.data?.canRate) return;
    const form = event.currentTarget, fields = new FormData(form);
    const id = selectedPlace.id, owner = api.me()?.id;
    const submit = form.querySelector('[type="submit"]');
    placeReviewSaving = true;
    if (submit) { submit.disabled = true; submit.textContent = "Saving…"; }
    try {
      await requestCloudApi("/api/places/reviews", {
        method: "PUT", body: { placeId: id, rating: Number(fields.get("rating")),
          tip: String(fields.get("tip") || ""), tags: fields.getAll("tags") },
      });
      if (owner !== api.me()?.id) return;
      placeReviewDraft = null;
      placeReviewSaving = false;
      toast("Your review is saved");
      if (selectedPlace?.id === id) {
        await loadPlaceProfile();
        const data = placeProfile.data;
        if (data) {
          const rating = { averageRating: data.averageRating, ratingCount: data.ratingCount };
          api.updateCloudPlaceRating(id, rating);
          placeFeed.posts.forEach(post => { if (post.place?.id === id) post.placeRating = rating; });
          render();
          app.querySelectorAll(`[data-place-rating-id]`).forEach(node => {
            if (node.dataset.placeRatingId === id) node.textContent = `★ ${Number(data.averageRating).toFixed(1)} · ${data.ratingCount}`;
          });
        }
      }
    } catch (error) { if (owner === api.me()?.id) toast(error.message || "Your review could not be saved."); }
    finally {
      placeReviewSaving = false;
      if (submit?.isConnected) { submit.disabled = false; submit.textContent = "Save review"; }
    }
  });
  root.querySelectorAll("[data-place-review-report]").forEach(button => button.addEventListener("click", async () => {
    const reason = window.prompt("Why are you reporting this review?");
    if (!reason?.trim()) return;
    button.disabled = true;
    try {
      await requestCloudApi(`/api/places/reviews/${encodeURIComponent(button.dataset.placeReviewReport)}/report`, {
        method: "POST", body: { reason: reason.trim().slice(0, 500) },
      });
      button.textContent = "Reported";
      toast("Report received");
    } catch (error) { button.disabled = false; toast(error.message || "Your report could not be sent."); }
  }));
  root.querySelectorAll('[data-action="open-post"]').forEach(button => button.addEventListener("click", async event => {
    event.preventDefault();
    event.stopPropagation();
    const postId = button.dataset.postId;
    if (!postId) return;
    try {
      if (!api.post(postId)) await api.loadCloudPost(postId);
      openPostViewer(postId, "", { source: "places" });
    } catch (error) {
      toast(error.message || "That post could not be opened.");
    }
  }));
  mountPlaceDetailMap(
    placesMapVisible ? root.querySelector("[data-place-detail-map], [data-place-discovery-map]") : null,
  );
}

function homeEmptyMessage(me) {
  const topic = HOME_TOPICS.find(item => item.id === homeTopic)?.label;
  if (homeView === "nearby" && nearbyCity !== "all") return `No photos or videos near ${nearbyCity || me.city} yet. Try another area.`;
  if (homeTopic === "interests" && !me.interests?.length) return "Choose interests to find posts about the things you care about.";
  if (homeTopic !== "all") {
    const scope = homeView === "nearby" ? `near ${nearbyCity === "all" ? "these areas" : nearbyCity}` : homeView === "following" ? "from people you follow" : "in Explore";
    return `No ${topic?.toLowerCase() || "topic"} posts ${scope} yet. Try another topic.`;
  }
  if (homeView === "nearby") return "No nearby photos or videos yet. Choose another area or explore everything.";
  if (homeView === "following") return "Photos and videos from people you follow will appear here.";
  return "No photos or videos to show yet.";
}

function copyText(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  let copied = false;
  try { copied = document.execCommand("copy"); } catch { copied = false; }
  ta.remove();
  return copied;
}
async function copyShareLink(url) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch {}
  return copyText(url);
}
async function shareExternally({ title, text, url }) {
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch (error) {
      if (error?.name === "AbortError") return "cancelled";
    }
  }
  return await copyShareLink(url) ? "copied" : "failed";
}
function toast(msg) {
  const t = $(".toast"); if (!t) return;
  t.textContent = publicNotice(msg); t.style.display = "block";
  clearTimeout(toast._t); toast._t = setTimeout(() => t.style.display = "none", 1600);
}
function screenScrollContext(inner) {
  const rootMarkup = inner.match(/^\s*<[a-z][\w:-]*\b[^>]*>/i)?.[0] || "";
  const screenClass = rootMarkup.match(/\bclass="([^"]*)"/i)?.[1] || "screen";
  const declaredContext = rootMarkup.match(/\bdata-scroll-context="([^"]+)"/i)?.[1] || "";
  const routeMarkers = [...rootMarkup.matchAll(/\b(data-(?:ap-view|ct-view|chat-view|places-view))="([^"]*)"/gi)]
    .map(([, name, value]) => `${name}:${value}`)
    .join("|");
  const accountContext = api.me()?.id || "guest";
  const routeContext = viewer
    ? `post:${viewer}:${viewerSource || "direct"}`
    : tab === "updates" && profileId
      ? `profile:${profileId}:${profileMode}`
      : tab === "updates"
        ? `home:${homeView}:${homeTopic}:${selectedPlace?.id || "browse"}`
        : tab === "communities"
          ? `community:${communityView}`
          : tab === "chat"
            ? `chat:${chatId || "inbox"}`
            : tab === "search"
              ? `search:${searchSection}:${discoveryTopic}`
              : tab === "notes"
                ? "notifications"
                : tab === "settings"
                  ? `settings:${settingsView}`
                  : `${tab}:${profileId || ""}:${chatId || ""}:${settingsView || ""}`;
  return `${accountContext}:${routeContext}|${screenClass}|${routeMarkers}|${declaredContext}`;
}
function inboxUnreadCount(me) {
  return unreadInboxCount(api.db().convos, me);
}
function cacheScreenScroll(context, snapshot) {
  if (!context) return;
  screenScrollCache.delete(context);
  screenScrollCache.set(context, snapshot || []);
  while (screenScrollCache.size > 48) {
    screenScrollCache.delete(screenScrollCache.keys().next().value);
  }
}
function shell(inner, mode, { hideNav = false } = {}) {
  hideNav = hideNav || (tab === "chat" && Boolean(chatId));
  if (!hideNav && tab === "updates" && !profileId && !viewer) {
    inner = inner.replace(/(<(?:header|div)\b[^>]*\bclass="[^"]*\bhome-primary-row\b[^"]*"[^>]*>)/,
      opening => opening + `<button type="button" class="app-search-shortcut" data-tab="search" aria-label="Search" data-testid="button-header-search">${ic.search}</button>`);
  }
  if (!hideNav && tab === "communities") {
    const owner = api.me();
    const ownerAvatar = profileNavigationAvatarMarkup(owner);
    inner = inner.replace(/(<(?:header|div)\b[^>]*\bclass="[^"]*\b(?:home-primary-row|community-header)\b[^"]*"[^>]*>)/,
      opening => opening + `<button type="button" class="app-profile-shortcut" data-tab="profile" aria-label="Your profile" data-testid="button-header-profile"><span class="nav-profile-frame">${ownerAvatar}</span></button>`);
  }
  if (document.querySelector(".emoji-overlay")) {
    deferredEmojiRender = true;
    return;
  }
  const communitiesScreen = inner.includes("community-screen");
  const profileScreen = inner.includes("profile-screen");
  const homeScreen = inner.includes("home-screen");
  const mediaFeedScreen = (homeScreen && /\bclass="[^"]*\bclip\b/.test(inner)) || inner.includes('<div class="feed">');
  const light = mode === "light" || (homeScreen && !mediaFeedScreen);
  const blastWorkspace = inner.includes('class="blast-x-workspace"');
  const darkSurface = mediaFeedScreen || inner.includes("post-viewer-media") || inner.includes("post-viewer-place");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", darkSurface ? "#090a0c" : "#ffffff");
  const stableContext = tab === "chat" ? `chat:${api.cloudAccountId()}:${chatId || "inbox"}`
    : tab === "updates" && !profileId && !viewer ? `home:${api.cloudAccountId()}:${homeView}` : "";
  if (stableContext && reconcileActiveScreen(app.querySelector(".screen.on"), inner, stableContext)) {
    closeChatTimers();
    feedObserver?.disconnect();
    const profileShortcut = app.querySelector(".app-profile-shortcut");
    if (profileShortcut) profileShortcut.onclick = () => navigateMainSection("profile");
    const homeSearchShortcut = app.querySelector(".app-search-shortcut");
    if (homeSearchShortcut) homeSearchShortcut.onclick = () => navigateMainSection("search");
    // A refresh can move Home between empty/loading and real media without
    // replacing its screen. Keep the surrounding navigation theme in sync.
    app.querySelector(".phone")?.classList.toggle("light", light);
    app.querySelector(".phone")?.classList.toggle("media-feed-phone", mediaFeedScreen);
    app.querySelector("nav.nav")?.classList.toggle("lightnav", light);
    hydrateLocalMedia(app);
    return;
  }
  const activeElement = document.activeElement;
  const focusSnapshot = activeElement && app.contains(activeElement) &&
    activeElement.matches("input, textarea, [contenteditable=true]")
    ? {
        id: activeElement.id,
        start: typeof activeElement.selectionStart === "number" ? activeElement.selectionStart : null,
        end: typeof activeElement.selectionEnd === "number" ? activeElement.selectionEnd : null,
      }
    : null;
  const previousScreen = app.querySelector(".screen.on");
  const previousNav = app.querySelector("nav.nav");
  const existingFeedEntryKeys = new Set(
    [...(previousScreen?.querySelectorAll(".clip[data-id], .community-post-card[data-testid]") || [])]
      .map(item => item.dataset.id || item.dataset.testid || "")
      .filter(Boolean),
  );
  const previousScrollContext = previousScreen?.dataset.scrollContext;
  const nextScrollContext = screenScrollContext(inner);
  const sameScreen = previousScrollContext === nextScrollContext;
  const communityTabChange = previousScreen?.classList.contains("community-screen") &&
    inner.includes("community-screen") && !sameScreen;
  const currentScrollSnapshot = previousScreen ? capturePreservedScroll(previousScreen) : [];
  if (previousScreen?.classList.contains("post-viewer-screen") && !inner.includes("post-viewer-screen")) {
    bindExploreViewerSwipe.offKey?.();
    bindMediaViewerComments.cleanup?.();
  }
  if (previousScrollContext) cacheScreenScroll(previousScrollContext, currentScrollSnapshot);
  const navigationSnapshot = pendingNavigationScrollRestore?.context === nextScrollContext
    ? pendingNavigationScrollRestore.scroll
    : null;
  const scrollSnapshot = navigationSnapshot
    ?? (sameScreen ? currentScrollSnapshot : screenScrollCache.get(nextScrollContext) || []);
  const preservedSheet = sameScreen ? app.querySelector("#sheet.on") : null;
  const preservedStoryView = sameScreen ? app.querySelector("#storyview.on") : null;
  const oldProfileActionSheet = sameScreen ? app.querySelector("#profile-actions-sheet") : null;
  const preservedProfileActionSheet = oldProfileActionSheet &&
    (oldProfileActionSheet.classList.contains("on") || oldProfileActionSheet.getAttribute("aria-hidden") === "false")
    ? oldProfileActionSheet
    : null;
  const preservedDrawer = sameScreen ? app.querySelector("#app-drawer.on") : null;
  if (!preservedStoryView) {
    storyUi?.dispose();
    storyUi = null;
  }
  mountRepostAffordances(null);
  closeEmojiPicker();
  const conversation = $("#msgs")?.dataset.convo;
  closeVoiceNote(!conversation || !inner.includes(`data-convo="${conversation}"`));
  closeChatTimers();
  if (!preservedStoryView) clearInterval(storyTimer);
  feedObserver?.disconnect();
  const me = api.me();
  const profileAvatar = profileNavigationAvatarMarkup(me);
  // Free players of discarded post videos (preserved sheet/story nodes and the floating player are skipped).
  if (previousScreen) releasePostVideos(previousScreen);
  app.innerHTML = `<div class="stage"><div class="phone ${light ? "light" : ""} ${communitiesScreen ? "stories-phone" : ""} ${mediaFeedScreen ? "media-feed-phone" : ""} ${blastWorkspace ? "blast-wide-phone" : ""}">
    ${inner}
    <nav class="nav ${light ? "lightnav" : ""} ${profileScreen ? "profile-nav" : ""} ${communitiesScreen ? "community-nav" : ""} ${hideNav ? "nav-hidden" : ""}" aria-label="Primary navigation">
      <button type="button" data-tab="updates" class="${tab === "updates" && !profileId ? "on" : ""}" aria-label="Home">${ic.home}<span class="nav-label">Home</span></button>
      <button type="button" data-tab="communities" class="${tab === "communities" ? "on" : ""}" aria-label="Community" data-testid="button-nav-community">${ic.users}<span class="nav-label">Community</span></button>
      <button type="button" class="nav-create-button" id="create-open" aria-label="Create" data-testid="button-nav-create"><span class="nav-create-icon">${ic.plus}</span><span class="nav-label">Create</span></button>
      <button type="button" data-tab="chat" class="${tab === "chat" ? "on" : ""}" aria-label="Messages"><span class="nav-message-frame">${ic.messages}<span class="nav-unread" ${inboxUnreadCount(me) ? "" : "hidden"} aria-label="${inboxUnreadCount(me)} unread messages">${inboxUnreadCount(me) > 99 ? "99+" : inboxUnreadCount(me)}</span></span><span class="nav-label">Messages</span></button>
      <button type="button" data-tab="profile" class="${profileScreen && profileId && String(profileId) === String(me.id) ? "on" : ""}" aria-label="Profile" data-testid="button-nav-profile"><span class="nav-profile-frame">${profileAvatar}</span><span class="nav-label">Profile</span></button>
    </nav>
    <div class="app-drawer" id="app-drawer" hidden aria-hidden="true">
      <button class="drawer-scrim" id="drawer-scrim" type="button" aria-label="Close menu"></button>
      <aside class="drawer-panel" role="dialog" aria-modal="true" aria-label="Oldtime navigation">
        <header class="drawer-header">
          <button type="button" class="drawer-account" data-drawer-route="profile" data-testid="button-drawer-profile">
            <img src="${esc(me.avatar || "")}" alt="" />
            <span><b>${esc(me.name || me.username)}</b><small>@${esc(me.username)}</small></span>
            <span class="drawer-chevron" aria-hidden="true">›</span>
          </button>
          <button type="button" class="drawer-close" id="drawer-close" data-testid="button-close-app-menu" aria-label="Close menu">${ic.close}</button>
        </header>
        <div class="drawer-links">
          <p class="drawer-label">Oldtime</p>
          <button type="button" class="drawer-link" data-drawer-route="notes" data-testid="button-drawer-notifications">${ic.bell}<span>Notifications</span></button>
          <button type="button" class="drawer-link" data-drawer-route="settings" data-testid="button-drawer-settings">${ic.settings}<span>Settings</span></button>
        </div>
        <div class="drawer-footer"><span>OLDTIME TECHNOLOGIES</span><small>Your Oldtime account, in one place.</small></div>
      </aside>
    </div>
    <div class="toast" role="status"></div>
    <div class="sheet" id="sheet"></div>
    <div class="storyview" id="storyview"></div>
  </div></div>`;
  if (!hideNav && !profileScreen) {
    const header = app.querySelector(".home-primary-row, .community-header");
    if (header) {
      if (communitiesScreen) header.querySelectorAll(".community-search-button").forEach(button => button.remove());
    }
  }
  const nextScreen = app.querySelector(".screen.on");
  if (nextScreen) {
    nextScreen.dataset.scrollContext = nextScrollContext;
    nextScreen.dataset.scrollRestored = String(scrollSnapshot.length > 0);
    if (!sameScreen && !communityTabChange) {
      nextScreen.classList.add("motion-screen-enter");
      const clearScreenEntry = event => {
        if (event.target === nextScreen) {
          nextScreen.classList.remove("motion-screen-enter");
          nextScreen.removeEventListener("animationend", clearScreenEntry);
        }
      };
      nextScreen.addEventListener("animationend", clearScreenEntry);
    }
    let staggerIndex = 0;
    for (const item of nextScreen.querySelectorAll(".clip[data-id], .community-post-card[data-testid]")) {
      if (communityTabChange || item.matches(".community-post-card")) continue;
      const key = item.dataset.id || item.dataset.testid || "";
      if (!key || existingFeedEntryKeys.has(key) || staggerIndex >= 4) continue;
      item.classList.add("motion-feed-entry");
      item.style.setProperty("--motion-entry-delay", `${staggerIndex * 44}ms`);
      item.addEventListener("animationend", () => {
        item.classList.remove("motion-feed-entry");
        item.style.removeProperty("--motion-entry-delay");
      }, { once: true });
      staggerIndex++;
    }
  }
  if (preservedSheet) app.querySelector("#sheet")?.replaceWith(preservedSheet);
  if (preservedStoryView) app.querySelector("#storyview")?.replaceWith(preservedStoryView);
  if (preservedProfileActionSheet) app.querySelector("#profile-actions-sheet")?.replaceWith(preservedProfileActionSheet);
  if (preservedDrawer) app.querySelector("#app-drawer")?.replaceWith(preservedDrawer);
  retainNavigation(previousNav, app.querySelector("nav.nav"));
  if (stableContext) app.querySelector(".screen.on")?.setAttribute("data-stable-context", stableContext);
  if (scrollSnapshot.length && nextScreen) {
    restorePreservedScroll(nextScreen, scrollSnapshot);
  }
  cacheScreenScroll(nextScrollContext, scrollSnapshot);
  pendingNavigationScrollRestore = null;
  app.querySelectorAll(".nav-profile-avatar").forEach(image => {
    if (image.dataset.errorBound) return;
    image.dataset.errorBound = "true";
    image.addEventListener("error", () => { image.hidden = true; }, { once: true });
  });
  $("#drawer-close") && ($("#drawer-close").onclick = closeAppDrawer);
  $("#drawer-scrim") && ($("#drawer-scrim").onclick = closeAppDrawer);
  app.querySelectorAll("[data-drawer-route]").forEach(button => {
    button.onclick = () => {
      if (hasPendingSettingsChanges && !confirm("Discard your unsaved settings changes?")) return;
      hasPendingSettingsChanges = false;
      navigateFromDrawer(button.dataset.drawerRoute);
    };
  });
  app.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => navigateMainSection(b.dataset.tab));
  if (app.querySelector("#create-open")) app.querySelector("#create-open").onclick = openHomeCreate;
  app.querySelectorAll('#back, #playall').forEach(button => {
    const symbols = { "←": ["back", "Back"], "✕": ["close", "Close"], "▶": ["play", "Play"] };
    const replacement = symbols[button.textContent.trim()];
    if (replacement) { button.innerHTML = icon(replacement[0]); button.setAttribute("aria-label", replacement[1]); }
  });
  app.querySelectorAll("[data-creator-open]").forEach(button => button.onclick = () => navigateFromDrawer(button.dataset.creatorOpen));
  void hydrateBlueBadges(app);
  if (helpfulSurface()) scheduleCreatorAnnouncement({ app,esc,navigate:navigateHelpfulPrompt,toast,accountId:api.cloudAccountId(),
    getContext:()=>({page:helpfulSurface(),hasCover:!!api.me()?.cover,friendCount:api.me()?.friends?.length||0,
      hasNote:api.posts().some(p=>p.author===api.me()?.id&&p.kind==="text"),
      ...interestContext(api.cloudAccountId()||api.me()?.id||""),composing:isComposing(),recording:!!document.querySelector(".creative-editor.is-capturing")}),isSafe:isHelpfulSurfaceSafe });
  if (focusSnapshot?.id) requestAnimationFrame(() => {
    const next = app.querySelector(`#${CSS.escape(focusSnapshot.id)}`);
    if (!next || !next.matches("input, textarea, [contenteditable=true]")) return;
    next.focus({ preventScroll: true });
    if (focusSnapshot.start !== null && typeof next.setSelectionRange === "function") {
      next.setSelectionRange(focusSnapshot.start, focusSnapshot.end ?? focusSnapshot.start);
    }
  });
}

function refreshCloudStoriesWhenNeeded() {
  if (api.authMode() !== "cloud" || !api.cloudStoriesNeedsRefresh() || api.cloudStoriesLoading()) return;
  const owner = api.cloudAccountId();
  const route = { tab, profileId, settingsView };
  const isSameRoute = () => api.cloudAccountId() === owner && tab === route.tab &&
    profileId === route.profileId && settingsView === route.settingsView;
  void api.refreshCloudStories().then(() => {
    if (isSameRoute()) render();
  }).catch(error => {
    if (isSameRoute()) {
      toast(error.message || "Stories could not be loaded.");
    }
  });
}
function isComposing() {
  if(document.querySelector(".creative-editor,.creative-response"))return true;
  const el=document.activeElement;
  return !!el&&(/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)||el.isContentEditable);
}
function helpfulSurface() {
  if(tab==="blast"&&!isBlastGuidanceSafe())return null;
  if(tab==="updates")return profileId?"profile":"home";
  if(tab==="settings")return settingsView==="home"?"settings":null;
  return {blast:"blast",chat:"messages",communities:"communities",notes:"notifications"}[tab]||null;
}
function isHelpfulSurfaceSafe() {
  return (tab!=="blast"||isBlastGuidanceSafe()) && !viewer && !chatId && !hasPendingSettingsChanges && !document.hidden && !isComposing()
    && !$("#sheet.on, #storyview.on, .creative-editor, .sp, .app-drawer.on, .emoji-overlay, .bvn-drawer-backdrop, .bvn-composer, .bvn-thread-wrap, .blast-notes-composer, .blast-create")
    && !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)
    && !document.activeElement?.isContentEditable;
}
async function inviteToBlast() {
  const me=api.me();if(!me)return;
  const text=`Let's try Oldtime Community. My Oldtime username is @${me.username}. Open Community to find people and share posts.`;
  try {
    if(navigator.share)await navigator.share({title:"Try Oldtime Community with me",text});
    else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);toast("Invite copied. Share it with your friends.");}
    else toast(`Your Oldtime username is @${me.username}. Share it with your friends.`);
  } catch(error) {if(error.name!=="AbortError")toast(`Sharing wasn't available. Your username is @${me.username}.`);}
}
function navigateHelpfulPrompt(route) {
  if(route==="help-blast-invite"){void inviteToBlast();return;}
  if(route==="help-cover"){openEditProfile();return;}
  if(route==="help-create"){openHomeCreate();return;}
  if(route==="help-note"){toast("This help article is unavailable right now.");return;}
  if(route==="help-messages"){navigateFromDrawer("chat");return;}
  if(route==="help-communities"){navigateFromDrawer("communities");return;}
  if(route==="help-friends"||route==="help-blast"){
    navigateFromDrawer("communities");return;
  }
  if(route.startsWith("settings:")){
    const view=route.slice(9);
    if(!["privacy-center","chat","notifications"].includes(view))return;
    navigationStack.push(captureNavigationState());
    settingsViewStack.length=0;
    closeAppDrawer();tab="settings";settingsView=view;profileId=null;chatId=null;viewer=null;render();return;
  }
  navigateFromDrawer(route);
  if(route.startsWith("help-article-")&&navigationStack.length){
    navigationStack.at(-1).helpfulArticle=route;
    $("#settings-back")?.setAttribute("aria-label","Back to previous screen");
  }
}
function likesRow(post) {
  const me=api.me();
  const people=post.cloud?(post.likedBy||[]):post.likes.map(id=>api.user(id)).filter(Boolean).map(u=>({id:u.id,displayName:u.name,avatarUrl:u.avatar}));
  return renderPostLikesRow({id:post.id,count:post.cloud?post.likeCount:post.likes.length,people,viewerId:me?.id,esc});
}
function updateLikesRow(post) {
  app.querySelectorAll("[data-post-likes]").forEach(row=>{
    if(row.dataset.postLikes===post.id)row.outerHTML=likesRow(post);
  });
  // A post without likes has no row yet. Insert after its author handle.
  app.querySelectorAll(".clip[data-id]").forEach(clip=>{
    if(clip.dataset.id===post.id&&!clip.querySelector("[data-post-likes]"))clip.querySelector(".handle")?.insertAdjacentHTML("afterend",likesRow(post));
  });
  app.querySelectorAll("[data-post-likes] [data-profile]").forEach(button=>button.onclick=e=>{
    e.stopPropagation();navigateToProfile(button.dataset.profile);
  });
  app.querySelectorAll("[data-post-likes] [data-avatar-profile]").forEach(button=>button.onclick=e=>{
    e.stopPropagation();openPersonAvatar(button.dataset.avatarProfile);
  });
}
function captureNavigationState() {
  const screen = app.querySelector(".screen.on");
  return {
    tab, homeView, homeTopic, communityView, communityTopic, nearbyCity, profileId, profileMode, chatId,
    profileReturnChatId, viewer, viewerSource, viewerSearchQuery, settingsView, settingsViewStack: [...settingsViewStack], searchQ,
    selectedPlace: selectedPlace ? { ...selectedPlace } : null, placeReturnTo, placesMapVisible,
    scrollContext: screen?.dataset.scrollContext || "",
    scroll: capturePreservedScroll(screen),
  };
}
function openSettingsSubview(route) {
  if (route !== settingsView) settingsViewStack.push(settingsView);
  settingsView = route;
  render();
}
function openAppDrawer() {
  const drawer = $("#app-drawer");
  if (!drawer) return;
  drawerReturnFocus = document.activeElement;
  drawer.hidden = false;
  drawer.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => { if (!drawer.hidden) drawer.classList.add("on"); });
  $("#drawer-close")?.focus();
  drawerEscapeHandler = event => {
    if (event.key === "Escape") closeAppDrawer();
  };
  document.addEventListener("keydown", drawerEscapeHandler);
}
function closeAppDrawer() {
  const drawer = $("#app-drawer");
  if (drawer) {
    drawer.classList.remove("on");
    drawer.hidden = true;
    drawer.setAttribute("aria-hidden", "true");
  }
  if (drawerEscapeHandler) {
    document.removeEventListener("keydown", drawerEscapeHandler);
    drawerEscapeHandler = null;
  }
  const focusTarget = drawerReturnFocus?.isConnected ? drawerReturnFocus : $("#profile-actions-open, #community-search-open");
  drawerReturnFocus = null;
  focusTarget?.focus({ preventScroll: true });
}
async function navigateFromDrawer(route) {
  closeAppDrawer();
  if (route === "blast") route = "communities";
  if (route === "sports" && !SPORTS_MODE_ENABLED) route = "updates";
  const isSupportRoute = route === "help" || route.startsWith("help-");
  const isToolsRoute = ACCOUNT_TOOL_ROUTES.includes(route) || CREATOR_TOOL_ROUTES.includes(route);
  if (!isSupportRoute && !isToolsRoute && !["updates", "search", "communities", "chat", "profile", "notes", "settings"].includes(route)) {
    route = "updates";
  }
  if (route === "communities") return navigateMainSection("communities");
  if (route === "sports") {
    let openSportsMode, sports, sportsSocial;
    try {
      [{ openSportsMode }, { sports }, { sportsSocial }] = await Promise.all([
        import("./sports-mode.js"), import("./sports-engine.js"), import("./sports-social.js"),
      ]);
    } catch (error) {
      console.error("[Oldtime sports] Could not load the Sports experience.", error);
      toast("Sports could not be opened. Please try again.");
      return;
    }
    openSportsMode({ toast,
      onShare: async ({ media, caption }) => {
        // Register generated recordings like uploads; unregistered blob URLs
        // cannot be saved or published from the editor.
        const source = media.blob ? await putLocalMedia(media.blob) : media.url;
        openUniversalCreation({
          background: { media: source, kind: media.type === "video" ? "video" : "photo" }, caption,
        });
        if (media.blob && media.url?.startsWith("blob:")) URL.revokeObjectURL(media.url);
        return true;
      },
      onPublish: async ({ workout, caption, media, challengeId, taggedUserIds = [] }) => {
        if (!api.me()?.cloudAccountId) throw new Error("Sign in to sync this activity and publish it to Oldtime.");
        if (!workout.synced) workout = await sports.sync(workout.id);
        // Freeze the selected canonical tags into the shared card metadata.
        // Validate before uploading so a failed tag never publishes a misleading card.
        await sportsSocial.tagWorkout(workout.id, { challengeId: challengeId || null, taggedUserIds });
        let content = media.blob, mime = media.mime || content?.type;
        if (media.type !== "video") {
          const source = await (await fetch(media.url)).blob();
          const image = await createImageBitmap(source);
          const canvas = document.createElement("canvas");
          canvas.width = image.width; canvas.height = image.height;
          canvas.getContext("2d").drawImage(image, 0, 0); image.close();
          content = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", .88)); mime = "image/jpeg";
        }
        if (!content) throw new Error("The card or video could not be exported.");
        const upload = await requestCloudApi(`/api/sports/workouts/${workout.id}/card`, {
          method: "POST", rawBody: content, contentType: mime,
        });
        const name = ({run:"Run",walk:"Walk",cycle:"Ride",hike:"Hike"})[workout.activityType];
        const post = await api.createCloudPost(caption.trim() || `${name} · ${(workout.summary.distanceM / 1000).toFixed(2)} km on Oldtime`,
          { workoutId: workout.id, sportsCardId: upload.cardId });
        viewer = null; profileId = null; tab = "updates"; settingsView = "home";
        homeView = "following"; homeTopic = "all";
        render();
        requestAnimationFrame(() => {
          const feed = $("#feed");
          const card = [...(feed?.children || [])].find(item => item.dataset.id === post.id);
          card?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        toast("Posted to your main feed");
      },
    });
    return;
  }
  if (route === "notes") {
    if (tab !== "notes") openNotifications();
    return;
  }
  if (route === "settings" && tab === "settings") {
    settingsViewStack.length = 0;
    settingsView = "home";
    render();
    return;
  }
  if (route === "profile" && tab === "updates" && profileId === api.me().id) return;
  if (route !== "settings" && route === tab && !profileId && !chatId && !viewer) return;

  navigationStack.push(captureNavigationState());
  settingsViewStack.length = 0;
  profileReturnChatId = null;
  if (!isToolsRoute) {
    notificationsOrigin = null;
    notificationsReturnStack = [];
  }
  settingsView = "home";
  viewer = null;
  viewerSource = "";
  if (route === "profile") {
    tab = "updates";
    profileId = api.me().id;
    profileMode = "posts";
    chatId = null;
  } else {
    tab = isSupportRoute ? "settings" : route;
    if (isSupportRoute) settingsView = route;
    profileId = null;
    chatId = null;
  }
  render();
}
function restoreNavigationState(state) {
  if (!state) return;
  ({ tab, homeView, homeTopic, communityView, nearbyCity, profileId, profileMode, chatId, profileReturnChatId, viewer, viewerSource, settingsView, searchQ } = state);
  selectedPlace = state.selectedPlace ? { ...state.selectedPlace } : null;
  placeReturnTo = state.placeReturnTo === "places" ? "places" : "home";
  placesMapVisible = state.placesMapVisible === true;
  settingsViewStack.splice(0, settingsViewStack.length, ...(state.settingsViewStack || []));
  viewerSource ||= "";
  viewerSearchQuery = viewerSource === "search" && typeof state.viewerSearchQuery === "string" ? state.viewerSearchQuery : "";
  communityView = state.communityView === "following" ? "following" : "for-you";
  communityTopic = typeof state.communityTopic === "string" ? state.communityTopic : "";
  pendingNavigationScrollRestore = state.scrollContext
    ? { context: state.scrollContext, scroll: state.scroll || [] }
    : null;
}
function navigateBack() {
  const previous = navigationStack.pop();
  if (!previous) return false;
  restoreNavigationState(previous);
  render();
  return true;
}
function navigateToProfile(id, { fromChat = false } = {}) {
  recordProfileVisit(id,fromChat?"direct":viewer?"content":tab==="search"?"search":tab==="communities"?"community":"direct");
  if (notificationsReturnStack.length) notificationsReturnStack.push(captureNavigationState());
  else navigationStack.push(captureNavigationState());
  if (fromChat) profileReturnChatId = chatId;
  else profileReturnChatId = null;
  profileId = id;
  profileMode = "posts";
  tab = "updates";
  viewer = null;
  viewerSource = "";
  render();
}
function openPersonAvatar(id) {
  const story = api.stories()
    .filter(item => item.author === id && isStoryActive(item) && api.canSeeStory(item))
    .sort((a, b) => b.created - a.created)[0];
  if (story) return openStory(id, story.id);
  if (id === api.me()?.id) return openStory(id);
  return navigateToProfile(id);
}
function openPostViewer(id, commentId = "", { source = "", searchQuery = "" } = {}) {
  const originalPost = api.post(id);
  if (originalPost && !profilePostMedia(originalPost).length && !originalPost.creativeProject) {
    if (commentId) comments(id, commentId);
    else openCommunityOriginalPostSheet(originalPost);
    return;
  }
  if (source === "places") {
    notificationsOrigin = null;
    notificationsReturnStack = [];
  }
  const currentState = captureNavigationState();
  placesViewerReturnState = source === "places" ? {
    ...currentState,
    tab: "updates",
    homeView: "nearby",
    homeTopic: "all",
    profileId: null,
    viewer: null,
    viewerSource: "",
    settingsView: "home",
    selectedPlace: selectedPlace ? { ...selectedPlace } : currentState.selectedPlace,
  } : null;
  placesViewerReturnStackDepth = source === "places" ? navigationStack.length : null;
  if (notificationsReturnStack.length) notificationsReturnStack.push(captureNavigationState());
  else navigationStack.push(captureNavigationState());
  viewer = id;
  viewerSource = ["places", "explore", "search"].includes(source) ? source : "";
  viewerSearchQuery = viewerSource === "search" ? String(searchQuery || "").trim().slice(0, 120) : "";
  profileId = null;
  render();
  if (commentId) comments(id, commentId);
}
function openCommunityOriginalPostSheet(post) {
  const sheet = $("#sheet");
  if (!post || !sheet || !api.canSeePost(post)) return toast("Post unavailable");
  const authorSource = post.author && typeof post.author === "object" ? post.author : {};
  const authorId = authorSource.id || post.authorId || (typeof post.author === "string" ? post.author : "");
  const author = (authorId && api.user(authorId)) || authorSource || {};
  const name = author.name || author.displayName || author.username || post.authorName || "Oldtime member";
  const handle = author.username || post.authorUsername || "";
  const avatar = author.avatar || author.avatarReference || author.avatarUrl || post.authorAvatar || "";
  const initial = String(name).trim().slice(0, 1).toUpperCase() || "O";
  const text = String(post.text || post.caption || "").trim();
  const likes = Number(post.likeCount ?? post.likes?.length ?? 0);
  const reposts = Number(post.repostCount ?? post.reposts?.length ?? 0);
  const replies = Number(post.commentCount ?? post.comments?.length ?? 0);
  const views = Number.isSafeInteger(post.measuredViews) ? post.measuredViews : null;
  sheet.classList.add("on");
  sheet.innerHTML = `<section class="panel community-original-post-panel" role="dialog" aria-modal="true" aria-labelledby="community-original-post-title"><div class="grab"></div><header><h2 id="community-original-post-title">Original post</h2><button type="button" data-original-post-close aria-label="Close original post">${ic.close}</button></header><article class="community-original-post-card"><div class="community-original-post-author"><span class="community-original-post-avatar"><span>${esc(initial)}</span>${avatar ? `<img ${profileMediaSource(avatar)} alt="" />` : ""}</span><span><b>${esc(name)}</b><small>${handle ? `@${esc(handle)} · ` : ""}${ago(Number(post.created || post.createdAt))}</small></span></div><p>${renderMentionText(text, { tag: "span" })}</p><div class="community-original-post-metrics" aria-label="Post activity"><span>${ic.heart}<b>${fmt(likes)}</b></span><span>${ic.repost}<b>${fmt(reposts)}</b></span><span>${ic.comment}<b>${fmt(replies)}</b></span>${views === null ? "" : `<span>${ic.viewBars}<b>${fmt(views)}</b></span>`}</div></article></section>`;
  const close = () => {
    sheet.classList.remove("on");
    sheet.innerHTML = "";
    sheet.onclick = null;
  };
  sheet.querySelector("[data-original-post-close]")?.addEventListener("click", close);
  sheet.onclick = event => { if (event.target === sheet) close(); };
  void hydrateLocalMedia(sheet);
}
function openNotifications() {
  if (tab === "notes") return;
  if (hasPendingSettingsChanges && !confirm("Discard your unsaved settings changes?")) return;
  hasPendingSettingsChanges = false;
  notificationsOrigin = captureNavigationState();
  notificationsReturnStack = [];
  tab = "notes";
  profileId = null;
  chatId = null;
  viewer = null;
  settingsView = "home";
  void Promise.all([loadAccountNotifications({ force: true }), api.refreshCloudRelationships({ force: true })])
    .then(() => { if (tab === "notes") render(); }).catch(() => { if (tab === "notes") render(); });
  render();
}
function backFromNotificationDetail() {
  const previous = notificationsReturnStack.pop();
  if (!previous) return false;
  restoreNavigationState(previous);
  render();
  return true;
}
function leaveNotifications() {
  const previous = notificationsOrigin || { tab: "updates", homeView, homeTopic, profileId: null, profileMode, chatId: null, profileReturnChatId: null, viewer: null, settingsView };
  notificationsOrigin = null;
  notificationsReturnStack = [];
  restoreNavigationState(previous);
  render();
}
let toolsOwner=null,toolsReady=false,toolsLoading=false,toolsAttempt=0;
function ensureAccountTools(){
  const account=api.cloudAccountId();
  if(account!==toolsOwner){toolsOwner=account;toolsReady=false;toolsLoading=false;toolsAttempt=0;resetAccountTools();}
  if(!account||toolsReady||toolsLoading||Date.now()-toolsAttempt<30000)return;
  toolsLoading=true;toolsAttempt=Date.now();
  void loadAccountTools().then(()=>{
    if(api.cloudAccountId()!==account)return;
    toolsReady=true;
    mutate(db=>{const user=db.users.find(u=>u.id===api.me()?.id);if(user)user.professional={...getAccountTools()};});
    render();
  }).catch(()=>{}).finally(()=>{if(api.cloudAccountId()===account)toolsLoading=false;});
}
window.addEventListener("oldtime-account-tools",()=>{
  if(!api.me())return;
  mutate(db=>{const user=db.users.find(u=>u.id===api.me().id);if(user)user.professional={...getAccountTools()};});
  // The switching screen controls its own navigation; do not unmount its
  // confirmation/success flow before the successful handler completes.
});
function navigateMainSection(section) {
  if (hasPendingSettingsChanges && !confirm("Discard your unsaved settings changes?")) return;
  hasPendingSettingsChanges = false;
  placesViewerReturnState = null;
  placesViewerReturnStackDepth = null;
  if (section === "blast") section = "communities";
  if (!["updates", "communities", "search", "chat", "profile"].includes(section)) section = "updates";
  const nextTab = section === "profile" ? "updates" : section;
  if (tab !== nextTab || profileId || chatId || viewer) navigationStack.push(captureNavigationState());
  if (section === "updates" && homeView === "nearby") {
    selectedPlace = null;
    homeView = "following";
    homeTopic = "all";
    placeFeedRequestId++;
    disposePlaceDetailMap();
  }
  profileReturnChatId = null;
  notificationsOrigin = null;
  notificationsReturnStack = [];
  tab = nextTab;
  settingsView = "home";
  viewer = null;
  viewerSource = "";
  if (section === "profile") { profileId = api.me().id; tab = "updates"; profileMode = "posts"; }
  else { chatId = null; profileId = null; }
  render();
}

bindSectionSwipes({
  root: app,
  current: () => tab === "updates" ? homeView : app.querySelector(".nav:not(.nav-hidden) [data-tab].on")?.dataset.tab,
  sections: () => tab === "updates" ? ["explore", "following", "nearby"] : ["updates", "communities", "chat", "search"],
  enabled: () => !!api.me() && !chatId && !viewer &&
    !!app.querySelector(".nav:not(.nav-hidden) [data-tab].on") &&
    !document.querySelector("#sheet.on,#storyview.on,.creative-editor,.app-drawer.on,.emoji-overlay,.gob,.ch-back,.pp-back,details[open]") &&
    !document.activeElement?.matches("input,textarea,select,[contenteditable=true]"),
  navigate: section => { if (tab === "updates") { homeView = section; render(); } else navigateMainSection(section); },
});

function render() {
  try {
    return renderScreen();
  } catch (error) {
    console.error("An Oldtime screen could not be rendered.", error);
    const content = `<section class="screen on"><div class="screen-retry" role="alert"><h1>Couldn’t open this screen</h1><p>Your content hasn’t been changed.</p><button type="button" id="screen-retry">Try again</button></div></section>`;
    try { shell(content, "light"); }
    catch { app.innerHTML = content; }
    app.querySelector("#screen-retry").onclick = () => render();
  }
}
let activePasswordRecoveryToken = "";
let authNotice = "";
window.addEventListener("hashchange", () => {
  const recoveryToken = new URLSearchParams(location.hash.slice(1)).get("password-reset");
  if (!recoveryToken) return;
  activePasswordRecoveryToken = recoveryToken;
  render();
});
function renderScreen() {
  if (!activePasswordRecoveryToken) {
    const recoveryToken = new URLSearchParams(location.hash.slice(1)).get("password-reset");
    if (recoveryToken) {
      activePasswordRecoveryToken = recoveryToken;
      history.replaceState(history.state, "", `${location.pathname}${location.search}`);
    }
  }
  if (activePasswordRecoveryToken) return passwordRecoveryReset(activePasswordRecoveryToken);
  if (tab !== "search" && placeDetailMapHost?.hasAttribute("data-search-place-map")) disposePlaceDetailMap();
  if (libraryPage && !(tab === "settings" && ["saved","archive"].includes(settingsView))) {
    libraryPage.close(); libraryPage = null;
  }
  if (document.querySelector(".emoji-overlay")) {
    deferredEmojiRender = true;
    return;
  }
  chatRenderGeneration++;
  deferredEmojiRender = false;
  if (tab === "profile") tab = "updates";
  if (!["updates", "communities", "search", "chat", "notes", "settings", "profile-edit", ...ACCOUNT_TOOL_ROUTES, ...CREATOR_TOOL_ROUTES].includes(tab)) {
    tab = "updates";
    profileId = null;
    chatId = null;
    viewer = null;
    settingsView = "home";
  }
  if (!app.dataset.carouselChangeListener) {
    app.addEventListener("creative-carousel-change", event => {
      const { id, index } = event.detail || {};
      if (id) carouselIndex[id] = Number(index) || 0;
    });
    app.dataset.carouselChangeListener = "true";
  }
  const relationshipAccount = api.cloudAccountId() || api.me()?.id || null;
  if (homeSessionOwnerId !== relationshipAccount) {
    homeSessionOwnerId = relationshipAccount;
    homeFeedFeedbackLoadedOwner = "";
    homeFeedFeedbackRequestOwner = "";
    homeFeedFeedbackRequest = null;
    homeIgnoredPostIds = new Set();
    homeIgnoredCreatorIds = new Set();
    homeCloseFriendsOwnerId = "";
    homeCloseFriendsIds = [];
    homeCloseFriendsRequestOwnerId = "";
    homeCloseFriendsRequest = null;
    muted = readFeedSoundMuted(relationshipAccount);
    syncFeedSoundControls();
  }
  if (relationshipAccount && !api.cloudRelationshipsLoaded() && !api.cloudRelationshipsLoading()) {
    void api.refreshCloudRelationships().then(() => {
      if (relationshipAccount === api.cloudAccountId()) render();
    }).catch(() => {});
  }
  registerOwnActivityContent();
  void loadAccountNotifications().then(changed => { if (changed) render(); })
    .catch(() => { if (tab === "notes") render(); });
  const creatorAccount = api.cloudAccountId();
  if (creatorAccount !== creatorSessionAccount) {
    closeProfileShare?.();
    closeProfileShare = null;
    // Never greet an account with no follows with an empty Following screen.
    // This is only the account-entry default; explicit tab choices stay intact.
    homeView = defaultHomeView(api.me());
    resetCreatorScreenState();
    resetCreatorAnnouncements();
    if (peopleSearchTimer) clearTimeout(peopleSearchTimer);
    peopleSearchTimer = null;
    peopleSearchRequestId++;
    peopleSearch = { query: "", status: "idle", profiles: [], error: "" };
    searchQ = "";
    creatorSessionAccount = creatorAccount;
  }
    if (!api.me() || !api.cloudAccountId()) { resetCreatorAnnouncements(); return auth(); }
  const stateOwner = api.cloudAccountId();
  if (stateOwner && !api.cloudAccountStateLoaded() && !api.cloudAccountStateLoading() &&
    app.dataset.accountStateAttempt !== stateOwner) {
    app.dataset.accountStateAttempt = stateOwner;
    void api.loadCloudAccountState().then(() => {
      if (api.cloudAccountId() === stateOwner) render();
    }).catch(error => toast(error.message || "Your saved account data could not be loaded."));
  }
  if (!app.dataset.accountStateErrorListener) {
    window.addEventListener("oldtime-account-state-error", event =>
      toast(event.detail?.message || "Saved account data could not be synchronized."));
    app.dataset.accountStateErrorListener = "true";
  }
   if (pendingProfileUsername) void resolvePendingProfileLink();
   if (pendingStoryId) void resolvePendingStoryLink();
   if(pendingPlaceId)queueMicrotask(resolvePendingPlaceLink);
  mountComms({ toast, esc });
  if (viewer) return postViewer(viewer);
  const toolsContext = { shell, app, esc, toast, navigate: navigateFromDrawer,
    back: () => { if (!navigateBack()) navigateFromDrawer("settings"); } };
  if (ACCOUNT_TOOL_ROUTES.includes(tab)) return renderAccountToolsScreen(tab, toolsContext);
  if (CREATOR_TOOL_ROUTES.includes(tab)) return renderCreatorScreen(tab, toolsContext);
  if (tab === "notes") return notes();
  if (tab === "settings") return settings();
  if (tab === "updates" && profileId) return profile(profileId);
  if (tab === "updates") return updates();
  if (tab === "chat") return chatId ? thread(chatId) : chats();
  if (tab === "search") return search();
  if (tab === "communities") return communities();
  if (tab === "profile-edit") return editProfilePage();
  updates();
}
function auth() {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#ffffff");
  app.innerHTML = loginMarkup(brandArtUrl);
  $("#auth-status").textContent = authNotice;
  authNotice = "";
  $("#forgot-password").onclick = event => {
    event.preventDefault();
    passwordRecoveryRequest();
  };
  void mountCognitoAction($("#cognito-sign-in"), { onError: message => { if ($("#err")) $("#err").textContent = message; } });
  $("#login-form").onsubmit = async event => {
    event.preventDefault();
    const button = $("#login");
    const error = $("#err");
    button.disabled = true;
    error.textContent = "";
    try {
      const mode = await api.login($("#email").value.trim(), $("#pass").value);
      render();
    } catch (e) {
      error.textContent = e.message;
    } finally {
      if (button.isConnected) button.disabled = false;
    }
  };
  $("#signup").onclick = signup;
}
function passwordRecoveryRequest() {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#ffffff");
  app.innerHTML = passwordRecoveryRequestMarkup(brandArtUrl);
  $("#recovery-back").onclick = auth;
  $("#password-recovery-form").onsubmit = async event => {
    event.preventDefault();
    const button = $("#recovery-submit");
    const error = $("#recovery-error");
    const status = $("#recovery-status");
    button.disabled = true;
    error.textContent = "";
    status.textContent = "";
    try {
      const result = await api.requestPasswordRecovery($("#recovery-email").value.trim());
      status.textContent = result.message ||
        "If an Oldtime account uses that email, reset instructions will be sent shortly.";
    } catch (requestError) {
      error.textContent = requestError.message || "The reset request could not be sent. Try again.";
    } finally {
      if (button.isConnected) button.disabled = false;
    }
  };
}
function passwordRecoveryReset(token) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#ffffff");
  app.innerHTML = passwordRecoveryResetMarkup(brandArtUrl);
  $("#recovery-back").onclick = () => {
    activePasswordRecoveryToken = "";
    auth();
  };
  $("#password-reset-form").onsubmit = async event => {
    event.preventDefault();
    const button = $("#recovery-submit");
    const error = $("#recovery-error");
    const password = $("#reset-password").value;
    const confirmation = $("#reset-password-confirm").value;
    error.textContent = "";
    if (password !== confirmation) {
      error.textContent = "Those passwords don’t match.";
      return;
    }
    button.disabled = true;
    try {
      await api.confirmPasswordRecovery(token, password);
      activePasswordRecoveryToken = "";
      api.logout();
      authNotice = "Your password has been reset. Sign in with your new password.";
      auth();
    } catch (resetError) {
      error.textContent = resetError.message || "This reset link could not be used. Request another.";
    } finally {
      if (button.isConnected) button.disabled = false;
    }
  };
}
function signup() {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#ffffff");
  app.innerHTML = signupMarkup(brandArtUrl, PROFILE_INTERESTS);
  const signupInterests = new Set();
  const interestCount = $("#su-interest-count");
  const paintInterests = () => {
    document.querySelectorAll("[data-signup-interest]").forEach(button => {
      const on = signupInterests.has(button.dataset.signupInterest);
      button.classList.toggle("selected", on);
      button.setAttribute("aria-pressed", String(on));
    });
    interestCount.textContent = signupInterestsCountLabel(signupInterests.size);
    interestCount.classList.toggle("is-ready", signupInterests.size >= SIGNUP_INTERESTS_MIN);
  };
  bindInterestEntry({ root: $(".signup-interests"), picker: $(".signup-interest-grid"),
    selected: signupInterests, catalog: PROFILE_INTERESTS, max: SIGNUP_INTERESTS_MAX,
    attribute: "data-signup-interest", onChange: () => { paintInterests(); if ($("#err")) $("#err").textContent = ""; } });
  void mountCognitoAction($("#cognito-sign-in"), { onError: message => { if ($("#err")) $("#err").textContent = message; } });
  $("#back").onclick = auth;
  const error = $("#err");
  const status = $("#signup-status");
  const steps = [...document.querySelectorAll(".signup-step")];
  const stepTitles = ["What’s your name?", "What’s your email?", "What’s your birthday?", "What are you into?", "Create a password"];
  const stepLedes = [
    "Enter the name you use in real life.",
    "Choose an email and a username for your account.",
    "Oldtime is for people 16 and older. Your birthday stays private.",
    "Choose at least 3 interests to shape what you see first.",
    "Use at least 8 characters.",
  ];
  let currentStep = 0;
  let verificationPending = false;
  const stepBack = $("#signup-step-back");
  const title = $("#signup-title");
  const lede = $("#signup-lede");
  const showStep = index => {
    currentStep = index;
    steps.forEach((section, sectionIndex) => { section.hidden = sectionIndex !== currentStep; });
    title.textContent = stepTitles[currentStep];
    lede.textContent = stepLedes[currentStep];
    stepBack.hidden = currentStep === 0;
    error.textContent = "";
  };
  const validateStep = () => {
    const fields = [...steps[currentStep].querySelectorAll("input")];
    if (currentStep === 2) {
      const ageError = signupAgeError($("#su-birthday").value);
      if (ageError) {
        error.textContent = ageError;
        $("#su-birthday").focus();
        return false;
      }
    }
    if (steps[currentStep].classList.contains("signup-interests-step")) {
      const interestError = signupInterestsError(signupInterests, PROFILE_INTERESTS);
      if (interestError) {
        error.textContent = interestError;
        document.querySelector("[data-signup-interest]")?.focus();
        return false;
      }
    }
    const invalid = fields.find(field => !field.checkValidity());
    if (invalid) {
      error.textContent = invalid.validationMessage || "Check this detail and try again.";
      invalid.focus();
      return false;
    }
    return true;
  };
  const birthday = $("#su-birthday");
  document.querySelectorAll(".signup-next").forEach(button => {
    button.onclick = () => {
      if (validateStep()) showStep(Math.min(currentStep + 1, steps.length - 1));
    };
  });
  stepBack.onclick = () => showStep(Math.max(0, currentStep - 1));
  showStep(0);
  $("#signup-form").onsubmit = async event => {
    event.preventDefault();
    if (currentStep < steps.length - 1) {
      if (validateStep()) showStep(currentStep + 1);
      return;
    }
    if (!validateStep()) return;
    const interestError = signupInterestsError(signupInterests, PROFILE_INTERESTS);
    if (interestError) { showStep(steps.findIndex(step => step.classList.contains("signup-interests-step"))); error.textContent = interestError; return; }
    const button = $("#go");
    const username = $("#su-user").value.trim();
    button.disabled = true;
    error.textContent = "";
    status.textContent = "";
    try {
      const name = `${$("#su-first").value.trim()} ${$("#su-last").value.trim()}`.trim();
      const result = await api.signup({
        email: $("#su-email").value.trim(),
        username,
        name,
        birthday: birthday.value,
        password: $("#su-pass").value,
        interests: normalizeSignupInterests(signupInterests, PROFILE_INTERESTS),
        followOldtime: $("#su-follow-oldtime").checked === true,
      });
      if (result === "pending") {
        verificationPending = true;
        status.textContent = "Check your email and open the verification link to finish creating @oldtime. Then return here and log in.";
        button.textContent = "Email sent";
        return;
      }
      render();
    } catch (e) {
      error.textContent = e.message;
    } finally {
      if (button.isConnected) button.disabled = verificationPending;
    }
  };
}
function updates() {
  if (homeView !== "nearby") homeTopic = "all";
  feedPageObserver?.disconnect();
  feedPageObserver = null;
  const initialCloudStatus = api.cloudFeedStatus();
  if (api.authMode() === "cloud" && !initialCloudStatus.loaded && !initialCloudStatus.loading && !initialCloudStatus.error) {
    const feedStartedAt = performance.now();
    void api.refreshCloudFeed().then(() => {
      if (tab === "updates" && settingsView === "home") {
        const responseAt = performance.now();
        render();
        if (shouldMeasureClientPerformance()) requestAnimationFrame(() => {
          if (tab !== "updates" || settingsView !== "home") return;
          const paintedAt = performance.now();
          reportClientPerformance(requestCloudApi, "feed", {
            fetchMs: responseAt - feedStartedAt,
            renderMs: paintedAt - responseAt,
            totalMs: paintedAt - feedStartedAt,
            ...readFeedServerTimings(performance.getEntriesByType("resource"), feedStartedAt),
          }, "success");
        });
      }
    }).catch(() => {
      if (tab === "updates" && settingsView === "home") {
        const responseAt = performance.now();
        render();
        if (shouldMeasureClientPerformance()) requestAnimationFrame(() => {
          if (tab !== "updates" || settingsView !== "home") return;
          const paintedAt = performance.now();
          reportClientPerformance(requestCloudApi, "feed", {
            fetchMs: responseAt - feedStartedAt,
            renderMs: paintedAt - responseAt,
            totalMs: paintedAt - feedStartedAt,
          }, "failure");
        });
      }
    });
  }
  const me = api.me();
  refreshCloudStoriesWhenNeeded();
  const posts = homePosts();
  const openedPost = viewer ? api.post(viewer) : null;
  const openedPostIsRelated = openedPost && (homeView === "following"
    ? followedAuthorPosts([openedPost], me).length > 0
    : homeView === "close-friends"
      ? (api.authMode() === "cloud" ? api.cloudCloseFriends() : (me?.closeFriends || [])).includes(openedPost.author)
    : relationshipPosts([openedPost], me).length > 0);
  if (openedPost && openedPostIsRelated && isFeedHomePost(openedPost) && !posts.some(post => post.id === openedPost.id)) {
    posts.unshift(openedPost);
  }
  const areas = nearbyAreas();
  const allAreaCount = areas.reduce((sum, area) => sum + area.count, 0);
  const cloudStatus = api.cloudFeedStatus();
  const cloudFeedPager = cloudStatus.hasMore
    ? `<div class="feed-page-status" role="status">${cloudStatus.loading || homeFeedMorePending
      ? "Loading more posts…"
      : cloudStatus.error
        ? `Couldn’t load more posts. <button type="button" class="feed-page-action" id="cloud-feed-more">Retry</button>`
        : `<button type="button" class="feed-page-action" id="cloud-feed-more">Load more posts</button>`}</div>`
    : "";
  const cloudEmpty = api.authMode() === "cloud" && !api.cloudPosts().length
    ? cloudStatus.loading
      ? `<div class="feed-loading-skeletons" role="status" aria-label="Loading posts">${Array.from({ length: 2 }, () => `
          <div class="feed-loading-skeleton-post" aria-hidden="true">
            <div class="feed-loading-skeleton-author"><i></i><span></span></div>
            <div class="feed-loading-skeleton-media"></div>
          </div>`).join("")}</div>`
      : cloudStatus.error
        ? `<div class="empty" role="status"><p>Couldn’t load online posts.</p><button type="button" id="cloud-feed-retry">Try again</button></div>`
        : null
    : null;
  const placesMarkup = homeView === "nearby"
    ? selectedPlace
      ? renderPlaceDetail({
          place: selectedPlace,
          profile: placeProfile.owner === api.me()?.id && placeProfile.data
            ? { ...placeProfile.data, ownReview: placeReviewDraft?.owner === api.me()?.id && placeReviewDraft?.placeId === selectedPlace.id
                ? { ...placeProfile.data.ownReview, ...placeReviewDraft } : placeProfile.data.ownReview } : null,
          profileLoading: placeProfile.status === "loading",
          profileError: placeProfile.error,
          profileTab: placeProfileTab,
          reviewSaving: placeReviewSaving,
          posts: placeFeed.posts.map(placeCardPost),
          personForPost: placeCardPerson,
          loading: placeFeed.status === "loading",
          loadingMore: placeFeed.status === "loadingMore",
          error: placeFeed.status === "error",
          moreError: placeFeed.moreError,
          hasMore: placeFeed.hasMore,
          attribution: placeFeed.attribution || placesBrowse.attribution,
          mapVisible: placesMapVisible,
          returnToPlaces: placeReturnTo === "places",
        })
      : renderPlacesBrowse({
          landing: placesBrowse.landing || {loved:[],nearby:[],suggested:[],trending:[]},
          location: {status:nearbyLocationStatus==="located"?"granted":nearbyLocationStatus,label:placesBrowse.locationLabel},
          personForPost: placeCardPerson,
          places: placesBrowse.places.map(item => ({
            ...item,
            previewReference: item.previewReference || null,
          })),
          posts: placeFeed.posts.map(placeCardPost),
          loading: ["idle", "loading"].includes(placeFeed.status),
          error: placeFeed.status === "error",
          attribution: placeFeed.attribution || placesBrowse.attribution,
          searchQuery: placesSearch.query,
          searchResults: placesSearch.results,
          searchLoading: placesSearch.status === "loading",
          searchError: placesSearch.status === "error",
          mapVisible: placesMapVisible,
          mapAvailable: placesForDiscoveryMap().length > 0,
        })
    : "";
  const homeEmpty = homeTopic === "interests"
    ? `<div class="interest-feed-empty"><div class="interest-feed-mark" aria-hidden="true">◎</div><b>${me.interests?.length ? "Your interests, your feed" : "Find posts around what you love"}</b><p>${me.interests?.length ? "There aren’t any posts matching your interests yet. Add another interest or check back soon." : "Choose a few interests to personalize this feed and find people who share them."}</p><button type="button" id="edit-home-interests">${me.interests?.length ? "Edit interests" : "Choose interests"}</button></div>`
    : homeView === "nearby"
      ? `<div class="nearby-feed-empty"><div class="interest-feed-mark" aria-hidden="true">⌖</div><b>${esc(homeEmptyMessage(me))}</b><p>Pick an area or switch to all areas to find more posts.</p><button type="button" data-nearby-area="all">Explore all areas</button></div>`
     : homeTopic === "all" && homeView === "close-friends"
       ? `<div class="relationship-feed-empty" role="status"><b>Your Close Friends feed starts here</b><p>Posts from people you add to Close Friends will appear here.</p><button type="button" data-manage-close-friends>Manage Close Friends</button></div>`
     : homeTopic === "all" && homeView === "following"
      ? `<div class="relationship-feed-empty" role="status"><b>Your Following feed starts here</b><p>Follow friends and creators to see their posts here. Public posts from other accounts are in Discovery.</p><button type="button" data-tab="search">Find people to follow</button></div>`
    : homeTopic === "all" && homeView === "explore"
      ? `<div class="relationship-feed-empty" role="status"><b>Your For You feed is getting started</b><p>Public posts from creators across Oldtime will appear here, ranked around your interests and activity.</p><button type="button" data-tab="search">Browse Discovery</button></div>`
    : `<div class="empty">${esc(homeEmptyMessage(me))}</div>`;
  const feedContent = homeView === "nearby"
    ? placesMarkup
    : posts.map((post, index) => postCard(post, "main") + (index === 2 && posts.length >= 4 ? `<div class="ev-feed-slot" id="ev-feed-slot" data-ev-slot data-managed-slot></div>` : "")).join("") || cloudEmpty || homeEmpty;
     shell(`<section class="screen on home-screen" data-places-view="${homeView === "nearby"}" data-scroll-context="home:${homeView}:${homeTopic}">
        <div class="feed" id="feed" data-scroll-preserve="home-feed">${feedContent}${homeView === "nearby" ? "" : cloudFeedPager}</div>
    ${homeView === "nearby" ? "" : `<header class="home-discovery-header">
      <div class="home-primary-row">
        <nav class="home-view-tabs" role="tablist" aria-label="Home feed views">
           ${HOME_VIEWS.map(view => `<button type="button" role="tab" class="home-view-tab ${homeView === view.id ? "on" : ""}" data-home-view="${view.id}" aria-selected="${homeView === view.id}" title="${view.label}">${view.label}</button>`).join("")}
         </nav>
        <span class="home-header-actions">
          <button class="icon home-notifications-button" id="notifications-open" aria-label="Notifications" title="Notifications">${ic.bell}${accountNotifications().some(note => note.user === me.id && !note.read) || api.db().requests.some(request => request.to === me.id) || api.db().friendRequests?.some(request => request.to === me.id) ? '<span class="home-notification-dot" aria-label="Unread notifications"></span>' : ""}</button>
        </span>
      </div>
    </header>`}
  </section>`);
  const feedScroller = $("#feed");
  app.querySelectorAll("[data-feed-not-interested]").forEach(button => {
    button.onclick = async () => {
      const postId = button.dataset.feedNotInterested;
      const authorId = button.dataset.feedbackAuthor;
      const ownerId = api.cloudAccountId();
      if (!postId || !authorId || !ownerId || button.disabled) return;
      button.disabled = true;
      try {
        const { requestCloudApi } = await import("./store.js");
        await requestCloudApi("/api/feed/feedback", { method: "POST", body: { postId } });
        if (api.cloudAccountId() !== ownerId) return;
        const scrollTop = feedScroller?.scrollTop || 0;
        homeIgnoredPostIds.add(postId);
        homeIgnoredCreatorIds.add(authorId);
        toast("We’ll show fewer posts from this creator.");
        render();
        const refreshedFeed = $("#feed");
        if (refreshedFeed) refreshedFeed.scrollTop = scrollTop;
        void api.refreshCloudFeed("main").then(() => {
          if (api.cloudAccountId() !== ownerId || tab !== "updates" || settingsView !== "home") return;
          render();
          const latestFeed = $("#feed");
          if (latestFeed) latestFeed.scrollTop = scrollTop;
        }).catch(() => {});
      } catch (error) {
        button.disabled = false;
        toast(error?.message || "That recommendation could not be updated.");
      }
    };
  });
  $("#cloud-feed-retry") && ($("#cloud-feed-retry").onclick = async () => {
    try { await api.refreshCloudFeed(homeView === "following" ? "following" : "main"); render(); }
    catch { render(); }
  });
  const loadMoreCloudPosts = async () => {
    if (homeFeedMorePending || !api.cloudFeedStatus().hasMore) return;
    homeFeedMorePending = true;
    try { await api.loadMoreCloudFeed(); }
    catch { /* The feed status retains the error and exposes a retry button. */ }
    finally {
      homeFeedMorePending = false;
      if (tab === "updates" && settingsView === "home") render();
    }
  };
  $("#cloud-feed-more")?.addEventListener("click", loadMoreCloudPosts);
  $("#edit-home-interests") && ($("#edit-home-interests").onclick = openEditProfile);
  app.querySelectorAll("[data-avatar-profile]").forEach(b => b.onclick = event => {
    event.stopPropagation();
    openPersonAvatar(b.dataset.avatarProfile);
  });
  const notificationsOpenButton = $("#notifications-open");
  if (notificationsOpenButton) notificationsOpenButton.onclick = openNotifications;
  app.querySelector("[data-manage-close-friends]")?.addEventListener("click", async () => {
    settingsView = "close-friends";
    await navigateFromDrawer("settings");
  });
  app.querySelectorAll("[data-home-view]").forEach(button => button.onclick = () => {
    const nextView = button.dataset.homeView;
    if (nextView === "nearby") {
      homeView = "nearby";
      homeTopic = "all";
      selectedPlace = null;
      placesFeedQuery = "";
      placesSearch = { query: "", status: "idle", results: [], error: "" };
      placesMapVisible = false;
      placeFeedRequestId++;
    } else {
      homeView = nextView;
      selectedPlace = null;
      placesMapVisible = false;
      placeFeedRequestId++;
    }
    render();
  });
  app.querySelectorAll("[data-nearby-area]").forEach(button => button.onclick = () => {
    nearbyLocationRequestId++;
    nearbyCity = button.dataset.nearbyArea || "all";
    render();
  });
  app.querySelector("[data-nearby-locate]")?.addEventListener("click", requestNearbyLocation);
  bindPosts();
  bindPlacesActions();
  if (homeView !== "nearby") mountEmailVerificationReminder(app.querySelector(".home-screen"), {
    isBusy: () => Boolean(storyUi || document.querySelector(".creative-editor") || $("#sheet")?.classList.contains("on") || tab !== "updates" || viewer),
    sheet: () => $("#sheet"), toast, esc,
  });
  if (homeView === "nearby" && !selectedPlace && placesBrowse.status === "idle") loadPlacesDiscovery();
  if (homeView === "nearby" && placeFeed.key !== activePlaceFeedKey()) loadPlaceFeed();
  const feedPager = $("#feed")?.querySelector(".feed-page-status");
  if (feedPager && cloudStatus.hasMore && !cloudStatus.loading && !cloudStatus.error &&
      api.authMode() === "cloud" && "IntersectionObserver" in window) {
    feedPageObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) void loadMoreCloudPosts();
    }, { root: $("#feed"), rootMargin: feedPaginationRootMargin({ viewportHeight: window.innerHeight }) });
    feedPageObserver.observe(feedPager);
  }
}
function observeVideos() {
  feedObserver?.disconnect();
  feedMetadataObserver?.disconnect();
  feedMetadataObserver = null;
  activeFeedVideo?.pause();
  activeFeedVideo = null;
  const vids = [...app.querySelectorAll(".clip video")];
  if (floatingVideoCleanup) { vids.forEach(video => video.pause()); return; }
  const feedRoot = $("#feed");
  let prefetchObserver = null;
  if (feedRoot && "IntersectionObserver" in window) {
    const queued = new Set();
    const queue = [];
    let pending = 0;
    const drainPrefetchQueue = () => {
      while (pending < 2 && queue.length) {
        const video = queue.shift();
        queued.delete(video);
        if (!video.isConnected) continue;
        prefetchObserver.unobserve(video);
        pending++;
        void prefetchFeedVideoMetadata(video, loadFeedVideo).finally(() => {
          pending--;
          drainPrefetchQueue();
        });
      }
    };
    prefetchObserver = new IntersectionObserver(entries => {
      if (!shouldPrefetchFeedVideo()) return;
      entries
        .filter(entry => entry.isIntersecting && !queued.has(entry.target))
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        .forEach(entry => {
          queued.add(entry.target);
          queue.push(entry.target);
        });
      drainPrefetchQueue();
    }, {
      root: feedRoot,
      rootMargin: FEED_VIDEO_PREFETCH_ROOT_MARGIN,
      threshold: 0,
    });
    feedMetadataObserver = prefetchObserver;
  }
  const startPlayback = async v => {
    if (v.dataset.playbackStartPending === "true") return;
    v.dataset.playbackStartPending = "true";
    const measure = shouldMeasureClientPerformance() && !videoPerformanceSampleReported;
    const activatedAt = performance.now();
    let urlMs = 0;
    let playCallMs = null;
    let frameAt = null;
    let frameSignal = "none";
    let reportSent = false;
    let frameTimer = null;
    let playStartedAt = 0;
    const reportVideo = outcome => {
      if (!measure || reportSent || playCallMs === null) return;
      reportSent = true;
      videoPerformanceSampleReported = true;
      clearTimeout(frameTimer);
      const metrics = { urlMs, playCallMs };
      if (frameAt !== null) metrics.activeToFrameMs = frameAt - activatedAt;
      reportClientPerformance(requestCloudApi, "video", metrics, outcome, frameSignal);
    };
    const markFrame = signal => {
      if (reportSent) return;
      frameAt = performance.now();
      frameSignal = signal;
      reportVideo("frame");
    };
    try {
      if (isLocalMedia(v.dataset.localMedia) && !v.src) {
        const urlStartedAt = performance.now();
        let loaded = false;
        try {
          loaded = await loadFeedVideo(v);
          urlMs = performance.now() - urlStartedAt;
        } catch {
          urlMs = performance.now() - urlStartedAt;
          playCallMs = 0;
          reportVideo("url-error");
          return;
        }
        if (!loaded) {
          playCallMs = 0;
          reportVideo("url-error");
          return;
        }
      }
      if (activeFeedVideo !== v) return;
      playStartedAt = performance.now();
      if (measure) {
        if (typeof v.requestVideoFrameCallback === "function") {
          v.requestVideoFrameCallback(() => markFrame("video-frame"));
        } else if (v.readyState >= 2) {
          queueMicrotask(() => markFrame("loadeddata"));
        } else {
          v.addEventListener("loadeddata", () => markFrame("loadeddata"), { once: true });
        }
        v.addEventListener("error", () => {
          playCallMs ??= performance.now() - playStartedAt;
          reportVideo("media-error");
        }, { once: true });
        frameTimer = setTimeout(() => {
          playCallMs ??= performance.now() - playStartedAt;
          reportVideo("timeout");
        }, 15_000);
      }
      await v.play();
      playCallMs = performance.now() - playStartedAt;
      if (frameAt !== null) reportVideo("frame");
      if (activeFeedVideo !== v && !v.closest(".ot-video-float")) v.pause();
    } catch {
      playCallMs ??= performance.now() - playStartedAt;
      reportVideo("play-rejected");
      if (activeFeedVideo === v) activeFeedVideo = null;
    } finally {
      delete v.dataset.playbackStartPending;
    }
  };
  feedObserver = new IntersectionObserver(ents => {
    if (floatingVideoCleanup) return;
    const candidate = selectFeedVideoCandidate(ents);
    if (candidate) {
      if (activeFeedVideo && activeFeedVideo !== candidate) activeFeedVideo.pause();
      activeFeedVideo = candidate;
      candidate.muted = muted;
      void startPlayback(candidate);
    }
    for (const entry of ents) {
      const video = entry.target;
      if (video === candidate) continue;
      if (!entry.isIntersecting) {
        video.pause();
        if (activeFeedVideo === video) activeFeedVideo = null;
      } else if (candidate && video !== candidate) {
        // Multiple cards can cross the threshold in one frame; only the clearest one plays.
        video.pause();
        if (activeFeedVideo === video) activeFeedVideo = null;
      }
    }
  }, { threshold: 0.65 });
  vids.forEach(v => {
    const item=api.post(v.dataset.id);if(item)trackQualifiedView(item,v.closest(".clip")||v,"feed");
    prefetchObserver?.observe(v);
    feedObserver.observe(v);
    v.ontimeupdate = () => { const p = api.db().posts.find(p => p.id === v.dataset.id); if (p?.trim && v.currentTime >= p.trim) v.currentTime = 0; };
  });
}
function postCard(p, surface = "main", { mediaViewer = false } = {}) {
  p=getRepostView(p,api.db());
  const u = api.user(p.author);
  if (!u) return "";
  const placesViewer = viewerSource === "places" && surface === "detail";
  const me = api.me();
  const liked = p.likes.includes(me.id);
  const likeCount = Number.isFinite(p.likeCount) ? p.likeCount : p.likes.length;
  const saved = p.saves.includes(me.id);
  const saveCount = Number.isFinite(p.saveCount) ? p.saveCount : p.saves.length;
  const repostFaces = p.cloud && !placesViewer
    ? renderRepostAffordance(p, { esc, confirming: isRepostConfirmationActive(p.id) })
    : "";
  const following = me.following.includes(u.id) || u.id === me.id;
  const caption = String(p.caption || "");
  const longCaption = caption.length > 120;
  const captionOpen = !!expandedCaptions[p.id];
  const postMedia = profilePostMedia(p);
  const renderKind = postMedia.length ? p.kind : "text";
  const moreButton = longCaption ? `<button type="button" class="caption-more" data-caption-toggle="${esc(p.id)}" aria-expanded="${captionOpen}">${captionOpen ? "See less" : "See more"}</button>` : "";
  const captionMarkup = renderKind !== "text" && caption
    ? `<div class="cap ${longCaption && !captionOpen ? "is-collapsed" : longCaption ? "is-expanded" : ""}" data-caption-content="${esc(p.id)}">${renderMentionText(caption)}</div>${moreButton}`
    : "";
  const placeViewerLocation = String(postPlaceValue(p) || p.place?.label || "").trim();
  const placeViewerTag = placesViewer ? (selectedPlace?.id ? selectedPlace : p.place?.id ? p.place : null) : null;
  const placeViewerLabel = String(placeViewerTag?.label || placeViewerLocation || "").trim();
  const placeViewerChip = placesViewer && placeViewerLabel
    ? `<button type="button" class="post-viewer-place-location place-video-overlay" data-place-explore="${esc(placeViewerLabel)}" data-place-id="${esc(placeViewerTag?.id || `custom:${cityMatchKey(placeViewerLabel)}`)}" data-place-source="${esc(placeViewerTag?.source || "custom")}" data-place-category="${esc(placeViewerTag?.category || "")}" data-place-address="${esc(placeViewerTag?.address || "")}"${Number.isFinite(Number(placeViewerTag?.lat)) && placeViewerTag?.lat !== "" && placeViewerTag?.lat != null ? ` data-place-lat="${esc(placeViewerTag.lat)}"` : ""}${Number.isFinite(Number(placeViewerTag?.lon)) && placeViewerTag?.lon !== "" && placeViewerTag?.lon != null ? ` data-place-lon="${esc(placeViewerTag.lon)}"` : ""} aria-label="View ${esc(placeViewerLabel)}"><span class="place-overlay-icon">${ic.locationBadge}</span><span class="place-overlay-name">${esc(placeViewerLabel)}</span></button>`
    : "";
  const placeViewerRatingInfo = placesViewer ? (p.placeRating || placeFeed.posts.find(item => item.id === p.id)?.placeRating || null) : null;
  const placeViewerAvg = Number(placeViewerRatingInfo?.averageRating);
  const placeViewerRatingCount = Number(placeViewerRatingInfo?.ratingCount) || 0;
  const placeViewerRating = placeViewerRatingCount > 0 && placeViewerAvg > 0
    ? `<div class="post-viewer-place-rating" aria-label="Place rated ${esc(placeViewerAvg.toFixed(1))} out of 5 from ${fmt(placeViewerRatingCount)} ${placeViewerRatingCount === 1 ? "rating" : "ratings"}"><span aria-hidden="true">★</span><b>${esc(placeViewerAvg.toFixed(1))}</b><small>(${fmt(placeViewerRatingCount)})</small></div>`
    : "";
  const selectedSlide = Math.max(0, Math.min((postMedia.length || 1) - 1, carouselIndex[p.id] || 0));
  const selectedMedia = postMedia[selectedSlide] || postMedia[0] || "";
  const rawVideoPoster = p.mediaPosters?.[0];
  const videoPoster = isDefaultAvatarMediaReference(rawVideoPoster) ? "" : rawVideoPoster;
  const videoPosterAttr = isLocalMedia(videoPoster)
    ? `data-local-poster="${esc(videoPoster)}"`
    : videoPoster ? `poster="${esc(renderMediaUrl(videoPoster))}"` : "";
  const mediaAttrs = reference => isLocalMedia(reference)
    ? `data-local-media="${esc(reference)}" data-local-media-owner="${esc(p.author)}"`
    : `src="${esc(renderMediaUrl(reference))}"`;
  const rawCarousel = !p.creativeProject && renderKind !== "text" && postMedia.length > 1;
  // Per-attachment kind from declared MIME metadata, never from the post's first item or a remote extension.
  const selectedItem = communityMediaItems(p, postMedia)[selectedSlide];
  const selectedIsVideo = rawCarousel && Boolean(selectedItem?.video);
  const searchInsight = p.cloud && (!p.visibility || p.visibility === "public") && !u.private &&
    api.authMode() === "cloud" && Boolean(api.cloudAccountId()) && (p.kind === "video" || selectedIsVideo)
    ? renderVideoSearchInsightPill({
      videoId: p.id,
      keyword: videoSearchInsights.get(p.id)?.keyword || "",
      searchIcon: ic.search,
      esc,
    })
    : "";
  const selectedPoster = selectedItem?.poster && !isDefaultAvatarMediaReference(selectedItem.poster) ? selectedItem.poster : "";
  const selectedPosterAttr = isLocalMedia(selectedPoster) ? `data-local-poster="${esc(selectedPoster)}"` : selectedPoster ? `poster="${esc(renderMediaUrl(selectedPoster))}"` : "";
  const media = p.creativeProject ? creativeMediaMarkup(p, esc, false, false, selectedSlide) : renderKind === "video" && !rawCarousel
    ? `<video ${mediaAttrs(postMedia[0])} ${videoPosterAttr} data-id="${p.id}" data-dbl="${p.id}" loop playsinline preload="none" ${muted ? "muted" : ""}></video>`
    : renderKind === "text"
      ? `<div class="textpost" style="height:100%"><p class="textpost-caption ${longCaption && !captionOpen ? "is-collapsed" : longCaption ? "is-expanded" : ""}" data-caption-content="${esc(p.id)}">${renderMentionText(caption || p.text || "")}</p>${moreButton}</div>`
      : rawCarousel
        ? `<div class="post-carousel" data-post-carousel="${esc(p.id)}" data-count="${postMedia.length}">${selectedIsVideo
            ? `<video class="fullimg carousel-video" ${mediaAttrs(selectedMedia)} ${selectedPosterAttr} data-id="${p.id}" data-dbl="${p.id}" loop playsinline controls preload="metadata" ${muted ? "muted" : ""} aria-label="Video ${selectedSlide + 1} of ${postMedia.length}"></video>`
            : `<img class="fullimg" ${mediaAttrs(selectedMedia)} loading="lazy" decoding="async" alt="Photo ${selectedSlide + 1} of ${postMedia.length}" data-dbl="${p.id}" />`}<span class="carousel-count">${selectedSlide + 1}/${postMedia.length}</span></div>`
        : `<img class="fullimg" ${mediaAttrs(selectedMedia)} loading="lazy" decoding="async" alt="" data-dbl="${p.id}" />`;
  const viewsMetric = p.cloud && Number.isSafeInteger(p.measuredViews) && p.measuredViews >= 0
    ? `<span class="ot-view-metric" aria-label="${fmt(p.measuredViews)} views" title="${fmt(p.measuredViews)} views">${ic.viewBars}<span>${fmt(p.measuredViews)}</span></span>`
    : "";
   const saveAction = mediaViewer ? "" : `<button class="act ${saved ? "on" : ""}" data-save="${p.id}" aria-label="${saved ? "Remove saved post" : "Save post"}" aria-pressed="${saved}">${saved ? ic.mediaBookmarkOn : ic.mediaBookmark}<span class="act-count">${fmt(saveCount)}</span></button>`;
   const actions = placesViewer
    ? `<button class="act ${liked ? "on" : ""}" data-like="${p.id}" aria-label="${liked ? "Unlike post" : "Like post"}" aria-pressed="${liked}">${liked ? ic.mediaHeartOn : ic.mediaHeart}<span class="act-count">${fmt(likeCount)}</span></button>
       <button class="act" data-comment="${p.id}" aria-label="Comments">${ic.mediaComment}<span class="act-count">${fmt(p.cloud ? (p.commentCount || 0) : (p.comments?.length || 0))}</span></button>
       <button class="act" data-share="${p.id}" aria-label="Share post">${ic.share}</button>`
    : p.cloud
    ? `<button class="act ${liked ? "on" : ""}" data-like="${p.id}" aria-label="${liked ? "Unlike post" : "Like post"}" aria-pressed="${liked}">${liked ? ic.mediaHeartOn : ic.mediaHeart}<span class="act-count">${fmt(likeCount)}</span></button>
       <button class="act" data-comment="${p.id}" aria-label="Comments">${ic.mediaComment}<span class="act-count">${fmt(p.commentCount || 0)}</span></button>
       ${viewsMetric}
        ${saveAction}
       <button class="act" data-share="${p.id}" aria-label="Share post">${ic.share}<span class="act-label">Share</span></button>`
    : `<button class="act ${liked ? "on" : ""}" data-like="${p.id}" aria-label="${liked ? "Unlike post" : "Like post"}" aria-pressed="${liked}">${liked ? ic.mediaHeartOn : ic.mediaHeart}<span class="act-count">${fmt(likeCount)}</span></button>
       <button class="act" data-comment="${p.id}" aria-label="Comments">${ic.mediaComment}<span class="act-count">${fmt(p.comments.length)}</span></button>
       ${viewsMetric}
        ${saveAction}
       <button class="act" data-share="${p.id}" aria-label="Share post">${ic.share}<span class="act-label">Share</span></button>`;
   const viewerActionsMenu = mediaViewer ? `<details class="post-actions-menu post-viewer-actions-menu" data-post-actions-menu>
      <summary aria-label="Post actions" title="Post actions" data-testid="button-post-options-${esc(p.id)}">${ic.tune}</summary>
      <div class="post-actions-menu-items" role="menu" aria-label="Post actions">
        <button type="button" role="menuitem" data-save="${esc(p.id)}" aria-label="${saved ? "Remove saved post" : "Save post"}" aria-pressed="${saved}">${saved ? ic.mediaBookmarkOn : ic.mediaBookmark}<span>${saved ? "Remove saved post" : "Save post"}</span></button>
        ${p.kind === "video" || postHasVideo(p) ? `<button type="button" role="menuitem" class="post-viewer-download-item" data-post-viewer-download="${esc(p.id)}" aria-label="Save video with Oldtime watermark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5v11m-4-3 4 4 4-4M4.5 17v3.5h15V17"/></svg><span>Download video</span></button>` : ""}
        ${p.author === me.id ? `
        <button type="button" role="menuitem" data-post-edit="${esc(p.id)}" data-testid="button-edit-post-${esc(p.id)}"><span>Edit post</span></button>
        <button type="button" role="menuitem" data-post-archive="${esc(p.id)}"><span>${p.archivedAt != null ? "Restore from archive" : "Archive post"}</span></button>
        <button type="button" role="menuitem" data-delete-post="${esc(p.id)}"><span>Delete post</span></button>
        <button type="button" role="menuitem" data-post-cover-edit="${esc(p.id)}" data-testid="button-set-profile-cover-${esc(p.id)}"><span>Set as profile cover</span></button>` : ""}
      </div>
    </details>` : "";
    const soundTitle = audioTitle(p);
    const soundLine = /^original audio(?:\s*[·-]\s*)?@?/i.test(soundTitle)
      ? soundTitle.replace(/^original audio(?:\s*[·-]\s*)?@?/i, "original sound - ")
      : soundTitle;
   return `<article class="clip ${viewer && !p.creativeProject ? "post-detail" : ""}" data-id="${p.id}">${media}<div class="shade"></div>
      ${viewerActionsMenu}
      ${renderKind === "video" ? `<button type="button" class="clip-float-control" data-video-float="${esc(p.id)}" aria-label="Continue video in a floating player" title="Continue video in a floating player">${videoFloatIcon}</button>` : ""}
    <div class="rail">
      ${(rawCarousel ? selectedIsVideo : p.kind === "video") ? `<button type="button" class="soundbar-toggle rail-sound-toggle" data-feed-sound-toggle="${esc(p.id)}" aria-label="${muted ? "Turn sound on" : "Mute sound"}" aria-pressed="${!muted}">${feedSoundGlyph(muted)}</button>` : ""}
      ${actions}
    </div>
    ${rawCarousel ? `<div class="carousel-nav">${postMedia.map((_, i) => `<button data-dot="${p.id}:${i}" aria-label="${communityMediaItems(p, postMedia)[i]?.video ? "Video" : "Photo"} ${i + 1} of ${postMedia.length}" aria-pressed="${i === selectedSlide}" class="${i === selectedSlide ? "on" : ""}"></button>`).join("")}</div>` : ""}
    <div class="meta" tabindex="0" aria-label="Post details">
        ${placesViewer
          ? `${captionMarkup}
             ${placeViewerChip}
             ${placeViewerRating}
              ${searchInsight}
             <div class="handle"><button type="button" class="feed-author-name post-viewer-place-creator" id="post-viewer-profile" aria-label="Open ${esc(u.name)}'s profile">${esc(u.name)}</button></div>`
           : `${repostFaces}
              ${postPlaceCard(p, { videoOverlay: renderKind !== "text" })}
              ${searchInsight}
               <div class="handle"><button type="button" class="feed-author-avatar" data-avatar-profile="${esc(u.id)}" aria-label="Open @${esc(u.username)}'s story or profile"><img src="${esc(u.avatar || "")}" alt="" class="avatar" /></button><button type="button" class="feed-author-name" data-profile="${esc(u.id)}">${esc(u.name)}</button>${blueBadgeMarkup(u.cloudAccountId || u.id, esc)} ${feedFollowButton({author:u,me:api.me(),following,requests:api.db().requests,className:"followpill",esc})}</div>
             ${likesRow(p)}
             ${captionMarkup}
             ${p.creativeProject ? creativeAttribution(p, esc) : ""}`}
    </div>
     <div class="soundbar">
        <button type="button" class="soundbar-main" data-audio-open="${esc(p.id)}" aria-label="Open sound details: ${esc(soundLine)}">
           <span class="soundbar-note" aria-hidden="true">♫</span>
           <span class="soundbar-copy">${esc(soundLine)}</span>
       </button>
     </div>
  </article>`;
}
function postPlaceValue(post) {
  return String(post?.location || "").trim();
}
function postPlaceCard(post, { videoOverlay = false } = {}) {
  const place = postPlaceValue(post);
  if (!place) return "";
  const placeTag = post.place?.id
    ? post.place
    : { id: `custom:${cityMatchKey(place)}`, label: place, source: "custom" };
  const hasPin = Number.isFinite(placeTag.lat) && Number.isFinite(placeTag.lon);
  const ratingCount = Number(post.placeRating?.ratingCount) || 0;
  const ratingAverage = Number(post.placeRating?.averageRating);
  const rating = ratingCount > 0 && Number.isFinite(ratingAverage) && ratingAverage > 0
    ? `<small><span data-place-rating-id="${esc(placeTag.id)}">★ ${ratingAverage.toFixed(1)} · ${ratingCount}</span></small>`
    : "";
  const placeCopy = videoOverlay
    ? `<span class="clip-place-copy place-overlay-copy"><b class="place-overlay-name">${esc(place)}</b>${rating}</span>`
    : `<span class="clip-place-copy"><b>${esc(place)}</b>${rating || `<small>${hasPin ? "View place" : "Place"}</small>`}</span>`;
  return `<div class="clip-place">
    <button type="button" class="clip-place-card${videoOverlay ? " place-video-overlay" : ""}" data-place-explore="${esc(place)}"
      data-place-id="${esc(placeTag.id)}" data-place-source="${esc(placeTag.source || "custom")}"
      data-place-category="${esc(placeTag.category || "")}" data-place-address="${esc(placeTag.address || "")}"
      ${Number.isFinite(placeTag.lat) ? `data-place-lat="${esc(placeTag.lat)}"` : ""}
      ${Number.isFinite(placeTag.lon) ? `data-place-lon="${esc(placeTag.lon)}"` : ""}
      aria-label="${hasPin ? `Show ${esc(place)} on the map` : `View location ${esc(place)}`}">
      <span class="clip-place-icon${videoOverlay ? " place-overlay-icon" : ""}">${videoOverlay ? ic.locationBadge : ic.location}</span>
      ${placeCopy}
    </button>
  </div>`;
}
function head(u, following, p) {
  return `<div class="handle"><button type="button" class="feed-author-avatar" data-avatar-profile="${esc(u.id)}" aria-label="Open @${esc(u.username)}'s story or profile"><img src="${esc(u.avatar || "")}" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover" /></button> <button class="feed-author-name" type="button" data-profile="${esc(u.id)}">@${esc(u.username)}</button>${blueBadgeMarkup(u.cloudAccountId || u.id, esc)} ${feedFollowButton({author:u,me:api.me(),following,requests:api.db().requests,className:"followchip",esc})}</div>`;
}
function rail(p, liked, saved) {
  return `<div class="rail">
    <button class="act ${liked ? "on" : ""}" data-like="${p.id}" aria-label="Like post">${liked ? ic.mediaHeartOn : ic.mediaHeart}${fmt(p.likes.length)}</button>
    <button class="act" data-comment="${p.id}" aria-label="Comments">${ic.mediaComment}${fmt(p.comments.length)}</button>
    <button class="act ${saved ? "on" : ""}" data-save="${p.id}" aria-label="${saved ? "Remove saved post" : "Save post"}" aria-pressed="${saved}">${saved ? ic.mediaBookmarkOn : ic.mediaBookmark}<span class="act-count">${fmt(p.saves.length)}</span></button>
    <button type="button" class="rail-avatar" data-avatar-profile="${esc(p.author)}" aria-label="Open author's story or profile"><img class="avatar" ${profileMediaSource(api.user(p.author)?.avatar || "")} alt="" /></button>
  </div>`;
}
function bindPostDeleteActions(root = app, { onDeleted } = {}) {
  root.querySelectorAll("[data-delete-post]").forEach(button => button.onclick = async event => {
    event.preventDefault();
    event.stopPropagation();
    const postId = button.dataset.deletePost;
    const owner = api.me()?.id;
    let post = api.post(postId);
    if (!post) {
      try { post = await api.loadCloudPost(postId); }
      catch (error) {
        if (api.me()?.id === owner) toast(error.message || "The post could not be loaded for deletion.");
        return;
      }
    }
    if (api.me()?.id !== owner) return;
    if (!post || !owner || post.author !== owner) {
      toast("You can only delete your own posts.");
      return;
    }
    if (!confirm("Permanently delete this post and its replies, likes, and shared copies? This cannot be undone.")) return;
    const media = (post.media || []).filter(isLocalMedia);
    button.disabled = true;
    try {
      await api.deleteOwnPost(postId);
      if (api.me()?.id !== owner) return;
      let cleanupFailed = false;
      for (const item of media) {
        const referenced = [...api.db().posts, ...api.db().stories].some(candidate =>
          Array.isArray(candidate.media) ? candidate.media.includes(item) : candidate.media === item
        );
        if (!referenced) {
          try { await deleteLocalMedia(item); }
          catch (error) { cleanupFailed = true; console.warn("Deleted post media could not be cleared from device storage.", error); }
        }
      }
      if (onDeleted) onDeleted(post);
      else { viewer = null; render(); }
      toast(cleanupFailed ? "Post deleted. Some device media could not be cleared." : "Post deleted");
    } catch (error) {
      if (api.me()?.id === owner) toast(error.message || "The post could not be deleted.");
      if (button.isConnected) button.disabled = false;
    }
  });
}

function bindPostArchiveActions(root = app) {
  root.querySelectorAll("[data-post-archive]").forEach(button => button.onclick = async event => {
    event.preventDefault();
    event.stopPropagation();
    const owner = api.me()?.id;
    let post = api.post(button.dataset.postArchive);
    if (!post) {
      try { post = await api.loadCloudPost(button.dataset.postArchive); }
      catch (error) {
        if (api.me()?.id === owner) toast(error.message || "The post could not be loaded for archiving.");
        return;
      }
    }
    if (api.me()?.id !== owner) return;
    if (!post || !owner || post.author !== owner) {
      toast("You can only archive your own posts.");
      return;
    }
    const archived = post.archivedAt != null;
    button.disabled = true;
    try {
      await api.setOwnPostArchived(post.id, !archived);
      if (api.me()?.id !== owner) return;
      render();
      toast(archived ? "Post restored" : "Post archived");
    } catch (error) {
      if (api.me()?.id === owner) toast(error.message || "The post could not be updated.");
      if (button.isConnected) button.disabled = false;
    }
  });
}

function closePostEditSheet(sheet) {
  sheet.classList.remove("on");
  sheet.innerHTML = "";
}

async function openPostEditSheet(postId) {
  let post = api.post(postId);
  if (!post) {
    try { post = await api.loadCloudPost(postId); }
    catch (error) {
      toast(error.message || "The post could not be loaded for editing.");
      return;
    }
  }
  const owner = api.me()?.id;
  if (!post || !owner || post.author !== owner) {
    toast("You can only edit your own posts.");
    return;
  }
  const sheet = $("#sheet");
  let place = post.place ? { ...post.place } : post.location
    ? { id: "custom:existing", label: String(post.location), source: "custom" }
    : null;
  const isArchived = post.archivedAt != null;
  const visibility = ["public", "connections", "close-friends"].includes(post.visibility) ? post.visibility : "public";
  const canUseCloseFriends = Array.isArray(api.me()?.closeFriends) && api.me().closeFriends.length > 0;
  sheet.innerHTML = `<div class="panel post-edit-panel" role="dialog" aria-modal="true" aria-labelledby="post-edit-title">
    <div class="grab"></div>
    <div class="post-edit-header">
      <h2 id="post-edit-title">${isArchived ? "Archived post" : "Edit post"}</h2>
      <div class="post-edit-header-actions">
        <details class="post-edit-menu">
          <summary aria-label="More post actions" title="Post options">${ic.tune}</summary>
          <div class="post-edit-menu-items" role="menu">
            <button type="button" role="menuitem" data-post-archive="${esc(post.id)}">${isArchived ? "Restore from archive" : "Archive post"}</button>
            <button type="button" role="menuitem" data-delete-post="${esc(post.id)}">Delete post</button>
          </div>
        </details>
        <button type="button" data-edit-close aria-label="Close">${ic.close}</button>
      </div>
    </div>
    ${isArchived ? `<p class="post-archive-note">Only you can see this post while it’s archived. Restore it to edit or share it again.</p>` : `
      <label class="post-edit-field"><span>Caption</span><textarea data-edit-caption maxlength="1000" rows="4" placeholder="Write a caption">${esc(post.caption || post.text || "")}</textarea></label>
      <label class="post-edit-field" for="post-edit-visibility"><span>Who can see this post?</span>
        <select id="post-edit-visibility" data-edit-visibility>
          <option value="public" ${visibility === "public" ? "selected" : ""}>Everyone</option>
          <option value="connections" ${visibility === "connections" ? "selected" : ""}>Friends &amp; Followers</option>
          <option value="close-friends" ${visibility === "close-friends" ? "selected" : ""} ${canUseCloseFriends || visibility === "close-friends" ? "" : "disabled"}>Close Friends</option>
        </select>
      </label>
      <div class="post-edit-location-row">
        <button type="button" class="post-edit-place" data-edit-place>${ic.location}<span data-edit-place-label></span></button>
      </div>`}
    <div class="post-edit-actions">
      <button type="button" class="post-edit-cancel" data-edit-close>${isArchived ? "Close" : "Cancel"}</button>
      ${isArchived ? "" : `<button type="button" class="post-edit-save" data-edit-save>Save changes</button>`}
    </div>
  </div>`;
  sheet.classList.add("on");
  const caption = sheet.querySelector("[data-edit-caption]");
  const placeButton = sheet.querySelector("[data-edit-place]");
  if (placeButton) {
    const placeButtonLabel = placeButton.querySelector("[data-edit-place-label]");
    const updatePlaceLabel = () => {
      placeButtonLabel.textContent = place?.label || "Add location";
      placeButton.setAttribute("aria-label", place ? `Change location: ${place.label}` : "Add a location");
    };
    updatePlaceLabel();
    placeButton.onclick = () => openPlacePicker({
      value: place,
      toast,
      onSelect: selected => { place = selected; updatePlaceLabel(); },
      onRemove: () => { place = null; updatePlaceLabel(); },
    });
  }
  sheet.querySelectorAll("[data-edit-close]").forEach(button => {
    button.onclick = () => closePostEditSheet(sheet);
  });
  sheet.onclick = event => {
    if (event.target === sheet) closePostEditSheet(sheet);
  };
  sheet.querySelector("[data-post-archive]").onclick = async event => {
    const button = event.currentTarget;
    button.disabled = true;
    try {
      await api.setOwnPostArchived(post.id, !isArchived);
      closePostEditSheet(sheet);
      render();
      toast(isArchived ? "Post restored" : "Post archived");
    } catch (error) {
      toast(error.message || "The post could not be updated.");
      if (button.isConnected) button.disabled = false;
    }
  };
  sheet.querySelector("[data-edit-save]")?.addEventListener("click", async event => {
    const button = event.currentTarget;
    const text = caption.value.trim();
    const visibility = sheet.querySelector("[data-edit-visibility]").value;
    if (text.length > 1000) {
      toast("Captions must be 1,000 characters or fewer.");
      caption.focus();
      return;
    }
    button.disabled = true;
    try {
      await api.updateOwnPost(post.id, { text, place, visibility });
      closePostEditSheet(sheet);
      render();
      toast("Post updated");
    } catch (error) {
      toast(error.message || "The post could not be updated.");
      if (button.isConnected) button.disabled = false;
    }
  });
  bindPostDeleteActions(sheet, {
    onDeleted: () => {
      closePostEditSheet(sheet);
      viewer = null;
      render();
    },
  });
  caption?.focus();
}

function bindPostViewerDownloadActions(root = app) {
  root.querySelectorAll("[data-post-viewer-download]").forEach(button => {
    button.onclick = async event => {
      event.preventDefault();
      event.stopPropagation();
      if (button.disabled) return;
      const postId = button.dataset.postViewerDownload;
      const downloadPost = api.post(postId);
      if (!downloadPost) return toast("This post is no longer available.");
      if (downloadPost.allowDownloads === false) return toast("This creator has turned off downloads.");
      const screen = button.closest(".post-viewer-screen");
      if (!screen) return;
      button.disabled = true;
      const buttonMarkup = button.innerHTML;
      button.textContent = "0%";
      const Constructor = window.AudioContext || window.webkitAudioContext;
      let context;
      try {
        if (Constructor) { context = new Constructor(); void context.resume().catch(() => {}); }
        const { downloadPostVideo } = await import("./post-video-download.js");
        await downloadPostVideo({
          reference: profilePostMedia(downloadPost)[0],
          audioSession: context ? { context } : null,
          alive: () => screen.isConnected,
          onProgress: fraction => {
            button.textContent = `${Math.round(fraction * 100)}%`;
            button.setAttribute("aria-label", `Preparing watermarked video ${Math.round(fraction * 100)}%`);
          },
        });
        if (screen.isConnected) toast("Watermarked video prepared for download.");
      } catch (error) {
        if (screen.isConnected) toast(error.message || "Couldn't save this video. Try again.");
      } finally {
        button.disabled = false;
        button.innerHTML = buttonMarkup;
        button.setAttribute("aria-label", "Save video with Oldtime watermark");
        await context?.close().catch(() => {});
      }
    };
  });
}

function bindPostEditActions(root = app) {
  root.querySelectorAll("[data-profile-post-menu], [data-post-actions-menu]").forEach(menu => {
    if (menu.dataset.postActionsToggleBound === "true") return;
    menu.dataset.postActionsToggleBound = "true";
    menu.addEventListener("toggle", () => {
      if (!menu.open) return;
      root.querySelectorAll("[data-profile-post-menu], [data-post-actions-menu]").forEach(other => {
        if (other !== menu) other.open = false;
      });
    });
  });
  if (root === app && !app.dataset.postActionsMenuDismissBound) {
    document.addEventListener("click", event => {
      if (event.target instanceof Element && event.target.closest("[data-profile-post-menu], [data-post-actions-menu]")) return;
      app.querySelectorAll("[data-profile-post-menu][open], [data-post-actions-menu][open]").forEach(menu => { menu.open = false; });
    });
    app.dataset.postActionsMenuDismissBound = "true";
  }
  root.querySelectorAll("[data-post-edit]").forEach(button => {
    button.onclick = event => {
      event.preventDefault();
      event.stopPropagation();
      button.closest("[data-profile-post-menu], [data-post-actions-menu]")?.removeAttribute("open");
      openPostEditSheet(button.dataset.postEdit);
    };
  });
  root.querySelectorAll("[data-post-cover-edit]").forEach(button => {
    button.onclick = event => {
      event.preventDefault();
      event.stopPropagation();
      button.closest("[data-profile-post-menu], [data-post-actions-menu]")?.removeAttribute("open");
      const post = api.post(button.dataset.postCoverEdit);
      const owner = post && api.user(post.author);
      if (post && owner?.id === api.me()?.id) openProfilePostCoverEditor(owner, post);
    };
  });
  bindPostViewerDownloadActions(root);
  bindPostArchiveActions(root);
  bindPostDeleteActions(root);
}

function bindPosts({ observe = true } = {}) {
  bindCommunityTextPostOpen();
  mountRepostAffordances(app);
  bindVideoSearchInsights();
  app.querySelectorAll("article.clip").forEach(element=>{
    if(element.querySelector("video"))return;
    const item=api.post(element.dataset.id);if(item)trackQualifiedView(item,element,tab==="communities"?"community":"feed");
  });
  if (observe) observeVideos();
  void hydrateLocalMedia(app);
  mountCreativeViewers(app, { onSource: openPostViewer, muted });
  const useAudioInCreate=({source,title})=>{
    const creator=source.authorProfile||api.user(source.author);
    openUniversalCreation({
      startCamera:true,
      initialProject:{
        audioTracks:[{
          id:`sound-${crypto.randomUUID()}`,media:source.media[0],title,
          sourcePostId:source.soundId?null:(source.sourcePostId||source.id),
          sourceSoundId:source.soundId||null,avatar:creator?.avatar||"",volume:.8,offset:0,loop:true,
        }],
      },
    });
  };
  app.querySelectorAll("[data-audio-open]").forEach(button => button.onclick = event => {
    event.stopPropagation();
    openAudioPanel({
      postId: button.dataset.audioOpen, sheet: $("#sheet"), esc, icons: ic, toast, onClose: render,
      onUseSound:useAudioInCreate,
      onPosted: () => { tab = "updates"; profileId = null; viewer = null; render(); }
    });
  });
  app.querySelectorAll("[data-audio-action]").forEach(button => button.onclick = event => {
    event.stopPropagation();
    openAudioPanel({
      postId: button.dataset.audioPost,
      initialMode: button.dataset.audioAction,
      sheet: $("#sheet"), esc, icons: ic, toast, onClose: render,
      onUseSound:useAudioInCreate,
      onPosted: () => { tab = "updates"; profileId = null; viewer = null; render(); }
    });
  });
  bindPostEditActions();
  app.querySelectorAll("[data-like]").forEach(b => b.onclick = event => {
    event.stopPropagation();
    const id = b.dataset.like;
    const isPlaceViewer = Boolean(b.closest(".post-viewer-place"));
    const isMediaViewer = Boolean(b.closest(".post-viewer-media"));
    const post = api.post(id);
    if (isPlaceViewer && !post?.likes?.includes(api.me()?.id)) {
      const clip = b.closest(".clip");
      showPostHeart(id, clip ? clip.clientWidth * .62 : 0, clip ? clip.clientHeight * .66 : 0);
    }
    void like(id, null, !isPlaceViewer && !isMediaViewer);
  });
  app.querySelectorAll("[data-save]").forEach(b => b.onclick = (e) => {
    e.stopPropagation();
    b.closest("[data-post-actions-menu]")?.removeAttribute("open");
    save(b.dataset.save);
  });
  app.querySelectorAll("[data-comment]").forEach(b => b.onclick = (e) => { e.stopPropagation(); comments(b.dataset.comment); });
  app.querySelectorAll("[data-share]").forEach(b => b.onclick = (e) => {
    e.stopPropagation();
    void sharePost(b.dataset.share, {
      allowRepost: !Boolean(b.closest(".community-post-actions,.cvc-actions")),
      communityPost: Boolean(b.closest(".community-post-card")),
    });
  });
  app.querySelectorAll("[data-repost]").forEach(b => b.onclick = (e) => { e.stopPropagation(); repost(b.dataset.repost); });
  app.querySelectorAll("[data-repost-note]").forEach(b => b.onclick = (e) => {
    e.stopPropagation();
    openRepostNote(b.dataset.repostNote, { esc, toast, onSaved: () => render() });
  });
  app.querySelectorAll("[data-follow]").forEach(b => b.onclick = (e) => {
    e.stopPropagation();
    void follow(b.dataset.follow, { rerender: !Boolean(b.closest(".post-viewer-media")) });
  });
  app.querySelectorAll("[data-place-explore]").forEach(b => b.onclick = e => {
    e.stopPropagation();
    selectPlace({
      id: b.dataset.placeId || `custom:${cityMatchKey(b.dataset.placeExplore)}`,
      label: b.dataset.placeExplore,
      source: b.dataset.placeSource,
      category: b.dataset.placeCategory,
      address: b.dataset.placeAddress,
      lat: b.dataset.placeLat,
      lon: b.dataset.placeLon,
    });
  });
  app.querySelectorAll("[data-avatar-profile]").forEach(b => b.onclick = e => {
    e.stopPropagation();
    openPersonAvatar(b.dataset.avatarProfile);
  });
  app.querySelectorAll("[data-profile]").forEach(b => b.onclick = e => {
    e.stopPropagation();
    navigateToProfile(b.dataset.profile);
  });
  app.querySelectorAll("[data-dot]").forEach(b => b.onclick = (e) => {
    e.stopPropagation();
    const [id, n] = b.dataset.dot.split(":");
    carouselIndex[id] = +n;
    const canvas = b.closest(".clip")?.querySelector("canvas[data-creative-carousel]");
    if (canvas) canvas.dispatchEvent(new CustomEvent("creative-carousel-index", { detail: +n }));
    else render();
  });
  app.querySelectorAll("[data-caption-toggle]").forEach(button => button.onclick = event => {
    event.stopPropagation();
    const expanded = button.getAttribute("aria-expanded") === "true";
    const body = button.parentElement?.querySelector("[data-caption-content]");
    if (!body) return;
    body.classList.toggle("is-expanded", !expanded);
    body.classList.toggle("is-collapsed", expanded);
    button.setAttribute("aria-expanded", String(!expanded));
    button.textContent = expanded ? "See more" : "See less";
    expandedCaptions[button.dataset.captionToggle] = !expanded;
  });
  app.querySelectorAll("[data-post-carousel]").forEach(stage => {
    let start = null;
    stage.onpointerdown = event => { start = { x: event.clientX, y: event.clientY }; };
    stage.onpointercancel = () => { start = null; };
    stage.onpointerup = event => {
      if (!start) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      start = null;
      if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
      const id = stage.dataset.postCarousel, count = Number(stage.dataset.count) || 1;
      carouselIndex[id] = Math.max(0, Math.min(count - 1, (carouselIndex[id] || 0) + (dx < 0 ? 1 : -1)));
      stage.dataset.suppressClickUntil = String(Date.now() + 350);
      event.preventDefault(); event.stopPropagation(); render();
    };
    stage.addEventListener("click", event => {
      if (Date.now() < Number(stage.dataset.suppressClickUntil || 0)) { event.preventDefault(); event.stopImmediatePropagation(); }
    }, true);
  });
  app.querySelectorAll("#feed .clip video").forEach(video => {
    video.addEventListener("click", () => {
      if (!video.muted) return;
      video.muted = false;
      const playback = video.play();
      playback?.then(() => { muted = false; syncFeedSoundControls(); }).catch(failure => {
        video.muted = true;muted = true;syncFeedSoundControls();
        toast(`${failure?.name||"PlaybackError"}: ${failure?.message||"Sound could not start."}`);
      });
    });
  });
  app.querySelectorAll("#feed [data-feed-sound-toggle], .post-viewer-feed [data-feed-sound-toggle]").forEach(button => {
    button.onclick = event => {
      event.preventDefault();
      event.stopPropagation();
      const video = button.closest(".clip")?.querySelector("video");
      if (!video) return;
      if (!muted) {
        muted = saveFeedSoundMuted(true, feedPreferenceOwnerId());
        app.querySelectorAll("#feed .clip video, .post-viewer-feed .clip video").forEach(item => { item.muted = true; });
        syncFeedSoundControls();
        return;
      }
      video.muted = false;
      let playback;
      try {
        playback = video.play();
      } catch {
        video.muted = true;
        muted = saveFeedSoundMuted(true, feedPreferenceOwnerId());
        syncFeedSoundControls();
        toast("Sound could not start on this device.");
        return;
      }
      muted = saveFeedSoundMuted(false, feedPreferenceOwnerId());
      syncFeedSoundControls();
      playback?.catch(failure => {
        video.muted = true;
        muted = saveFeedSoundMuted(true, feedPreferenceOwnerId());
        syncFeedSoundControls();
        toast(`${failure?.name||"PlaybackError"}: ${failure?.message||"Sound could not start."}`);
      });
    };
  });
  app.querySelectorAll("[data-dbl]").forEach(el => {
    let lastTap = 0;
    let singleTapTimer = null;
    el.onclick = event => {
      event.preventDefault();
      const now = Date.now();
      if (now - lastTap <= 320) {
        clearTimeout(singleTapTimer);
        lastTap = 0;
        const clip = el.closest(".clip");
        const bounds = clip?.getBoundingClientRect();
        const x = bounds ? Math.max(24, Math.min(bounds.width - 24, event.clientX - bounds.left)) : 0;
        const y = bounds ? Math.max(48, Math.min(bounds.height - 48, event.clientY - bounds.top)) : 0;
        like(el.dataset.dbl, true, false);
        showPostHeart(el.dataset.dbl, x, y);
        return;
      }
      lastTap = now;
      singleTapTimer = window.setTimeout(() => {
        lastTap = 0;
        if (el instanceof HTMLVideoElement && el.isConnected) {
          if (el.paused) el.play().catch(() => {});
          else el.pause();
        }
      }, 320);
    };
  });
}

function showFeedCommentPreview(postId, comment) {
  const clip = [...app.querySelectorAll(".clip")].find(item => item.dataset.id === String(postId));
  if (!clip || clip.classList.contains("post-detail")) return;
  clip.querySelector(".feed-comment-preview")?.remove();
  const author = api.user(comment?.author) || api.me() || { username: "you", avatar: "" };
  const preview = document.createElement("div");
  preview.className = "feed-comment-preview";
  preview.setAttribute("aria-hidden", "true");
  const avatar = document.createElement("img");
  avatar.alt = "";
  avatar.src = author.avatar || "";
  const copy = document.createElement("span");
  copy.className = "feed-comment-preview-copy";
  const name = document.createElement("b");
  name.textContent = `@${author.username || "you"}`;
  const body = document.createElement("span");
  body.textContent = String(comment?.body || "").trim();
  copy.append(name, body);
  preview.append(avatar, copy);
  clip.append(preview);
  requestAnimationFrame(() => preview.classList.add("is-visible"));
  setTimeout(() => {
    if (!preview.isConnected) return;
    preview.classList.remove("is-visible");
    preview.classList.add("is-leaving");
    setTimeout(() => preview.remove(), 220);
  }, 3600);
}
function showPostHeart(id, x, y) {
  const clip = [...app.querySelectorAll(".clip")].find(item => item.dataset.id === id);
  if (!clip) return;
  const heart = document.createElement("span");
  heart.className = "post-heart-burst";
  heart.style.left = `${x || clip.clientWidth / 2}px`;
  heart.style.top = `${y || clip.clientHeight / 2}px`;
  heart.innerHTML = ic.mediaHeartOn;
  heart.setAttribute("aria-hidden", "true");
  clip.appendChild(heart);
  window.setTimeout(() => heart.remove(), 1050);
}
const pendingCloudLikeIds = new Set();
function syncCloudLikeButtons(id, post, me, pending = false) {
  if (post && !app.querySelector(".post-viewer-place")) updateLikesRow(post);
  app.querySelectorAll("[data-like]").forEach(button => {
    if (button.dataset.like !== id) return;
    const liked = Boolean(post?.likes?.includes(me.id));
    const isCommunityPost = Boolean(button.closest(".community-post-card"));
    button.classList.toggle(isCommunityPost ? "is-active" : "on", liked);
    button.classList.toggle("like-pending", pending && liked);
    if (pending) button.setAttribute("aria-busy", "true");
    else button.removeAttribute("aria-busy");
    button.setAttribute("aria-pressed", String(liked));
    button.setAttribute("aria-label", liked ? "Unlike post" : "Like post");
    const heartIcon = isCommunityPost
      ? (liked ? ic.heartOn : ic.heart)
      : (liked ? ic.mediaHeartOn : ic.mediaHeart);
    const countMarkup = isCommunityPost
      ? `<span>${fmt(post?.likeCount || 0)}</span>`
      : `<span class="act-count">${fmt(post?.likeCount || 0)}</span>`;
    button.innerHTML = `${heartIcon}${countMarkup}`;
  });
}
async function like(id, forceLike = null, rerender = true) {
  const me = api.me();
  const cloudPost = api.cloudPost(id);
  if (cloudPost) {
    const wasLiked = cloudPost.likes.includes(me.id);
    const shouldLike = forceLike === null ? !wasLiked : forceLike;
    if (shouldLike === wasLiked || pendingCloudLikeIds.has(id)) return;
    const previous = {
      likes: [...cloudPost.likes],
      likeCount: cloudPost.likeCount,
      likedBy: Array.isArray(cloudPost.likedBy) ? [...cloudPost.likedBy] : null,
    };
    pendingCloudLikeIds.add(id);
    cloudPost.likes = shouldLike
      ? [...cloudPost.likes, me.id]
      : cloudPost.likes.filter(personId => personId !== me.id);
    const currentCount = Number.isFinite(previous.likeCount) ? previous.likeCount : previous.likes.length;
    cloudPost.likeCount = Math.max(0, currentCount + (shouldLike ? 1 : -1));
    if (Array.isArray(cloudPost.likedBy)) {
      cloudPost.likedBy = cloudPost.likedBy.filter(person => person?.id !== me.id);
      if (shouldLike) cloudPost.likedBy.unshift({
        id: me.id, displayName: me.name, avatarUrl: me.avatar || "",
      });
    }
    if (rerender) render();
    syncCloudLikeButtons(id, cloudPost, me, true);
    try {
      await api.setCloudLike(id, shouldLike);
      if (shouldLike) recordActivity("like", cloudPost);
      if (rerender) render();
    } catch (error) {
      cloudPost.likes = previous.likes;
      cloudPost.likeCount = previous.likeCount;
      if (previous.likedBy) cloudPost.likedBy = previous.likedBy;
      if (rerender) render();
      toast(error.message || "Couldn’t update this like");
    } finally {
      pendingCloudLikeIds.delete(id);
      syncCloudLikeButtons(id, api.cloudPost(id) || cloudPost, me);
    }
    return;
  }
  mutate(db => {
    const p = db.posts.find(x => x.id === id);
    if (!p) return;
    const i = p.likes.indexOf(me.id);
    const shouldLike = forceLike === null ? i < 0 : forceLike;
    if (shouldLike && i < 0) {
      p.likes.push(me.id);
      recordActivity("like",p);
      (p.tags || []).forEach(t => db.interests[t] = (db.interests[t] || 0) + 1);
      if (p.author !== me.id) notify(db, { id: "n" + Date.now(), user: p.author, kind: "like", actor: me.id, post: id, body: "liked your post", created: Date.now(), read: false });
    } else if (!shouldLike && i >= 0) p.likes.splice(i, 1);
  });
  if (rerender) render();
  else {
    const post = api.db().posts.find(item => item.id === id);
    if(post && !app.querySelector(".post-viewer-place"))updateLikesRow(post);
    app.querySelectorAll("[data-like]").forEach(button => {
      if (button.dataset.like !== id) return;
      const liked = post?.likes.includes(me.id) || false;
      button.classList.toggle("on", liked);
      button.setAttribute("aria-pressed", String(liked));
      button.setAttribute("aria-label", liked ? "Unlike post" : "Like post");
      const isCommunityPost = Boolean(button.closest(".community-post-card"));
      const heartIcon = isCommunityPost
        ? (liked ? ic.heartOn : ic.heart)
        : (liked ? ic.mediaHeartOn : ic.mediaHeart);
      button.innerHTML = `${heartIcon}${fmt(post?.likes.length || 0)}`;
    });
  }
}
const savingPostIds = new Set();
async function save(id) {
  const me = api.me();
  const post = api.post(id);
  if (!me || !post) return toast("This post is unavailable. Try again.");
  if (savingPostIds.has(id)) return;
  const wasSaved = Boolean(post.saves?.includes(me.id) || me.savedPostIds?.includes(id));
  const initialButtons = [...app.querySelectorAll("[data-save]")].filter(button => button.dataset.save === id);
  savingPostIds.add(id);
  initialButtons.forEach(button => { button.disabled = true; button.setAttribute("aria-busy", "true"); });
  try {
    await setPostSaved(id, !wasSaved);
    const updated = api.post(id) || post;
    const saved = Boolean(updated.saves?.includes(me.id) || api.me()?.savedPostIds?.includes(id));
    const count = Number(updated.saveCount ?? updated.saves?.length ?? 0);
    app.querySelectorAll("[data-save]").forEach(button => {
      if (button.dataset.save !== id) return;
      button.classList.toggle(button.closest(".community-post-card") ? "is-active" : "on", saved);
      button.setAttribute("aria-pressed", String(saved));
      button.setAttribute("aria-label", saved ? "Remove saved post" : "Save post");
      const isCommunityPost = Boolean(button.closest(".community-post-card"));
      const mark = isCommunityPost
        ? (saved ? ic.bookmarkOn : ic.bookmark)
        : (saved ? ic.mediaBookmarkOn : ic.mediaBookmark);
      if (isCommunityPost) button.innerHTML = `${mark}<span>${fmt(count)}</span>`;
      else if (button.closest(".post-viewer-actions-menu")) button.innerHTML = `${mark}<span>${saved ? "Remove saved post" : "Save post"}</span>`;
      else if (button.closest(".rail")) button.innerHTML = `<span class="bubble">${mark}</span><span class="act-count">${fmt(count)}</span>`;
      else button.innerHTML = `${mark}<span class="act-count">${fmt(count)}</span>`;
    });
    toast(saved ? "Saved" : "Removed from saved");
  } catch (error) {
    toast(error.message || "Could not update Saved. Try again.");
  } finally {
    savingPostIds.delete(id);
    initialButtons.forEach(button => {
      button.disabled = false;
      button.removeAttribute("aria-busy");
    });
  }
}
function showSocialSheet(id, mode, options = {}) {
  const communityPost = options.communityPost === true;
  openSocialSheet({
    id, mode, allowRepost: options.allowRepost !== false, sheet: $("#sheet"), esc, icons: ic, toast,
    communityPost,
    onClose: options.onClose || render,
    onExternal: sharePostExternally,
    onStory: (postId, commentId = "") => addSharedContentToStory(postId, commentId, { communityPost }),
    onRepost: repost,
  });
}
function syncFollowButtons(id) {
  const me = api.me();
  const author = api.user(id);
  if (!me || !author) return;
  const following = me.following.includes(id);
  const requested = api.db().requests.some(request => request.from === me.id && request.to === id);
  const label = following ? "Following" : requested ? "Requested" : "Follow";
  app.querySelectorAll("[data-follow]").forEach(button => {
    if (button.dataset.follow !== id) return;
    button.textContent = label;
    button.setAttribute("aria-pressed", String(following));
    button.setAttribute("aria-label", `${label} ${author.name || author.username || ""}`.trim());
  });
}
async function follow(id, { rerender = true } = {}) {
  const me = api.me();
  const u = api.user(id);
  const wasFollowing=me.following.includes(id);
  if (api.blocked(me.id, id)) return toast("Unblock this user before following");
  if (api.authMode() === "cloud") {
    try {
      await api.refreshCloudRelationships();
      const current = api.me();
      const following = current.following.includes(id);
      const requested = api.db().requests.some(request => request.from === current.id && request.to === id);
      await api.setCloudFollow(id, !following && !requested);
      const nowFollowing = api.me().following.includes(id);
      const nowRequested = api.db().requests.some(request => request.from === api.me().id && request.to === id);
      if (rerender) render();
      else syncFollowButtons(id);
      toast(nowFollowing ? "Following" : nowRequested ? "Follow request sent" : wasFollowing ? "Unfollowed" : "Follow request canceled");
    } catch (error) {
      toast(error.message || "Follow settings could not be updated.");
    }
    return;
  }
  mutate(db => {
    const meU = db.users.find(x => x.id === me.id);
    const them = db.users.find(x => x.id === id);
    if (meU.following.includes(id)) {
      meU.following = meU.following.filter(x => x !== id);
      them.followers = them.followers.filter(x => x !== me.id);
      db.requests = db.requests.filter(r => !(r.from === me.id && r.to === id));
    } else if (them.private) {
      if (db.requests.some(r => r.from === me.id && r.to === id)) db.requests = db.requests.filter(r => !(r.from === me.id && r.to === id));
      else db.requests.push({ from: me.id, to: id, at: Date.now() });
    } else {
      meU.following.push(id); them.followers.push(me.id);
      notify(db, { id: "n" + Date.now(), user: id, kind: "follow", actor: me.id, body: "started following you", created: Date.now(), read: false });
    }
  });
  if(!u.private)recordActivity(api.me().following.includes(id)?"follow":"unfollow",{author:id,id:null},"profile");
  if (rerender) render();
  else syncFollowButtons(id);
  const following=api.me().following.includes(id);
  const requested=api.db().requests.some(r=>r.from===me.id&&r.to===id);
  toast(following?"Following":requested?"Requested":wasFollowing?"Unfollowed":"Follow request canceled");
}
async function friend(id) {
  const me = api.me();
  const them = api.user(id);
  if (!them || them.id === me.id || api.blocked(me.id, them.id)) {
    return toast("Unblock this user before adding them as a Friend");
  }
  if (api.authMode() === "cloud") {
    try {
      await api.refreshCloudRelationships();
      if (api.areFriends(me.id, them.id)) {
        if (!confirm(`Remove @${them.username} from Friends?`)) return;
        await api.removeCloudFriend(them.id);
        render();
        toast("Friend removed");
        return;
      }
      const incoming = api.db().friendRequests.some(request => request.from === them.id && request.to === me.id);
      const outgoing = api.db().friendRequests.some(request => request.from === me.id && request.to === them.id);
      if (incoming) {
        await api.respondCloudFriendRequest(them.id, true);
        render();
        toast("You’re now Friends");
      } else if (outgoing) {
        await api.respondCloudFriendRequest(them.id, false);
        render();
        toast("Friend request canceled");
      } else {
        const status = await api.sendCloudFriendRequest(them.id);
        render();
        toast(status === "friends" ? "You’re now Friends" : "Friend request sent");
      }
    } catch (error) {
      toast(error.message || "Friend settings could not be updated.");
    }
    return;
  }
  const alreadyFriends = api.areFriends(me.id, them.id);
  if (alreadyFriends && !confirm(`Remove @${them.username} from Friends?`)) return;
  let message = "Friend request sent";
  mutate(db => {
    db.friendRequests = Array.isArray(db.friendRequests) ? db.friendRequests : [];
    const current = db.users.find(user => user.id === me.id);
    const other = db.users.find(user => user.id === them.id);
    if (!current || !other) return;
    current.friends = Array.isArray(current.friends) ? current.friends : [];
    other.friends = Array.isArray(other.friends) ? other.friends : [];
    const outgoing = db.friendRequests.some(request => request.from === me.id && request.to === them.id);
    const incoming = db.friendRequests.some(request => request.from === them.id && request.to === me.id);
    if (alreadyFriends) {
      current.friends = current.friends.filter(friendId => friendId !== them.id);
      other.friends = other.friends.filter(friendId => friendId !== me.id);
      message = "Friend removed";
    } else if (incoming) {
      if (!current.friends.includes(them.id)) current.friends.push(them.id);
      if (!other.friends.includes(me.id)) other.friends.push(me.id);
      db.friendRequests = db.friendRequests.filter(request =>
        !((request.from === me.id && request.to === them.id) || (request.from === them.id && request.to === me.id))
      );
      notify(db, { id: "n" + Date.now(), user: them.id, kind: "friend-accepted", actor: me.id, body: "accepted your Friend request", created: Date.now(), read: false });
      message = "You’re now Friends";
    } else if (outgoing) {
      db.friendRequests = db.friendRequests.filter(request => !(request.from === me.id && request.to === them.id));
      message = "Friend request canceled";
    } else {
      db.friendRequests.push({ from: me.id, to: them.id, at: Date.now() });
      notify(db, { id: "n" + Date.now(), user: them.id, kind: "friend-request", actor: me.id, body: "sent you a Friend request", created: Date.now(), read: false });
    }
  });
  render();
  toast(message);
}
async function toggleCloseFriend(id) {
  const me = api.me();
  const target = api.user(id);
  if (!target || target.id === me.id || api.blocked(me.id, target.id)) {
    return toast("Unblock this user before adding them to Close Friends");
  }
  if (api.authMode() === "cloud") {
    try {
      await Promise.all([api.refreshCloudCloseFriends(), api.refreshCloudBlocks()]);
      const selected = new Set(api.cloudCloseFriends());
      if (selected.has(target.id)) selected.delete(target.id);
      else selected.add(target.id);
      await api.replaceCloudCloseFriends([...selected]);
      render();
      toast(selected.has(target.id) ? "Added to Close Friends" : "Removed from Close Friends");
    } catch (error) {
      toast(error.message || "Close Friends could not be updated.");
    }
    return;
  }
  if (!api.areFriends(me.id, target.id)) return toast("Become Friends first before adding them to Close Friends");
  let added = false;
  mutate(db => {
    const current = db.users.find(user => user.id === me.id);
    current.closeFriends = Array.isArray(current.closeFriends) ? current.closeFriends : [];
    const index = current.closeFriends.indexOf(target.id);
    if (index >= 0) current.closeFriends.splice(index, 1);
    else { current.closeFriends.push(target.id); added = true; }
  });
  render();
  toast(added ? "Added to Close Friends" : "Removed from Close Friends");
}
async function respondToFriendRequest(from, accept) {
  const me = api.me();
  if (api.authMode() === "cloud") {
    try {
      await api.respondCloudFriendRequest(from, accept);
      render();
      toast(accept ? "Friend request accepted" : "Friend request declined");
    } catch (error) {
      toast(error.message || "Friend request could not be updated.");
    }
    return;
  }
  mutate(db => {
    db.friendRequests = Array.isArray(db.friendRequests) ? db.friendRequests : [];
    const request = db.friendRequests.find(item => item.from === from && item.to === me.id);
    const other = db.users.find(user => user.id === from);
    const current = db.users.find(user => user.id === me.id);
    if (request && accept && other && current) {
      current.friends = Array.isArray(current.friends) ? current.friends : [];
      other.friends = Array.isArray(other.friends) ? other.friends : [];
      if (!current.friends.includes(from)) current.friends.push(from);
      if (!other.friends.includes(me.id)) other.friends.push(me.id);
      notify(db, { id: "n" + Date.now(), user: from, kind: "friend-accepted", actor: me.id, body: "accepted your Friend request", created: Date.now(), read: false });
    }
    db.friendRequests = db.friendRequests.filter(item => !(item.from === from && item.to === me.id));
  });
  render();
}
function sharePost(id, options = {}) {
  showSocialSheet(id, "share", options);
}
async function sharePostExternally(id, action = "external") {
  const p = api.post(id);
  if (!p || !api.canSeePost(p)) return toast("Post unavailable");
  const author = api.user(p.author);
  const link = postPublicLink(id);
  const text = p.caption?.trim() || `View @${author?.username || "someone"}'s post on Oldtime.`;
  if (action === "copylink") {
    if (!await copyShareLink(link.href)) throw new Error("Couldn't copy this link.");
    toast("Post link copied");
    return {completed:true,kind:"copied"};
  }
  const result = await shareExternally({
    title: `@${author?.username || "someone"} on Oldtime`,
    text,
    url: link.href
  });
  if (result === "cancelled") return;
  if (result === "failed") return toast("Couldn't share this post");
  if (result === "shared") {
    recordActivity("share",p,"shared-link");
    const me = api.me();
    mutate(db => {
      const post = db.posts.find(item => item.id === id);
      if (!post) return;
      post.shares = (post.shares || 0) + 1;
      if (post.author !== me.id) notify(db, { id: "n" + Date.now(), user: post.author, kind: "share", actor: me.id, post: id, body: "shared your post", created: Date.now(), read: false });
    });
  }
  toast(result === "shared" ? "Post shared" : "Post link copied");
  return {completed:true,kind:result==="shared"?"shared":"copied"};
}
function addSharedContentToStory(id, commentId = "", { communityPost = false } = {}) {
  const post = api.post(id);
  if (!post || !api.canSeePost(post)) throw new Error("Post unavailable.");
  const comment = findSharedComment(post, commentId);
  if (commentId && !comment) throw new Error("Comment unavailable.");
  // Sharing must not turn another person's restricted content into a public snapshot.
  if (!api.canSeePost(post, null)) throw new Error("Only public posts can be added to your status.");
  queueMicrotask(async () => {
    try {
      const { prepareStatusShare } = await import("./status-sharing.js");
      const seed = await prepareStatusShare(id, commentId, {
        communityPost,
        viewerId: api.me()?.id || "",
        icons: ic,
      });
      await openUniversalCreation({ destination: "story", ...seed, shareText: postPublicLink(id, commentId).href });
    } catch (error) { toast(error.message || "Couldn't prepare this Status. Please try again."); }
  });
  return true;
}
const pendingRepostRequests = new Set();
const pendingRepostConfirmations = new Map();
function isRepostConfirmationActive(id) {
  return pendingRepostConfirmations.get(id)?.ownerId === api.me()?.id;
}
function clearRepostConfirmation(id) {
  const confirmation = pendingRepostConfirmations.get(id);
  if (!confirmation) return;
  clearTimeout(confirmation.timer);
  pendingRepostConfirmations.delete(id);
}
function finishRepostConfirmation(id, confirmation) {
  if (pendingRepostConfirmations.get(id) !== confirmation) return;
  pendingRepostConfirmations.delete(id);
  document.querySelectorAll(".rp-aff").forEach(affordance => {
    if (affordance.dataset.rpPost !== id) return;
    affordance.querySelector('.rp-confirmation[role="status"]')?.remove();
  });
}
function showRepostConfirmation(id, ownerId) {
  clearRepostConfirmation(id);
  const confirmation = { ownerId, timer: null };
  pendingRepostConfirmations.set(id, confirmation);
  render();
  confirmation.timer = setTimeout(() => finishRepostConfirmation(id, confirmation), 1800);
}
async function repost(id) {
  if (pendingRepostRequests.has(id)) return false;
  const me = api.me(), post = api.post(id);
  if (!me || !post || !post.cloud) {
    toast("This post hasn’t been uploaded yet. Only online posts can be reposted.");
    return false;
  }
  const remove = Boolean(post.repostedByMe) || (post.reposts || []).includes(me.id);
  pendingRepostRequests.add(id);
  try {
    await api.setCloudRepost(id, !remove, post.repostNote || post.repostNotes?.[me.id] || "");
    if (api.me()?.id !== me.id) return false;
    if (remove) {
      clearRepostConfirmation(id);
      render();
    } else {
      showRepostConfirmation(id, me.id);
    }
    return true;
  } catch (error) {
    if (api.me()?.id === me.id) toast(error.message || "Could not save your repost.");
    return false;
  } finally {
    pendingRepostRequests.delete(id);
  }
}

function openCommentCreative(postId, commentId, destination = "post", startCamera = false, onClose = () => comments(postId, commentId)) {
  if (destination === "story") {
    try { return addSharedContentToStory(postId, commentId); }
    catch (error) { toast(error.message || "Couldn't prepare this Status."); return false; }
  }
  const sheet = $("#sheet");
  sheet.classList.remove("on"); sheet.innerHTML = ""; sheet.onclick = null; sheet.onkeydown = null;
  openCreativeEditor({ postId, commentId, destination, startCamera, responseStudio: true, esc, icons: ic, toast,
    onClose,
    onPosted: (id, story) => {
      tab = "updates"; profileId = null; viewer = null; render();
      if (story) openStory(api.me().id); else openPostViewer(id);
    }
  });
}
function comments(id, focusedCommentId = "") {
  const sheet = $("#sheet");
  const owner = api.cloudAccountId();
  let panel = null;
  const isCurrent = () => panel?.isConnected && sheet.querySelector(".comment-panel") === panel && api.cloudAccountId() === owner;
  let loadingComments = Boolean(api.cloudPost(id)), commentLoadFailed = false;
  const trigger = document.activeElement;
  let searchText = "";
  let sortMode = "top";
  let enteringCommentId = "";
  let actionLayer = null;
  let mentionCleanup = () => {};
  const expandedReplies = new Set();
  const totalCount = comments => comments.reduce((total, comment) => total + 1 + totalCount(comment.replies || []), 0);
  const close = () => {
    actionLayer?.remove();
    actionLayer = null;
    sheet.classList.remove("on");
    sheet.innerHTML = "";
    sheet.onclick = null;
    sheet.onkeydown = null;
    mentionCleanup();
    notifyMediaViewerComments(id);
    if (trigger?.isConnected) trigger.focus();
  };
  function showCommentActions(commentId, triggerButton) {
    const post = api.post(id);
    const comment = findSharedComment(post, commentId);
    if (!comment) return;
    actionLayer?.remove();
    const author = api.user(comment.author) || { username: "member" };
    const key = `${id}:${comment.id}`;
    const isFavorite = Array.isArray(api.me().commentFavorites) && api.me().commentFavorites.includes(key);
    const body = `@${author.username}: ${comment.body || "Photo comment"}`;
    const commentPanel = $(".comment-panel", sheet);
    commentPanel?.setAttribute("aria-hidden", "true");
    if (commentPanel) commentPanel.inert = true;
    actionLayer = document.createElement("div");
    actionLayer.className = "comment-action-overlay";
    actionLayer.innerHTML = `<section class="comment-action-panel" role="dialog" aria-modal="true" aria-label="Comment actions" tabindex="-1">
      <div class="grab" aria-hidden="true"></div>
      <header class="comment-action-header"><h2>Comment actions</h2><button type="button" data-action-close aria-label="Close comment actions">${ic.close}</button></header>
      <div class="comment-action-preview"><b>@${esc(author.username)}</b><span>${esc(comment.body || "Photo comment")}</span></div>
      <div class="comment-action-list">
        <button type="button" data-action-remix>Remix</button>
        <button type="button" data-action-video>Reply with video</button>
        <button type="button" data-action-story>Share to Status</button>
        <button type="button" data-action-copy>Copy comment</button>
        <button type="button" data-action-favorite>${isFavorite ? "Remove from Favorites" : "Add to Favorites"}</button>
        <button type="button" data-action-report>Report comment</button>
      </div>
      <p class="comment-action-note">Reports are not sent to moderation.</p>
    </section>`;
    sheet.appendChild(actionLayer);
    const dialog = $(".comment-action-panel", actionLayer);
    const dismiss = () => {
      actionLayer?.remove();
      actionLayer = null;
      if (commentPanel?.isConnected) {
        commentPanel.removeAttribute("aria-hidden");
        commentPanel.inert = false;
      }
      if (triggerButton?.isConnected) triggerButton.focus();
    };
    $("[data-action-close]", actionLayer).onclick = dismiss;
    actionLayer.onclick = event => { if (event.target === actionLayer) dismiss(); };
    $("[data-action-story]", actionLayer).onclick = () => {
      dismiss(); close(); openCommentCreative(id, comment.id, "story");
    };
    $("[data-action-remix]", actionLayer).onclick = () => { dismiss(); close(); openCommentCreative(id, comment.id); };
    $("[data-action-video]", actionLayer).onclick = () => { dismiss(); close(); openCommentCreative(id, comment.id, "post", true); };
    $("[data-action-copy]", actionLayer).onclick = async () => {
      try {
        const copied = await copyShareLink(body);
        toast(copied ? "Comment copied." : "Couldn’t copy comment.");
        if (copied) dismiss();
      } catch (error) { toast(error.message || "Couldn’t copy comment."); }
    };
    $("[data-action-favorite]", actionLayer).onclick = () => {
      try {
        mutate(db => {
          const me = db.users.find(user => user.id === api.me().id);
          me.commentFavorites = Array.isArray(me.commentFavorites) ? me.commentFavorites : [];
          me.commentFavorites = me.commentFavorites.includes(key) ? me.commentFavorites.filter(item => item !== key) : [...me.commentFavorites, key];
        });
        const saved = (api.me().commentFavorites || []).includes(key);
        toast(saved ? "Saved to Favorites" : "Removed from Favorites");
        dismiss();
        drawList();
        [...$("#clist", sheet).querySelectorAll("[data-cmore]")].find(button => button.dataset.cmore === commentId)?.focus();
      } catch (error) { toast(error.message || "Couldn’t update Favorites."); }
    };
    $("[data-action-report]", actionLayer).onclick = async () => {
      try {
        const author = api.user(comment.author);
        const targetUserId = author?.cloudAccountId || comment.author;
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetUserId)) {
          throw new Error("This comment is not linked to an online account, so it cannot be reported.");
        }
        await api.submitCloudReport({
          kind: "comment",
          category: "Comment",
          targetUserId,
          postId: String(id),
          commentId: String(comment.id),
          reason: "Reported comment for review.",
        });
        toast("Report received by Oldtime. Review status is not available yet.");
        dismiss();
      } catch (error) { toast(error.message || "Couldn’t save this report."); }
    };
    dialog.onkeydown = event => {
      if (event.key !== "Tab") return;
      const focusable = [...dialog.querySelectorAll("button:not([disabled])")];
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        focusable.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
        event.preventDefault();
        focusable[0].focus();
      }
    };
    dialog.focus();
  }
  const drawList = () => {
    if (!isCurrent()) return;
    const post = api.post(id);
    if (!post || !api.canSeePost(post)) return close();
    const list = $("#clist", sheet);
    const visibleComments = [...(post.comments || [])]
      .filter(comment => {
        const author = api.user(comment.author);
        const text = `${author?.username || ""} ${author?.name || ""} ${comment.body || ""}`.toLowerCase();
        return !searchText || text.includes(searchText);
      })
      .sort((a, b) => sortMode === "top"
        ? ((b.likes || []).length - (a.likes || []).length) || (b.created || 0) - (a.created || 0)
        : (b.created || 0) - (a.created || 0));
    const count = Math.max(totalCount(post.comments || []), Number(post.commentCount) || 0);
    $("#comment-count", sheet).textContent = `${count} ${count === 1 ? "comment" : "comments"}`;
    app.querySelectorAll("[data-comment]").forEach(button => {
      const label = button.querySelector("span");
      if (button.dataset.comment === id && label) label.textContent = fmt(count);
    });
    $("#comment-sort-label", sheet).textContent = sortMode === "top" ? "Top" : "Newest";
    list.innerHTML = visibleComments.map(comment => {
      const author = api.user(comment.author) || { username: "member", avatar: "" };
      const replies = comment.replies || [];
      const replyCount = totalCount(replies);
      const expanded = expandedReplies.has(comment.id);
      const liked = (comment.likes || []).includes(api.me().id);
      const disliked = (comment.dislikes || []).includes(api.me().id);
      const commentDate = comment.created ? new Date(comment.created) : null;
      const dateLabel = commentDate ? `${commentDate.getMonth() + 1}-${String(commentDate.getDate()).padStart(2, "0")}` : ago(comment.created);
      const renderReply = reply => {
        const replyAuthor = api.user(reply.author) || { username: "member", avatar: "" };
        const nested = reply.replies || [];
        return `<div class="comment-reply ${reply.id === enteringCommentId ? "comment-item-entering" : ""}" id="reply-${esc(reply.id)}">
          <img ${profileMediaSource(replyAuthor.avatar)} alt="" class="comment-reply-avatar" />
          <div class="comment-reply-content"><b>@${esc(replyAuthor.username)}</b><span>${renderMentionText(reply.body)}</span>
            ${reply.attachment?.url ? `<img class="comment-attachment" src="${esc(reply.attachment.url)}" alt="Photo attached to reply" loading="lazy" />` : ""}
            <small>${ago(reply.created)} <button type="button" data-reply="${esc(reply.id)}">Reply</button> <button type="button" data-cmore="${esc(reply.id)}" aria-label="Reply actions">${ic.tune}</button> ${reply.author === api.me().id ? `<button type="button" data-rdel="${esc(comment.id)}:${esc(reply.id)}">Delete</button>` : ""}</small>
            ${nested.length ? `<div class="comment-replies comment-replies-nested">${nested.map(renderReply).join("")}</div>` : ""}
          </div>
        </div>`;
      };
      const replyMarkup = replies.map(renderReply).join("");
      const favoriteKey = `${id}:${comment.id}`;
      const isFavorite = Array.isArray(api.me().commentFavorites) && api.me().commentFavorites.includes(favoriteKey);
      return `<article class="comment-item ${comment.id === enteringCommentId ? "comment-item-entering" : ""}" id="comment-${esc(comment.id)}">
        <img class="comment-avatar" ${profileMediaSource(author.avatar)} alt="" loading="lazy" />
        <div class="comment-content">
          <div class="comment-body"><b>@${esc(author.username)}${blueBadgeMarkup(author.cloudAccountId || author.id, esc)}</b><span>${renderMentionText(comment.body)}</span></div>
          ${comment.attachment?.url ? `<img class="comment-attachment" src="${esc(comment.attachment.url)}" alt="Photo attached to comment" loading="lazy" />` : ""}
          <div class="comment-footer">
            <span class="comment-date">${dateLabel}</span>
            <button type="button" class="comment-reply-action" data-reply="${esc(comment.id)}">Reply</button>
            <span class="comment-votes">
               <button type="button" class="comment-vote ${liked ? "on" : ""}" data-clike="${esc(comment.id)}" aria-label="${liked ? "Unlike" : "Like"} comment" aria-pressed="${liked}">${ic.mediaHeart}<small>${(comment.likes || []).length || ""}</small></button>
               <button type="button" class="comment-vote ${disliked ? "on" : ""}" data-cdislike="${esc(comment.id)}" aria-label="${disliked ? "Remove dislike" : "Dislike"} comment" aria-pressed="${disliked}"><svg viewBox="0 0 24 24" aria-hidden="true"><path transform="rotate(180 12 12)" d="M7 10v11H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3Zm0 0 4-8c1.5 0 2.5 1 2.5 2.5L13 9h6.2a2 2 0 0 1 2 2.4l-1.4 8a2 2 0 0 1-2 1.6H7V10Z"/></svg></button>
            </span>
            <button type="button" class="comment-more" data-cmore="${esc(comment.id)}" aria-label="Comment actions">${ic.tune}</button>
            ${comment.author === api.me().id || post.author === api.me().id ? `<button type="button" class="comment-delete" data-cdel="${esc(comment.id)}">Delete</button>` : ""}
          </div>
          ${replyCount ? `<button type="button" class="comment-view-replies" data-toggle-replies="${esc(comment.id)}" aria-expanded="${expanded}">${expanded ? "Hide" : "View"} ${replyCount} ${replyCount === 1 ? "reply" : "replies"}</button>` : ""}
          ${expanded ? `<div class="comment-replies">${replyMarkup}</div>` : ""}
        </div>
      </article>`;
    }).join("") || `<div class="comment-empty">${searchText ? "No comments match your search." : loadingComments ? "Loading comments…" : commentLoadFailed ? 'Comments could not be loaded. <button type="button" data-comments-retry>Try again</button>' : "No comments yet. Start the conversation."}</div>`;
    list.querySelector("[data-comments-retry]")?.addEventListener("click", () => void loadComments());
    list.querySelectorAll("[data-reply]").forEach(button => button.onclick = () => {
      const comment = findSharedComment(api.post(id), button.dataset.reply);
      if (!comment) return;
      const author = api.user(comment.author);
      const input = $("#cbody", sheet);
      input.value = author ? `@${author.username} ` : "";
      input.dataset.reply = comment.id;
      input.placeholder = `Reply to @${author?.username || "member"}`;
      input.focus();
    });
    list.querySelectorAll("[data-cmore]").forEach(button => button.onclick = () => showCommentActions(button.dataset.cmore, button));
    list.querySelectorAll("[data-toggle-replies]").forEach(button => button.onclick = () => {
      const commentId = button.dataset.toggleReplies;
      if (expandedReplies.has(commentId)) expandedReplies.delete(commentId);
      else expandedReplies.add(commentId);
      drawList();
    });
    hydrateLocalMedia(sheet);
    void hydrateBlueBadges(sheet);
    list.querySelectorAll("[data-clike]").forEach(button => button.onclick = async () => {
      button.disabled = true;
      try { await api.setCloudPostCommentReaction(id, button.dataset.clike, "like"); drawList(); }
      catch (error) { toast(error.message || "Couldn’t update the comment reaction online."); }
      finally { button.disabled = false; }
    });
    list.querySelectorAll("[data-cdislike]").forEach(button => button.onclick = async () => {
      button.disabled = true;
      try { await api.setCloudPostCommentReaction(id, button.dataset.cdislike, "dislike"); drawList(); }
      catch (error) { toast(error.message || "Couldn’t update the comment reaction online."); }
      finally { button.disabled = false; }
    });
    list.querySelectorAll("[data-cdel]").forEach(button => button.onclick = async () => {
      button.disabled = true;
      try { await api.deleteCloudPostComment(id, button.dataset.cdel); notifyMediaViewerComments(id); }
      catch (error) { toast(error.message || "Couldn’t delete the comment online."); return; }
      expandedReplies.delete(button.dataset.cdel);
      drawList();
    });
    list.querySelectorAll("[data-rdel]").forEach(button => button.onclick = async () => {
      const [commentId, replyId] = button.dataset.rdel.split(":");
      try { await api.deleteCloudPostComment(id, replyId); notifyMediaViewerComments(id); }
      catch (error) { toast(error.message || "Couldn’t delete the reply online."); return; }
      drawList();
    });
  };
  const loadComments = async () => {
    loadingComments = true;
    commentLoadFailed = false;
    try {
      await api.loadCloudPostComments(id);
      if (!isCurrent()) return;
      if (focusedCommentId) {
        const parent = api.post(id)?.comments?.find(comment => comment.replies?.some(reply => reply.id === focusedCommentId));
        if (parent) expandedReplies.add(parent.id);
      }
    } catch (error) {
      console.warn("Comments refresh failed.", error);
      commentLoadFailed = true;
    } finally {
      loadingComments = false;
      if (isCurrent()) drawList();
    }
  };
  sheet.classList.add("on");
  const draw = () => {
    const p = api.post(id);
    if (!p || !api.canSeePost(p)) return close();
    const previousBody = $("#cbody", sheet)?.value || "";
    const previousReply = $("#cbody", sheet)?.dataset.reply || "";
    sheet.innerHTML = `<section class="panel comment-panel" role="dialog" aria-modal="true" aria-label="Comments">
      <div class="grab" aria-hidden="true"></div>
      <div class="comment-toolbar">
        <label class="comment-search-wrap">${ic.search}<input id="comment-search" type="search" placeholder="Search comments" aria-label="Search comments" value="${esc(searchText)}" /></label>
        <button type="button" class="comment-sort" id="comment-sort" aria-label="Sort comments"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4v16m0 0-4-4m4 4 4-4M16 20V4m0 0 4 4m-4-4-4 4"/></svg><span id="comment-sort-label"></span></button>
        <button type="button" class="comment-close" id="comment-close" aria-label="Close comments">${ic.close}</button>
      </div>
      <div class="comment-count" id="comment-count"></div>
      <div class="comment-list" id="clist" aria-label="Comments"></div>
      <form id="cform" class="comment-composer">
        <img class="comment-composer-avatar" ${profileMediaSource(api.me().avatar)} alt="" />
        <div class="comment-composer-pill">
          <input class="comment-input" id="cbody" value="${esc(previousBody)}" data-reply="${esc(previousReply)}" placeholder="${previousReply ? "Write a reply" : "Add a comment..."}" autocomplete="off" aria-label="${previousReply ? "Write a reply" : "Add a comment"}" />
          <button type="button" class="comment-tool" id="comment-mention" aria-label="Mention someone">@</button>
          <button type="button" class="comment-tool" id="comment-emoji" aria-label="Add emoji">${ic.smile}</button>
        </div>
        <button class="comment-send" type="submit" aria-label="Send comment">${ic.send}</button>
      </form>
    </section>`;
    panel = sheet.querySelector(".comment-panel");
    $("#comment-search", sheet).oninput = event => { searchText = event.target.value.trim().toLowerCase(); drawList(); };
    $("#comment-sort", sheet).onclick = () => { sortMode = sortMode === "top" ? "newest" : "top"; drawList(); };
    $("#comment-close", sheet).onclick = close;
    $("#comment-emoji", sheet).onclick = () => openEmojiPicker($("#cbody", sheet), undefined, { chat: true });
    $("#comment-mention", sheet).onclick = () => {
      const input = $("#cbody", sheet);
      const start = input.selectionStart ?? input.value.length;
      input.setRangeText("@", start, input.selectionEnd ?? start, "end");
      input.focus();
    };
    mentionCleanup();
    mentionCleanup = bindMentionAutocomplete($("#cbody", sheet), { api });
    $("#cform", sheet).onsubmit = async e => {
      e.preventDefault();
      if ($("#cform button[type=submit]", sheet)?.disabled) return;
      const input = $("#cbody", sheet);
      const body = input.value.trim();
      if (!body) return input.focus();
      const parent = input.dataset.reply;
      const send = $("#cform button[type=submit]", sheet);
      send.disabled = true;
      try {
        const created = await api.createCloudPostComment(id, { body, parentId: parent || null });
        if (!isCurrent() || !input.isConnected) return;
        if (parent) expandedReplies.add(parent);
        enteringCommentId = created?.id || "";
        input.value = "";
        delete input.dataset.reply;
        input.placeholder = "Add a comment...";
        searchText = "";
        $("#comment-search", sheet).value = "";
        drawList();
        enteringCommentId = "";
        if (!parent) showFeedCommentPreview(id, { author: api.me()?.id, body, created: created?.createdAt || Date.now() });
        notifyMediaViewerComments(id);
        $("#cbody", sheet).focus();
      } catch (error) { toast(error.message || "Couldn’t add your comment online."); }
      finally { send.disabled = false; }
    };
    drawList();
    sheet.onclick = event => { if (event.target === sheet) close(); };
    sheet.onkeydown = event => {
      if (event.key !== "Escape") return;
      if (actionLayer) {
        event.stopPropagation();
        $("[data-action-close]", actionLayer)?.click();
      } else close();
    };
  };
  draw();
  if (api.cloudPost(id)) {
    void loadComments();
  }
  if (focusedCommentId) {
    const source = api.post(id);
    const parent = source?.comments?.find(comment => comment.replies?.some(reply => reply.id === focusedCommentId));
    if (parent) { expandedReplies.add(parent.id); drawList(); }
    const target = document.getElementById(`comment-${focusedCommentId}`) || document.getElementById(`reply-${focusedCommentId}`);
    if (target) {
      target.classList.add("shared-comment-highlight");
      target.setAttribute("tabindex", "-1");
      target.scrollIntoView?.({ block: "center" });
      target.focus({ preventScroll: true });
    } else toast("Comment unavailable");
  }
}

function openStory(authorId, storyId = null, { source = "direct" } = {}) {
  let visibleStories = api.stories()
    .filter(s => isStoryActive(s) && api.canSeeStory(s))
    .sort((a, b) => b.created - a.created);
  // Carry Home's membership rule into next/previous gestures too; otherwise a
  // followed Status could silently advance into an unrelated public account.
  if (source === "home") visibleStories = homeStatusStories(visibleStories, api.me());
  const targetStory = storyId ? visibleStories.find(story => story.id === storyId) : null;
  if (storyId && !targetStory) return toast("Story unavailable");
  authorId = targetStory?.author || authorId;
  const authors = [...new Set(visibleStories.map(story => story.author))];
  const groups = authors.map(author => ({ author, stories: visibleStories.filter(story => story.author === author) }));
  let groupIndex = groups.findIndex(group => group.author === authorId);
  if (groupIndex < 0) {
    if (authorId !== api.me()?.id) return toast("Story unavailable");
    return toast("Story creation is being rebuilt.");
  }
  let list = groups[groupIndex].stories;
  let i = storyId ? Math.max(0, list.findIndex(story => story.id === storyId)) : 0;
  const view = $("#storyview");
  view.classList.add("on");
  let touchOrigin = null;
  let disposeStickerUi = () => {};
  let show;
  const close = () => {
    disposeStickerUi();
    storyUi?.dispose(); storyUi = null;
    view.removeEventListener("touchstart", onTouchStart);
    view.removeEventListener("touchend", onTouchEnd);
    view.classList.remove("on"); view.innerHTML = ""; clearInterval(storyTimer);
  };
  const changeAuthor = direction => {
    const next = groupIndex + direction;
    if (next < 0 || next >= groups.length) return close();
    groupIndex = next;
    list = groups[groupIndex].stories;
    i = direction > 0 ? 0 : list.length - 1;
    show();
  };
  const moveStory = direction => {
    const next = i + direction;
    if (next >= list.length) return changeAuthor(1);
    if (next < 0) return changeAuthor(-1);
    i = next;
    show();
  };
  const onTouchStart = event => {
    if (event.touches.length !== 1 || event.target.closest("button,a,input,textarea,select,.story-bar")) {
      touchOrigin = null;
      return;
    }
    touchOrigin = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };
  const onTouchEnd = event => {
    if (!touchOrigin || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchOrigin.x;
    const dy = event.changedTouches[0].clientY - touchOrigin.y;
    touchOrigin = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 52) return;
    event.preventDefault();
    event.stopPropagation();
    if (Math.abs(dy) > Math.abs(dx)) changeAuthor(dy < 0 ? 1 : -1);
    else moveStory(dx < 0 ? 1 : -1);
  };
  view.addEventListener("touchstart", onTouchStart, { passive: true });
  view.addEventListener("touchend", onTouchEnd, { passive: false });
  show = async () => {
    clearInterval(storyTimer);
    const s = list[i];
    disposeStickerUi(); disposeStickerUi = () => {};
    storyUi?.dispose(); storyUi = null;
    if (!s) { if (groupIndex < groups.length - 1) changeAuthor(1); else close(); return; }
    if (!isStoryActive(s) || !api.canSeeStory(s)) { i++; show(); return; }
    const nextStory = list[i + 1];
    // Warm only the immediately following image when it is already in the
    // authorized Story list. Do not broaden access or eagerly fetch a sequence.
    const preloadStoryImage = story => {
      if (!story || !isStoryActive(story) || !api.canSeeStory(story)) return;
      const source = resolveStoryMedia(story, id => api.post(id));
      if (!source || story.kind === "video" || String(source).startsWith("data:video")) return;
      const image = new Image();
      image.decoding = "async";
      image.src = source;
      image.decode?.().catch(() => {});
    };
    preloadStoryImage(nextStory);
    if (nextStory?.cloud && nextStory.hasMedia && !nextStory.media && !nextStory.creativeProject) {
      void api.loadCloudStoryMedia(nextStory.id).then(url => {
        if (!url || !view.classList.contains("on") || list[i + 1]?.id !== nextStory.id
          || !isStoryActive(nextStory) || !api.canSeeStory(nextStory)) return;
        nextStory.media = url;
        preloadStoryImage(nextStory);
      }).catch(() => {});
    }
    const needsCloudMedia = Boolean(s.cloud && s.hasMedia && !s.media && !s.creativeProject);
    const cloudMediaRequest = needsCloudMedia ? api.loadCloudStoryMedia(s.id) : null;
    let mediaPending = needsCloudMedia;
    const mediaSource = resolveStoryMedia(s, id => api.post(id));
       const author = api.user(s.author) || {};
       const creatorName = author.name || author.displayName || author.username || "Oldtime member";
       const age = ago(s.created || s.createdAt);
       const ageLabel = age === "now" ? "Just now" : `${age} ago`;
       const sharedTarget = sharedStatusTarget(s.text);
       const commentCardTarget = Boolean(sharedTarget?.commentId && s.creativeProject);
       const stageAppearance = storyStageAppearance(s);
       const sourceHitbox = sharedStatusLayerHitbox(s.creativeProject);
       const sourceHitClass = commentCardTarget ? "story-comment-source" : sourceHitbox ? "story-post-source" : "story-stage-source";
       const sourceHitStyle = sourceHitbox
         ? `style="left:${sourceHitbox.left}%;top:${sourceHitbox.top}%;width:${sourceHitbox.width}%;height:${sourceHitbox.height}%;--story-source-rotation:${sourceHitbox.rotation}deg"`
         : "";
       const sourceHitMarkup = sharedTarget
         ? `<button type="button" id="story-source" class="${sourceHitClass}" ${sourceHitStyle} aria-label="Open original ${sharedTarget.commentId ? "comment" : "post"}"></button>`
         : "";
       const storyTextIsRenderedInMedia = Boolean(s.creativeProject || (Array.isArray(s.stickers) && s.stickers.length));
       const storyCaption = storyTextIsRenderedInMedia
         ? (s.caption && s.caption !== s.text ? s.caption : "")
         : (s.text || s.caption || "");
       view.innerHTML = `<div class="progress story-progress" role="group" aria-label="Story ${i + 1} of ${list.length}">${list.map((_, index) => `<span class="progress-segment${index < i ? " is-complete" : ""}${index === i ? " is-active" : ""} story-progress-segment" aria-hidden="true"><b${index === i ? ' id="bar"' : ""}></b></span>`).join("")}</div>
         <div class="story-header"><button type="button" id="story-profile" class="story-creator" aria-label="Open ${esc(author.username || "member")} profile">${author.avatar ? `<img ${profileMediaSource(author.avatar)} alt="" />` : `<span class="story-creator-avatar-fallback" aria-hidden="true">${esc(String(creatorName).trim().slice(0,1).toUpperCase() || "O")}</span>`}<span class="story-creator-copy"><b>${esc(creatorName)}</b><small>${esc(ageLabel)}</small></span></button><div class="story-header-actions"></div></div>
        <button type="button" id="sclose" aria-label="Close Story">${ic.close}</button>
          <div class="story-stage${stageAppearance.isLight ? " is-light-background" : ""}" style="background:${esc(stageAppearance.color)}">${s.creativeProject ? creativeMediaMarkup(s, esc, true) : mediaSource ? (String(mediaSource).startsWith("data:video") || s.kind === "video" ? `<video class="story-stage-media" src="${esc(mediaSource)}" autoplay muted playsinline></video>` : `<img class="story-stage-media" src="${esc(mediaSource)}" alt="" />`) : needsCloudMedia ? `<div class="story-stage-media-pending" aria-hidden="true"></div>` : `<div class="story-stage-empty" role="status">Text Story</div>`}${sourceHitMarkup}<div class="story-caption">${sharedTarget ? "" : renderMentionText(storyCaption)}${s.creativeProject ? creativeAttribution(s, esc) : ""}</div></div>`;
     $("#story-source", view)?.addEventListener("click", async event => {
       event.stopPropagation();
       const button = event.currentTarget;
       button.disabled = true;
       try {
         await api.loadCloudPost(sharedTarget.postId);
         if (sharedTarget.commentId) await api.loadCloudPostComments(sharedTarget.postId);
         if (!view.classList.contains("on") || list[i]?.id !== s.id) return;
          const originalPost = api.post(sharedTarget.postId);
         close();
          const textOnlyCommunityPost = !sharedTarget.commentId && isCommunitySurfacePost(originalPost)
            && !profilePostMedia(originalPost).length && !originalPost?.creativeProject;
          if (textOnlyCommunityPost) openCommunityOriginalPostSheet(originalPost);
          else {
            openPostViewer(sharedTarget.postId);
            if (sharedTarget.commentId) comments(sharedTarget.postId, sharedTarget.commentId);
          }
       } catch (error) {
         console.warn("Shared Status source unavailable.", error);
         toast("The original post or comment is no longer available.");
       } finally { button.disabled = false; }
     });
     const storyStage = view.querySelector(".story-stage");
      storyStage?.classList.toggle("is-text-story", !s.creativeProject && !mediaSource && !needsCloudMedia);
     const attachStoryMediaError = media => media?.addEventListener("error", () => {
       media.remove();
       storyStage?.classList.add("is-media-unavailable");
       const notice = document.createElement("div");
       notice.className = "story-stage-empty";
       notice.setAttribute("role", "status");
       notice.textContent = "Story media unavailable";
       storyStage?.prepend(notice);
     }, { once: true });
     attachStoryMediaError(storyStage?.querySelector(".story-stage-media"));
     if (cloudMediaRequest) {
       void cloudMediaRequest.then(url => {
         if (!view.classList.contains("on") || list[i]?.id !== s.id || !url) return;
         s.media = url;
         const resolvedMedia = resolveStoryMedia(s, id => api.post(id));
         const placeholder = storyStage?.querySelector(".story-stage-media-pending");
         if (!storyStage || !placeholder || !resolvedMedia) {
           mediaPending = false;
           return;
         }
         const mediaMarkup = String(resolvedMedia).startsWith("data:video") || s.kind === "video"
           ? `<video class="story-stage-media" src="${esc(resolvedMedia)}" autoplay muted playsinline></video>`
           : `<img class="story-stage-media" src="${esc(resolvedMedia)}" alt="" />`;
         placeholder.outerHTML = mediaMarkup;
         storyStage.classList.remove("is-text-story", "is-media-unavailable");
         const loadedMedia = storyStage.querySelector(".story-stage-media");
         attachStoryMediaError(loadedMedia);
         if (loadedMedia?.tagName === "VIDEO") void loadedMedia.play?.().catch(() => {});
         mediaPending = false;
       }).catch(error => {
         if (!view.classList.contains("on") || list[i]?.id !== s.id) return;
         mediaPending = false;
         const placeholder = storyStage?.querySelector(".story-stage-media-pending");
         if (placeholder) {
           const notice = document.createElement("div");
           notice.className = "story-stage-empty";
           notice.setAttribute("role", "status");
           notice.textContent = "Story media unavailable";
           placeholder.replaceWith(notice);
         }
         storyStage?.classList.add("is-media-unavailable");
         toast(error.message || "Story media could not be loaded.");
       });
     }
    if (s.creativeProject) mountCreativeViewers(view, { onSource: (postId, commentId) => {
      close(); openPostViewer(postId, commentId);
    } });
    trackQualifiedView(s,view.lastElementChild,"content");
    let paused = false;
    const storyVideo = () => view.querySelector("video");
     if (s.cloud && s.author !== api.me()?.id) {
       void api.recordCloudStoryView(s.id).catch(error => {
         if (list[i] === s) toast(error.message || "Story view could not be recorded.");
       });
     }
     storyUi = mountStoryInteractions({
       view,
       story: s,
       api,
       toast,
        viewerAvatarMarkup: (() => {
          const viewerAvatar = resolveProfileAvatar(api.me() || {}, "");
          return viewerAvatar && !isDefaultAvatarMediaReference(viewerAvatar)
            ? `<img class="story-viewer-avatar" ${profileMediaSource(viewerAvatar)} alt="" aria-hidden="true" />`
            : "";
        })(),
        onShare: async () => {
          const url = new URL(location.href);
          url.search = "";
          url.hash = "";
          url.searchParams.set("story", s.id);
          return shareExternally({
            title: `${creatorName}'s Oldtime Story`,
            text: `View ${creatorName}'s Story on Oldtime.`,
            url: url.href,
          });
        },
       pause: () => { paused = true; storyVideo()?.pause(); },
       resume: () => { paused = false; storyVideo()?.play?.().catch(() => {}); },
       onSave: async () => {
         await api.saveStory(s.id, !s.savedToProfile);
         s.savedToProfile = !s.savedToProfile;
       },
       onDelete: async () => {
         const owner = api.me()?.id;
         if (!owner || s.author !== owner) { toast("You can only delete your own Story."); return; }
         if (!confirm("Delete this Story? This cannot be undone.")) return;
         try {
           await api.deleteOwnStory(s.id);
           if (api.me()?.id !== owner) return;
           list = list.filter(story => story.id !== s.id);
           let cleanupFailed = false;
           if (isLocalMedia(s.media)) {
             const stillUsed = [...api.db().posts, ...api.db().stories].some(item =>
               Array.isArray(item.media) ? item.media.includes(s.media) : item.media === s.media
             );
             if (!stillUsed) try { await deleteLocalMedia(s.media); }
             catch (error) { cleanupFailed = true; console.warn("Deleted Story media could not be cleared from device storage.", error); }
           }
           toast(cleanupFailed ? "Story deleted. Its device media could not be cleared." : "Story deleted");
           if (!list.length) close(); else { i = Math.min(i, list.length - 1); show(); }
         } catch (error) { toast(error.message || "The Story could not be deleted."); }
       },
     });
    disposeStickerUi = mountStoryStickerInteractions(view, s, {
      toast,
      onCreate: async options => {
        try {
          const { openStatusCapture } = await import("./status-capture.js");
          close();
          openStatusCapture({ ...options, source: "landing", toast, onPosted: () => render() });
        } catch (error) { toast(error.message || "Couldn't open the Status editor."); }
      },
      onOpenStory: (author, id) => { close(); openStory(author, id); },
    });
    $("#sclose").onclick = close;
     $("#story-profile").onclick = () => { close(); navigateToProfile(s.author); };
    let w = 0;
    clearInterval(storyTimer);
    const progressBar = $("#bar");
    const advanceStory = () => { if (list[i] === s) { i++; show(); } };
    let lastTick = Date.now();
    let backgroundPaused = false;
    storyTimer = setInterval(() => {
      if (list[i] !== s) return;
      if (!isStoryActive(s) || !api.canSeeStory(s) || !api.stories().some(item => item.id === s.id)) { advanceStory(); return; }
      const video = storyVideo();
      if (document.hidden) {
        if (video && !video.paused) { video.pause(); backgroundPaused = true; }
        lastTick = Date.now();
        return;
      }
      if (backgroundPaused) {
        backgroundPaused = false;
        if (!paused && video) void video.play?.().catch(() => {});
      }
      if (paused || mediaPending || view.dataset.stickerOpen === "true") { lastTick = Date.now(); return; }
      if (video) {
        if (Number.isFinite(video.duration) && video.duration > 0 && progressBar) {
          progressBar.style.width = Math.min(100, video.currentTime / video.duration * 100) + "%";
        }
        if (video.ended) advanceStory();
        return; // Follow the real media clock; do not run a competing photo countdown.
      }
      const now = Date.now();
      const elapsed = Math.max(0, now - lastTick);
      lastTick = now;
      const duration = s.creativeProject ? Math.max(1000, Number(s.trim || s.creativeProject.duration || 5) * 1000) : 5000;
      w = Math.min(100, w + elapsed / duration * 100);
      if (progressBar) progressBar.style.width = w + "%";
      if (w >= 100) advanceStory();
    }, 90);
  };
  show();
}

function openProfilePostPlayback(authorId, posts) {
  const list = posts.slice();
  if (!list.length) return toast("No posts to play");
  if (!api.canSee(authorId)) return toast("This account is private");
  const view = $("#storyview");
  let index = 0;

  const close = () => {
    clearInterval(storyTimer);
    storyTimer = null;
    view.classList.remove("on");
    view.innerHTML = "";
  };
  const move = direction => {
    if (direction > 0) {
      if (index >= list.length - 1) return close();
      index += 1;
    } else if (index > 0) index -= 1;
    show();
  };
  const startPhotoTimer = progress => {
    clearInterval(storyTimer);
    const started = Date.now();
    storyTimer = setInterval(() => {
      const amount = Math.min(100, ((Date.now() - started) / 5000) * 100);
      if (progress.isConnected) progress.style.width = `${amount}%`;
      if (amount >= 100) move(1);
    }, 90);
  };
  const show = () => {
    clearInterval(storyTimer);
    storyTimer = null;
    if (!api.canSee(authorId)) {
      close();
      toast("This account is private");
      return;
    }
    const post = list[index];
    const author = api.user(authorId);
    if (!post || !author) return close();
    const media = profilePostMedia(post)[0] || "";
    const isVideo = Boolean(media) && (post.kind === "video" || String(media).startsWith("data:video"));
    const content = post.creativeProject ? creativeMediaMarkup(post, esc) : media
      ? (isVideo
        ? `<video id="profile-play-video" ${profileMediaSource(media)} autoplay muted playsinline aria-label="${esc(post.caption || "Profile video")}"></video>`
        : `<img src="${esc(media)}" alt="${esc(post.caption || "Profile post")}" />`)
      : `<div class="profile-play-text">${esc(post.caption || "Post")}</div>`;
    view.classList.add("on");
    view.innerHTML = `
      <div class="profile-play-progress" aria-hidden="true">
        ${list.map((_, i) => `<span class="${i < index ? "done" : i === index ? "active" : ""}"><i></i></span>`).join("")}
      </div>
      <div class="profile-play-header">
        <img src="${esc(author.avatar || "")}" alt="" />
        <div><b>@${esc(author.username)}</b><small>${index + 1} of ${list.length} posts</small></div>
      </div>
      <button type="button" class="profile-play-close" id="profile-play-close" aria-label="Close playback">${ic.close}</button>
      <div class="profile-play-media">${content}</div>
      ${isVideo ? `<button type="button" class="clip-float-control profile-play-float" data-video-profile data-video-float="${esc(post.id)}" aria-label="Continue video in a floating player">${videoFloatIcon}</button>` : ""}
      ${post.creativeProject ? creativeAttribution(post, esc) : ""}
      ${media && post.caption ? `<div class="profile-play-caption">${esc(post.caption)}</div>` : ""}
      <button type="button" class="profile-play-zone profile-play-zone-left" id="profile-play-prev" aria-label="Previous post"></button>
      <button type="button" class="profile-play-zone profile-play-zone-right" id="profile-play-next" aria-label="Next post"></button>
    `;
    if (post.creativeProject) mountCreativeViewers(view, { onSource: (id, commentId) => { close(); openPostViewer(id, commentId); } });
    $("#profile-play-close", view).onclick = close;
    $("#profile-play-prev", view).onclick = () => move(-1);
    $("#profile-play-next", view).onclick = () => move(1);

    const progress = $(".profile-play-progress .active i", view);
    trackQualifiedView(post,$(".profile-play-media",view),"profile");
    const video = $("#profile-play-video", view);
    void hydrateLocalMedia(view);
    if (!video) {
      startPhotoTimer(progress);
      return;
    }
    const started = Date.now();
    let lastTime = video.currentTime;
    let lastAdvance = started;
    video.addEventListener("ended", () => move(1), { once: true });
    video.addEventListener("error", () => move(1), { once: true });
    video.addEventListener("timeupdate", () => {
      if (Number.isFinite(video.duration) && video.duration > 0 && progress.isConnected) {
        progress.style.width = `${Math.min(100, (video.currentTime / video.duration) * 100)}%`;
      }
    });
    storyTimer = setInterval(() => {
      if (video.currentTime > lastTime) {
        lastTime = video.currentTime;
        lastAdvance = Date.now();
      }
      if (Date.now() - lastAdvance > 15000) move(1);
    }, 500);
    const attempt = video.play();
    if (attempt?.catch) attempt.catch(() => startPhotoTimer(progress));
  };

  show();
}

function openHomeCreate() {
  return openUniversalCreation({ destination: "post", startCamera: true });
}
function openCameraLanding() {
  stopCameraLanding();
  openUniversalCreation({startCamera:true});
}
function legacyCameraLanding() {
  stopCameraLanding();
  cameraFacing = "environment";
  cameraMode = "post";
  shell(`<section class="screen on camera-screen" aria-label="Camera">
    <div class="camera-feed"><video id="camera-preview" autoplay playsinline muted></video><div class="camera-vignette"></div></div>
    <header class="camera-top-controls">
      <button type="button" class="camera-top-button" id="camera-close" aria-label="Close">${ic.close}</button>
      <button type="button" class="camera-top-button" id="camera-flash" aria-label="Flash" disabled>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-9 12h7l-1 8 10-13h-7z"/></svg>
      </button>
      <span></span>
    </header>
    <div class="camera-bottom-controls">
      <div class="camera-capture-row">
        <button type="button" class="camera-side-button" id="camera-gallery" aria-label="Choose a photo from your library" title="Choose a photo">${ic.image}</button>
        <button type="button" class="camera-shutter" id="camera-shutter" aria-label="Take photo"><span></span></button>
        <button type="button" class="camera-side-button" id="camera-flip" aria-label="Flip camera">${ic.flip}</button>
      </div>
      <nav class="camera-modes" role="tablist" aria-label="Create type">
        ${[["post","POST"],["story","STORY"]].map(([id,label]) => `<button type="button" role="tab" data-camera-mode="${id}" aria-selected="${id === cameraMode}" class="${id === cameraMode ? "on" : ""}">${label}</button>`).join("")}
      </nav>
    </div>
    <input id="camera-file" type="file" accept="image/*" hidden />
  </section>`, undefined, { hideNav: true });

  const preview = $("#camera-preview");
  const generation = cameraGeneration;
  connectCamera(preview, generation).then(available => {
    if (!available && generation === cameraGeneration && preview.isConnected) toast("Camera unavailable");
  });
  $("#camera-close").onclick = () => { stopCameraLanding(); render(); };
  $("#camera-flash").onclick = toggleCameraFlash;
  $("#camera-flip").onclick = flipCamera;
  $("#camera-gallery").onclick = () => $("#camera-file").click();
  $("#camera-file").onchange = async () => {
    const file = $("#camera-file").files?.[0];
    $("#camera-file").value = "";
    if (!file) return;
    try {
      const media = preparePendingMedia(file);
      if (!$("#camera-preview")) return;
      const kind = cameraMode === "story" ? "story" : "photo";
      createKind = kind;
      stopCameraLanding();
      render();
      openCreate([media], kind);
    } catch (error) {
      toast(error.message || "Couldn't read media");
    }
  };
  $("#camera-shutter").onclick = () => {
    captureCameraPhoto();
  };
  app.querySelectorAll("[data-camera-mode]").forEach(button => button.onclick = () => {
    cameraMode = button.dataset.cameraMode;
    app.querySelectorAll("[data-camera-mode]").forEach(modeButton => {
      const active = modeButton.dataset.cameraMode === cameraMode;
      modeButton.classList.toggle("on", active);
      modeButton.setAttribute("aria-selected", active);
    });
    $("#camera-shutter").setAttribute("aria-label", "Take photo");
    $("#camera-gallery").disabled = false;
  });
}

async function connectCamera(preview, generation) {
  if (!preview?.isConnected || !navigator.mediaDevices?.getUserMedia) return false;
  const video = { facingMode: { ideal: cameraFacing }, width: { ideal: 1280 }, height: { ideal: 1920 } };
  let next;
  try {
    next = await navigator.mediaDevices.getUserMedia({ video, audio: true });
  } catch {
    try { next = await navigator.mediaDevices.getUserMedia({ video, audio: false }); }
    catch { return false; }
  }
  if (generation !== cameraGeneration || !preview.isConnected) {
    next.getTracks().forEach(track => track.stop());
    return false;
  }
  cameraStream = next;
  preview.srcObject = next;
  try { await preview.play(); } catch {}
  updateFlashButton();
  return true;
}

function updateFlashButton() {
  const button = $("#camera-flash");
  const track = cameraStream?.getVideoTracks()[0];
  if (!button) return;
  const available = Boolean(track?.getCapabilities?.().torch);
  button.disabled = !available;
  button.classList.toggle("active", cameraFlashOn);
  button.setAttribute("aria-label", available ? (cameraFlashOn ? "Turn flash off" : "Turn flash on") : "Flash unavailable");
}

async function toggleCameraFlash() {
  const track = cameraStream?.getVideoTracks()[0];
  if (!track?.getCapabilities?.().torch) return;
  cameraFlashOn = !cameraFlashOn;
  try {
    await track.applyConstraints({ advanced: [{ torch: cameraFlashOn }] });
    updateFlashButton();
  } catch {
    cameraFlashOn = false;
    updateFlashButton();
  }
}

async function flipCamera() {
  cameraFacing = cameraFacing === "environment" ? "user" : "environment";
  cameraFlashOn = false;
  cameraStream?.getTracks().forEach(track => track.stop());
  cameraStream = null;
  const preview = $("#camera-preview");
  if (preview) preview.srcObject = null;
  const generation = ++cameraGeneration;
  const available = await connectCamera(preview, generation);
  if (!available && generation === cameraGeneration && preview?.isConnected) toast("Camera unavailable");
}

function stopCameraLanding() {
  cameraGeneration++;
  cameraStream?.getTracks().forEach(track => track.stop());
  cameraStream = null;
  cameraFlashOn = false;
}

async function captureCameraPhoto() {
  const preview = $("#camera-preview");
  if (!cameraStream || !preview?.videoWidth || !preview.videoHeight) {
    $("#camera-file").click();
    return;
  }
  const generation = cameraGeneration;
  const scale = Math.min(1, 1600 / Math.max(preview.videoWidth, preview.videoHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(preview.videoWidth * scale);
  canvas.height = Math.round(preview.videoHeight * scale);
  const context = canvas.getContext("2d");
  if (!context) return toast("Camera capture unavailable");
  context.drawImage(preview, 0, 0, canvas.width, canvas.height);
  canvas.toBlob(async blob => {
    if (!blob || generation !== cameraGeneration || !preview.isConnected) return;
    try {
      const media = preparePendingMedia(new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" }));
      const kind = cameraMode === "story" ? "story" : "photo";
      createKind = kind;
      stopCameraLanding();
      render();
      openCreate([media], kind);
    } catch (error) {
      toast(error.message || "Couldn't read media");
    }
  }, "image/jpeg", .82);
}

window.addEventListener("pagehide", stopCameraLanding);

function showPlaceCommentOffer(id){
  document.querySelector(".place-comment-offer")?.remove();
  const offer=document.createElement("div");offer.className="place-comment-offer";offer.setAttribute("role","status");
  const text=document.createElement("span");text.textContent="Posted.";
  const button=document.createElement("button");button.type="button";button.textContent="Share what it was like";
  button.onclick=()=>{offer.remove();comments(id)};
  const close=document.createElement("button");close.type="button";close.textContent="×";close.setAttribute("aria-label","Dismiss");
  close.onclick=()=>offer.remove();offer.append(text,button,close);document.body.append(offer);
  setTimeout(()=>offer.remove(),10000);
}
function openUniversalCreation({startCamera=false,mediaPicker=false,startText=false,startShare=false,initialProject=null,background=null,destination="post",caption="",location="",shareText="",validateSource,sourcePostId="",nativeVideoSource="",nativeVideoOverlayDataUrl=""}={}) {
  if(destination==="story"){
    const returnFocus=document.activeElement;
    const originTab=tab;
    const sheet=$("#sheet");sheet?.classList.remove("on");
    return import("./status-capture.js").then(({openStatusCapture})=>openStatusCapture({
      source:startText?"text":mediaPicker?"gallery":"landing",background,initialProject,shareText,validateSource,
      sourcePostId,nativeVideoSource,nativeVideoOverlayDataUrl,toast,
      onClose:()=>{if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});},
      onPosted:()=>{if(tab===originTab)render();},
    })).catch(error=>{console.warn("Status could not open",error);toast("We couldn’t open status. Please try again.");});
  }
  const storyOverMessages = destination === "story" && tab === "chat";
  const returnFocus = document.activeElement;
  const sheet=$("#sheet");if(sheet){sheet.classList.remove("on");sheet.innerHTML="";}
  openCreativeEditor({startCamera,mediaPicker,startText,startShare,initialProject,background,caption,location,destination,editorVersion:"v2",esc,icons:ic,toast,
    onClose:()=>{
      if(storyOverMessages && returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
    },
    onPosted:(id,story,toCommunity)=>{
      if(storyOverMessages && story){
        if(tab === "chat") render();
        toast("Story posted");
        return;
      }
      viewer=null;profileId=null;tab=toCommunity?"communities":"updates";render();
      if(story)openStory(api.me().id);else if(!toCommunity)openPostViewer(id);
      if(!story&&api.cloudPost(id)?.place)showPlaceCommentOffer(id);
    }
  });
}
if (import.meta.env.DEV && new URLSearchParams(location.search).get("create-editor") === "v2") {
  window.__oldtimeOpenCreatePreview = () => openUniversalCreation({ startCamera: true });
}
function preparePendingMedia(file) {
  return {
    blob: file,
    url: URL.createObjectURL(file),
    video: file.type.startsWith("video/"),
    name: file.name || "media",
  };
}
function openCreate(initialMedia = [], initialKind = null) {
  const media = initialMedia[0];
  if (!media) return openHomeCreate();
  return openUniversalCreation({
    destination: initialKind === "story" ? "story" : "post",
    background: { media: media.url, kind: media.video ? "video" : "photo" },
  });
}
function legacyCreateForm(initialMedia = [], initialKind = null) {
  const returnToCommunity = tab === "communities" && initialKind === "text";
  pending = initialMedia;
  if (initialKind) createKind = initialKind;
  const sheet = $("#sheet");
  sheet.classList.add("on");
  const kinds = [["video", "Video"], ["photo", "Photo"], ["carousel", "Carousel"], ["story", "Story"]];
  sheet.innerHTML = `<div class="panel" style="max-height:94%"><div class="grab"></div><b>Create</b>
    <div class="seg" id="kinds">
      ${kinds.map(([kind, label]) => `<button data-k="${kind}">${label}</button>`).join("")}
    </div>
    <textarea class="field" id="cap" placeholder="Caption"></textarea>
    <button class="icon" id="caption-emoji" aria-label="Add emoji to caption">${ic.smile}</button>
    <input class="field" id="loc" placeholder="Location (optional)" style="margin-top:8px" />
     <select class="field" id="vis" style="margin-top:8px"><option value="public">Public</option><option value="followers">Followers</option><option value="friends">Friends</option><option value="close-friends">Close Friends</option></select>
     <div class="sub close-friends-hint" id="close-friends-hint" hidden><span id="close-friends-hint-text"></span> <button type="button" class="close-friends-manage" id="manage-close-friends">Manage Close Friends</button></div>
    <div id="create-media-tools">
      <div class="row" style="margin:8px 0;flex-wrap:wrap"><button class="btn ghost small" id="pick">Upload</button><button class="btn ghost small" id="rec">Record</button><input id="file" type="file" accept="image/*,video/*" multiple hidden /><input id="cam" type="file" accept="video/*,image/*" capture="environment" hidden /><span class="sub" id="picked">No file yet</span></div>
      <video id="prev" controls style="width:100%;max-height:160px;display:none;border-radius:12px"></video>
      <img id="pimg" style="width:100%;max-height:160px;object-fit:cover;display:none;border-radius:12px" />
      <label class="sub" id="trim-row">Trim end <input class="field" id="trim" type="number" min="1" placeholder="Seconds" /></label>
    </div>
    <button class="btn ghost" id="create-layer-editor" style="margin-top:10px">Open layer editor</button>
    <button class="btn" id="post" style="margin-top:10px">Post</button></div>`;
  const paint = () => {
    sheet.querySelectorAll("#kinds button").forEach(b => b.classList.toggle("on", b.dataset.k === createKind));
    $("#create-media-tools").hidden = false;
    $("#rec").hidden = createKind !== "video";
    $("#trim-row").hidden = createKind !== "video";
    $("#cap").placeholder = "Caption";
    const closeFriendsOption = $("#vis").querySelector('option[value="close-friends"]');
    const cloudMode = api.authMode() === "cloud";
    const hasCloseFriends = cloudMode ? api.cloudCloseFriends().length > 0 : (api.me().closeFriends || []).length > 0;
    const visibilitySelect = $("#vis");
    visibilitySelect.querySelectorAll('option[value="followers"], option[value="friends"]').forEach(option => {
      option.hidden = cloudMode;
      option.disabled = cloudMode;
    });
    const publicOption = visibilitySelect.querySelector('option[value="public"]');
    publicOption.disabled = cloudMode && api.me()?.private === true;
    if (publicOption.disabled && visibilitySelect.value === "public") visibilitySelect.value = "close-friends";
    closeFriendsOption.disabled = !hasCloseFriends;
    $("#close-friends-hint-text").textContent = hasCloseFriends
      ? "Only people on your list can see this."
      : "Add people to Close Friends before sharing privately.";
    $("#close-friends-hint").hidden = $("#vis").value !== "close-friends" && !(createKind === "story" && !hasCloseFriends);
  };
  paint();
  if (api.authMode() === "cloud") {
    void Promise.all([api.syncCloudPrivacy(), api.refreshCloudCloseFriends(), api.refreshCloudBlocks()])
      .then(() => { if (sheet.classList.contains("on")) paint(); })
      .catch(error => toast(error.message || "Online story settings could not be loaded."));
  }
  $("#vis").onchange = paint;
  const showPending = () => {
    const picked = $("#picked"), prev = $("#prev"), pimg = $("#pimg");
    if (!picked?.isConnected) return;
    picked.textContent = pending.length ? `${pending.length} ready` : "No file yet";
    prev.style.display = "none";
    pimg.style.display = "none";
    if (pending[0]?.video) { prev.style.display = "block"; prev.src = pending[0].url; }
    else if (pending[0]) { pimg.style.display = "block"; pimg.src = pending[0].url; }
  };
  showPending();
  $("#caption-emoji").onclick = () => openEmojiPicker($("#cap"));
  $("#create-layer-editor").onclick = () => {
    const files = pending.slice(), kind = createKind, caption = $("#cap").value, location = $("#loc").value, visibility = $("#vis").value;
    sheet.classList.remove("on"); sheet.innerHTML = "";
    openCreativeEditor({ destination: kind === "story" ? "story" : "post", background: files[0] ? { media: files[0].url, kind: files[0].video ? "video" : "photo" } : null,
      esc, icons: ic, toast,
      onClose: () => { openCreate(files, kind); $("#cap").value = caption; $("#loc").value = location; $("#vis").value = visibility; },
      onPosted: (id, story) => { viewer = null; profileId = null; tab = "updates"; render(); if (story) openStory(api.me().id); else openPostViewer(id); }
    });
  };
  sheet.querySelector("#kinds").onclick = (e) => { const b = e.target.closest("[data-k]"); if (!b) return; createKind = b.dataset.k; paint(); };
  $("#pick").onclick = () => $("#file").click();
  $("#rec").onclick = () => $("#cam").click();
  const take = async (files) => {
    const post = $("#post");
    post.disabled = true;
    try {
      pending = [];
      for (const f of files) {
        if (!/^(image|video)\//.test(f.type)) throw new Error("Choose photos or videos");
        pending.push(preparePendingMedia(f));
      }
    } catch (e) { pending = []; toast(e.message || "Couldn't read media"); return; }
    finally { post.disabled = false; }
    showPending();
  };
  $("#file").onchange = () => take([...$("#file").files]);
  $("#cam").onchange = () => take([...$("#cam").files]);
  $("#post").onclick = async () => {
    const caption = $("#cap").value.trim();
    const tags = [...caption.matchAll(/#([a-z0-9_]+)/gi)].map(m => m[1].toLowerCase());
    if (createKind === "text" && !caption) return toast("Add text");
    if (createKind === "story" && !caption && !pending.length) return toast("Add text or media");
    if (["video", "photo", "carousel"].includes(createKind) && !pending.length) return toast("Add a photo or video");
    if (createKind === "video" && (pending.length !== 1 || !pending[0].video)) return toast("Choose one video");
    if (createKind === "photo" && (pending.length !== 1 || pending[0].video)) return toast("Choose one photo");
    if (createKind === "carousel" && (pending.length < 2 || pending.some(p => p.video))) return toast("Choose at least two photos");
    if (createKind === "story" && pending.length > 1) return toast("Choose one story image or video");
    const visibility = $("#vis").value;
    const hasCloseFriends = api.authMode() === "cloud"
      ? api.cloudCloseFriends().length > 0
      : (api.me().closeFriends || []).length > 0;
    if (visibility === "close-friends" && !hasCloseFriends) {
      return toast("Add people to Close Friends before sharing with them");
    }
    const trim = Number($("#trim").value) || 0;
    if (api.authMode() === "cloud" && createKind === "story") {
      try {
        await api.createCloudStory({
          text: caption,
          visibility,
          mediaDataUrl: pending[0]?.url || "",
        });
      } catch (error) {
        toast(error.message || "Couldn’t publish your Story");
        return;
      }
    } else if (api.authMode() === "cloud" && ["photo", "video", "carousel"].includes(createKind)) {
      // Do not tell a signed-in user that media is online when this legacy
      // feed path would still write the file into browser-local storage.
      return toast("Cloud photo and video posts are not ready yet. Use Story to publish media online.");
    } else if (api.authMode() === "cloud" && createKind === "text") {
      if (visibility !== "public") return toast("Online text posts currently support public visibility only. Nothing was posted.");
      try { await api.createCloudPost(caption); }
      catch (error) { toast(error.message || "Couldn’t publish your post"); return; }
    } else {
      try { mutate(db => {
        if (createKind === "story") db.stories.unshift({ id: "s" + Date.now(), author: api.me().id, kind: pending[0]?.video ? "video" : (pending[0] ? "photo" : "text"), media: pending[0]?.url || "", text: caption, visibility, created: Date.now(), color: "#111922" });
        else db.posts.unshift({ id: "p" + Date.now(), author: api.me().id, kind: createKind, caption: caption || " ", tags, media: createKind === "text" ? [] : pending.map(p => p.url), sound: "Original audio", location: $("#loc").value.trim(), visibility, trim, likes: [], comments: [], saves: [], created: Date.now(), views: 0, shares: 0, color: "linear-gradient(160deg,#111922,#1a2330)" });
      }); } catch (e) { toast(e.message); return; }
    }
    pending = []; sheet.classList.remove("on");
    if ($("#camera-preview")) stopCameraLanding();
    tab = returnToCommunity ? "communities" : "updates"; profileId = null;
    render(); toast("Posted");
  };
  $("#manage-close-friends").onclick = () => {
    sheet.classList.remove("on");
    tab = "settings";
    settingsView = "close-friends";
    render();
  };
  sheet.onclick = (e) => { if (e.target === sheet) sheet.classList.remove("on"); };
}

function automaticProfileCover(user) {
  return "";
}

// Development-only hook for the isolated profile layout fixture (profile-header.browser.test.js).
if (import.meta.env.DEV) window.__oldtimeOpenProfilePreview = id => navigateToProfile(id);
function profilePostMedia(post) {
  const stored = postMediaReferences(post);
  if (stored.length) return stored;
  const project = post?.creativeProject;
  const projectMedia = [project?.background?.media, ...(project?.layers || []).filter(layer => layer.kind === "image").map(layer => layer.media)]
    .filter(value => typeof value === "string" && value && !isDefaultAvatarMediaReference(value));
  return projectMedia.slice(0, 1);
}

function profileMediaSource(value) {
  const media = String(value || "");
  return /^oldtime-media:[\w-]+$/i.test(media)
    ? `data-local-media="${esc(media)}"`
    : `src="${esc(media)}"`;
}

function profileNavigationAvatarMarkup(user) {
  const avatar = user?.avatar || user?.avatarReference || (user?.id ? api.user(user.id)?.avatar : "") || "";
  return avatar
    ? `${ic.user}<img class="nav-profile-avatar" ${profileMediaSource(avatar)} alt="" />`
    : ic.user;
}

function profileCoverPickerMarkup(prefix, { title = "", uri = "", template = "", position = {} } = {}) {
  const x = Math.max(0, Math.min(100, Number(position.x) || 50));
  const y = Math.max(0, Math.min(100, Number(position.y) || 50));
  const zoom = Math.max(1, Math.min(2, Number(position.zoom) || 1));
  const photo = uri ? `<img data-cover-image ${profileMediaSource(uri)} alt="" style="object-position:${x}% ${y}%;transform:scale(${zoom})" />` : "";
  const art = template ? `<span data-cover-template-preview class="ot-profile-cover-template is-${esc(template)}"><b>${esc(title || "Your collection")}</b><small>OLDTIME · ${template === "night" ? "MEMORIES" : "ALBUM"}</small></span>` : "";
  return `<div class="ot-cover-picker" data-cover-picker="${esc(prefix)}" data-cover-title="${esc(title)}">
    <div class="ot-cover-preview" data-cover-preview>${photo}${art}<span data-cover-placeholder ${uri || template ? "hidden" : ""}>Cover preview</span></div>
    <label class="ot-cover-upload" for="${esc(prefix)}-file">${uri ? "Change photo" : "Choose photo"}</label>
    <input id="${esc(prefix)}-file" class="ot-cover-file" type="file" accept="image/*" aria-label="Choose and crop a cover image" />
    <div class="ot-cover-templates" role="group" aria-label="Cover templates">
      <button type="button" data-cover-template="mono" aria-pressed="${template === "mono"}">Mono</button>
      <button type="button" data-cover-template="red" aria-pressed="${template === "red"}">Red</button>
      <button type="button" data-cover-template="night" aria-pressed="${template === "night"}">Night</button>
    </div>
    <div class="ot-cover-crop-controls" ${uri ? "" : "hidden"}>
      <label>Horizontal <input type="range" min="0" max="100" value="${x}" data-cover-x></label>
      <label>Vertical <input type="range" min="0" max="100" value="${y}" data-cover-y></label>
      <label>Zoom <input type="range" min="100" max="200" value="${Math.round(zoom * 100)}" data-cover-zoom></label>
    </div>
    ${uri || template ? `<button type="button" class="ot-cover-remove" data-cover-remove>Remove cover</button>` : ""}
  </div>`;
}

function bindProfileCoverPicker(root, prefix) {
  const picker = root.querySelector(`[data-cover-picker="${prefix}"]`);
  if (!picker) throw new Error("Cover editor is unavailable.");
  const coverTitle = picker.dataset.coverTitle || "Your collection";
  const image = picker.querySelector("[data-cover-image]");
  const templatePreview = picker.querySelector("[data-cover-template-preview]");
  const placeholder = picker.querySelector("[data-cover-placeholder]");
  const fileInput = picker.querySelector(".ot-cover-file");
  const cropControls = picker.querySelector(".ot-cover-crop-controls");
  let file = null;
  let objectUrl = "";
  let uri = image?.dataset.localMedia || image?.getAttribute("src") || "";
  let template = templatePreview?.classList.contains("is-red") ? "red"
    : templatePreview?.classList.contains("is-night") ? "night"
      : templatePreview ? "mono" : "";
  const position = { x: Number(picker.querySelector("[data-cover-x]")?.value || 50), y: Number(picker.querySelector("[data-cover-y]")?.value || 50), zoom: Number(picker.querySelector("[data-cover-zoom]")?.value || 100) / 100 };
  const updateCrop = () => {
    const activeImage = picker.querySelector("[data-cover-image]");
    if (activeImage) {
      activeImage.style.objectPosition = `${position.x}% ${position.y}%`;
      activeImage.style.transform = `scale(${position.zoom})`;
    }
  };
  [["x", "data-cover-x"], ["y", "data-cover-y"], ["zoom", "data-cover-zoom"]].forEach(([key, selector]) => {
    picker.querySelector(`[${selector}]`)?.addEventListener("input", event => {
      position[key] = key === "zoom" ? Number(event.target.value) / 100 : Number(event.target.value);
      updateCrop();
    });
  });
  const clearObjectUrl = () => { if (objectUrl) URL.revokeObjectURL(objectUrl); objectUrl = ""; };
  fileInput?.addEventListener("change", () => {
    const selected = fileInput.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) { toast("Choose an image file"); fileInput.value = ""; return; }
    clearObjectUrl();
    file = selected;
    uri = "";
    template = "";
    objectUrl = URL.createObjectURL(selected);
    const preview = picker.querySelector("[data-cover-preview]");
    preview.innerHTML = `<img data-cover-image alt="" />`;
    const nextImage = preview.querySelector("[data-cover-image]");
    nextImage.src = objectUrl;
    nextImage.style.objectPosition = `${position.x}% ${position.y}%`;
    nextImage.style.transform = `scale(${position.zoom})`;
    placeholder.hidden = true;
    cropControls.hidden = false;
    picker.querySelectorAll("[data-cover-template]").forEach(button => button.setAttribute("aria-pressed", "false"));
    picker.querySelector("[data-cover-remove]")?.remove();
    fileInput.closest(".ot-cover-picker").querySelector(".ot-cover-upload").textContent = "Change photo";
  });
  picker.querySelectorAll("[data-cover-template]").forEach(button => button.addEventListener("click", () => {
    clearObjectUrl();
    file = null;
    uri = "";
    template = button.dataset.coverTemplate;
    const preview = picker.querySelector("[data-cover-preview]");
    preview.innerHTML = `<span data-cover-template-preview class="ot-profile-cover-template is-${template}"><b>${esc(coverTitle)}</b><small>OLDTIME · ${template === "night" ? "MEMORIES" : "ALBUM"}</small></span>`;
    picker.querySelectorAll("[data-cover-template]").forEach(option => option.setAttribute("aria-pressed", String(option === button)));
    placeholder.hidden = true;
    cropControls.hidden = true;
    if (!picker.querySelector("[data-cover-remove]")) picker.insertAdjacentHTML("beforeend", `<button type="button" class="ot-cover-remove" data-cover-remove>Remove cover</button>`);
  }));
  picker.addEventListener("click", event => {
    if (!event.target.closest("[data-cover-remove]")) return;
    clearObjectUrl();
    file = null;
    uri = "";
    template = "";
    picker.querySelector("[data-cover-preview]").innerHTML = `<span data-cover-placeholder>Cover preview</span>`;
    placeholder.hidden = false;
    cropControls.hidden = true;
    picker.querySelectorAll("[data-cover-template]").forEach(button => button.setAttribute("aria-pressed", "false"));
    picker.querySelector("[data-cover-remove]")?.remove();
    fileInput.value = "";
  });
  if (uri) {
    cropControls.hidden = false;
    picker.querySelector(".ot-cover-upload").textContent = "Change photo";
    updateCrop();
  }
  const read = async () => ({
    uri: file ? await putLocalMedia(file) : uri,
    template: file || uri ? "" : template,
    position: { ...position },
  });
  return { read, dispose: clearObjectUrl };
}

function openProfilePostCoverEditor(user, post) {
  if (!post || post.author !== user?.id || user?.id !== api.me()?.id) return;
  const sheet = $("#sheet");
  if (!sheet) return;
  const saved = user.profilePostCovers?.[post.id] || {};
  const currentUri = post.profileCoverUri || saved.uri || "";
  const currentTemplate = post.profileCoverTemplate || saved.template || "";
  const currentPosition = post.profileCoverPosition || saved.position || {};
  const title = post.caption || post.text || "Profile post";
  sheet.classList.add("on");
  sheet.innerHTML = `<div class="panel ot-collection-create-panel ot-post-cover-panel" role="dialog" aria-modal="true" aria-labelledby="ot-post-cover-title">
    <div class="grab"></div><div class="row ot-collection-form-head"><b id="ot-post-cover-title">Profile post cover</b><button type="button" class="icon" data-cover-cancel aria-label="Close">×</button></div>
    <p class="sub">Choose a photo, adjust the crop, or select a template. This only changes how the post appears on your profile.</p>
    ${profileCoverPickerMarkup("post-cover", { title, uri: currentUri, template: currentTemplate, position: currentPosition })}
    <button type="button" class="btn primary" id="ot-post-cover-save">Save cover</button>
  </div>`;
  const picker = bindProfileCoverPicker(sheet, "post-cover");
  const close = () => { picker.dispose(); sheet.classList.remove("on"); sheet.innerHTML = ""; };
  sheet.querySelector("[data-cover-cancel]").onclick = close;
  void hydrateLocalMedia(sheet);
  sheet.querySelector("#ot-post-cover-save").onclick = async () => {
    let cover;
    try { cover = await picker.read(); }
    catch (error) { toast(error.message || "Could not save the cover"); return; }
    mutate(db => {
      const localPost = db.posts.find(item => item.id === post.id && item.author === user.id);
      const owner = db.users.find(item => item.id === user.id);
      if (localPost) {
        localPost.profileCoverUri = cover.uri || undefined;
        localPost.profileCoverTemplate = cover.template || undefined;
        localPost.profileCoverPosition = cover.position;
      }
      if (owner) {
        if (!owner.profilePostCovers) owner.profilePostCovers = {};
        if (cover.uri || cover.template) owner.profilePostCovers[post.id] = { uri: cover.uri, template: cover.template, position: cover.position };
        else delete owner.profilePostCovers[post.id];
      }
    });
    close();
    render();
    toast("Profile cover updated");
  };
}

function profile(id) {
  const u = api.user(id);
  const me = api.me();
  if (!u) { profileId = null; profileReturnChatId = null; return updates(); }
  if (u.id !== me?.id && profileMode === "archived") profileMode = "posts";
  const profileStatsComplete = ["followerCount", "followingCount", "viewCount"].every(key =>
    Number.isSafeInteger(u.stats?.[key]) && u.stats[key] >= 0
  ) && (Number.isSafeInteger(u.profilePostCount) && u.profilePostCount >= 0 ||
    Number.isSafeInteger(u.stats?.postCount) && u.stats.postCount >= 0);
  const profileStatsMissing = api.authMode() === "cloud" && !profileStatsComplete && !u.statsError;
  if (api.authMode() === "cloud" && u.username && !u.statsLoading &&
      (profileStatsMissing || Date.now() - (u.statsFetchedAt || 0) >= 15_000)) {
    const owner = api.cloudAccountId();
    void api.refreshCloudProfileStats(u.id, u.username).then(stats => {
      if (stats && owner === api.cloudAccountId() && profileId === u.id) render();
    }).catch(error => {
      if (owner === api.cloudAccountId() && profileId === u.id) { toast(error.message); render(); }
    });
  }
  // Owner card previews reuse the viewer's own readable relationship list (GET /api/relationships, cached).
  // Other members' lists are never fetched; their cards stay count-only unless ids are already known.
  if (u.id === me?.id && api.authMode() === "cloud" && profileRelationsRequestedFor !== api.cloudAccountId()) {
    const owner = profileRelationsRequestedFor = api.cloudAccountId();
    void api.refreshCloudRelationships({ force: false, importLegacy: false }).then(() => {
      if (owner === api.cloudAccountId() && profileId === u.id) render();
    }).catch(() => {});
  }
  const cloudBlocksReady = api.authMode() !== "cloud" || api.cloudBlocksLoaded();
  if (!cloudBlocksReady) {
    const owner = api.cloudAccountId();
    void api.refreshCloudBlocks().then(() => {
      if (api.cloudAccountId() === owner && profileId === u.id) render();
    }).catch(error => toast(error.message || "Block settings could not be loaded."));
  }
  const locked = !api.canSee(u.id);
  const mine = u.id === me.id;
  let profileRepostStatus = api.authMode() === "cloud" ? api.cloudProfileRepostsStatus(u.id) : null;
  if (["posts","reposts"].includes(profileMode) && !locked && api.authMode() === "cloud" &&
      u.username && !profileRepostStatus.loaded && !profileRepostStatus.loading && !profileRepostStatus.error) {
    const owner = api.cloudAccountId();
    const load = api.refreshCloudProfileReposts(u.id, u.username);
    profileRepostStatus = api.cloudProfileRepostsStatus(u.id);
    void load.then(() => {
      if (api.cloudAccountId() === owner && profileId === u.id && ["posts","reposts"].includes(profileMode)) render();
    }).catch(() => {
      if (api.cloudAccountId() === owner && profileId === u.id && ["posts","reposts"].includes(profileMode)) render();
    });
  }
  let archiveStatus = mine && api.authMode() === "cloud" ? api.cloudArchivedPostsStatus() : null;
  if (mine && profileMode === "archived" && api.authMode() === "cloud" &&
      !archiveStatus.loaded && !archiveStatus.loading && !archiveStatus.error) {
    const owner = api.cloudAccountId();
    const load = api.refreshCloudArchivedPosts();
    archiveStatus = api.cloudArchivedPostsStatus();
    void load.then(() => {
      if (api.cloudAccountId() === owner && profileId === u.id && profileMode === "archived") render();
    }).catch(() => {
      if (api.cloudAccountId() === owner && profileId === u.id && profileMode === "archived") render();
    });
  }
  const profilePostStatus = api.authMode() === "cloud" ? api.cloudProfilePostsStatus(u.id) : null;
  const posts = api.profilePosts(u.id).filter(isProfileSurfacePost);
  const archivedPosts = mine
    ? [...new Map([
        ...api.cloudArchivedPosts(),
        ...api.db().posts.filter(post => post.author === u.id && post.archivedAt != null),
      ].map(post => [post.id, post])).values()]
    : [];
  const coverImage = u.cover || "";
  const videos = posts.filter(p => p.kind === "video" && profilePostMedia(p).length);
    const saved = listSavedPosts().filter(isProfileSurfacePost);
   const reposts = api.authMode() === "cloud"
     ? api.cloudProfileReposts(u.id)
      : api.posts().filter(p => isProfileSurfacePost(p) && (p.reposts || []).includes(u.id) && (p.author === me.id || api.canSeePost(p)));
   const visibleReposts = reposts.filter(isProfileSurfacePost);
   const archiveMode = mine && profileMode === "archived";
   const mainPostGrid = [...new Map([...posts, ...visibleReposts]
     .map(p => [p.id, p])).values()].sort((a, b) => (b.created || b.time || b.createdAt || 0) - (a.created || a.time || a.createdAt || 0));
   const grid = locked ? [] : archiveMode ? archivedPosts : profileMode === "videos" ? videos
     : profileMode === "reposts" ? visibleReposts
      : profileMode === "saved" && mine ? saved : mainPostGrid;
   const profileModes = ["posts", "videos", "community", "reposts"];
   const profileModeIcons = { posts: icon("grid"), videos: ic.video, reposts: ic.repost, saved: ic.mediaBookmark, archived: icon("archive"), community: ic.users };
   const profileModeLabels = { posts: "Posts", videos: "Videos", reposts: "Reposts", saved: "Saved", archived: "Archived", community: "Community" };
   const gridTitle = archiveMode ? "Archived posts" : profileMode === "saved" ? "Saved posts" : profileMode === "reposts" ? "Reposts" : profileMode === "videos" ? "Videos" : "Posts";
  const profileGridMarkup = grid.slice(0, profileMore ? grid.length : 8).map(p => {
    const savedCover = u.profilePostCovers?.[p.id] || {};
    const coverUri = p.profileCoverUri || savedCover.uri || "";
    const coverTemplate = p.profileCoverTemplate || savedCover.template || "";
    const crop = p.profileCoverPosition || savedCover.position || {};
    const postMedia = profilePostMedia(p);
    const cropStyle = `object-position:${Math.max(0, Math.min(100, Number(crop.x) || 50))}% ${Math.max(0, Math.min(100, Number(crop.y) || 50))}%;transform:scale(${Math.max(1, Math.min(2, Number(crop.zoom) || 1))})`;
    const rawPoster = p.mediaPosters?.[0];
    const mediaPreviewPoster = p.kind === "video" && rawPoster && !isDefaultAvatarMediaReference(rawPoster) ? rawPoster : "";
     const postAuthorSource = p.author && typeof p.author === "object" ? p.author : {};
     const postAuthorId = String(postAuthorSource.id || p.authorId || p.authorLocalId || (typeof p.author === "string" ? p.author : ""));
     const postAuthor = (postAuthorId ? api.user(postAuthorId) : null) ||
       ([postAuthorSource.name, postAuthorSource.displayName, postAuthorSource.username, postAuthorSource.avatar].some(Boolean)
         ? postAuthorSource
         : [p.authorName, p.authorDisplayName, p.authorUsername, p.authorAvatar].some(Boolean)
           ? { id: postAuthorId, name: p.authorName || p.authorDisplayName || "", username: p.authorUsername || "", avatar: p.authorAvatar || "" }
           : profileMode === "reposts" ? null : u);
    let visual;
    if (coverTemplate) {
      visual = `<span class="ot-profile-cover-template is-${esc(coverTemplate)}"><b>${esc(p.caption || p.text || "A moment")}</b><small>OLDTIME · ${coverTemplate === "night" ? "MEMORIES" : "POST"}</small></span>`;
    } else if (coverUri) {
      visual = `<img ${profileMediaSource(coverUri)} alt="" style="width:100%;height:100%;display:block;object-fit:cover;${cropStyle}" />`;
    } else if (p.creativeProject) {
      visual = creativeMediaMarkup(p, esc, false, true);
    } else if (postMedia[0]) {
      const mediaReference = postMedia[0];
      const poster = mediaPreviewPoster;
      visual = p.kind === "video" && !poster
        ? `<span class="profile-video-preview-fallback" role="img" aria-label="Video preview: ${esc(p.caption || p.text || "Video post")}">
            <span class="profile-video-preview-icon">${ic.video}</span>
            <b>${esc((p.caption || p.text || "Video post").slice(0, 72))}</b>
            <small>Tap to play</small>
          </span>`
        : `<img ${profileMediaSource(poster || mediaReference)} alt="" style="width:100%;height:100%;display:block;object-fit:cover" />`;
    } else {
      visual = `<span class="ot-profile-cover-template"><b>${esc((p.text || p.caption || "A thought").slice(0, 54))}</b><small>OLDTIME · NOTE</small></span>`;
    }
    const archived = p.archivedAt != null;
    const openPostAttributes = archived ? "" : `data-open="${esc(p.id)}"`;
    const postCaption = String(p.caption || p.text || "Post");
    return `<article class="profile-post-card">
      <${archived ? "div" : "button"} ${archived ? `role="img" aria-label="Archived post preview: ${esc(postCaption)}"` : `type="button" aria-label="Open ${esc(postCaption)}"`} class="profile-post-media ${archived ? "is-archived" : ""} ${p.kind === "video" ? "is-video-preview" : ""} ${!postMedia[0] && !coverUri && !coverTemplate && !p.creativeProject ? "is-text" : ""}" ${openPostAttributes}>
        ${visual}
      </${archived ? "div" : "button"}>
      <div class="profile-post-detail">
        ${postAuthor ? `<div class="profile-post-byline">
          ${postAuthor ? `<span class="profile-post-author"><img ${profileMediaSource(postAuthor.avatar || "")} alt="" /><span>${esc(postAuthor.name || postAuthor.displayName || postAuthor.username || "Oldtime member")}</span></span>` : ""}
        </div>` : ""}
      </div>
    </article>`;
  }).join("");
  const profileGridEmptyMessage = archiveMode
    ? archiveStatus?.loading ? "Loading archived posts…"
      : archiveStatus?.error ? "Your archive could not be loaded. Try again."
        : "Posts you archive will appear here."
    : profileMode === "reposts"
    ? profileRepostStatus?.loading ? "Loading reposts…"
      : profileRepostStatus?.error ? "Reposts could not be loaded. Check your connection and try again."
        : mine ? "Posts you repost will appear here." : "No reposts to show yet."
    : profileMode === "saved" ? "Posts you save stay private and appear here."
      : profileMode === "videos" ? mine ? "Your videos will appear here." : "No videos to show yet."
        : mine ? "Your posts will appear here." : "No posts to show yet.";
  const profileStatsLoading = api.authMode() === "cloud" && !profileStatsComplete && !u.statsError;
  const profileStatsUnavailable = api.authMode() === "cloud" && !profileStatsComplete && Boolean(u.statsError);
  const profileCountCard = (kind, label, count) => {
    const listHidden = !mine && !canSeeProfileList(kind, { visibility: listVisibilityOf(u) });
    const stateClass = profileStatsLoading ? " is-count-loading" : profileStatsUnavailable ? " is-count-unavailable" : "";
    const stateLabel = profileStatsLoading ? `Loading ${label.toLowerCase()} count`
      : profileStatsUnavailable ? `${label} count unavailable` : "";
    const title = listHidden ? hiddenListMessage(kind, u.name || "This member")
      : profileStatsUnavailable ? "Profile totals could not be loaded." : "";
    const ariaLabel = listHidden ? `${count} ${label}. ${hiddenListMessage(kind, u.name || "This member")}` : stateLabel;
    return `<button type="button" class="profile-count-card${listHidden ? " is-list-private" : ""}${stateClass}" data-profile-list="${kind}" data-testid="profile-count-${kind}"${title ? ` title="${esc(title)}"` : ""}${ariaLabel ? ` aria-label="${esc(ariaLabel)}"` : ""}><span class="profile-count-text"><b>${count}</b><small>${label}</small></span></button>`;
  };
  const loadingCount = profileStatsLoading ? "…" : "—";
  const followerCount = api.authMode() === "cloud" ? (Number.isSafeInteger(u.stats?.followerCount) ? fmt(u.stats.followerCount) : loadingCount) : fmt(u.followers.length);
  const followingCount = api.authMode() === "cloud" ? (Number.isSafeInteger(u.stats?.followingCount) ? fmt(u.stats.followingCount) : loadingCount) : fmt(u.following.length);
  const followingCountMarkup = profileCountCard("following", "Following", followingCount);
  const followerCountMarkup = profileCountCard("followers", "Followers", followerCount);
  const profilePostCount = api.authMode() === "cloud"
    ? Number.isSafeInteger(u.profilePostCount) ? u.profilePostCount
      : Number.isSafeInteger(u.stats?.postCount) ? u.stats.postCount : null
    : posts.length;
  const profileStatsMarkup = followingCountMarkup
     + followerCountMarkup
     + `<div class="profile-count-card profile-post-count" data-testid="profile-post-count" aria-label="${profilePostCount == null ? profileStatsLoading ? "Loading post count" : "Post count unavailable" : `${fmt(profilePostCount)} posts`}"><span class="profile-count-text"><b>${profilePostCount == null ? loadingCount : fmt(profilePostCount)}</b><small>Posts</small></span></div>`;
  const requested = api.db().requests.some(r => r.from === me.id && r.to === u.id);
  const friendRequests = Array.isArray(api.db().friendRequests) ? api.db().friendRequests : [];
  const friendRequested = friendRequests.some(r => r.from === me.id && r.to === u.id);
  const friendRequestIncoming = friendRequests.some(r => r.from === u.id && r.to === me.id);
  const isFriend = api.areFriends(me.id, u.id);
  const isCloseFriend = (api.authMode() === "cloud" ? api.cloudCloseFriends() : me.closeFriends || []).includes(u.id);
  const hasProfileStory = api.stories().some(story =>
    story.author === u.id && isStoryActive(story) && api.canSeeStory(story)
  );
  const visibleNote = !locked && Boolean(u.profileNote?.trim());
  const profileNoteMarkup = mine
    ? `<button type="button" class="profile-note-inline" id="profile-note" aria-label="${u.profileNote?.trim() ? "Edit your note" : "Add a note"}">${esc(u.profileNote?.trim() || "Add a note")}</button>`
    : visibleNote ? `<p class="profile-note-inline">${esc(u.profileNote.trim())}</p>` : "";
  const visibleCity = !locked && (mine || u.profileVisibility?.city !== false);
  const visibleInterests = !locked && (mine || u.profileVisibility?.interests !== false);
  const interestIds = visibleInterests && Array.isArray(u.interests) ? u.interests : [];
  const cityLine = u.city && visibleCity
    ? `<p class="sub profile-city"><span class="profile-meta-icon" aria-hidden="true">${ic.location}</span><span class="sr-only">City · </span>${esc(u.city)}${mine && u.profileVisibility?.city === false ? `<small>Only you</small>` : ""}</p>`
    : "";
  const interestLine = interestIds.length
    ? `<div class="profile-interest-list" aria-label="Interests"><span class="profile-meta-icon" aria-hidden="true">${ic.star}</span>${interestIds.slice(0,2).map(id => `<span class="profile-interest-chip">${esc(profileInterestName(id))}</span>`).join("")}${interestIds.length>2?`<small>+${interestIds.length-2}</small>`:""}${mine && u.profileVisibility?.interests === false ? `<small>Only you</small>` : ""}</div>`
    : "";
   shell(`<section class="screen on profile-screen"><div class="scroll profile-page">
      <div class="profile-hero profile-simple-hero${coverImage ? "" : " profile-no-cover"}">
        <div class="profile-cover"><img class="profile-cover-background" ${profileMediaSource(coverImage)} alt="" aria-hidden="true" /><img class="profile-cover-landscape" ${profileMediaSource(coverImage)} alt="" /></div>
        <div class="profile-topbar"><button id="back" aria-label="Back">←</button><div class="row profile-topbar-actions"><button type="button" class="icon profile-more" id="profile-actions-open" aria-label="${mine ? "Open profile settings and actions" : "More profile actions"}" title="${mine ? "Settings" : "Profile actions"}">${ic.menu}</button></div></div>
       <div class="profile-intro">
          <div class="profile-overview-row">
           <div class="profile-avatar-wrap">
             ${profileNoteMarkup}
             ${hasProfileStory ? `<button type="button" class="profile-story-ring" data-profile-story aria-label="View ${esc(u.username)}'s story"><img class="profile-avatar" ${profileMediaSource(u.avatar)} alt="" /></button>` : `<img class="profile-avatar" ${profileMediaSource(u.avatar)} alt="" />`}
           </div>
          </div>
           <div class="profile-name-row">
             <div class="profile-details-copy">
               <b class="profile-name" title="${esc(u.name)}">${esc(u.name)}${blueBadgeMarkup(u.cloudAccountId || u.id, esc)}</b>
               <small class="profile-handle">@${esc(u.username)}</small>
               ${u.professional?.showCategory&&u.professional.accountType!=="personal"?`<small class="sub profile-category">${esc(u.professional.accountType==="creator"?u.professional.creatorCategory:u.professional.businessCategory)}</small>`:""}
             </div>
           </div>
           <div class="profile-stats" aria-live="polite">${profileStatsMarkup}</div>
           ${mine ? `<div class="row profile-primary-actions profile-owner-actions"><button type="button" class="profile-edit-primary" id="edit" data-testid="button-edit-profile" aria-label="Edit profile">Edit profile</button><button type="button" class="profile-share-primary" id="sharep">Share profile</button></div>` : ""}
           ${u.bio?.trim() ? `<p class="cap">${esc(u.bio)}</p>` : ""}
          ${cityLine || interestLine ? `<div class="profile-meta-row">${cityLine}${interestLine}</div>` : ""}
           ${mine
              ? ""
              : `<div class="row profile-primary-actions profile-visitor-actions"><button type="button" class="profile-follow-button" id="pfollow" aria-pressed="${me.following.includes(u.id)}">${me.following.includes(u.id) ? "Following" : requested ? "Requested" : "Follow"}</button><button type="button" class="profile-icon-action profile-visitor-message" id="pmsg" aria-label="Message @${esc(u.username)}" title="Message" ${api.blocked(me.id, u.id) ? "disabled" : ""}>${ic.messages}<span>Message</span></button></div>`}
      </div>
    </div>
    <div class="profile-body">
     <div class="profile-section-tabs" role="tablist" aria-label="Profile sections">
      ${profileModes.map(mode => `<button type="button" role="tab" id="profile-tab-${mode}" data-m="${mode}" class="profile-section-tab ${profileMode === mode ? "on" : ""}" aria-label="${profileModeLabels[mode]}" title="${profileModeLabels[mode]}" aria-selected="${profileMode === mode}" aria-controls="profile-content-grid" tabindex="${profileMode === mode ? "0" : "-1"}">${profileModeIcons[mode]}</button>`).join("")}
     </div>
     ${!locked && profileMode === "community" ? (() => {
       const pc = profileCommunity.userId === u.id && profileCommunity.owner === (api.cloudAccountId() || "") ? profileCommunity : { status: "idle", posts: [], hasMore: false };
       if (pc.status === "idle") queueMicrotask(() => loadProfileCommunity(u.id));
       const cards = pc.posts.map(post => communityPostCard(post)).filter(Boolean).join("");
       return `<div id="profile-content-grid" class="profile-community-timeline" role="tabpanel" aria-labelledby="profile-tab-community">
         ${(pc.status === "loading" || pc.status === "idle") && !pc.posts.length ? `<div class="profile-community-skeleton" role="status" aria-label="Loading Community posts"><span></span><span></span><span></span></div>` : ""}
         ${pc.status === "error" ? `<div class="profile-community-state" role="alert">${esc(pc.error)} <button type="button" id="profile-community-retry">Try again</button></div>` : ""}
         ${pc.status === "success" && !pc.posts.length ? `<div class="empty">${mine ? "Your Community posts will appear here." : "No Community posts to show yet."}</div>` : ""}
         ${cards}
         ${pc.hasMore ? `<button type="button" class="profile-grid-more" id="profile-community-more" ${pc.status === "loading" ? "disabled" : ""}>${pc.status === "loading" ? "Loading…" : "Load more Community posts"}</button>` : ""}
       </div>`;
     })() : locked ? `<div id="profile-content-grid" role="tabpanel" aria-labelledby="profile-tab-${profileMode}"><div class="empty">This account is private.</div></div>` : `<div id="profile-content-grid" role="tabpanel" aria-labelledby="profile-tab-${profileMode}">
       ${profileGridMarkup ? `<div class="profile-post-grid">${profileGridMarkup}</div>` : `<div class="empty">${["posts","videos"].includes(profileMode) && profilePostStatus?.loading ? "Loading posts…" : ["posts","videos"].includes(profileMode) && profilePostStatus?.error ? "Profile posts could not be loaded. Try again." : profileGridEmptyMessage}</div>`}
       ${["posts","videos"].includes(profileMode) && profilePostStatus?.error ? `<button type="button" class="profile-grid-more" id="profile-posts-retry">Try again</button>` : ""}
       ${profileMode === "reposts" && profileRepostStatus?.error ? `<button type="button" class="profile-grid-more" id="profile-reposts-retry">Try again</button>` : ""}
        ${archiveMode && archiveStatus?.error ? `<button type="button" class="profile-grid-more" id="profile-archive-retry">Try again</button>` : ""}
       ${grid.length > 8 && !profileMore ? `<button type="button" class="profile-grid-more" id="more">See more ${gridTitle.toLowerCase()}</button>` : ""}
       ${profileMode === "reposts" && profileRepostStatus?.hasMore ? `<button type="button" class="profile-grid-more" id="profile-reposts-more" ${profileRepostStatus.loading ? "disabled" : ""}>${profileRepostStatus.loading ? "Loading…" : "Load more reposts"}</button>` : ""}
        ${archiveMode && archiveStatus?.hasMore ? `<button type="button" class="profile-grid-more" id="profile-archive-more" ${archiveStatus.loading ? "disabled" : ""}>${archiveStatus.loading ? "Loading…" : "Load more archived posts"}</button>` : ""}
      </div>`}
    </div>
   </div>
   <div class="sheet profile-action-sheet" id="profile-actions-sheet" aria-hidden="true">
    <section class="panel profile-action-panel" role="dialog" aria-modal="true" aria-label="Profile actions" tabindex="-1">
     <div class="grab"></div>
     <div class="profile-action-heading"><b>${mine ? "Your profile" : `@${esc(u.username)}`}</b><button type="button" class="profile-action-close" data-profile-actions-close aria-label="Close profile actions">${ic.close}</button></div>
     <div class="profile-action-list">
      ${mine ? `
       <button type="button" class="profile-action-item" data-profile-settings>${ic.settings}<span>Settings</span><span class="profile-action-chevron">›</span></button>
      ` : `
       <button type="button" class="profile-action-item" id="pfriend" aria-pressed="${isFriend}">${ic.user}<span>${isFriend ? "Friends" : friendRequestIncoming ? "Accept friend request" : friendRequested ? "Friend request sent" : "Add friend"}</span><span class="profile-action-chevron">›</span></button>
       <button type="button" class="profile-action-item" id="pclosefriend" aria-pressed="${isCloseFriend}" ${!isFriend ? 'disabled title="Become friends first"' : ""}>${ic.mediaHeart}<span>${isCloseFriend ? "Remove from Close Friends" : "Add to Close Friends"}</span><span class="profile-action-chevron">›</span></button>
       <button type="button" class="profile-action-item" data-profile-share>${ic.share}<span>Share profile</span><span class="profile-action-chevron">›</span></button>
       <div class="profile-action-divider"></div>
       <button type="button" class="profile-action-item" id="pblock" ${cloudBlocksReady ? "" : "disabled"}>${ic.lock}<span>${!cloudBlocksReady ? "Loading block settings…" : (api.authMode() === "cloud" ? api.cloudBlocks() : api.db().blocks.filter(b => b.by === me.id).map(b => b.who)).includes(u.id) ? "Unblock account" : "Block account"}</span></button>
       <button type="button" class="profile-action-item profile-action-quiet" id="prep">${ic.flag}<span>Report profile</span></button>
      `}
     </div>
    </section>
   </div>
   </section>`, "dark");
  bindPostEditActions(app);
  $("#back").onclick = () => {
    if (backFromNotificationDetail()) return;
    if (navigateBack()) return;
    profileId = null;
    if (profileReturnChatId) {
      const previousChat = profileReturnChatId;
      profileReturnChatId = null;
      tab = "chat";
      chatId = previousChat;
    }
    render();
  };
  $("#profile-note") && ($("#profile-note").onclick = editProfileNote);
  const profileActionSheet = $("#profile-actions-sheet");
  let profileActionReturnFocus = null;
  const closeProfileActionSheet = () => {
    if (!profileActionSheet) return;
    profileActionSheet.classList.remove("on");
    profileActionSheet.setAttribute("aria-hidden", "true");
    const focusTarget = profileActionReturnFocus?.isConnected ? profileActionReturnFocus : $("#profile-actions-open");
    focusTarget?.focus({ preventScroll: true });
    profileActionReturnFocus = null;
  };
  const profileShareButton = app.querySelector("#sharep, [data-profile-share]");
  if (profileShareButton) profileShareButton.onclick = () => {
    if (!mine) closeProfileActionSheet();
    void shareProfile(u);
  };
  $("#profile-actions-open") && ($("#profile-actions-open").onclick = () => {
    if (mine) { settingsView = "home"; navigateFromDrawer("settings"); return; }
    if (!profileActionSheet) return;
    profileActionReturnFocus = document.activeElement;
    profileActionSheet.setAttribute("aria-hidden", "false");
    profileActionSheet.classList.add("on");
    profileActionSheet.querySelector('[role="dialog"]')?.focus({ preventScroll: true });
  });
  if (profileActionSheet) {
    profileActionSheet.onclick = event => { if (event.target === profileActionSheet) closeProfileActionSheet(); };
    profileActionSheet.onkeydown = event => { if (event.key === "Escape") closeProfileActionSheet(); };
    const closeButton = profileActionSheet.querySelector("[data-profile-actions-close]");
    if (closeButton) closeButton.onclick = closeProfileActionSheet;
    const settingsButton = profileActionSheet.querySelector("[data-profile-settings]");
    if (settingsButton) settingsButton.onclick = () => {
      closeProfileActionSheet();
      navigateFromDrawer("settings");
    };
  }
  void hydrateLocalMedia(app);
  bindPostDeleteActions();
  mountCreativeViewers(app, { onSource: openPostViewer, muted: true });
  app.querySelector("[data-profile-story]")?.addEventListener("click", () => openStory(u.id));
  $("#playall") && ($("#playall").onclick = () => {
    closeProfileActionSheet();
    if (locked) return toast("This account is private");
    openProfilePostPlayback(u.id, posts);
  });
  $("#more") && ($("#more").onclick = () => { profileMore = !profileMore; render(); });
  $("#profile-posts-retry")?.addEventListener("click", async () => {
    const owner = api.cloudAccountId();
    const load = api.refreshCloudProfileStats(u.id, u.username, { force: true });
    render();
    try { await load; } catch { /* Preserve confirmed content and show the retry state. */ }
    if (api.cloudAccountId() === owner && profileId === u.id) render();
  });
  $("#profile-reposts-retry")?.addEventListener("click", async () => {
    const owner = api.cloudAccountId();
    const load = api.refreshCloudProfileReposts(u.id, u.username);
    render();
    try { await load; } catch { /* The profile shows the retry state. */ }
    if (api.cloudAccountId() === owner && profileId === u.id && profileMode === "reposts") render();
  });
  $("#profile-reposts-more")?.addEventListener("click", async () => {
    const owner = api.cloudAccountId();
    const load = api.loadMoreCloudProfileReposts(u.id, u.username);
    render();
    try { await load; } catch (error) { toast(error.message || "More reposts could not be loaded."); }
    if (api.cloudAccountId() === owner && profileId === u.id && profileMode === "reposts") render();
  });
  $("#profile-archive-retry")?.addEventListener("click", async () => {
    const owner = api.cloudAccountId();
    const load = api.refreshCloudArchivedPosts({ force: true });
    render();
    try { await load; } catch { /* The archive shows the retry state. */ }
    if (api.cloudAccountId() === owner && profileId === u.id && profileMode === "archived") render();
  });
  $("#profile-archive-more")?.addEventListener("click", async () => {
    const owner = api.cloudAccountId();
    const load = api.loadMoreCloudArchivedPosts();
    render();
    try { await load; } catch (error) { toast(error.message || "More archived posts could not be loaded."); }
    if (api.cloudAccountId() === owner && profileId === u.id && profileMode === "archived") render();
  });
  $("#logout") && ($("#logout").onclick = () => { closeProfileActionSheet(); logoutAccount(); settingsView = "home"; tab = "updates"; chatId = null; profileId = null; profileReturnChatId = null; viewer = null; render(); });
  if (profileMode === "community" && app.querySelector(".profile-community-timeline")) {
    bindPosts();
    app.querySelectorAll(".profile-community-timeline [data-stories-post]").forEach(button => button.onclick = () => openPostViewer(button.dataset.storiesPost));
    $("#profile-community-retry")?.addEventListener("click", () => loadProfileCommunity(u.id));
    $("#profile-community-more")?.addEventListener("click", () => loadProfileCommunity(u.id, { append: true }));
  }
  app.querySelectorAll(".profile-section-tab[data-m]").forEach((button, index, buttons) => {
    const activateMode = mode => {
      profileMode = mode;
      profileMore = false;
      render();
      requestAnimationFrame(() => $(`#profile-tab-${mode}`)?.focus({ preventScroll: true }));
    };
    button.onclick = () => activateMode(button.dataset.m);
    button.onkeydown = event => {
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % buttons.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = buttons.length - 1;
      else return;
      event.preventDefault();
      activateMode(buttons[nextIndex].dataset.m);
    };
  });
  $("#pfollow") && ($("#pfollow").onclick = () => follow(u.id));
  // Followers/Following counts open the server-backed list (server decides privacy; owner always allowed).
  app.querySelectorAll(".profile-stats [data-profile-list]").forEach(button => button.onclick = () => openProfileListSheet({
    sheet: $("#sheet"), kind: button.dataset.profileList, profile: u, isOwner: u.id === api.me()?.id,
    esc, mediaSource: profileMediaSource, toast,
    onProfile: id => navigateToProfile(id),
    // follow() re-renders the shell (which recreates #sheet); keep the open list sheet node in place.
    onFollow: async id => { const open = $("#sheet"); await follow(id); const fresh = $("#sheet"); if (open && fresh && fresh !== open && open.classList.contains("on")) fresh.replaceWith(open); },
    isFollowing: id => (api.me()?.following || []).includes(id),
    isRequested: id => api.db().requests.some(r => r.from === api.me()?.id && r.to === id),
    onClose: () => button.isConnected && button.focus(),
  }));
  $("#pmsg") && ($("#pmsg").onclick = async () => {
    profileReturnChatId = null;
    const request = ++chatRenderGeneration;
    try {
      const module = await loadChatModule();
      if (request !== chatRenderGeneration || tab !== "updates" || profileId !== u.id) return;
      chatId = module.ensureConvo([u.id]);
      tab = "chat";
      render();
    } catch (error) {
      toast(error.message || "Messages could not be opened.");
    }
  });
  $("#pfriend") && ($("#pfriend").onclick = () => { closeProfileActionSheet(); friend(u.id); });
  $("#pclosefriend") && ($("#pclosefriend").onclick = () => { closeProfileActionSheet(); toggleCloseFriend(u.id); });
  $("#pblock") && ($("#pblock").onclick = async () => {
    closeProfileActionSheet();
    if (api.authMode() === "cloud") {
      try {
        await api.refreshCloudBlocks();
        const selected = new Set(api.cloudBlocks());
        if (selected.has(u.id)) selected.delete(u.id);
        else selected.add(u.id);
        await api.replaceCloudBlocks([...selected]);
        render();
        toast(selected.has(u.id) ? "Account blocked" : "Account unblocked");
      } catch (error) { toast(error.message || "Block settings could not be updated."); }
      return;
    }
    mutate(db => {
      const i = db.blocks.findIndex(b => b.by === me.id && b.who === u.id);
      if (i >= 0) db.blocks.splice(i, 1);
      else db.blocks.push({ by: me.id, who: u.id });
    });
    render();
  });
  $("#prep") && ($("#prep").onclick = async () => {
    closeProfileActionSheet();
    try {
      const targetUserId = api.user(u.id)?.cloudAccountId || u.cloudAccountId || u.id;
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetUserId)) {
        throw new Error("This profile is not linked to an online account, so it cannot be reported.");
      }
      await api.submitCloudReport({
        kind: "profile",
        category: "Profile",
        targetUserId,
        reason: "Reported profile for review.",
      });
      toast("Report received by Oldtime. Review status is not available yet.");
    } catch (error) { toast(error.message || "Couldn’t submit this report."); }
  });
  $("#edit") && ($("#edit").onclick = openEditProfile);
  $("#edit-interests") && ($("#edit-interests").onclick = openEditProfile);
  app.querySelectorAll("[data-open]").forEach(b => b.onclick = () => openPostViewer(b.dataset.open));
}
async function shareProfile(user) {
  const owner = api.cloudAccountId();
  const [{ openProfileShare }] = await Promise.all([
    import("./profile-share.js"),
    import("./profile-share.css"),
  ]);
  const me = api.me();
  const avatarReference = user?.avatar || user?.avatarReference || (user?.id ? api.user(user.id)?.avatar : "")
    || (user?.id === me?.id ? me?.avatar : "");
  let avatar = avatarReference;
  if (isLocalMedia(avatarReference)) {
    try { avatar = await mediaUrl(avatarReference); } catch { avatar = ""; }
  }
  if (owner !== api.cloudAccountId()) return;
  const link = new URL("/", "https://www.heyoldtime.com");
  link.searchParams.set("user", user.username);
  closeProfileShare?.();
  closeProfileShare = openProfileShare({
    user: { ...user, avatar }, url: link.href, shareExternally, toast,
    onScanProfile: username => openProfileUsername(username, owner),
  });
}
async function openProfileUsername(username, owner = api.cloudAccountId()) {
  if (!owner) throw new Error("Sign in to open this profile.");
  const normalized = String(username || "").trim().replace(/^@/, "");
  if (!/^[A-Za-z0-9_.]{1,30}$/.test(normalized)) throw new Error("This profile code is invalid.");
  const own = api.me();
  let person = own?.username?.toLowerCase() === normalized.toLowerCase() ? own : api.user(normalized);
  if (!person) {
    const matches = await api.searchCloudUsers(normalized);
    const exact = matches.find(profile => profile.username?.toLowerCase() === normalized.toLowerCase());
    if (exact) person = api.user(exact.localId || exact.id);
  }
  if (owner !== api.cloudAccountId()) throw new Error("Your account changed. Open the code again.");
  if (!person) throw new Error("This profile could not be found or is unavailable.");
  navigateToProfile(person.id);
}
function openEditProfile() {
  navigationStack.push(captureNavigationState());
  tab = "profile-edit";
  profileId = null;
  chatId = null;
  viewer = null;
  render();
}

function editProfilePage() {
  const me = api.me();
  const defaultCover = automaticProfileCover(me);
  const selectedInterests = new Set((Array.isArray(me.interests) ? me.interests : []).filter(id => typeof id === "string"));
  let resetCover = false;
  let coverObjectUrl = "";
  let avatarObjectUrl = "", pickedAvatar = null, pickedAvatarPreset = null;
  let pickedAvatarFile = null, pickedCoverFile = null;
  shell(`<section class="screen on edit-profile-screen">
    <header class="profile-editor-header">
      <button type="button" id="profile-editor-back" class="profile-editor-back" data-testid="button-profile-editor-back" aria-label="Back">${ic.back}</button>
      <b>Edit profile</b>
      <span aria-hidden="true"></span>
    </header>
    <div class="edit-profile-scroll">
      <section class="profile-editor-avatar-section">
        <img id="cover-preview" class="profile-editor-cover-preview" ${me.cover?profileMediaSource(me.cover):"hidden"} alt="Your cover photo" />
        <img id="profile-avatar-preview" class="profile-editor-avatar" ${profileMediaSource(me.avatar || "")} alt="Profile photo" />
        <div class="profile-editor-identity"><b>${esc(me.name)}</b><small>@${esc(me.username)}</small></div>
          <div class="profile-avatar-actions">
            <label class="profile-editor-photo-action" data-testid="button-profile-photo-upload" for="avatar-file">Profile photo</label>
            <label class="profile-editor-photo-action" data-testid="button-profile-cover-upload" for="cover-file">Cover photo</label>
          </div>
        <input id="avatar-file" type="file" accept="image/*" data-testid="input-profile-photo" aria-label="Choose a profile photo" />
        <input id="cover-file" type="file" accept="image/*" data-testid="input-profile-cover" aria-label="Choose a cover photo" />
      </section>
      <div class="profile-editor-fields">
        <label class="profile-editor-field"><span>Name</span><input id="nm" data-testid="input-profile-name" value="${esc(me.name)}" placeholder="Add your name" autocomplete="name" /></label>
        <label class="profile-editor-field"><span>Username</span><input id="un" data-testid="input-profile-username" value="${esc(me.username)}" placeholder="username" autocomplete="username" autocapitalize="none" /></label>
        <label class="profile-editor-field"><span class="profile-editor-email-label">Email${emailManualActionAvailable() ? `<button type="button" class="profile-editor-email-verify" data-ev-editor-open data-testid="button-editor-verify-email">Confirm email</button>` : ""}</span><input id="em" data-testid="input-profile-email" type="email" value="${esc(me.email || "")}" placeholder="Email address" autocomplete="email" /></label>
        <div class="profile-editor-bio">
          <label for="bio">Bio</label>
          <textarea id="bio" data-testid="input-profile-bio" placeholder="Write a short bio">${esc(me.bio || "")}</textarea>
          <button type="button" class="profile-editor-emoji" id="bio-emoji" aria-label="Add emoji to bio">${ic.smile}</button>
        </div>
        <label class="profile-editor-field"><span>Birthday</span><input id="birthday" data-testid="input-profile-birthday" type="date" value="${esc(me.birthday || "")}" /></label>
        <label class="profile-editor-field"><span>City</span><input id="city" data-testid="input-profile-city" value="${esc(me.city || "")}" placeholder="Add a city" autocomplete="address-level2" /></label>
      </div>
      <section class="profile-editor-interests">
        <div class="profile-editor-section-heading"><b>Interests</b><small>Choose up to 8</small></div>
        <div class="profile-interest-picker" role="group" aria-label="Choose your interests">
          ${PROFILE_INTERESTS.map(interest => `<button type="button" class="profile-interest-option ${selectedInterests.has(interest.id) ? "selected" : ""}" data-profile-interest="${interest.id}" data-testid="button-interest-${interest.id}" aria-pressed="${selectedInterests.has(interest.id)}">${interest.label}</button>`).join("")}
        </div>
      </section>
    </div>
    <footer class="profile-editor-footer">
      <button type="button" class="profile-editor-save" id="savep" data-testid="button-save-profile">Save changes</button>
    </footer>
  </section>`, "light");
  $("#bio-emoji").onclick = () => openEmojiPicker($("#bio"));
  // Explicit email confirmation from Edit profile: opens the send sheet only; editor fields are untouched.
  app.querySelector("[data-ev-editor-open]")?.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); void openEmailVerificationSheet({ sheet: $("#sheet"), toast, esc }); });
  bindInterestEntry({ root: $(".profile-editor-interests"), picker: $(".profile-interest-picker"),
    selected: selectedInterests, catalog: PROFILE_INTERESTS, max: 8, attribute: "data-profile-interest" });
  const coverInput = $("#cover-file");
  const coverPreview = $("#cover-preview");
  const avatarInput = $("#avatar-file");
  const releaseAvatarPreview = () => {
    if(avatarObjectUrl)URL.revokeObjectURL(avatarObjectUrl);
    avatarObjectUrl="";
  };
  const markAvatarChoice = choice => {
    document.querySelectorAll("[data-profile-avatar]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.profileAvatar===choice)));
  };
  document.querySelectorAll("[data-profile-avatar]").forEach(button=>button.onclick=()=>{
    const choice=button.dataset.profileAvatar;
    pickedAvatar=choice==="automatic"?automaticAvatar(me.cloudAccountId||me.id):avatarImage(choice);
    pickedAvatarPreset=choice;
    pickedAvatarFile=null;
    avatarInput.value="";
    releaseAvatarPreview();
    $("#profile-avatar-preview").src=pickedAvatar;
    markAvatarChoice(choice);
    $("#profile-avatar-choices").open=false;
  });
  avatarInput.onchange=async()=>{
    const file=avatarInput.files?.[0];
    if(!file)return;
    try {
      const croppedFile=await openProfileImageCropper(file,"avatar");
      if(!croppedFile)return;
      pickedAvatarFile=croppedFile;
      pickedAvatar=null;pickedAvatarPreset=null;
      releaseAvatarPreview();
      avatarObjectUrl=URL.createObjectURL(croppedFile);
      $("#profile-avatar-preview").removeAttribute("data-local-media");
      $("#profile-avatar-preview").src=avatarObjectUrl;
      markAvatarChoice(null);
    } catch(error) {
      toast(error.message);
    } finally {
      avatarInput.value="";
    }
  };
  const releaseCoverPreview = () => {
    if (coverObjectUrl) URL.revokeObjectURL(coverObjectUrl);
    coverObjectUrl = "";
  };
  const leaveEditor = () => {
    releaseCoverPreview();
    releaseAvatarPreview();
    if (!navigateBack()) {
      tab = "updates";
      profileId = me.id;
      render();
    }
  };
  $("#profile-editor-back").onclick = leaveEditor;
  coverInput.onchange = async () => {
    const coverFile = coverInput.files?.[0];
    if (!coverFile) return;
    try {
      const croppedFile=await openProfileImageCropper(coverFile,"cover");
      if(!croppedFile)return;
      pickedCoverFile=croppedFile;
      resetCover = false;
      releaseCoverPreview();
      coverObjectUrl = URL.createObjectURL(croppedFile);
      coverPreview.removeAttribute("data-local-media");
      coverPreview.src = coverObjectUrl;
      coverPreview.hidden = false;
    } catch(error) {
      toast(error.message);
    } finally {
      coverInput.value = "";
    }
  };
  const profileSaveButtons = [$("#savep")];
  const profileSaveLabels = profileSaveButtons.map(button => button.textContent);
  let savingProfile = false;
  const saveProfile = async () => {
    if (savingProfile) return;
    const username = $("#un").value.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,24}$/.test(username)) return toast("Bad username");
    if (api.db().users.some(u => u.username === username && u.id !== me.id)) return toast("Username taken");
    const email = $("#em").value.trim().toLowerCase();
    const emailError = profileEmailValidationMessage(email, me.email, value => api.emailInUse(value, me.id));
    if (emailError) return toast(emailError);
    const file = pickedAvatarFile;
    const coverFile = pickedCoverFile;
    const changes = { name: $("#nm").value.trim() || username, username, email, bio: $("#bio").value.trim(), city: $("#city").value.trim(), birthday: $("#birthday").value, interests: [...selectedInterests] };
    let emailChangeNeedsVerification = false;
    let profileWasSaved = false;
    try {
      savingProfile = true;
      profileSaveButtons.forEach(button => {
        button.disabled = true;
        button.textContent = "Saving…";
      });
      if (file && !file.type.startsWith("image/")) return toast("Choose an image");
      if (coverFile && !coverFile.type.startsWith("image/")) return toast("Choose an image");
      if (!api.cloudAccountId()) throw new Error("Sign in to your online account before saving your profile.");
      const avatar = file ? await putLocalMedia(file) : pickedAvatar || api.me()?.avatar || me.avatar;
      const cover = coverFile ? await putLocalMedia(coverFile) : resetCover ? null : me.cover || null;
      const profile = {
        bio: changes.bio,
        city: changes.city,
        birthday: changes.birthday,
        interests: changes.interests,
        avatar,
        cover,
        profileVisibility: {
          city: me.profileVisibility?.city !== false,
          interests: me.profileVisibility?.interests !== false,
        },
        ...(file ? { avatarPreset: null } : pickedAvatarPreset ? { avatarPreset: pickedAvatarPreset } : {}),
      };
      const savedProfile = await api.updateCloudAccountProfile({
        username: changes.username,
        displayName: changes.name,
        email: changes.email,
        profile,
      });
      profileWasSaved = true;
      emailChangeNeedsVerification = savedProfile.emailChangeNeedsVerification === true;
      if (emailChangeNeedsVerification) {
        await api.requestCloudEmailChange(changes.email);
      }
    } catch (e) {
      toast(profileWasSaved
        ? `Profile saved, but email verification could not be sent: ${e.message}`
        : e.message);
      return;
    }
    finally {
      savingProfile = false;
      profileSaveButtons.forEach((button, index) => {
        button.disabled = false;
        button.textContent = profileSaveLabels[index];
      });
    }
    releaseCoverPreview();
    releaseAvatarPreview();
    if (!navigateBack()) {
      tab = "updates";
      profileId = me.id;
    }
    render();
    toast(emailChangeNeedsVerification
      ? `Verification link sent to ${changes.email}. Your current email stays active until you confirm.`
      : "Profile updated");
  };
  profileSaveButtons.forEach(button => { button.onclick = saveProfile; });
}

function editProfileNote() {
  const me = api.me();
  const sheet = $("#sheet");
  sheet.classList.add("on");
  sheet.innerHTML = `<div class="panel profile-note-panel"><div class="grab"></div><b>Your note</b>
    <p class="sub">This note appears above your profile photo.</p>
    <textarea class="field" id="note-text" maxlength="80" placeholder="Write a short note…">${esc(me.profileNote || "")}</textarea>
    <div class="note-form-row"><span class="sub" id="note-count"></span>${me.profileNote?.trim() ? `<button type="button" class="sub" id="remove-note">Remove note</button>` : ""}</div>
    <button type="button" class="btn" id="save-note">Save note</button></div>`;
  const input = $("#note-text");
  const updateCount = () => { $("#note-count").textContent = `${input.value.length}/80`; };
  updateCount();
  input.oninput = updateCount;
  let savingNote=false;
  const persistNote=async profileNote=>{
    if(savingNote)return;
    savingNote=true;
    const controls=[$("#save-note"),$("#remove-note")].filter(Boolean);
    controls.forEach(button=>button.disabled=true);
    try{
      if(api.authMode()!=="cloud")throw new Error("Reconnect to save your note online.");
      const current=await api.loadCloudAccountState();
      if(api.me()?.id!==me.id||!input.isConnected)throw new Error("This note editing session has ended.");
      if(!current.profile||typeof current.profile!=="object")throw new Error("Your online profile couldn't load. Try again.");
      const account=api.me();
      const displayName=account?.displayName||account?.name;
      if(!account?.username||!displayName||!account?.email)throw new Error("Your account details couldn't load. Try again.");
      await api.updateCloudAccountProfile({
        username:account.username,
        displayName,
        email:account.email,
        profile:{...current.profile,profileNote},
      });
      if(api.me()?.id!==me.id||api.me()?.profileNote!==profileNote)throw new Error("Your note couldn't be confirmed online. Try again.");
      if(input.isConnected){sheet.classList.remove("on");render();toast(profileNote?"Note saved online":"Note removed");}
    }catch(error){if(input.isConnected)toast(error.message||"Couldn't save your note. Please try again.");}
    finally{savingNote=false;controls.forEach(button=>{if(button.isConnected)button.disabled=false;});}
  };
  $("#save-note").onclick=()=>void persistNote(input.value.trim());
  $("#remove-note")?.addEventListener("click",()=>void persistNote(""));
  sheet.onclick = (e) => { if (!savingNote && e.target === sheet) sheet.classList.remove("on"); };
}
// Full-screen media browsing uses the browser's vertical scroll and snap behavior.
function bindExploreViewerSwipe(id, source = "explore") {
  bindExploreViewerSwipe.offKey?.();
  bindExploreViewerSwipe.offKey = null;
  const screen = app.querySelector(".post-viewer-screen");
  const feed = screen?.querySelector(".post-viewer-feed");
  if (!screen || !feed) return;
  const mediaViewer = screen.classList.contains("post-viewer-media");
  let activeId = id;
  const places = source === "places";
  screen.classList.add(places ? "post-viewer-place-swipe" : "post-viewer-explore");
  // Places: browse placeFeed.posts plus a viewer-only queue of extra ids (global feed untouched).
  const placeKey = placeFeed.key;
  if (places && bindExploreViewerSwipe.placeQueue?.key !== placeKey) {
    bindExploreViewerSwipe.placeQueue = { key: placeKey, ids: [], nextOffset: null, hasMore: null, loading: null };
  }
  const queue = bindExploreViewerSwipe.placeQueue;
  const placeIds = () => [...new Set([...placeFeed.posts.map(post => post.id), ...(queue?.ids || [])])];
  const placeNeighbor = (offset, fromId = id) => { const ids = placeIds(); const i = ids.indexOf(fromId); return i < 0 ? null : ids[i + offset] || null; };
  const fetchMorePlacePosts = async (fromId = activeId) => {
    const hasMore = queue.hasMore ?? placeFeed.hasMore;
    if (!hasMore || !selectedPlace?.id) return null;
    queue.loading ||= (async () => {
      const query = new URLSearchParams({ offset: String(queue.nextOffset ?? placeFeed.nextOffset ?? 0), limit: "18",
        sort: placeProfileTab === "recent" ? "recent" : "top", placeId: selectedPlace.id, label: selectedPlace.label || "" });
      const result = await requestCloudApi(`/api/places/feed?${query}`);
      const cached = api.cacheCloudExplorePosts(Array.isArray(result?.posts) ? result.posts : []);
      const known = new Set(placeIds());
      queue.ids.push(...cached.map(post => post.id).filter(postId => !known.has(postId)));
      queue.hasMore = result?.hasMore === true;
      queue.nextOffset = Number.isSafeInteger(result?.nextOffset) ? result.nextOffset : (queue.nextOffset ?? placeFeed.nextOffset ?? 0) + cached.length;
    })().finally(() => { queue.loading = null; });
    await queue.loading;
    return placeNeighbor(1, fromId);
  };
  let settleTimer = 0;
  let loading = false;
  let loadObserver = null;
  const pendingMarkup = () => `<div class="post-viewer-next-pending" data-viewer-next-pending role="status">Loading more posts…</div>`;
  const loadPending = async sentinel => {
    if (!sentinel?.isConnected || loading || !screen.isConnected || viewerSource !== source) return;
    loading = true;
    screen.setAttribute("aria-busy", "true");
    try {
      const cursorId = sentinel.previousElementSibling?.matches?.(".clip[data-id]")
        ? sentinel.previousElementSibling.dataset.id
        : activeId;
      const targetId = places ? await fetchMorePlacePosts(cursorId) : await exploreEco.ensureNext(cursorId);
      if (!sentinel.isConnected || !screen.isConnected || viewerSource !== source) return;
      if (!targetId) {
        sentinel.textContent = "You’re all caught up.";
        sentinel.classList.add("is-ended");
        sentinel.removeAttribute("data-viewer-next-pending");
        return;
      }
      const existing = [...feed.querySelectorAll(":scope > .clip[data-id]")].some(card => card.dataset.id === targetId);
      if (existing) {
        sentinel.remove();
        return;
      }
      let post = api.post(targetId);
      if (!post) {
        try {
          await api.loadCloudPost(targetId);
          post = api.post(targetId);
        }
        catch { post = null; }
      }
      if (!post || !api.canSeePost(post) || !sentinel.isConnected) {
        sentinel.removeAttribute("data-viewer-next-pending");
        sentinel.innerHTML = `<button type="button" data-viewer-next-retry>Couldn't load the next post. Try again.</button>`;
        sentinel.querySelector("[data-viewer-next-retry]")?.addEventListener("click", () => void loadPending(sentinel), { once: true });
        return;
      }
      sentinel.outerHTML = postCard(post, "detail", { mediaViewer }) + pendingMarkup();
      const addedCard = viewerCards().find(card => card.dataset.id === targetId);
      bindPosts({ observe: false });
      addedCard?.querySelectorAll("video").forEach(video => feedObserver?.observe(video));
      const nextSentinel = feed.querySelector(":scope > [data-viewer-next-pending]:last-child");
      if (nextSentinel && loadObserver) loadObserver.observe(nextSentinel);
      feed.querySelectorAll(".clip[data-id] video").forEach(video => {
        if (video.closest(".clip")?.dataset.id !== activeId) video.pause();
      });
    } catch (error) {
      if (sentinel.isConnected) {
        sentinel.removeAttribute("data-viewer-next-pending");
        sentinel.innerHTML = `<button type="button" data-viewer-next-retry>${esc(error?.message || "Couldn't load more posts. Try again.")}</button>`;
        sentinel.querySelector("[data-viewer-next-retry]")?.addEventListener("click", () => void loadPending(sentinel), { once: true });
      }
    } finally {
      loading = false;
      screen.removeAttribute("aria-busy");
    }
  };
  const viewerCards = () => [...feed.querySelectorAll(":scope > .clip[data-id]")];
  const appendSearchNext = () => {
    if (source !== "search") return;
    const cards = viewerCards();
    const activeIndex = cards.findIndex(card => card.dataset.id === activeId);
    if (activeIndex < cards.length - 2 || !cards.length) return;
    const lastId = cards[cards.length - 1].dataset.id;
    const nextId = viewerAdjacentPostIds(lastId, source).nextId;
    if (!nextId || cards.some(card => card.dataset.id === nextId)) return;
    const post = api.post(nextId);
    if (!post || !api.canSeePost(post)) return;
    feed.insertAdjacentHTML("beforeend", postCard(post, "detail", { mediaViewer }));
    const addedCard = viewerCards().find(card => card.dataset.id === nextId);
    bindPosts({ observe: false });
    addedCard?.querySelectorAll("video").forEach(video => feedObserver?.observe(video));
  };
  const appendMoreSentinel = () => {
    if (source === "search" || feed.querySelector(":scope > [data-viewer-next-pending]")) return;
    const cards = viewerCards();
    const activeIndex = cards.findIndex(card => card.dataset.id === activeId);
    if (!cards.length || activeIndex < cards.length - 2) return;
    const lastId = cards[cards.length - 1].dataset.id;
    const hasMore = places
      ? (queue?.hasMore ?? placeFeed.hasMore) === true
      : viewerAdjacentPostIds(lastId, source).hasMore;
    if (!hasMore) return;
    feed.insertAdjacentHTML("beforeend", pendingMarkup());
    const sentinel = feed.querySelector(":scope > [data-viewer-next-pending]:last-child");
    if (sentinel && loadObserver) loadObserver.observe(sentinel);
  };
  const appendAhead = () => {
    appendSearchNext();
    appendMoreSentinel();
  };
  const onScroll = () => {
    clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      if (!screen.isConnected || document.querySelector(".sheet.on")) return;
      const feedRect = feed.getBoundingClientRect();
      const center = feedRect.top + feed.clientHeight / 2;
      const cards = [...feed.querySelectorAll(":scope > .clip[data-id]")];
      let active = null;
      let distance = Infinity;
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const nextDistance = Math.abs(rect.top + rect.height / 2 - center);
        if (nextDistance < distance) { active = card; distance = nextDistance; }
      }
      const activePost = active && api.post(active.dataset.id);
      if (active && activePost && distance < feed.clientHeight * .3 && active.dataset.id !== activeId &&
          api.canSeePost(activePost)) {
        activeId = active.dataset.id;
        viewer = activeId;
        feed.querySelectorAll("video").forEach(video => {
          if (video.closest(".clip")?.dataset.id !== activeId) video.pause();
        });
        const contextMarkup = `<section class="${[...screen.classList].filter(name => name !== "motion-screen-enter").join(" ")}">`;
        screen.dataset.scrollContext = screenScrollContext(contextMarkup);
        if (screen.classList.contains("post-viewer-media")) bindMediaViewerComments(activeId);
        appendAhead();
      }
      const sentinel = feed.querySelector("[data-viewer-next-pending]");
      if (sentinel) {
        const rect = sentinel.getBoundingClientRect();
        if (rect.top < feedRect.bottom + feed.clientHeight * .5) void loadPending(sentinel);
      }
    }, 120);
  };
  feed.addEventListener("scroll", onScroll, { passive: true });
  feed.addEventListener("keydown", event => {
    if (event.key === "ArrowDown" || event.key === "PageDown") feed.scrollBy({ top: feed.clientHeight, behavior: "smooth" });
    else if (event.key === "ArrowUp" || event.key === "PageUp") feed.scrollBy({ top: -feed.clientHeight, behavior: "smooth" });
  });
  if ("IntersectionObserver" in window) {
    loadObserver = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) void loadPending(entry.target);
    }, { root: feed, rootMargin: "50% 0px" });
    feed.querySelectorAll("[data-viewer-next-pending]").forEach(sentinel => loadObserver.observe(sentinel));
  }
  feed.querySelectorAll(".clip[data-id] video").forEach(video => {
    if (video.closest(".clip")?.dataset.id !== activeId) video.pause();
  });
  appendAhead();
  bindExploreViewerSwipe.offKey = () => {
    clearTimeout(settleTimer);
    loadObserver?.disconnect();
    feed.removeEventListener("scroll", onScroll);
    if (bindExploreViewerSwipe.offKey) bindExploreViewerSwipe.offKey = null;
  };
}
// Search/Discover media viewer: real recent comments float over the media, inline composer below.
const MEDIA_VIEWER_COMMENTS_EVENT = "oldtime:media-viewer-comments";
function notifyMediaViewerComments(postId) {
  document.dispatchEvent(new CustomEvent(MEDIA_VIEWER_COMMENTS_EVENT, { detail: { postId } }));
}
function bindMediaViewerComments(id) {
  bindMediaViewerComments.cleanup?.();
  bindMediaViewerComments.cleanup = null;
  const clip = [...app.querySelectorAll(".post-viewer-media .clip.post-detail")].find(item => item.dataset.id === id);
  const form = $("#post-viewer-composer");
  if (!clip || !form) return;
  const commentSession = `${api.cloudAccountId() || api.me()?.id || "guest"}:${id}`;
  if (bindMediaViewerComments.session !== commentSession) {
    bindMediaViewerComments.session = commentSession;
    bindMediaViewerComments.seen = new Set();
  }
  // Same-media soft backdrop so the contained foreground never sits on empty bands.
  const still = clip.querySelector(":scope > .fullimg, :scope > .post-carousel .fullimg");
  const backdropSrc = still?.currentSrc || still?.getAttribute("src") || clip.querySelector(":scope > video")?.getAttribute("poster") || "";
  if (backdropSrc && !isLocalMedia(backdropSrc) && !clip.querySelector(":scope > .post-viewer-media-backdrop")) {
    const backdrop = document.createElement("img");
    backdrop.className = "post-viewer-media-backdrop";
    backdrop.alt = ""; backdrop.setAttribute("aria-hidden", "true");
    backdrop.src = backdropSrc;
    clip.prepend(backdrop);
  }
  const info = clip.querySelector(":scope > .post-viewer-media-info") || document.createElement("div");
  info.classList.add("post-viewer-media-info");
  const meta = info.querySelector(":scope > .meta") || clip.querySelector(":scope > .meta");
  const soundbar = info.querySelector(":scope > .soundbar") || clip.querySelector(":scope > .soundbar");
  if (meta && meta.parentElement !== info) info.append(meta);
  if (soundbar && clip.querySelector(":scope > video") && soundbar.parentElement !== info) info.append(soundbar);
  else if (soundbar && !clip.querySelector(":scope > video")) soundbar.remove();
  const overlay = document.createElement("div");
  overlay.className = "post-viewer-comment-overlay";
  overlay.setAttribute("aria-label", "Recent comments");
  info.prepend(overlay);
  if (!info.isConnected) clip.append(info);
  let loading = Boolean(api.cloudPost(id)), failed = false;
  const current = () => overlay.isConnected && viewer === id;
  const rowNodes = new Map();
  const historyButton = document.createElement("button");
  historyButton.type = "button";
  historyButton.className = "pvc-history";
  historyButton.dataset.pvcOpen = "";
  historyButton.textContent = "View comments";
  historyButton.hidden = true;
  overlay.setAttribute("role", "log");
  overlay.setAttribute("aria-live", "polite");
  const visibility = createTransientComments({ seenIds: bindMediaViewerComments.seen, onChange: () => {
    if (!current()) { cleanup(); return; }
    let visible = 0;
    for (const [commentId, row] of rowNodes) {
      const phase = visibility.phase(commentId);
      row.hidden = phase === "hidden";
      row.classList.toggle("pvc-leaving", phase === "leaving");
      if (phase !== "hidden") visible++;
    }
    historyButton.hidden = true; // Use the existing comment action to read the complete history.
  } });
  const draw = () => {
    if (!current()) return;
    const post = api.post(id);
    const list = (post?.comments || []).slice(visibility.isReading() ? -30 : -3);
    if (loading && !list.length) { overlay.innerHTML = `<span class="pvc-skel"></span><span class="pvc-skel short"></span>`; return; }
    if (failed && !list.length) { overlay.innerHTML = `<button type="button" class="pvc-row pvc-retry" data-pvc-retry>Comments didn’t load. Retry</button>`; return; }
    const wasReading = visibility.isReading(), fromBottom = overlay.scrollHeight - overlay.scrollTop;
    const ids = new Set(list.map(comment => String(comment.id)));
    for (const [commentId, row] of rowNodes) if (!ids.has(commentId)) { row.remove(); rowNodes.delete(commentId); }
    overlay.querySelectorAll(".pvc-skel,.pvc-retry").forEach(row => row.remove());
    for (const comment of list) {
      const author = api.user(comment.author) || { username: "member" };
      const html = `<b>@${esc(author.username)}</b> <span>${renderMentionText(String(comment.body || comment.text || ""))}</span>`;
      const commentId = String(comment.id);
      let row = rowNodes.get(commentId);
      if (!row) {
        row = document.createElement("div");
        row.className = `pvc-row${visibility.hasSeen(commentId) ? "" : " pvc-entering"}`;
        row.addEventListener("animationend", () => row.classList.remove("pvc-entering"), { once: true });
        row.dataset.pvcOpen = ""; row.dataset.pvcId = commentId;
        rowNodes.set(commentId, row);
      }
      if (row.dataset.content !== html) { row.innerHTML = html; row.dataset.content = html; }
      overlay.append(row);
    }
    overlay.append(historyButton);
    visibility.sync([...ids]);
    overlay.scrollTop = wasReading ? Math.max(0, overlay.scrollHeight - fromBottom) : overlay.scrollHeight;
  };
  const readComments = event => {
    visibility.read();
    if (event.type === "wheel" || event.type === "touchmove") draw();
  };
  for (const event of ["pointerdown", "wheel", "touchmove", "focusin"]) overlay.addEventListener(event, readComments, { passive: true });
  const load = () => {
    if (!api.cloudPost(id)) { loading = false; draw(); return; }
    loading = true; failed = false; draw();
    api.loadCloudPostComments(id).then(() => { failed = false; }).catch(() => { failed = true; }).finally(() => { loading = false; draw(); });
  };
  overlay.onclick = async event => {
    event.stopPropagation();
    if (event.target.closest("[data-mention-handle]")) return;
    if (event.target.closest("[data-pvc-retry]")) return load();
    const del = event.target.closest("[data-pvc-del]");
    if (del) {
      if (!confirm("Delete this comment?")) return;
      del.disabled = true;
      try { await api.deleteCloudPostComment(id, del.dataset.pvcDel); draw(); }
      catch (error) { del.disabled = false; toast(error.message || "Couldn’t delete that comment."); }
      return;
    }
    if (event.target.closest("[data-pvc-open]")) comments(id);
  };
  form.onsubmit = async event => {
    event.preventDefault();
    const input = $("#post-viewer-composer-input");
    const send = form.querySelector("button[type=submit]");
    const body = input.value.trim();
    if (!body) return input.focus();
    if (!api.cloudPost(id)) return comments(id);
    send.disabled = true;
    try {
      const created = await api.createCloudPostComment(id, { body, parentId: null });
      if (!current()) return;
      input.value = "";
      draw();
      showFeedCommentPreview(id, { author: api.me()?.id, body, created: created?.createdAt || Date.now() });
    } catch (error) { toast(error.message || "Couldn’t add your comment online."); }
    finally { send.disabled = false; }
  };
  const onChange = event => {
    if (!overlay.isConnected) return cleanup();
    if (event.detail?.postId === id) draw();
  };
  const cleanup = () => {
    visibility.dispose();
    for (const event of ["pointerdown", "wheel", "touchmove", "focusin"]) overlay.removeEventListener(event, readComments);
    document.removeEventListener(MEDIA_VIEWER_COMMENTS_EVENT, onChange);
    overlay.remove();
    if (bindMediaViewerComments.cleanup === cleanup) bindMediaViewerComments.cleanup = null;
  };
  document.addEventListener(MEDIA_VIEWER_COMMENTS_EVENT, onChange);
  bindMediaViewerComments.cleanup = cleanup;
  load();
}
// Followers/Following list visibility (server authoritative, saved immediately; counts always remain visible).
let listVisibilitySetting = { owner: "", status: "idle", value: { ...DEFAULT_LIST_VISIBILITY }, error: "" };
function listVisibilitySettingsMarkup() {
  const owner = api.cloudAccountId() || "";
  if (listVisibilitySetting.owner !== owner) listVisibilitySetting = { owner, status: "idle", value: { ...DEFAULT_LIST_VISIBILITY }, error: "" };
  const { status, value, error } = listVisibilitySetting;
  const disabled = status !== "ready" ? " disabled" : "";
  const row = (kind, label) => `<button type="button" class="listbtn" data-list-visibility="${kind}" data-testid="button-toggle-${kind}-list" aria-pressed="${value[kind]}"${disabled}>${label} · ${status === "ready" ? (value[kind] ? "Visible" : "Hidden") : "…"}</button>`;
  return `<div class="profile-visibility-settings list-visibility-settings" data-list-visibility-status="${status}">
    <b>Who can see your lists</b>
    ${row("followers", "Followers list")}
    ${row("following", "Following list")}
    <p class="sub">${status === "error" ? `${esc(error)} <button type="button" data-list-visibility-retry>Try again</button>` : "Counts always show. You can always see both lists on your own profile."}</p>
  </div>`;
}
function bindListVisibilitySettings() {
  const owner = api.cloudAccountId() || "";
  if (!owner || api.authMode() !== "cloud") return;
  const redraw = () => {
    const block = app.querySelector(".list-visibility-settings");
    if (!block || api.cloudAccountId() !== owner || settingsView !== "privacy") return;
    block.outerHTML = listVisibilitySettingsMarkup();
    bindListVisibilitySettings();
  };
  const load = () => {
    listVisibilitySetting = { ...listVisibilitySetting, owner, status: "loading", error: "" };
    fetchListVisibility().then(value => {
      if (listVisibilitySetting.owner !== owner) return;
      listVisibilitySetting = { owner, status: "ready", value, error: "" };
    }).catch(failure => {
      if (listVisibilitySetting.owner !== owner) return;
      listVisibilitySetting = { ...listVisibilitySetting, status: "error", error: failure?.message || "List visibility could not be loaded." };
    }).finally(redraw);
  };
  if (listVisibilitySetting.owner === owner && listVisibilitySetting.status === "idle") { load(); redraw(); return; }
  app.querySelector("[data-list-visibility-retry]")?.addEventListener("click", () => { load(); redraw(); });
  app.querySelectorAll("[data-list-visibility]").forEach(button => button.onclick = async () => {
    if (listVisibilitySetting.status !== "ready") return;
    const kind = button.dataset.listVisibility;
    const next = { ...listVisibilitySetting.value, [kind]: !listVisibilitySetting.value[kind] };
    listVisibilitySetting = { ...listVisibilitySetting, status: "saving" };
    redraw();
    try {
      const saved = await saveListVisibility(next);
      if (listVisibilitySetting.owner !== owner) return;
      listVisibilitySetting = { owner, status: "ready", value: saved, error: "" };
      toast(`${kind === "followers" ? "Followers" : "Following"} list ${saved[kind] ? "visible to others" : "hidden from others"}`);
    } catch (failure) {
      if (listVisibilitySetting.owner !== owner) return;
      listVisibilitySetting = { ...listVisibilitySetting, status: "ready" };
      toast(failure?.message || "List visibility could not be saved.");
    }
    redraw();
  });
}
function viewerAdjacentPostIds(id, source) {
  if (source === "explore") {
    return {
      previousId: exploreEco.previousBefore(id),
      nextId: exploreEco.preloadNext(id),
      hasMore: true,
    };
  }
  if (source === "places") {
    const queue = bindExploreViewerSwipe.placeQueue?.key === placeFeed.key
      ? bindExploreViewerSwipe.placeQueue : null;
    const ids = [...new Set([...placeFeed.posts.map(post => post.id), ...(queue?.ids || [])])];
    const index = ids.indexOf(id);
    return {
      previousId: index > 0 ? ids[index - 1] : null,
      nextId: index >= 0 ? ids[index + 1] || null : null,
      hasMore: (queue?.hasMore ?? placeFeed.hasMore) === true,
    };
  }
  if (source === "search") {
    const query = searchQ.trim().toLowerCase().replace(/^[@#]/, "");
    const ids = api.posts().filter(post => {
      if (!["photo", "video", "carousel"].includes(post.kind) ||
          isCommunitySurfaceMediaPost(post) || !api.canSeePost(post)) return false;
      if (!query) return true;
      const author = api.user(post.author);
      const text = [post.caption, ...(post.tags || []), author?.username, author?.name]
        .filter(Boolean).join(" ").toLowerCase();
      return text.includes(query);
    }).map(post => post.id);
    if (!ids.includes(id)) ids.push(id);
    const index = ids.indexOf(id);
    return {
      previousId: index > 0 ? ids[index - 1] : null,
      nextId: index >= 0 ? ids[index + 1] || null : null,
      hasMore: false,
    };
  }
  return { previousId: null, nextId: null, hasMore: false };
}
function postViewer(id) {
  const p = api.post(id);
  if (!p || !api.canSeePost(p)) { viewer = null; viewerSource = ""; render(); toast("Post unavailable"); return; }
  const author = api.user(p.author) || { id: p.author, username: "member", name: "Oldtime member", avatar: "" };
  const me = api.me();
  const following = (me?.following || []).includes(author.id);
  const requested = (api.db().requests || []).some(request => request.from === me?.id && request.to === author.id);
  const fromPlaces = viewerSource === "places";
  const exploreViewer = ["explore", "search"].includes(viewerSource);
  const hasViewerMedia = Boolean(profilePostMedia(p).length || p.creativeProject);
  const mediaViewer = !fromPlaces && hasViewerMedia && (["photo","video","carousel"].includes(p.kind) || exploreViewer);
  const adjacent = viewerAdjacentPostIds(id, viewerSource);
  const previousPost = adjacent.previousId && adjacent.previousId !== id ? api.post(adjacent.previousId) : null;
  const nextPost = adjacent.nextId && adjacent.nextId !== id ? api.post(adjacent.nextId) : null;
  const viewerCards = [previousPost, p, nextPost].filter((post, index, posts) =>
    post && api.canSeePost(post) && posts.findIndex(candidate => candidate?.id === post.id) === index);
  const initialFeedIndex = Math.max(0, viewerCards.findIndex(post => post.id === id));
  const feedTail = !nextPost && adjacent.hasMore
    ? `<div class="post-viewer-next-pending" data-viewer-next-pending role="status">Loading more posts…</div>`
    : "";
  shell(`<section class="screen on post-viewer-screen${fromPlaces ? " post-viewer-place" : ""}${mediaViewer ? " post-viewer-media" : ""}${exploreViewer ? " post-viewer-explore" : ""}">
    <header class="post-viewer-topbar">
      <button type="button" class="post-viewer-back" id="post-viewer-back" aria-label="Back">${ic.back}</button>
      ${fromPlaces
        ? `<span class="post-viewer-place-title">Post</span>`
        : mediaViewer
        ? ""
        : `<button type="button" class="post-viewer-avatar" id="post-viewer-avatar" aria-label="Open @${esc(author.username)}'s Story or profile"><img ${profileMediaSource(author.avatar || "")} alt="" /></button>
           <button type="button" class="post-viewer-identity" id="post-viewer-profile"><b>${esc(author.name || author.username)}</b><small>@${esc(author.username)}</small></button>
            ${author.id !== me?.id && !following ? `<button type="button" class="post-viewer-follow" id="post-viewer-follow" aria-pressed="false">${requested ? "Requested" : "Follow"}</button>` : ""}`}
    </header>
    <div class="post-viewer-feed" data-initial-index="${initialFeedIndex}" tabindex="0" aria-label="Scrollable posts">
      ${viewerCards.map(post => postCard(post, "detail", { mediaViewer })).join("")}${feedTail}
    </div>
    ${fromPlaces
      ? `<footer class="post-viewer-place-footer"><button type="button" id="post-viewer-place-profile">View Profile</button></footer>`
      : mediaViewer
      ? `<footer class="post-viewer-footer post-viewer-composer">
          <form class="post-viewer-composer-form" id="post-viewer-composer">
            <img src="${esc(api.me()?.avatar || "")}" alt="" />
            <input id="post-viewer-composer-input" type="text" maxlength="2200" autocomplete="off" placeholder="Add a comment…" aria-label="Add a comment" />
            <button type="submit" class="post-viewer-footer-send" aria-label="Send comment">${ic.send}</button>
          </form>
        </footer>`
      : `<footer class="post-viewer-footer">
          <button type="button" class="post-viewer-comment-launch" id="post-viewer-comment" aria-label="Add a comment">
            <img src="${esc(api.me()?.avatar || "")}" alt="" /><span>Add a comment…</span>
          </button>
          <button type="button" class="post-viewer-footer-send" id="post-viewer-comment-send" aria-label="Open comments">${ic.send}</button>
        </footer>`}
  </section>`, mediaViewer || (fromPlaces && hasViewerMedia) ? "dark" : "light", { hideNav: true });
  const viewerFeed = app.querySelector(".post-viewer-feed");
  if (viewerFeed && initialFeedIndex) {
    requestAnimationFrame(() => {
      if (viewerFeed.isConnected) viewerFeed.scrollTop = initialFeedIndex * viewerFeed.clientHeight;
    });
  }
  $("#post-viewer-back").onclick = () => {
    if (fromPlaces) {
      const stackedPlaceState = [...navigationStack].reverse()
        .find(state => state?.tab === "updates" && state.homeView === "nearby" && state.selectedPlace);
      const placeState = placesViewerReturnState || stackedPlaceState || (selectedPlace
        ? { ...captureNavigationState(), tab: "updates", homeView: "nearby", profileId: null, viewer: null, viewerSource: "", selectedPlace: { ...selectedPlace } }
        : null);
      if (placeState) {
        let returnStackDepth = placesViewerReturnStackDepth;
        if (!Number.isInteger(returnStackDepth) && stackedPlaceState) {
          returnStackDepth = navigationStack.lastIndexOf(stackedPlaceState);
        }
        placesViewerReturnState = null;
        placesViewerReturnStackDepth = null;
        if (Number.isInteger(returnStackDepth)) navigationStack.length = Math.min(navigationStack.length, returnStackDepth);
        notificationsOrigin = null;
        notificationsReturnStack = [];
        restoreNavigationState({
          ...placeState,
          tab: "updates",
          homeView: "nearby",
          homeTopic: "all",
          profileId: null,
          viewer: null,
          viewerSource: "",
          settingsView: "home",
          selectedPlace: placeState.selectedPlace || (selectedPlace ? { ...selectedPlace } : null),
        });
        render();
        return;
      }
    }
    if (backFromNotificationDetail()) return;
    if (navigateBack()) return;
    viewer = null;
    render();
  };
  $("#post-viewer-avatar")?.addEventListener("click", () => openPersonAvatar(author.id));
  $("#post-viewer-profile")?.addEventListener("click", () => navigateToProfile(author.id));
  $("#post-viewer-place-profile")?.addEventListener("click", () => navigateToProfile(author.id));
  $("#post-viewer-follow")?.addEventListener("click", () => void follow(author.id));
  const openComments = () => comments(id);
  $("#post-viewer-comment")?.addEventListener("click", openComments);
  $("#post-viewer-comment-send")?.addEventListener("click", openComments);
  bindPosts();
  if (mediaViewer) bindMediaViewerComments(id);
  else bindMediaViewerComments.cleanup?.();
  unbindSearchPlayback?.();
  unbindSearchPlayback = null;
  if (viewerSource === "search" && viewerSearchQuery && api.authMode() === "cloud" && viewerFeed && searchPlayback.start(viewerSearchQuery, api.cloudAccountId() || "")) {
    unbindSearchPlayback = searchPlayback.bind(viewerFeed, video => {
      const clipId = video.closest(".clip[data-id]")?.dataset.id;
      const clipPost = clipId && clipId === viewer && viewerSource === "search" ? api.post(clipId) : null;
      return clipPost && (clipPost.kind === "video" || postHasVideo(clipPost)) ? clipId : "";
    });
  } else searchPlayback.stop();
  if (["explore", "search"].includes(viewerSource)) bindExploreViewerSwipe(id, viewerSource);
  else if (fromPlaces) bindExploreViewerSwipe(id, "places");
  else { bindExploreViewerSwipe.offKey?.(); }
  if (fromPlaces) app.querySelectorAll(".post-viewer-place [data-place-explore]").forEach(chip => chip.onclick = event => {
    event.stopPropagation();
    if (selectedPlace?.id && chip.dataset.placeId === selectedPlace.id) {
      if (navigateBack()) return;
      viewer = null; viewerSource = ""; render(); return;
    }
    selectPlace({ id: chip.dataset.placeId, label: chip.dataset.placeExplore, source: chip.dataset.placeSource,
      category: chip.dataset.placeCategory, address: chip.dataset.placeAddress, lat: chip.dataset.placeLat, lon: chip.dataset.placeLon });
  });
  if (pendingSharedComment && params.get("post") === id) {
    const commentId = pendingSharedComment;
    pendingSharedComment = "";
    comments(id, commentId);
  }
}
function chats() {
  const request = chatRenderGeneration;
  const open = module => {
    if (request !== chatRenderGeneration || tab !== "chat" || chatId) return;
    module.openChatList({
      shell, toast, esc, ago, app, $: (q) => $(q), render,
      setChat: (id) => { chatId = id; render(); },
      openProfile: id => navigateToProfile(id, { fromChat: true }),
      openStory: (authorId, storyId) => openStory(authorId, storyId),
      createStory: ({ source } = {}) => openUniversalCreation({
        destination: "story", startCamera: source !== "gallery" && source !== "text", mediaPicker: source === "gallery", startText: source === "text",
      }),
      editProfileNote
    });
  };
  if (loadedChatModule) return open(loadedChatModule);
  return loadChatModule().then(open).catch(error => {
    if (request === chatRenderGeneration && tab === "chat" && !chatId) {
      toast(error.message || "Messages could not be opened.");
    }
  });
}
function thread(id) {
  const request = chatRenderGeneration;
  const open = module => {
    if (request !== chatRenderGeneration || tab !== "chat" || chatId !== id) return;
    module.openThread(id, {
      shell, toast, esc, ago, app, $: (q) => $(q), render,
      setChat: (nextId) => { chatId = nextId; render(); },
      openProfile: uid => navigateToProfile(uid, { fromChat: true }),
      openSharedPost: openPostViewer
    });
  };
  if (loadedChatModule) return open(loadedChatModule);
  return loadChatModule().then(open).catch(error => {
    if (request === chatRenderGeneration && tab === "chat" && chatId === id) {
      toast(error.message || "Messages could not be opened.");
    }
  });
}

function isCloseFriendsStory(story) {
  const visibility = String(story?.visibility || story?.audience || "").toLowerCase().replace(/_/g, "-");
  return story?.closeFriends === true || visibility === "close-friends";
}

async function loadCommunityDiscovery(ownerId, { force = false } = {}) {
  if (!ownerId || api.authMode() !== "cloud") return;
  if (communityDiscovery.ownerId !== ownerId) {
    communityDiscovery = {
      ownerId, loading: false, videos: [], people: [], posts: [], topics: [], emergingTopics: [], trends: [],
      videosError: "", peopleError: "", recommendationsError: "", trendsError: "", fetchedAt: 0,
    };
  }
  if (communityDiscovery.loading || (!force && Date.now() - communityDiscovery.fetchedAt < COMMUNITY_DISCOVERY_CACHE_MS)) return;
  const requestId = ++communityDiscoveryRequestId;
  communityDiscovery = {
    ...communityDiscovery, loading: true, videosError: "", peopleError: "",
    recommendationsError: "", trendsError: "",
  };
  try {
    const result = await api.loadCloudCommunityDiscovery();
    if (requestId !== communityDiscoveryRequestId || api.cloudAccountId() !== ownerId) return;
    communityDiscovery = {
      ownerId,
      loading: false,
      videos: result.videos,
      people: result.people,
      posts: result.posts,
      topics: result.topics,
      emergingTopics: result.emergingTopics,
      trends: result.trends,
      videosError: result.videosError,
      peopleError: result.peopleError,
      recommendationsError: result.recommendationsError,
      trendsError: result.trendsError,
      fetchedAt: Date.now(),
    };
  } catch (error) {
    if (requestId !== communityDiscoveryRequestId || api.cloudAccountId() !== ownerId) return;
    communityDiscovery = {
      ...communityDiscovery,
      loading: false,
      videosError: error?.message || "Trending videos could not be loaded.",
      peopleError: error?.message || "People suggestions could not be loaded.",
      recommendationsError: error?.message || "Personalized posts could not be loaded.",
      trendsError: error?.message || "Interest trends could not be loaded.",
      fetchedAt: Date.now(),
    };
  }
  if (tab === "communities" && api.cloudAccountId() === ownerId) render();
}

function communities() {
  const communityAccount = api.cloudAccountId() || "";
  if (api.authMode() === "cloud") {
    if (!communityFeedsModule) {
      shell(`<section class="screen on community-screen">
        <header class="community-header"><h1>Community</h1><div class="community-header-actions">
          <button type="button" class="community-new-post compose-trigger" id="community-note-open" aria-label="New post">${icon("plus")}</button>
        </div></header>
        <div class="cf-feed-header"><nav class="cf-feed-tabs" aria-label="Community feeds">
          <button type="button" disabled>Following</button><button type="button" aria-current="page" disabled>Discover</button>
          <button type="button" disabled>Popular</button><button type="button" disabled>Mutuals / Friends</button>
        </nav><button type="button" class="cf-controls" aria-label="Feed controls loading" disabled>${icon("sliders")}</button></div>
        <p class="community-feed-status" role="status">${communityFeedsLoadError ? esc(communityFeedsLoadError) : "Opening Community…"}${communityFeedsLoadError ? '<button type="button" id="community-module-retry">Try again</button>' : ""}</p></section>`, "light");
      $("#community-search-open")?.addEventListener("click", openCommunitySearch);
      $("#community-note-open")?.addEventListener("click", openCommunityNoteComposer);
      const load = () => {
        if (communityFeedsLoading) return;
        communityFeedsLoading = import("./community-feeds.js").then(module => {
          communityFeedsModule = module; communityFeedsLoadError = "";
          if (tab === "communities" && !isComposing()) render();
        }).catch(error => {
          communityFeedsLoadError = error?.message || "Community couldn’t open.";
          if (tab === "communities" && !isComposing()) render();
        }).finally(() => { communityFeedsLoading = null; });
      };
      if (!communityFeedsLoadError) load();
      $("#community-module-retry")?.addEventListener("click", load);
      return;
    }
    return communityFeedsModule.renderCommunityFeeds({
      api, requestCloudApi, app, shell, esc, icon, toast, renderPost: communityPostCard, bindPosts: () => { bindPosts(); bindCommunityMediaOpen(); },
      onProfile: navigateToProfile, onFollow: follow,
      refresh: render, isActive: () => tab === "communities", onCompose: openCommunityNoteComposer,
      onSearch: () => {
        navigationStack.push(captureNavigationState());tab = "search";searchSection = "search";discoveryTopic = "";render();
        requestAnimationFrame(() => $("#q")?.focus({preventScroll:true}));
      },
    });
  }
  const me = api.me();
  const communityOwnerId = api.cloudAccountId() || me.id;
  if (api.authMode() === "cloud") {
    if (communityDiscovery.ownerId !== communityOwnerId) {
      communityDiscoveryRequestId += 1;
      communityDiscovery = {
        ownerId: communityOwnerId, loading: false, videos: [], people: [], posts: [], topics: [], emergingTopics: [], trends: [],
        videosError: "", peopleError: "", recommendationsError: "", trendsError: "", fetchedAt: 0,
      };
    }
    if (communityView === "for-you" &&
      (!communityDiscovery.fetchedAt || Date.now() - communityDiscovery.fetchedAt >= COMMUNITY_DISCOVERY_CACHE_MS)) {
      void loadCommunityDiscovery(communityOwnerId);
    }
  } else if (communityDiscovery.ownerId !== communityOwnerId) {
    communityDiscoveryRequestId += 1;
    communityDiscovery = {
      ownerId: communityOwnerId, loading: false, videos: [], people: [], posts: [], topics: [], emergingTopics: [], trends: [],
      videosError: "", peopleError: "", recommendationsError: "", trendsError: "", fetchedAt: 0,
    };
  }
  const desiredCommunitySurface = communityView === "following" ? "community-following" : "community";
  if (communityTopicOwner !== communityOwnerId) {
    communityTopicOwner = communityOwnerId;
    communityTopic = "";
  }
  const initialCloudStatus = api.cloudCommunityFeedStatus();
  const startingCloudLoad = api.authMode() === "cloud" &&
    (!initialCloudStatus.loaded || initialCloudStatus.surface !== desiredCommunitySurface) &&
    !initialCloudStatus.loading &&
    (!initialCloudStatus.error || initialCloudStatus.surface !== desiredCommunitySurface);
  if (startingCloudLoad) {
    void api.refreshCloudCommunityFeed(communityView === "following").then(() => {
      if (tab === "communities") render();
    }).catch(() => {
      if (tab === "communities") render();
    });
  }
  const cloudStatus = api.cloudCommunityFeedStatus();
  const followed = new Set(me.following || []);
  const rankedPosts = api.authMode() === "cloud"
    ? api.ranked(desiredCommunitySurface)
    : api.ranked("foryou").filter(isCommunitySurfacePost);
  const communitySourcePosts = api.authMode() === "cloud"
    ? rankedPosts
    : communityView === "following"
      ? followingPosts(rankedPosts, me)
      : rankedPosts;
  const communityPosts = communitySourcePosts;
  const myInterests = new Set(Array.isArray(me.interests) ? me.interests : []);
  const canMatchMyInterests = me.profileVisibility?.interests !== false;
  const canMatchMyCity = me.profileVisibility?.city !== false;
  const suggestedPeople = api.authMode() === "cloud"
    ? communityDiscovery.people.map(suggestion => {
      const profile = suggestion.profile || suggestion.person || suggestion;
      const person = {
        id: profile.id,
        username: profile.username,
        name: profile.displayName || profile.name || profile.username,
        avatar: profile.avatar || profile.avatarReference || automaticAvatar(profile.id || profile.username || "oldtime"),
        city: profile.city || "",
      };
      return {
        person,
        sharedInterests: Array.isArray(suggestion.sharedInterests) ? suggestion.sharedInterests : [],
        sameCity: suggestion.sameCity === true,
        reason: suggestion.reason || "",
      };
    }).filter(match => match.person.id && match.person.id !== me.id && !followed.has(match.person.id)).slice(0, 8)
    : api.db().users
      .filter(person => person.id !== me.id && !followed.has(person.id) && api.canSee(person.id))
      .map(person => {
        const personInterests = new Set(Array.isArray(person.interests) ? person.interests : []);
        const sharedInterests = canMatchMyInterests && person.profileVisibility?.interests !== false
          ? [...myInterests].filter(id => personInterests.has(id))
          : [];
        const sameCity = canMatchMyCity
          && person.profileVisibility?.city !== false
          && cityMatchKey(me.city)
          && cityMatchKey(me.city) === cityMatchKey(person.city);
        return { person, sharedInterests, sameCity, reason: "" };
      })
      .filter(match => match.sharedInterests.length || match.sameCity)
      .sort((a, b) => b.sharedInterests.length - a.sharedInterests.length || Number(b.sameCity) - Number(a.sameCity) || (a.person.name || a.person.username).localeCompare(b.person.name || b.person.username))
      .slice(0, 8);
  const suggestedPeopleCards = suggestedPeople.map(({ person, sharedInterests, sameCity, reason }) => {
    const sharedLabels = sharedInterests.map(value => profileInterestName(value) || String(value));
    const matchSummary = [
      sameCity && person.city ? `City · ${esc(person.city)}` : "",
      ...sharedLabels.map(label => esc(label))
    ].filter(Boolean);
    const matchCount = sharedInterests.length;
    const reasonLabels = {
      "mutual-followers": "Followed by people you know",
      "shared-interests": "Interests you share",
      "same-city": "In your city",
      "new-to-oldtime": "New to Oldtime",
    };
    const matchTitle = reasonLabels[reason] || (matchCount
      ? `${matchCount} shared ${matchCount === 1 ? "interest" : "interests"}${sameCity ? " · Same city" : ""}`
      : sameCity ? "Same city" : "Suggested for you");
    return `<article class="people-match-card" data-testid="card-person-match-${esc(person.id)}">
      <div class="people-match-person">
        <img ${profileMediaSource(person.avatar)} alt="" loading="lazy" decoding="async" />
        <div class="people-match-identity"><b>${esc(person.name || person.username)}</b><small>@${esc(person.username)}</small></div>
      </div>
      <p class="people-match-reason">${matchTitle}</p>
      <div class="people-match-tags">${matchSummary.map(label => `<span>${label}</span>`).join("")}</div>
      <div class="people-match-actions">
        <button type="button" class="people-match-view" data-vibe-profile="${esc(person.id)}" data-testid="button-view-match-${esc(person.id)}">View profile</button>
        <button type="button" class="people-match-follow" data-vibe-follow="${esc(person.id)}" data-testid="button-follow-match-${esc(person.id)}">Follow</button>
      </div>
    </article>`;
  }).join("");
  const trendingVideoCards = communityDiscovery.videos.map(post => {
    const authorId = typeof post.author === "string" ? post.author : post.author?.id || post.authorId;
    const author = (typeof post.author === "object" && post.author) || api.user(authorId) || {};
    const videoIndex = Array.isArray(post.mediaTypes)
      ? post.mediaTypes.findIndex(contentType => String(contentType).startsWith("video/"))
      : post.kind === "video" ? 0 : -1;
    if (videoIndex < 0 || !post.media?.[videoIndex] || !authorId) return "";
    const posterReference = post.mediaPosters?.[videoIndex];
    const poster = posterReference ? renderMediaUrl(posterReference) : "";
    const authorAvatar = author.avatar ? profileMediaSource(author.avatar) : "";
    const isFollowing = followed.has(authorId);
    const interactions = Number(post.likeCount || 0) + Number(post.remixCount || post.repostCount || 0) + Number(post.commentCount || 0);
    return `<article class="community-trending-video" data-testid="community-trending-video-${esc(post.id)}">
      <button type="button" class="community-trending-video-preview" data-community-trending-post="${esc(post.id)}" aria-label="Watch video by @${esc(author.username || "creator")}">
        ${poster ? `<img src="${esc(poster)}" alt="" loading="lazy" decoding="async" />` : `<span class="community-trending-video-placeholder" aria-hidden="true"></span>`}
        <span class="community-trending-video-play" aria-hidden="true">▶</span>
      </button>
      <div class="community-trending-video-meta">
        <button type="button" class="community-trending-video-author" data-vibe-profile="${esc(authorId)}" aria-label="View @${esc(author.username || "creator")}'s profile">
          ${authorAvatar ? `<img ${authorAvatar} alt="" loading="lazy" decoding="async" />` : `<span class="community-trending-video-avatar">${esc((author.displayName || author.name || author.username || "O").slice(0, 1).toUpperCase())}</span>`}
          <span><b>${esc(author.displayName || author.name || author.username || "Oldtime creator")}</b><small>@${esc(author.username || "")}</small></span>
        </button>
        ${isFollowing
          ? `<span class="community-trending-following">Following</span>`
          : `<button type="button" class="community-trending-follow" data-vibe-follow="${esc(authorId)}">Follow</button>`}
      </div>
      <small class="community-trending-video-activity">${interactions.toLocaleString()} interactions this week</small>
    </article>`;
  }).filter(Boolean).join("");
  const peopleMatchEmpty = myInterests.size
    ? "No new matches yet. Try adding another interest."
    : "Choose a few interests to find people with more in common.";
  const communityPostCards = communityPosts.map(post => communityPostCard(post)).filter(Boolean);
  const showCommunityAnnouncements = api.authMode() === "cloud" && communityView === "for-you" && communityPostCards.length > 0;
  const communityAnnouncementSlot = showCommunityAnnouncements
    ? `<div class="community-announcement-slot" id="community-announcement-slot" aria-label="Official Oldtime updates"></div>`
    : "";
  const communityEmptyState = !communityPostCards.length && !cloudStatus.loading && !startingCloudLoad && !cloudStatus.error
    ? `<div class="stories-empty discover-empty relationship-feed-empty" id="community-feed-empty" role="status">
        <b>${communityView === "following" ? "Your Following feed starts here" : "No posts from your connections yet"}</b>
        <p>${communityView === "following"
          ? "Follow people to see their Community posts here. Public posts from other accounts are in Discovery."
          : "Posts from friends and people you follow appear in this timeline. Interest-based recommendations are shown separately below."}</p>
        <button type="button" data-tab="search">${communityView === "following" ? "Find people to follow" : "Explore public posts"}</button>
      </div>`
    : "";
  const showTrendingVideoShelf = false;
  const communityTrendingSection = showTrendingVideoShelf
    ? `<section class="community-trending-section" aria-label="Trending videos">
        <div class="community-trending-heading">
         <div><h2>Trending videos</h2><p>Popular public clips from the last 7 days</p></div>
          <span class="community-trending-period">7 days</span>
        </div>
        ${trendingVideoCards
          ? `<div class="community-trending-rail">${trendingVideoCards}</div>`
          : communityDiscovery.loading
            ? `<p class="community-discovery-status" role="status">Finding videos…</p>`
            : `<p class="community-discovery-status" role="status">Trending videos couldn’t load. <button type="button" data-community-discovery-retry>Try again</button></p>`}
      </section>`
    : "";
  const showPeopleDiscovery = communityView === "for-you" &&
    (suggestedPeopleCards || api.authMode() === "cloud");
  const peopleDiscoveryContent = suggestedPeopleCards
    || (communityDiscovery.loading
      ? `<div class="people-match-empty" role="status">Finding people…</div>`
      : communityDiscovery.peopleError
        ? `<div class="people-match-empty">${esc(communityDiscovery.peopleError)} <button type="button" data-community-discovery-retry>Try again</button></div>`
        : `<div class="people-match-empty">${api.authMode() === "cloud" ? "No new suggestions right now." : peopleMatchEmpty}<button type="button" id="community-discovery-find-people">Search people</button></div>`);
  const peopleDiscoverySection = showPeopleDiscovery
    ? `<section class="stories-section people-match-section">
        <div class="people-match-heading"><div><h2 class="stories-heading">People to follow</h2><p>Creators selected from public profiles and shared signals</p></div></div>
        <div class="people-match-carousel" aria-label="People to follow">${peopleDiscoveryContent}</div>
      </section>`
    : "";
  const interestTrendCards = communityDiscovery.trends.slice(0, 5).map(trend => {
    const topic = String(trend.topic || "").replace(/^#/, "");
    if (!topic) return "";
    const activity = `${Number(trend.postCount || 0).toLocaleString()} posts · ${Number(trend.creatorCount || 0).toLocaleString()} creators`;
    return `<button type="button" class="community-interest-trend" data-community-trend-search="${esc(topic)}">
      <b>#${esc(topic)}</b><span>${activity}</span>
    </button>`;
  }).filter(Boolean).join("");
  const recommendedCommunityCards = communityDiscovery.posts.slice(0, 3)
    .map(post => communityPostCard(post)).filter(Boolean).join("");
  const interestRecommendationsSection = communityView === "for-you" && api.authMode() === "cloud" &&
    (communityDiscovery.loading || interestTrendCards || recommendedCommunityCards ||
      communityDiscovery.recommendationsError || communityDiscovery.trendsError)
    ? `<section class="community-interest-recommendations" aria-label="Posts and trends matched to your interests">
        <div class="community-interest-recommendations-heading">
          <div><h2 class="stories-heading">For your interests</h2><p>Public posts and trends matched to interests you selected</p></div>
        </div>
        <div class="community-interest-trend-list" aria-label="Trending topics">
          ${interestTrendCards || (communityDiscovery.loading
            ? `<p class="community-discovery-status" role="status">Finding trends in your interests…</p>`
            : communityDiscovery.trendsError
              ? `<p class="community-discovery-status" role="status">${esc(communityDiscovery.trendsError)}</p>`
              : "")}
        </div>
        ${recommendedCommunityCards
          ? `<div class="community-interest-posts">${recommendedCommunityCards}</div>`
          : communityDiscovery.loading
            ? `<p class="community-discovery-status" role="status">Finding public posts for you…</p>`
            : communityDiscovery.recommendationsError
              ? `<p class="community-discovery-status" role="status">${esc(communityDiscovery.recommendationsError)}</p>`
              : `<p class="community-discovery-status" role="status">No public posts match your selected interests yet.</p>`}
      </section>`
    : "";
  const communityCardParts = [];
  if (!communityPostCards.length && communityEmptyState) communityCardParts.push(communityEmptyState);
  for (let index = 0; index < communityPostCards.length; index += 1) {
    if (index === 3 && peopleDiscoverySection) communityCardParts.push(peopleDiscoverySection);
    if (index === 7 && interestRecommendationsSection) communityCardParts.push(interestRecommendationsSection);
    if (index === 4 && communityAnnouncementSlot) communityCardParts.push(communityAnnouncementSlot);
    if (index === 6 && communityTrendingSection) communityCardParts.push(communityTrendingSection);
    communityCardParts.push(communityPostCards[index]);
  }
  if (communityPostCards.length < 3 && peopleDiscoverySection) communityCardParts.push(peopleDiscoverySection);
  if (communityPostCards.length < 8 && interestRecommendationsSection) communityCardParts.push(interestRecommendationsSection);
  if (communityAnnouncementSlot && communityPostCards.length < 4) communityCardParts.push(communityAnnouncementSlot);
  if (communityTrendingSection && communityPostCards.length === 6) communityCardParts.push(communityTrendingSection);
  const communityCards = communityCardParts.join("");
  const communityFeedMarkup = communityCards || communityEmptyState;
  // Older-server fallback: keep the approved module tab row; only Following/Discover are backed by this server.
  const legacyFeedFallback = api.authMode() === "cloud" && Boolean(communityAccount) && communityFeedsUnavailableFor === communityAccount;
  const communityFallbackTabs = `<div class="cf-feed-header community-fallback-header" data-community-fallback-tabs>
        <nav class="cf-feed-tabs" aria-label="Pinned Community feeds">
          <button type="button" data-community-view="following" aria-current="${communityView === "following" ? "page" : "false"}">Following</button>
          <button type="button" data-community-view="for-you" aria-current="${communityView === "for-you" ? "page" : "false"}">Discover</button>
          ${[["popular", "Popular"], ["friends", "Mutuals / Friends"]].map(([id, name]) =>
            `<button type="button" class="community-fallback-unavailable" data-community-unavailable-feed="${id}" aria-current="false">${name}</button>`).join("")}
        </nav>
        <button type="button" class="cf-controls" data-community-fallback-controls aria-expanded="false" aria-controls="community-fallback-panel" aria-label="Community feed controls">${icon("settings")}</button>
      </div>
      <div class="cf-description"><p>${communityView === "following" ? "Posts from people you follow, newest first." : "Public posts from across Oldtime, with people you follow mixed in."}</p><button type="button" data-community-fallback-reload aria-label="Refresh Community feed">${icon("refresh")}</button></div>
      <div class="community-fallback-panel" id="community-fallback-panel" role="region" aria-label="Community feed controls" hidden>
      </div>`;
  shell(`<section class="screen on community-screen" aria-label="Community" data-scroll-context="community:${communityView}">
    <div class="stories-feed-scroll" data-scroll-preserve="community-feed">
      <header class="community-header">
        <h1>Community</h1>
        <div class="community-header-actions">
          <button type="button" class="community-new-post" id="community-note-open">New Post</button>
        </div>
      </header>
      ${legacyFeedFallback ? communityFallbackTabs : `<nav class="community-feed-tabs" role="tablist" aria-label="Community posts">
        <button type="button" role="tab" data-community-view="following" aria-selected="${communityView === "following"}" class="${communityView === "following" ? "on" : ""}">Following</button>
        <button type="button" role="tab" data-community-view="for-you" aria-selected="${communityView === "for-you"}" class="${communityView === "for-you" ? "on" : ""}">For You</button>
      </nav>`}
      <section class="stories-section community-feed-section">
        ${cloudStatus.error ? `<div class="community-feed-status" role="status">Online posts couldn’t load. <button type="button" id="community-feed-retry">Try again</button></div>` : cloudStatus.loading || startingCloudLoad ? `<p class="community-feed-loading" role="status">Loading posts…</p>` : ""}
        <div class="community-content-grid" aria-label="${communityView === "following" ? "Posts from people you follow" : "Posts from friends and people you follow, with separate personalized recommendations"}">
          ${communityFeedMarkup}
        </div>
        ${cloudStatus.hasMore ? `<button type="button" class="community-feed-more" id="community-feed-more" ${cloudStatus.loading ? "disabled" : ""}>${cloudStatus.loading ? "Loading…" : "Load more"}</button>` : ""}
      </section>
    </div>
  </section>`, "light");
  app.querySelectorAll("[data-community-unavailable-feed]").forEach(button => button.addEventListener("click", () => {
    toast(`${button.textContent.trim()} isn’t supported by this server yet. Following and Discover are available.`);
  }));
  const fallbackControls = app.querySelector("[data-community-fallback-controls]");
  const fallbackPanel = app.querySelector("#community-fallback-panel");
  fallbackControls?.addEventListener("click", () => {
    fallbackPanel.hidden = !fallbackPanel.hidden;
    fallbackControls.setAttribute("aria-expanded", String(!fallbackPanel.hidden));
  });
  app.querySelector("[data-community-probe]")?.addEventListener("click", () => {
    communityFeedsUnavailableFor = ""; communityFeedsModule?.retryCommunityFeeds(); render();
  });
  app.querySelector("[data-community-fallback-reload]")?.addEventListener("click", () => render());
  function openCommunitySearch() {
    navigationStack.push(captureNavigationState());
    tab = "search";
    searchSection = "search";
    discoveryTopic = "";
    render();
    requestAnimationFrame(() => $("#q")?.focus({ preventScroll: true }));
  }
  $("#community-note-open")?.addEventListener("click", openCommunityNoteComposer);
  $("#community-search-open")?.addEventListener("click", openCommunitySearch);
  $("#community-discovery-find-people")?.addEventListener("click", openCommunitySearch);
  app.querySelectorAll("[data-community-trend-search]").forEach(button => {
    button.addEventListener("click", () => {
      const query = button.dataset.communityTrendSearch || "";
      openCommunitySearch();
      requestAnimationFrame(() => {
        const input = $("#q");
        if (!input) return;
        input.value = query;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    });
  });
  bindPosts();
  app.querySelectorAll("[data-community-trending-post]").forEach(button => {
    button.onclick = async () => {
      const postId = button.dataset.communityTrendingPost;
      try {
        if (!api.cloudPost(postId)) await api.loadCloudPost(postId);
        openPostViewer(postId);
      } catch (error) {
        toast(error?.message || "That video could not be opened.");
      }
    };
  });
  app.querySelectorAll("[data-community-discovery-retry]").forEach(button => {
    button.onclick = () => {
      void loadCommunityDiscovery(communityOwnerId, { force: true });
      render();
    };
  });
  if (showCommunityAnnouncements) {
    mountCommunityAnnouncementCards($("#community-announcement-slot"), {
      accountId: api.cloudAccountId() || me.id,
      esc,
      icons: ic,
      baseUrl: import.meta.env.BASE_URL,
      navigate: navigateHelpfulPrompt,
      toast,
      hasCommunityPosts: communityPostCards.length > 0,
    });
  }
  $("#community-feed-retry")?.addEventListener("click", async event => {
    const button = event.currentTarget;
    button.disabled = true;
    try { await api.refreshCloudCommunityFeed(communityView === "following"); } catch {}
    if (tab === "communities") render();
  });
  $("#community-feed-more")?.addEventListener("click", async event => {
    const button = event.currentTarget;
    button.disabled = true;
    try { await api.loadMoreCloudCommunityFeed(); } catch {}
    if (tab === "communities") render();
  });
  app.querySelectorAll("[data-community-view]").forEach(button => button.onclick = () => {
    communityView = button.dataset.communityView === "following" ? "following" : "for-you";
    communityTopic = "";
    render();
  });
  app.querySelectorAll("[data-story]").forEach(button => button.onclick = event => {
    if (button.classList.contains("own-story") && event.target.closest(".friend-note")) return editProfileNote();
    openStory(button.dataset.story);
  });
  app.querySelectorAll("[data-profile-note]").forEach(button => button.onclick = () => {
    navigateToProfile(button.dataset.profileNote);
  });
  bindCommunityMediaOpen();
  app.querySelectorAll("[data-vibe-profile]").forEach(button => button.onclick = () => {
    navigateToProfile(button.dataset.vibeProfile);
  });
  app.querySelectorAll("[data-vibe-follow]").forEach(button => button.onclick = () => follow(button.dataset.vibeFollow));
}

function openCommunityNoteComposer() {
  const sheet = $("#sheet");
  if (!sheet) return;
  const trigger = $("#community-note-open");
  const ownerId = api.me()?.id;
  let closed = false;
  let imageEditorOpen = false;
  // { id, file, kind, url, uploadedId } — uploadedId is kept so a retry never re-uploads confirmed media.
  let attachments = [];
  let partKeys = [];
  let publishedIds = [];
  let threadParts = [];
  let threadMentionCleanups = [];
  let mentionCleanup = () => {};
  const releaseAll = () => attachments.forEach(item => item.url && URL.revokeObjectURL(item.url));
  const close = () => {
    if (closed) return;
    closed = true;
    releaseAll();
    attachments = [];
    document.removeEventListener("keydown", onKey);
    mentionCleanup();
    threadMentionCleanups.forEach(cleanup => cleanup());
    sheet.classList.remove("on");
    sheet.innerHTML = "";
    sheet.onclick = null;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  };
  const onKey = event => { if (event.key === "Escape" && !imageEditorOpen && sheet.querySelector("#community-note-submit")?.dataset.busy !== "true") close(); };
  sheet.innerHTML = `<div class="panel community-note-panel" role="dialog" aria-modal="true" aria-labelledby="community-note-title" tabindex="-1">
    <div class="grab"></div>
    <header class="community-note-panel-head">
      <button type="button" class="community-note-close" aria-label="Cancel post">Cancel</button>
      <h2 id="community-note-title">New post</h2>
      <button type="button" class="community-note-submit" id="community-note-submit" disabled data-testid="button-post-note">Post</button>
    </header>
    <div class="community-note-author"><img src="${esc(api.me()?.avatar || automaticAvatar(api.me()))}" alt="" width="32" height="32"><span>${esc(api.me()?.name || api.me()?.username || "You")}</span></div>
    <textarea id="community-note-input" maxlength="1000" placeholder="What’s on your mind?" aria-label="Write a Community post" data-testid="input-community-note"></textarea>
    <div class="community-thread-compose-tools"><button type="button" id="community-thread-add">＋ Add to thread</button><span>Connected posts · up to 10 parts</span></div>
    <div id="community-thread-parts" class="community-thread-parts" aria-label="Additional thread posts"></div>
    <ol id="community-note-attachments" class="community-note-attachments" aria-label="Attached photos and videos" data-testid="list-community-attachments" hidden></ol>
    <div class="community-note-media-tools" role="toolbar" aria-label="Post tools">
      <label class="community-note-tool community-note-image-picker" for="community-note-image" aria-label="Add photos or videos">
        ${ic.image}<span class="community-note-sr">Photos or videos</span>
        <input id="community-note-image" type="file" accept="image/*,video/*" multiple hidden data-testid="input-community-media">
      </label>
      <label class="community-note-tool community-note-camera-picker" for="community-note-camera" aria-label="Take a photo">
        ${ic.camera}<span class="community-note-sr">Camera</span>
        <input id="community-note-camera" type="file" accept="image/*" capture="environment" hidden>
      </label>
      <span class="community-note-attach-count" id="community-note-attach-count" aria-live="polite">0 / ${COMMUNITY_MAX_ATTACHMENTS}</span>
    </div>
    <div class="community-note-compose-footer"><span class="community-note-public">Public · Community</span><small id="community-note-count">0 / 1,000</small></div>
    <p class="community-note-status" id="community-note-status" aria-live="polite"></p>
    <p class="community-note-error" id="community-note-error" role="alert"></p>
  </div>`;
  sheet.classList.add("on");
  sheet.onclick = event => { if (event.target === sheet && submit.dataset.busy !== "true") close(); };
  document.addEventListener("keydown", onKey);
  const input = $("#community-note-input", sheet);
  mentionCleanup = bindMentionAutocomplete(input, { api });
  const imageInput = $("#community-note-image", sheet);
  const cameraInput = $("#community-note-camera", sheet);
  const list = $("#community-note-attachments", sheet);
  const threadAdd = $("#community-thread-add", sheet);
  const threadList = $("#community-thread-parts", sheet);
  const counter = $("#community-note-count", sheet);
  const attachCount = $("#community-note-attach-count", sheet);
  const submit = $("#community-note-submit", sheet);
  const error = $("#community-note-error", sheet);
  const status = $("#community-note-status", sheet);
  const busy = () => submit.dataset.busy === "true";
  const partInputs = () => [input, ...threadParts];
  const syncSubmit = () => {
    submit.disabled = (!partInputs().some(field => field.value.trim()) && !attachments.length && !publishedIds.length) || busy();
    threadAdd.disabled = busy() || threadParts.length >= 9;
    const full = attachments.length >= COMMUNITY_MAX_ATTACHMENTS;
    const rootLocked = Boolean(publishedIds[0] || partKeys[0]);
    imageInput.disabled = full || busy() || rootLocked;
    cameraInput.disabled = full || busy() || rootLocked;
    sheet.querySelectorAll(".community-note-image-picker,.community-note-camera-picker").forEach(label => label.classList.toggle("is-disabled", full || busy() || rootLocked));
    attachCount.textContent = `${attachments.length} / ${COMMUNITY_MAX_ATTACHMENTS}`;
  };
  const contentChanged = index => { if (index >= publishedIds.length && !partKeys[index]) partKeys[index] = null; };
  const addThreadPart = () => {
    if (threadParts.length >= 9 || busy()) return;
    const index = threadParts.length + 1;
    const wrap = document.createElement("section");
    wrap.className = "community-thread-part";
    wrap.innerHTML = `<header><span>Post ${index + 1} of 10</span><button type="button" data-thread-remove>Remove</button></header><textarea maxlength="1000" placeholder="Continue your thread…" aria-label="Thread post ${index + 1}"></textarea><small>0 / 1,000</small>`;
    const field = wrap.querySelector("textarea");
    threadParts.push(field); partKeys.push(null); threadList.appendChild(wrap);
    threadMentionCleanups.push(bindMentionAutocomplete(field, { api }));
    field.oninput = () => { const currentIndex=threadParts.indexOf(field)+1; wrap.querySelector("small").textContent = `${[...field.value].length.toLocaleString()} / 1,000`; contentChanged(currentIndex); syncSubmit(); };
    wrap.querySelector("[data-thread-remove]").onclick = () => {
      const at = threadParts.indexOf(field); if (at < 0 || at+1 < publishedIds.length || busy()) return;
      threadParts.splice(at,1); partKeys.splice(at+1,1); threadMentionCleanups.splice(at,1)[0]?.(); wrap.remove();
      [...threadList.children].forEach((item,i)=>{ item.querySelector("header span").textContent = `Post ${i+2} of 10`; item.querySelector("textarea").setAttribute("aria-label",`Thread post ${i+2}`); });
      syncSubmit();
    };
    field.focus(); syncSubmit();
  };
  const renderAttachments = () => {
    list.hidden = !attachments.length;
    const rootLocked = Boolean(publishedIds[0] || partKeys[0]);
    list.innerHTML = attachments.map((item, index) => `<li class="community-note-attachment" data-kind="${item.kind}">
      ${item.kind === "video"
        ? `<video src="${esc(item.url)}" muted playsinline preload="metadata" aria-label="Video ${index + 1}"></video><span class="community-grid-play" aria-hidden="true">${ic.play}</span>`
        : `<img src="${esc(item.url)}" alt="Photo ${index + 1}">`}
      <span class="community-note-attachment-index" aria-hidden="true">${index + 1}</span>
      <div class="community-note-attachment-tools">
        <button type="button" data-attach-move="${index}" data-dir="-1" aria-label="Move ${item.kind} ${index + 1} earlier" ${index === 0 || busy() || rootLocked ? "disabled" : ""}>‹</button>
        ${item.kind === "photo" ? `<button type="button" data-attach-edit="${index}" aria-label="Edit photo ${index + 1}" ${busy() || rootLocked ? "disabled" : ""}>${ic.edit}</button>` : ""}
        <button type="button" data-attach-move="${index}" data-dir="1" aria-label="Move ${item.kind} ${index + 1} later" ${index === attachments.length - 1 || busy() || rootLocked ? "disabled" : ""}>›</button>
      </div>
      <button type="button" class="community-note-attachment-remove" data-attach-remove="${index}" aria-label="Remove ${item.kind} ${index + 1}" ${busy() || rootLocked ? "disabled" : ""}>×</button>
    </li>`).join("");
    list.querySelectorAll("[data-attach-remove]").forEach(button => button.onclick = () => {
      const [removed] = attachments.splice(Number(button.dataset.attachRemove), 1);
      if (removed?.url) URL.revokeObjectURL(removed.url);
      contentChanged(0); renderAttachments(); syncSubmit();
    });
    list.querySelectorAll("[data-attach-move]").forEach(button => button.onclick = () => {
      const from = Number(button.dataset.attachMove);
      attachments = moveAttachment(attachments, from, from + Number(button.dataset.dir));
      contentChanged(0); renderAttachments(); syncSubmit();
    });
    list.querySelectorAll("[data-attach-edit]").forEach(button => button.onclick = () => editPhoto(Number(button.dataset.attachEdit)));
  };
  const addFiles = files => {
    if (publishedIds[0] || partKeys[0]) return;
    const { next, rejected } = addComposerFiles(attachments, files, COMMUNITY_MAX_ATTACHMENTS);
    attachments = next.map(item => item.id ? item : { ...item, id: crypto.randomUUID(), url: URL.createObjectURL(item.file), uploadedId: "" });
    error.textContent = rejectionMessage(rejected, COMMUNITY_MAX_ATTACHMENTS);
    contentChanged(0); renderAttachments(); syncSubmit();
  };
  const editPhoto = index => {
    const item = attachments[index];
    if (!item || item.kind !== "photo" || busy()) return;
    imageEditorOpen = true;
    openCreativeEditor({
      destination: "community",
      background: { media: item.url, kind: "photo" },
      editorVersion: "v2",
      esc,
      icons: ic,
      toast,
      onClose: () => { imageEditorOpen = false; },
      onSave: async ({ preview, active }) => {
        const rendered = await preview();
        if (closed || !active()) { imageEditorOpen = false; return; }
        if (!(rendered instanceof Blob) || !rendered.size) throw new Error("The edited photo could not be prepared.");
        const edited = new File([rendered], "oldtime-edited-photo.png", { type: rendered.type || "image/png" });
        const position = attachments.indexOf(item);
        if (position >= 0) {
          URL.revokeObjectURL(item.url);
          attachments[position] = { id: crypto.randomUUID(), file: edited, kind: "photo", url: URL.createObjectURL(edited), uploadedId: "" };
        }
        error.textContent = "";
        contentChanged(0); renderAttachments(); syncSubmit();
        imageEditorOpen = false;
      },
    });
  };
  sheet.querySelector(".community-note-close").onclick = () => { if (!busy()) close(); };
  input.oninput = () => {
    counter.textContent = `${[...input.value].length.toLocaleString()} / 1,000`;
    contentChanged(0); syncSubmit();
  };
  threadAdd.onclick = addThreadPart;
  imageInput.onchange = () => { addFiles(imageInput.files); imageInput.value = ""; };
  cameraInput.onchange = () => { addFiles(cameraInput.files); cameraInput.value = ""; };
  submit.onclick = async () => {
    const texts = partInputs().map(field => field.value.trim());
    if ((!texts.some(Boolean) && !attachments.length && !publishedIds.length) || busy()) return;
    if (texts.some((text,index) => !text && !(index===0 && attachments.length))) { error.textContent = "Each part of a thread needs text. Add media to the first post if you want."; return; }
    if (api.authMode() !== "cloud") { error.textContent = "Reconnect your online account before publishing a post."; return; }
    submit.dataset.busy = "true"; error.textContent = ""; renderAttachments(); syncSubmit();
    const total = attachments.length;
    try {
      const mediaIds = [];
      for (const [index,item] of attachments.entries()) {
        if (!item.uploadedId) {
          status.textContent = `Uploading ${item.kind} ${index+1} of ${total}…`;
          const reference = await putLocalMedia(item.file, item.id);
          const uploadedId = String(reference||"").replace(/^oldtime-media:/,"");
          if (!/^[0-9a-f-]{36}$/i.test(uploadedId)) throw new Error(`${item.kind==="video"?"Video":"Photo"} ${index+1} could not be confirmed. Your post and attachments are still here.`);
          item.uploadedId = uploadedId;
        }
        mediaIds.push(item.uploadedId);
      }
      if (mediaIds.length !== total) throw new Error("Some attachments were not confirmed. Nothing was posted.");
      for (let index=0; index<texts.length; index++) {
        if (publishedIds[index]) continue;
        status.textContent = texts.length>1 ? `Publishing post ${index+1} of ${texts.length}…` : "Publishing…";
        partKeys[index] ||= crypto.randomUUID();
        partInputs()[index].readOnly = true;
        const published = await api.createCloudPost(texts[index],{destination:"community",mediaIds:index===0?mediaIds:[]},{idempotencyKey:partKeys[index]});
        publishedIds[index] = published.id; partInputs()[index].readOnly = true;
        if (api.me()?.id !== ownerId) { close(); return; }
      }
      let publishedPost = api.cloudPost(publishedIds[0]);
      if (publishedIds.length>1) {
        status.textContent = "Connecting your conversation…";
        const linked = await api.linkCloudPostThread(publishedIds[0],publishedIds.slice(1));
        publishedPost = linked.posts[0] || publishedPost;
      }
      if (api.me()?.id !== ownerId) { close(); return; }
      close(); communityView="for-you"; communityFeedsModule?.showPublishedPost?.(publishedPost); render();
      toast(publishedIds.length>1 ? `Your ${publishedIds.length}-part thread is live in Community` : total ? `Post shared to Community with ${total} attachment${total===1?"":"s"}` : "Post shared to Community");
    } catch (failure) {
      if (closed) return;
      status.textContent=""; error.textContent=failure.message || "Your post could not be posted. Your draft is still here — try again.";
      submit.dataset.busy="false"; partInputs().forEach((field,index)=>{if(publishedIds[index] || partKeys[index])field.readOnly=true;});
      renderAttachments(); syncSubmit();
    }
  };
  syncSubmit();
  sheet.querySelector(".community-note-close")?.focus();
  requestAnimationFrame(() => { if (!closed) input.focus(); });
}

function bindCommunityTextPostOpen() {
  if (app.dataset.communityTextPostOpenBound) return;
  const ignoredTargets = "button,a,input,textarea,select,summary,[data-profile],[data-thread-open]";
  app.addEventListener("click", event => {
    const card = event.target instanceof Element ? event.target.closest("[data-community-open-post]") : null;
    if (!card || !app.contains(card) || event.target.closest(ignoredTargets)) return;
    event.preventDefault();
    event.stopPropagation();
    openPostViewer(card.dataset.communityOpenPost);
  });
  app.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target instanceof Element ? event.target.closest("[data-community-open-post]") : null;
    if (!card || event.target !== card) return;
    event.preventDefault();
    openPostViewer(card.dataset.communityOpenPost);
  });
  app.dataset.communityTextPostOpenBound = "true";
}

// Community cards (legacy and cloud community-feeds paths): open the shared viewer at the tapped attachment.
function bindCommunityMediaOpen() {
  bindCommunityTextPostOpen();
  app.querySelectorAll("[data-stories-post]").forEach(button => button.onclick = () => {
    if (button.dataset.mediaIndex !== undefined) carouselIndex[button.dataset.storiesPost] = Number(button.dataset.mediaIndex) || 0;
    openPostViewer(button.dataset.storiesPost);
  });
  bindCommunityVideoCards();
}
let communityVideoObserver = null;
function bindCommunityVideoCards() {
  communityVideoObserver?.disconnect();
  const videos = [...app.querySelectorAll(".community-video-card video[data-community-autoplay]")];
  if (!videos.length) return;
  const reduce = matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  communityVideoObserver = "IntersectionObserver" in window ? new IntersectionObserver(entries => entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting && entry.intersectionRatio >= .6 && !reduce) {
      void video.play()?.catch?.(() => {});
    } else video.pause();
  }), { threshold: [0, .6] }) : null;
  videos.forEach(video => communityVideoObserver?.observe(video));
  app.querySelectorAll(".community-video-card [data-community-sound]").forEach(button => button.onclick = event => {
    event.preventDefault(); event.stopPropagation();
    const video = button.closest(".cvc-stage")?.querySelector("video");
    if (!video) return;
    const nextMuted = !video.muted;
    app.querySelectorAll(".community-video-card video").forEach(item => { if (item !== video) item.muted = true; });
    video.muted = nextMuted;
    if (!nextMuted) void video.play()?.catch?.(() => { video.muted = true; });
    app.querySelectorAll(".community-video-card [data-community-sound]").forEach(item => {
      const isMuted = item.closest(".cvc-stage")?.querySelector("video")?.muted !== false;
      item.setAttribute("aria-pressed", String(!isMuted));
      item.setAttribute("aria-label", isMuted ? "Turn sound on" : "Mute sound");
      item.innerHTML = feedSoundGlyph(isMuted);
    });
  });
}
async function openCommunityThread(postId, trigger) {
  const sheet = $("#sheet");
  if (!sheet) return;
  const owner = api.cloudAccountId();
  sheet.classList.add("on");
  sheet.innerHTML = `<section class="panel community-thread-viewer" role="dialog" aria-modal="true" aria-labelledby="community-thread-title" tabindex="-1">
    <header><button type="button" data-thread-close aria-label="Close conversation">${ic.back || ic.close}</button><div><h2 id="community-thread-title">Conversation</h2><small>Connected Community posts</small></div></header>
    <div class="community-thread-viewer-content" role="status"><div class="community-thread-loading"><i></i><span></span><span></span></div></div>
  </section>`;
  const close = () => {
    sheet.classList.remove("on"); sheet.innerHTML=""; sheet.onclick=null;
    if (trigger?.isConnected) trigger.focus({preventScroll:true});
  };
  sheet.onclick = event => { if(event.target===sheet) close(); };
  sheet.querySelector("[data-thread-close]").onclick=close;
  try {
    const result=await api.loadCloudPostThread(postId);
    if(api.cloudAccountId()!==owner || !sheet.querySelector(".community-thread-viewer")) return;
    if(result.posts.length<2){close();toast("This post isn’t part of a multi-post thread yet.");return;}
    const cards=result.posts.map((post,index)=>`<div class="community-thread-viewer-part"><span class="community-thread-part-number">${index+1} / ${result.posts.length}</span>${communityPostCard(post)}</div>`).join("");
    sheet.querySelector(".community-thread-viewer-content").outerHTML=`<div class="community-thread-viewer-content">${cards}</div>`;
    bindPosts(); bindCommunityMediaOpen();
  } catch(error) {
    if(sheet.querySelector(".community-thread-viewer")) sheet.querySelector(".community-thread-viewer-content").innerHTML=`<p class="community-thread-viewer-error">${esc(error.message||"This conversation couldn’t be loaded.")}</p>`;
  }
}
app?.addEventListener("click",event=>{
  const button=event.target.closest?.("[data-thread-open]");
  if(!button)return;
  event.preventDefault();event.stopPropagation();
  void openCommunityThread(button.dataset.threadOpen,button);
});

function communityPostCard(post) {
  const sourceAuthor = post.author && typeof post.author === "object" ? post.author : {};
  const authorId = sourceAuthor.id || post.authorId || (typeof post.author === "string" ? post.author : "");
  const resolvedAuthor = (authorId && api.user(authorId)) || sourceAuthor;
  const author = {
    ...resolvedAuthor,
    id: resolvedAuthor.id || authorId,
    username: resolvedAuthor.username || post.authorUsername || "member",
    name: resolvedAuthor.name || resolvedAuthor.displayName || post.authorName || "Member",
    avatar: resolvedAuthor.avatar || resolvedAuthor.avatarReference || post.authorAvatar || "",
  };
  const avatarMarkup = author.avatar
    ? `<img ${profileMediaSource(author.avatar)} alt="" loading="lazy" decoding="async" />`
    : `<span class="community-post-avatar-fallback" aria-hidden="true">${esc(String(author.name).trim().slice(0, 1).toUpperCase() || "O")}</span>`;
  const currentUser = api.me();
  const text = String(post.text || post.caption || "").trim();
  const media = profilePostMedia(post);
  const likes = Array.isArray(post.likes) ? post.likes : [];
  const comments = Array.isArray(post.comments) ? post.comments : [];
  const saves = Array.isArray(post.saves) ? post.saves : [];
  const liked = likes.includes(currentUser?.id);
  const saved = saves.includes(currentUser?.id);
  const likeCount = Number(post.likeCount ?? likes.length);
  const commentCount = Number(post.commentCount ?? comments.reduce((count, item) => count + 1 + (item.replies?.length || 0), 0));
  const repostCount = Number(post.repostCount ?? (post.reposts || []).length);
  const reposted = Boolean(post.repostedByMe) || (post.reposts || []).includes(currentUser?.id);
  const friendReposts = Array.isArray(post.repostedByFriends) ? post.repostedByFriends : [];
  const friendRepostCount = Number.isSafeInteger(post.friendRepostCount) ? post.friendRepostCount : friendReposts.length;
  const repostSummary = compactRepostSummary(friendReposts, friendRepostCount);
  const repostAttribution = repostSummary
    ? `<div class="community-repost-attribution" aria-label="${esc(repostSummary.label)}"><span aria-hidden="true">${ic.repost}</span><span>Reposted by <b>${esc(repostSummary.firstName)}${repostSummary.extraLabel ? ` ${esc(repostSummary.extraLabel)}` : ""}</b></span></div>`
    : "";
  const items = communityMediaItems(post, media);
  const layout = communityMediaLayout(items);
  const posterAttr = posterReference => isLocalMedia(posterReference)
    ? `data-local-poster="${esc(posterReference)}"`
    : posterReference ? `poster="${esc(renderMediaUrl(posterReference))}"` : "";
  const postActionsMenu = post.author === currentUser?.id ? renderPostActionsMenu({
    postId: post.id, archived: post.archivedAt != null, className: "community-post-actions-menu",
    allowDelete: false, esc, icons: ic,
  }) : "";
  const likeButton = `<button type="button" class="${liked ? "is-active" : ""}" data-like="${esc(post.id)}" aria-label="${liked ? "Unlike post" : "Like post"}" aria-pressed="${liked}">${liked ? ic.heartOn : ic.heart}<span>${fmt(likeCount)}</span></button>`;
  const repostButton = `<button type="button" class="${reposted ? "is-active" : ""}" data-repost="${esc(post.id)}" aria-label="${reposted ? "Remove repost" : "Repost"}" aria-pressed="${reposted}">${ic.repost}<span>${fmt(repostCount)}</span></button>`;
  const commentButton = `<button type="button" data-comment="${esc(post.id)}" aria-label="Comment on post">${ic.comment}<span>${fmt(commentCount)}</span></button>`;
  const saveButton = `<button type="button" class="${saved ? "is-active" : ""}" data-save="${esc(post.id)}" aria-label="${saved ? "Remove saved post" : "Save post"}" aria-pressed="${saved}">${saved ? ic.bookmarkOn : ic.bookmark}</button>`;
  const shareButton = `<button type="button" data-share="${esc(post.id)}" aria-label="Share post">${ic.share}</button>`;
  const viewsMetric = Number.isSafeInteger(post.measuredViews) && post.measuredViews >= 0
    ? `<span class="ot-view-metric" aria-label="${fmt(post.measuredViews)} views" title="${fmt(post.measuredViews)} views">${ic.viewBars}<span>${fmt(post.measuredViews)}</span></span>`
    : "";
  const textOnlyPost = Boolean(text && !items.length && !post.creativeProject);
  if (layout === "video-card") {
    const item = items[0];
    return `<article class="community-post-card community-video-card" data-testid="card-community-post-${esc(post.id)}">
      ${repostAttribution}
      <div class="cvc-stage">
        <button type="button" class="cvc-media" data-stories-post="${esc(post.id)}" data-media-index="0" aria-label="Open video by @${esc(author.username)}">
          <video ${profileMediaSource(item.source)} ${posterAttr(item.poster)} muted loop playsinline preload="metadata" data-community-autoplay aria-hidden="true"></video>
        </button>
        <button type="button" class="cvc-sound" data-community-sound aria-pressed="false" aria-label="Turn sound on">${feedSoundGlyph(true)}</button>
        <button type="button" class="clip-float-control cvc-float" data-video-float="${esc(post.id)}" aria-label="Continue video in a floating player">${videoFloatIcon}</button>
        <div class="cvc-panel">
          <header class="cvc-author">
            <button type="button" class="community-post-avatar" data-profile="${esc(author.id)}" aria-label="Open @${esc(author.username)}'s profile">${avatarMarkup}</button>
            <button type="button" class="cvc-identity" data-profile="${esc(author.id)}"><b>${esc(author.name || author.username)}${blueBadgeMarkup(author.cloudAccountId || author.id, esc)}</b><small>${ago(Number(post.created || post.createdAt))}</small></button>
            ${postActionsMenu}
          </header>
          ${text ? `<button type="button" class="cvc-caption" data-stories-post="${esc(post.id)}" data-media-index="0">${renderMentionText(text, { tag: "span" })}</button>` : ""}
          ${postPlaceCard(post) ? `<div class="cvc-place">${postPlaceCard(post)}</div>` : ""}
          ${post.threadId ? `<button type="button" class="community-thread-affordance" data-thread-open="${esc(post.id)}">${ic.messageCircle || ic.comment}<span>View thread · Part ${Number(post.threadPosition)+1}</span></button>` : ""}
          <div class="cvc-actions" aria-label="Post actions">${likeButton}${commentButton}${repostButton}${viewsMetric}<span class="cvc-spacer"></span>${saveButton}${shareButton}</div>
          <button type="button" class="cvc-comment-prompt" data-comment="${esc(post.id)}">${commentPromptLabel(commentCount)}</button>
        </div>
      </div>
    </article>`;
  }
  const grid = layout === "grid" ? communityGridMarkup(post.id, items, {
    esc, sourceAttr: profileMediaSource, posterAttr, playIcon: ic.play, handle: author.username, alt: text || "Community post photo",
  }) : "";
  return `<article class="community-post-card${textOnlyPost ? " is-text-post" : ""}" data-testid="card-community-post-${esc(post.id)}"${textOnlyPost ? ` data-community-open-post="${esc(post.id)}" tabindex="0" aria-label="Open original Community post"` : ""}>
    <header class="community-post-author-row">
      <button type="button" class="community-post-avatar" data-profile="${esc(author.id)}" aria-label="Open @${esc(author.username)}'s profile">${avatarMarkup}</button>
      <button type="button" class="community-post-identity" data-profile="${esc(author.id)}">
         <b>${esc(author.name || author.username)}${blueBadgeMarkup(author.cloudAccountId || author.id, esc)}</b><small>@${esc(author.username)} · ${ago(Number(post.created || post.createdAt))}</small>
      </button>
      ${postActionsMenu}
    </header>
    ${repostAttribution}
    ${post.threadId ? `<button type="button" class="community-thread-affordance" data-thread-open="${esc(post.id)}">${ic.messageCircle || ic.comment}<span>View thread · Part ${Number(post.threadPosition)+1}</span></button>` : ""}
    ${text ? `<p class="community-post-copy">${renderMentionText(text, { tag: "span" })}</p>` : ""}
    ${grid}
    ${postPlaceCard(post) ? `<div class="community-post-place">${postPlaceCard(post)}</div>` : ""}
    <div class="community-post-actions" aria-label="Post actions">${likeButton}${repostButton}${commentButton}${viewsMetric}${saveButton}${shareButton}</div>
  </article>`;
}

function peopleSearchQuery(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed || trimmed.startsWith("#")) return "";
  return trimmed.replace(/^@/, "").trim().toLowerCase();
}

function renderSearchPreservingInput() {
  const input = $("#q");
  const keepFocus = document.activeElement === input;
  const start = input?.selectionStart ?? 0;
  const end = input?.selectionEnd ?? start;
  const scrollTop = app.querySelector(".search-screen .page")?.scrollTop || 0;
  render();
  const nextPage = app.querySelector(".search-screen .page");
  if (nextPage && scrollTop) nextPage.scrollTop = scrollTop;
  if (keepFocus) {
    const nextInput = $("#q");
    nextInput?.focus({ preventScroll: true });
    nextInput?.setSelectionRange(start, end);
  }
}

function schedulePeopleSearch(query) {
  if (peopleSearchTimer) clearTimeout(peopleSearchTimer);
  peopleSearchTimer = null;
  if (api.authMode() !== "cloud" || query.length < 2) {
    peopleSearchRequestId++;
    peopleSearch = { query, status: "idle", profiles: [], error: "" };
    return;
  }
  if (peopleSearch.query === query && ["loading", "success", "error"].includes(peopleSearch.status)) return;

  const requestId = ++peopleSearchRequestId;
  peopleSearch = { query, status: "loading", profiles: [], error: "" };
  peopleSearchTimer = setTimeout(async () => {
    peopleSearchTimer = null;
    try {
      const result = await requestCloudApi(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (!Array.isArray(result?.users)) throw new Error("Account search returned an invalid response.");
      if (requestId !== peopleSearchRequestId || peopleSearch.query !== query) return;
      peopleSearch = { query, status: "success", profiles: result.users, error: "" };
    } catch (error) {
      if (requestId !== peopleSearchRequestId || peopleSearch.query !== query) return;
      peopleSearch = { query, status: "error", profiles: [], error: error?.message || "Couldn’t search online accounts." };
    }
    if (tab === "search" && peopleSearchQuery(searchQ) === query) renderSearchPreservingInput();
  }, 250);
}

const DISCOVERY_CATEGORIES = [
  ["", "For You"], ["art", "Art"], ["gaming", "Gaming"], ["sports", "Sports"],
  ["music", "Music"], ["photography", "Photography"], ["fashion", "Fashion"],
  ["food", "Food"], ["travel", "Travel"], ["fitness", "Fitness"], ["tech", "Tech"], ["comedy", "Comedy"],
];
const DISCOVERY_CATEGORY_TERMS = {
  art: ["art", "design", "illustration"], gaming: ["gaming", "video games", "games"],
  sports: ["sports", "fitness", "running", "basketball", "football"], music: ["music", "singing", "production"],
  photography: ["photography", "photo", "camera"], fashion: ["fashion", "style", "beauty"],
  food: ["food", "cooking", "recipes"], travel: ["travel", "adventure"],
  fitness: ["fitness", "workout", "health", "running"], tech: ["tech", "technology", "coding"],
  comedy: ["comedy", "humor", "funny"],
};
const exploreEco = createExploreEcosystem({
  api, requestCloudApi, esc, ic, renderMediaUrl, isLocalMedia, automaticAvatar,
  renderSuggestedPerson: discoveryPersonMarkup,
  matchesHomeTopic: (post, topic) => matchesHomeTopicPost(post, topic, api.me()),
  openPostViewer: (...args) => openPostViewer(...args),
  navigateToProfile: id => navigateToProfile(id),
  selectPlace: place => selectPlace(place),
  openPlaces: query => openSearchPlaces(query),
  toast: message => toast(message),
  isActive: () => tab === "search" && (searchSection === "trending" || searchSection === "search") && !discoveryTopic,
  isViewing:()=>Boolean(viewer)&&(viewerSource==="explore"||viewerSource==="search"),
  rerender: () => {
    const page = document.querySelector(".search-screen .page");
    const top = page?.scrollTop || 0;
    renderSearchPreservingInput();
    const next = document.querySelector(".search-screen .page");
    if (next && top) next.scrollTop = top;
  },
});
const searchPlayback = createSearchPlaybackTracker({
  send: ({ videoId, queryText, watchTimeSeconds }) => requestCloudApi(`/api/videos/${encodeURIComponent(videoId)}/search-click`,
    { method: "POST", body: { queryText, watchTimeSeconds }, timeoutMs: 10000 }),
});
const videoSearchInsights = createInsightLoader({
  request: id => requestCloudApi(`/api/videos/${encodeURIComponent(id)}/search-insight`, { timeoutMs: 8000 }),
  onChange: id => {
    const insight = videoSearchInsights.get(id);
    if (!insight) return;
    app.querySelectorAll("[data-video-search-insight]").forEach(node => {
      if (node.dataset.videoSearchInsight !== id) return;
      const text = node.querySelector("[data-video-search-insight-text]");
      if (!text) return;
      const label = `Search "${insight.keyword}"`;
      text.textContent = label;
      node.setAttribute("aria-label", label);
      node.hidden = false;
    });
  },
});
let videoSearchInsightObserver = null;
function bindVideoSearchInsights(root = app) {
  videoSearchInsightObserver?.disconnect();
  videoSearchInsightObserver = null;
  if (api.authMode() !== "cloud" || !api.cloudAccountId()) return;
  const slots = [...root.querySelectorAll("[data-video-search-insight]")];
  if (!slots.length) return;
  if (typeof IntersectionObserver !== "function") {
    slots.forEach(slot => {
      const bounds = slot.getBoundingClientRect();
      if (bounds.bottom >= 0 && bounds.top <= window.innerHeight) {
        videoSearchInsights.request(slot.dataset.videoSearchInsight);
      }
    });
    return;
  }
  const scrollRoot = root.querySelector(".post-viewer-feed") || root.querySelector("#feed") || null;
  videoSearchInsightObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      videoSearchInsightObserver?.unobserve(entry.target);
      const slot = entry.target.matches?.("[data-video-search-insight]")
        ? entry.target
        : entry.target.querySelector?.("[data-video-search-insight]");
      if (slot) videoSearchInsights.request(slot.dataset.videoSearchInsight);
    }
  }, { root: scrollRoot, rootMargin: "140px" });
  slots.forEach(slot => videoSearchInsightObserver.observe(slot.closest(".clip") || slot));
}
function exploreIsCloud() {
  return api.authMode() === "cloud" && (searchSection === "trending" || searchSection === "search") && !discoveryTopic;
}
function discoveryOwnerKey() {
  return api.cloudAccountId() || api.me()?.id || "local";
}
function ensureDiscoveryOwner() {
  const owner = discoveryOwnerKey();
  if (owner === discoveryOwner) return;
  discoveryOwner = owner;
  discoveryTrendRequestId++;
  discoveryPeopleRequestId++;
  discoveryPlacesRequestId++;
  discoveryPlaceFeedRequestId++;
  discoveryTopicRequestId++;
  discoveryFeedRequestId++;
  if (discoveryPeopleTimer) clearTimeout(discoveryPeopleTimer);
  if (discoveryPlacesTimer) clearTimeout(discoveryPlacesTimer);
  if (discoveryPlaceFeedTimer) clearTimeout(discoveryPlaceFeedTimer);
  discoveryPeopleTimer = null;
  discoveryPlacesTimer = null;
  discoveryPlaceFeedTimer = null;
  discoveryTrends = { status: "idle", topics: [], error: "", fetchedAt: 0 };
  discoveryPeople = { key: "", status: "idle", suggestions: [], hasMore: false, nextOffset: 0, error: "", fetchedAt: 0 };
  discoveryPlaces = { key: "", status: "idle", places: [], error: "", fetchedAt: 0 };
  discoveryPlaceFeed = { key: "", status: "idle", posts: [], hasMore: false, nextOffset: 0, error: "", moreError: false, fetchedAt: 0 };
  discoveryTopic = "";
  discoveryTopicPosts = { topic: "", status: "idle", posts: [], hasMore: false, nextOffset: 0, error: "" };
  discoveryFeedQuery = "";
  discoveryHomeTopic = "all";
  searchExploreAllExpanded = false;
  localSearchType = "all";
  searchExploreFeedsRequestId++;
  searchExploreFeeds = { owner, status: "idle", lists: [], pinned: [], error: "", fetchedAt: 0 };
}
function discoveryCompactNumber(value) {
  return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(Number(value) || 0);
}
function searchExploreHomeIsVisible() {
  if (tab !== "search" || discoveryTopic) return false;
  return searchSection === "trending" && !discoveryFeedQuery.trim();
}
function loadSearchExploreFeeds(force = false) {
  ensureDiscoveryOwner();
  const owner = discoveryOwner;
  if (api.authMode() !== "cloud") {
    searchExploreFeeds = { owner, status: "unavailable", lists: [], pinned: [], error: "", fetchedAt: Date.now() };
    return;
  }
  if (!force && searchExploreFeeds.owner === owner && searchExploreFeeds.status === "loading") return;
  if (!force && searchExploreFeeds.owner === owner && searchExploreFeeds.status === "success" &&
      Date.now() - searchExploreFeeds.fetchedAt < 60_000) return;
  if (!force && searchExploreFeeds.owner === owner && searchExploreFeeds.status === "error" &&
      Date.now() - searchExploreFeeds.fetchedAt < 60_000) return;
  const requestId = ++searchExploreFeedsRequestId;
  searchExploreFeeds = { owner, status: "loading", lists: [], pinned: searchExploreFeeds.pinned, error: "", fetchedAt: 0 };
  void Promise.all([
    requestCloudApi("/api/community/lists"),
    requestCloudApi("/api/community/preferences"),
  ]).then(([catalog, settings]) => {
    if (requestId !== searchExploreFeedsRequestId || owner !== discoveryOwnerKey()) return;
    if (!Array.isArray(catalog?.lists) || !Array.isArray(settings?.preferences?.pinned)) {
      throw new Error("Public feeds returned an incomplete response.");
    }
    searchExploreFeeds = {
      owner,
      status: "success",
      lists: catalog.lists.filter(list => list?.isPublic === true && list.owned !== true),
      pinned: settings.preferences.pinned,
      error: "",
      fetchedAt: Date.now(),
    };
    if (searchExploreHomeIsVisible()) renderSearchPreservingInput();
  }).catch(() => {
    if (requestId !== searchExploreFeedsRequestId || owner !== discoveryOwnerKey()) return;
    searchExploreFeeds = { owner, status: "error", lists: [], pinned: [], error: "Public feeds couldn’t be loaded.", fetchedAt: Date.now() };
    if (searchExploreHomeIsVisible()) renderSearchPreservingInput();
  });
}
async function pinSearchExploreFeed(listId, button) {
  if (!listId || button?.disabled) return;
  const owner = discoveryOwnerKey();
  const list = searchExploreFeeds.lists.find(item => item.id === listId && item.isPublic === true);
  if (!list) return toast("This public feed is no longer available.");
  if (api.authMode() !== "cloud") return toast("Connect your online account to pin feeds.");
  if (button) button.disabled = true;
  try {
    const current = await requestCloudApi("/api/community/preferences");
    if (owner !== discoveryOwnerKey()) return;
    const preferences = current?.preferences;
    if (!Array.isArray(preferences?.pinned)) throw new Error("Feed settings could not be loaded.");
    const feedId = `list:${list.id}`;
    if (preferences.pinned.includes(feedId)) {
      searchExploreFeeds = { ...searchExploreFeeds, pinned: preferences.pinned };
      toast("This feed is already pinned.");
      renderSearchPreservingInput();
      return;
    }
    if (preferences.pinned.length >= 30) {
      toast("You’ve reached the 30 pinned feed limit.");
      return;
    }
    const pinned = [...preferences.pinned, feedId];
    await requestCloudApi("/api/community/preferences", {
      method: "PUT",
      body: {
        pinned,
        filters: preferences.filters || {},
        mutedWords: Array.isArray(preferences.mutedWords) ? preferences.mutedWords : [],
        mutedAccounts: Array.isArray(preferences.mutedAccounts) ? preferences.mutedAccounts : [],
      },
    });
    if (owner !== discoveryOwnerKey()) return;
    searchExploreFeeds = { ...searchExploreFeeds, pinned };
    toast("Feed pinned to Community.");
    renderSearchPreservingInput();
  } catch (error) {
    toast(error?.message || "This feed couldn’t be pinned.");
  } finally {
    if (button?.isConnected) button.disabled = false;
  }
}
function searchExploreLandingMarkup({ videoBrowseMarkup = "", compact = false } = {}) {
  const topicState = discoveryTrends;
  const feedState = searchExploreFeeds;
  const topicRows = (topicState.topics || []).slice(0, compact ? 6 : 12).map((topic, index) => {
    const value = String(topic.topic || "").replace(/^#/, "").trim();
    const momentum = topic.direction === "new" ? "New" : topic.direction === "rising"
      ? `+${Math.max(0, Number(topic.changePercent) || 0)}%`
      : topic.direction === "cooling" ? "Cooling" : "Active";
    return `<button class="search-explore-trend" type="button" data-trending-topic="${esc(value)}">
      <span class="search-explore-rank">${index + 1}</span>
      <span class="search-explore-trend-copy"><b>${esc(value || "Trending topic")}</b>
        <small>${discoveryCompactNumber(topic.postCount)} posts · ${discoveryCompactNumber(topic.creatorCount)} creators</small></span>
      <span class="search-explore-momentum ${esc(topic.direction || "steady")}">${esc(momentum)}</span>
    </button>`;
  }).join("");
  const feedCards = (feedState.lists || []).slice(0, compact ? 3 : 20).map(list => {
    const feedId = `list:${list.id}`;
    const pinned = feedState.pinned.includes(feedId);
    const username = String(list.owner?.username || "").replace(/^@/, "");
    const description = String(list.description || "").trim() || "Public posts from this feed’s listed members.";
    const members = Array.isArray(list.members) ? list.members.length : 0;
    return `<article class="search-explore-feed">
      <div class="search-explore-feed-copy">
        <h3>${esc(list.name || "Public feed")}</h3>
        <small>${username ? `Feed by @${esc(username)}` : "Public Community feed"}${members ? ` · ${discoveryCompactNumber(members)} members` : ""}</small>
        <p>${esc(description)}</p>
      </div>
      <button type="button" class="search-explore-pin" data-search-pin-feed="${esc(list.id)}" aria-pressed="${pinned}" ${pinned ? "disabled" : ""}>${pinned ? "Pinned" : "Pin feed"}</button>
    </article>`;
  }).join("");
  const trendContent = topicState.status === "loading" && !topicRows
    ? `<div class="search-explore-state" role="status">Loading trends…</div>`
    : topicState.status === "error"
      ? `<div class="search-explore-state" role="status">${esc(topicState.error || "Trending topics couldn’t be loaded.")} <button type="button" data-trends-retry>Try again</button></div>`
      : topicRows || `<div class="search-explore-state">Public trends will appear when enough posts are available.</div>`;
  const feedContent = feedState.status === "loading"
    ? `<div class="search-explore-state" role="status">Loading public feeds…</div>`
    : feedState.status === "error"
      ? `<div class="search-explore-state" role="status">${esc(feedState.error)} <button type="button" data-search-feeds-retry>Try again</button></div>`
      : feedState.status === "unavailable"
        ? `<div class="search-explore-state">Connect an online account to discover public feeds.</div>`
        : feedCards || `<div class="search-explore-state">No public feeds are available yet.</div>`;
  const trendHeading = compact
    ? `<button type="button" class="search-explore-heading-button" data-search-discovery-expand aria-expanded="false">Trending</button>`
    : "Trending";
  const feedHeading = compact
    ? `<button type="button" class="search-explore-heading-button" data-search-discovery-expand aria-expanded="false">Discover feeds</button>`
    : "Discover feeds";
  const expandLabel = compact ? "See all" : "Show less";
  const expanded = !compact;
  const trendSeeAll = `<button type="button" class="search-explore-see-all" data-search-discovery-expand aria-expanded="${expanded}" aria-label="${compact ? "Show all trends and public feeds" : "Show fewer trends and feeds"}">${expandLabel}</button>`;
  const feedSeeAll = `<button type="button" class="search-explore-see-all" data-search-discovery-expand aria-expanded="${expanded}" aria-label="${compact ? "Show all trends and public feeds" : "Show fewer trends and feeds"}">${expandLabel}</button>`;
  return `<div class="search-explore-home ${compact ? "search-explore-home--combined" : ""}">
    <section class="search-explore-section" aria-label="Trending">
      <header><h2>${trendHeading}</h2>${trendSeeAll}</header>
      <div class="search-explore-list ${compact ? "search-explore-trend-rail" : ""}" aria-label="Trending topics">${trendContent}</div>
    </section>
    <section class="search-explore-section" aria-label="Discover feeds">
      <header><h2>${feedHeading}</h2>${feedSeeAll}</header>
      <div class="search-explore-list">${feedContent}</div>
    </section>
    ${videoBrowseMarkup ? `<section class="search-explore-section search-explore-videos" aria-label="Videos to explore">
      <header><h2>Videos to explore</h2></header>${videoBrowseMarkup}
    </section>` : ""}
  </div>`;
}
function searchPlacesMapGlyph() {
  return `<svg class="search-place-map-mark" viewBox="0 0 28 28" aria-hidden="true" focusable="false"><path d="m3.5 7 5.3-2.3 10.2 2.8 5.5-2.3v15.7L19 23.2 8.8 20.4l-5.3 2.3V7Z" fill="none" stroke="#808a98" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.8 4.7v15.7M19 7.5v15.7" fill="none" stroke="#a0a8b3" stroke-width="1.35"/><path d="M15.7 10.1c0 2.4-2.9 5.3-2.9 5.3s-2.9-2.9-2.9-5.3a2.9 2.9 0 1 1 5.8 0Z" fill="#1456d9" stroke="#fff" stroke-width="1"/><circle cx="12.8" cy="10.1" r="1" fill="#fff"/></svg>`;
}
function localTrendingTopics() {
  const now = Date.now();
  const cutoff = now - 48 * 60 * 60 * 1000;
  const currentCutoff = now - 24 * 60 * 60 * 1000;
  const topics = new Map();
  for (const post of api.posts()) {
    const createdAt = Number(post.createdAt ?? post.created ?? post.createdAtMs ?? 0);
    if (!createdAt || createdAt < cutoff) continue;
    const tags = new Set((post.tags || []).map(tag => String(tag).replace(/^#/, "").toLowerCase()).filter(Boolean));
    for (const topic of tags) {
      const stats = topics.get(topic) || { posts: new Set(), creators: new Set(), engagement: 0, previousPosts: 0 };
      if (createdAt >= currentCutoff) {
        stats.posts.add(post.id);
        stats.creators.add(post.author);
        stats.engagement += (post.likes?.length || 0) + (post.reposts?.length || 0) + (post.comments?.length || 0);
      } else stats.previousPosts++;
      topics.set(topic, stats);
    }
  }
  return [...topics.entries()].filter(([, stats]) => stats.posts.size >= 2 &&
    (stats.creators.size >= 2 || stats.posts.size >= 4))
    .map(([topic, stats]) => ({
      topic,
      postCount: stats.posts.size,
      creatorCount: stats.creators.size,
      engagementCount: stats.engagement,
      changePercent: stats.previousPosts ? Math.max(0, Math.round((stats.posts.size - stats.previousPosts) / stats.previousPosts * 100)) : 0,
      direction: !stats.previousPosts ? "new" : stats.posts.size > stats.previousPosts * 1.2 ? "rising"
        : stats.posts.size < stats.previousPosts * 0.8 ? "cooling" : "steady",
    })).sort((left, right) => right.postCount - left.postCount || right.engagementCount - left.engagementCount);
}
function loadDiscoveryTrends(force = false) {
  ensureDiscoveryOwner();
  if (api.authMode() !== "cloud") {
    if (discoveryTrends.status !== "success" || force) {
      discoveryTrends = { status: "success", topics: localTrendingTopics(), error: "", fetchedAt: Date.now() };
    }
    return;
  }
  if (!force && discoveryTrends.status === "loading") return;
  if (!force && discoveryTrends.status === "success" && Date.now() - discoveryTrends.fetchedAt < 60_000) return;
  if (!force && discoveryTrends.status === "error" && Date.now() - discoveryTrends.fetchedAt < 60_000) return;
  const requestId = ++discoveryTrendRequestId;
  discoveryTrends = { ...discoveryTrends, status: "loading", error: "" };
  void requestCloudApi("/api/discovery/trending").then(result => {
    if (requestId !== discoveryTrendRequestId || !Array.isArray(result?.topics)) return;
    discoveryTrends = { status: "success", topics: result.topics, error: "", fetchedAt: Date.now() };
    if (tab === "search" && searchSection === "trending" && !discoveryTopic) renderSearchPreservingInput();
  }).catch(() => {
    if (requestId !== discoveryTrendRequestId) return;
    discoveryTrends = { ...discoveryTrends, status: "error", error: "Trending topics could not be loaded.", fetchedAt: Date.now() };
    if (tab === "search" && searchSection === "trending" && !discoveryTopic) renderSearchPreservingInput();
  });
}
function localPeopleSuggestions(query, category) {
  const me = api.me();
  if (!me) return [];
  const following = new Set(me.following || []);
  const ownInterests = new Set((me.interests || []).map(value => String(value).toLowerCase()));
  const city = me.profileVisibility?.city === false ? "" : String(me.city || "").trim().toLowerCase();
  const needles = DISCOVERY_CATEGORY_TERMS[category] || [];
  return api.db().users.filter(user => user.id !== me.id && !following.has(user.id) &&
    user.isPrivate !== true && user.private !== true && !api.blocked(me.id, user.id))
    .map(user => {
      const interests = (user.profileVisibility?.interests === false ? [] : user.interests || [])
        .map(value => String(value).toLowerCase());
      const sharedInterests = [...ownInterests].filter(interest => interests.includes(interest)).slice(0, 3);
      const matchesQuery = !query || [user.username, user.name, ...interests].some(value => String(value || "").toLowerCase().includes(query));
      const matchesCategory = !needles.length || interests.some(interest => needles.some(needle => interest.includes(needle)));
      const sameCity = Boolean(city && user.profileVisibility?.city !== false &&
        String(user.city || "").trim().toLowerCase() === city);
      const mutualFollowCount = (user.following || []).filter(id => following.has(id)).length;
      return { profile: {
        id: user.id, username: user.username, displayName: user.name || user.username,
        avatar: user.avatar, bio: user.bio, city: user.profileVisibility?.city === false ? undefined : user.city,
        interests: user.profileVisibility?.interests === false ? undefined : user.interests,
      }, mutualFollowCount, sharedInterests, sameCity,
      reason: mutualFollowCount ? "mutual-followers" : sharedInterests.length ? "shared-interests"
        : sameCity ? "same-city" : "new-to-oldtime",
      score: mutualFollowCount * 3 + sharedInterests.length * 2 + Number(sameCity) };
    }).filter(person => matchesQueryAndCategory(person, query, needles))
    .sort((left, right) => right.score - left.score || left.profile.username.localeCompare(right.profile.username))
    .slice(0, 30).map(({ score: _score, ...person }) => person);
}
function matchesQueryAndCategory(person, query, needles) {
  const profile = person.profile;
  const interests = profile.interests || [];
  return (!query || [profile.username, profile.displayName, profile.bio, ...interests]
    .some(value => String(value || "").toLowerCase().includes(query))) &&
    (!needles.length || interests.some(interest => needles.some(needle => String(interest).toLowerCase().includes(needle))));
}
function scheduleDiscoveryPeople(query = discoveryPeopleQuery, category = discoveryPeopleCategory, force = false) {
  ensureDiscoveryOwner();
  if (discoveryPeopleTimer) clearTimeout(discoveryPeopleTimer);
  discoveryPeopleTimer = null;
  const normalizedQuery = String(query || "").trim().toLowerCase();
  const serverQuery = normalizedQuery.length >= 2 ? normalizedQuery : "";
  const key = `${discoveryOwner}|${category}|${serverQuery}`;
  if (!force && discoveryPeople.key === key && ["loading", "success"].includes(discoveryPeople.status)) return;
  const requestId = ++discoveryPeopleRequestId;
  if (api.authMode() !== "cloud") {
    const suggestions = localPeopleSuggestions(normalizedQuery, category);
    discoveryPeople = { key, status: "success", suggestions, hasMore: false, nextOffset: suggestions.length, error: "", fetchedAt: Date.now() };
    return;
  }
  discoveryPeople = { key, status: "loading", suggestions: [], hasMore: false, nextOffset: 0, error: "", fetchedAt: 0 };
  discoveryPeopleTimer = setTimeout(async () => {
    discoveryPeopleTimer = null;
    try {
      const params = new URLSearchParams({ limit: "30", offset: "0" });
      if (category) params.set("category", category);
      if (serverQuery) params.set("query", serverQuery);
      const result = await requestCloudApi(`/api/discovery/people?${params}`);
      if (!Array.isArray(result?.suggestions)) throw new Error("Invalid people response.");
      if (requestId !== discoveryPeopleRequestId || discoveryPeople.key !== key) return;
      discoveryPeople = { key, status: "success", suggestions: result.suggestions, hasMore: result.hasMore === true,
        nextOffset: Number(result.nextOffset) || 0, error: "", fetchedAt: Date.now() };
    } catch {
      if (requestId !== discoveryPeopleRequestId || discoveryPeople.key !== key) return;
      discoveryPeople = { key, status: "error", suggestions: [], hasMore: false, nextOffset: 0,
        error: "People suggestions could not be loaded.", fetchedAt: 0 };
    }
    if (tab === "search" && searchSection === "people") renderSearchPreservingInput();
  }, 220);
}
function loadMoreDiscoveryPeople() {
  if (api.authMode() !== "cloud" || !discoveryPeople.hasMore || discoveryPeople.status === "loading") return;
  const key = discoveryPeople.key;
  const requestId = ++discoveryPeopleRequestId;
  const params = new URLSearchParams({ limit: "30", offset: String(discoveryPeople.nextOffset) });
  if (discoveryPeopleCategory) params.set("category", discoveryPeopleCategory);
  const normalizedQuery = discoveryPeopleQuery.trim().toLowerCase();
  if (normalizedQuery.length >= 2) params.set("query", normalizedQuery);
  discoveryPeople = { ...discoveryPeople, status: "loading", error: "" };
  void requestCloudApi(`/api/discovery/people?${params}`).then(result => {
    if (requestId !== discoveryPeopleRequestId || discoveryPeople.key !== key || !Array.isArray(result?.suggestions)) return;
    discoveryPeople = { ...discoveryPeople, status: "success",
      suggestions: [...discoveryPeople.suggestions, ...result.suggestions],
      hasMore: result.hasMore === true, nextOffset: Number(result.nextOffset) || discoveryPeople.nextOffset,
      fetchedAt: Date.now() };
    if (tab === "search" && searchSection === "people") renderSearchPreservingInput();
  }).catch(() => {
    if (requestId !== discoveryPeopleRequestId || discoveryPeople.key !== key) return;
    discoveryPeople = { ...discoveryPeople, status: "error", error: "More people could not be loaded." };
    if (tab === "search" && searchSection === "people") renderSearchPreservingInput();
  });
}
function loadDiscoveryTopicPosts(topic, append = false) {
  if (!topic) return;
  ensureDiscoveryOwner();
  const sameTopic = discoveryTopicPosts.topic === topic;
  if (!append && sameTopic && ["loading", "success", "error"].includes(discoveryTopicPosts.status)) return;
  if (append && (!sameTopic || !discoveryTopicPosts.hasMore || discoveryTopicPosts.status === "loading")) return;
  const requestId = ++discoveryTopicRequestId;
  const offset = append ? discoveryTopicPosts.nextOffset : 0;
  discoveryTopicPosts = {
    topic, status: "loading",
    posts: sameTopic ? discoveryTopicPosts.posts : [],
    hasMore: sameTopic && discoveryTopicPosts.hasMore,
    nextOffset: offset, error: "",
  };
  const load = api.authMode() === "cloud"
    ? requestCloudApi(`/api/discovery/trending/${encodeURIComponent(topic)}/posts?limit=20&offset=${offset}`)
    : Promise.resolve(null);
  void load.then(result => {
    let posts = result?.posts;
    let hasMore = result?.hasMore === true;
    let nextOffset = Number(result?.nextOffset) || 0;
    if (api.authMode() !== "cloud") {
      const matches = api.posts().filter(post => (post.tags || []).some(tag =>
        String(tag).replace(/^#/, "").toLowerCase() === topic.toLowerCase()));
      posts = matches.slice(offset, offset + 20).map(post => {
        const author = api.user(post.author);
        return {
          id: post.id, text: post.caption || "", createdAt: post.createdAt || post.created,
          author: { id: author?.id, username: author?.username || "member", displayName: author?.name || author?.username || "Oldtime member", avatar: author?.avatar },
          likeCount: post.likes?.length || 0, commentCount: post.comments?.length || 0,
        };
      });
      hasMore = offset + posts.length < matches.length;
      nextOffset = offset + posts.length;
    }
    if (requestId !== discoveryTopicRequestId || discoveryTopicPosts.topic !== topic) return;
    if (!Array.isArray(posts)) throw new Error("Invalid topic posts response.");
    discoveryTopicPosts = { topic, status: "success",
      posts: append ? [...discoveryTopicPosts.posts, ...posts] : posts,
      hasMore, nextOffset, error: "" };
    if (tab === "search" && discoveryTopic === topic) render();
  }).catch(() => {
    if (requestId !== discoveryTopicRequestId || discoveryTopicPosts.topic !== topic) return;
    discoveryTopicPosts = { ...discoveryTopicPosts, status: "error", error: "Posts for this topic could not be loaded." };
    if (tab === "search" && discoveryTopic === topic) render();
  });
}
function discoveryReasonLabel(person) {
  if (person.mutualFollowCount > 0) return `${person.mutualFollowCount} mutual ${person.mutualFollowCount === 1 ? "connection" : "connections"}`;
  if (person.sharedInterests?.length) return `You both like ${person.sharedInterests.slice(0, 2).join(" · ")}`;
  if (person.sameCity) return "In your area";
  return "New to Oldtime";
}
function trendingTopicMarkup(topic, index) {
  const momentum = topic.direction === "new" ? "New" : topic.direction === "rising"
    ? `+${topic.changePercent}%` : topic.direction === "cooling" ? "Cooling" : "Active";
  return `<button class="discovery-trend-row" type="button" data-trending-topic="${esc(topic.topic)}">
    <span class="discovery-trend-rank">${index + 1}</span>
    <span class="discovery-trend-copy"><b>#${esc(topic.topic)}</b><small>${discoveryCompactNumber(topic.postCount)} posts · ${discoveryCompactNumber(topic.creatorCount)} creators</small></span>
    <span class="discovery-trend-momentum ${esc(topic.direction)}">${esc(momentum)}</span><span class="discovery-trend-chevron" aria-hidden="true">›</span>
  </button>`;
}
function discoveryPersonMarkup(person) {
  const profile = person.profile || {};
  const id = api.authMode() === "cloud" ? api.cloudAuthorId(profile) : profile.id;
  const avatar = profile.avatar || automaticAvatar(profile.id || profile.username || "oldtime");
  const interests = (profile.interests || []).slice(0, 3);
  return `<article class="discovery-person">
    <button type="button" class="discovery-person-profile" data-discovery-profile="${esc(id)}">
       <img ${profileMediaSource(avatar)} alt="" loading="lazy" decoding="async" />
      <span class="discovery-person-copy"><b>${esc(profile.displayName || profile.username || "Oldtime member")}</b><small>@${esc(profile.username || "member")}</small>
      <span class="discovery-person-reason">${esc(discoveryReasonLabel(person))}</span>
      ${interests.length ? `<span class="discovery-person-interests">${interests.map(interest => `<i>${esc(interest)}</i>`).join("")}</span>` : ""}
      </span>
    </button>
    <div class="discovery-person-actions"><button type="button" class="discovery-view-profile" data-discovery-profile="${esc(id)}">View profile</button><button type="button" class="discovery-follow-button" data-discovery-follow="${esc(id)}" aria-label="Follow @${esc(profile.username || "member")}">Follow</button></div>
  </article>`;
}
function scheduleDiscoveryPlaces(query = discoveryPlaceQuery, force = false) {
  ensureDiscoveryOwner();
  const normalized = String(query || "").trim();
  const serverQuery = normalized.length >= 2 ? normalized : "";
  const key = `${discoveryOwner}|${serverQuery.toLowerCase()}`;
  const fresh = ["loading", "error"].includes(discoveryPlaces.status) ||
    (discoveryPlaces.status === "success" && Date.now() - discoveryPlaces.fetchedAt < 60_000);
  if (!force && discoveryPlaces.key === key &&
      ["loading", "success", "error"].includes(discoveryPlaces.status) && fresh) return;
  if (discoveryPlacesTimer) clearTimeout(discoveryPlacesTimer);
  discoveryPlacesTimer = null;
  if (api.authMode() !== "cloud") {
    discoveryPlaces = { key, status: "error", places: [], error: "Connect your online account to explore tagged places.", fetchedAt: 0 };
    return;
  }
  const requestId = ++discoveryPlacesRequestId;
  discoveryPlaces = { key, status: "loading", places: [], error: "", fetchedAt: 0 };
  discoveryPlacesTimer = setTimeout(async () => {
    discoveryPlacesTimer = null;
    try {
      const params = new URLSearchParams();
      if (serverQuery) params.set("q", serverQuery);
      if(!serverQuery&&placesLocationCoordinates)for(const [key,value] of Object.entries(placesLocationCoordinates))params.set(key,String(value));
      const suffix = params.size ? `?${params}` : "";
      const [tagged,mapped] = await Promise.allSettled([
        requestCloudApi(`/api/places/${serverQuery?"discovery":"landing"}${suffix}`),
        mappedPlaceSuggestions(normalized,requestCloudApi),
      ]);
      if(tagged.status==="rejected"&&mapped.status==="rejected")throw tagged.reason;
      const result=tagged.status==="fulfilled"?tagged.value:{places:[]};
      if (!Array.isArray(result?.places)) throw new Error("Place discovery returned an invalid response.");
      if (requestId !== discoveryPlacesRequestId || discoveryPlaces.key !== key) return;
      discoveryPlaces = { key, status: "success", landing:result.landing||null, places: mergePlaceResults(result.places,mapped.status==="fulfilled"?mapped.value:[]),
        error: mapped.status==="rejected" ? "Place search is busy. Please try again in a moment." : "", fetchedAt: Date.now() };
    } catch {
      if (requestId !== discoveryPlacesRequestId || discoveryPlaces.key !== key) return;
      discoveryPlaces = { key, status: "error", places: [], error: "Places couldn’t be loaded.", fetchedAt: 0 };
    }
    if (tab === "search" && searchSection === "places") renderSearchPreservingInput();
  }, 500);
}
function scheduleDiscoveryPlaceFeed(query = discoveryPlaceQuery, force = false) {
  ensureDiscoveryOwner();
  const normalized = String(query || "").trim();
  const serverQuery = normalized.length >= 2 ? normalized : "";
  const key = `${discoveryOwner}|${serverQuery.toLowerCase()}`;
  const fresh = discoveryPlaceFeed.key === key &&
    (discoveryPlaceFeed.status === "loading" ||
      discoveryPlaceFeed.status === "loadingMore" ||
      discoveryPlaceFeed.status === "error" ||
      (discoveryPlaceFeed.status === "ready" && Date.now() - discoveryPlaceFeed.fetchedAt < 60_000));
  if (!force && fresh) return;
  if (discoveryPlaceFeedTimer) clearTimeout(discoveryPlaceFeedTimer);
  discoveryPlaceFeedTimer = null;
  if (api.authMode() !== "cloud") {
    discoveryPlaceFeed = { key, status: "error", posts: [], hasMore: false, nextOffset: 0,
    error: "Connect your online account to browse public place posts.", moreError: false, fetchedAt: Date.now() };
    return;
  }
  discoveryPlaceFeedRequestId++;
  discoveryPlaceFeed = { key, status: "loading", posts: [], hasMore: false, nextOffset: 0,
    error: "", moreError: false, fetchedAt: 0 };
  discoveryPlaceFeedTimer = setTimeout(() => {
    discoveryPlaceFeedTimer = null;
    void loadDiscoveryPlaceFeed({ query: serverQuery, force: true });
  }, 350);
}
async function loadDiscoveryPlaceFeed({ query = discoveryPlaceQuery, append = false, force = false } = {}) {
  ensureDiscoveryOwner();
  const normalized = String(query || "").trim();
  const serverQuery = normalized.length >= 2 ? normalized : "";
  const key = `${discoveryOwner}|${serverQuery.toLowerCase()}`;
  if (append && (discoveryPlaceFeed.key !== key || discoveryPlaceFeed.status === "loadingMore" || !discoveryPlaceFeed.hasMore)) return;
  const fresh = discoveryPlaceFeed.key === key &&
    (discoveryPlaceFeed.status === "loading" ||
      (discoveryPlaceFeed.status === "ready" && Date.now() - discoveryPlaceFeed.fetchedAt < 60_000));
  if (!append && !force && fresh) return;
  if (discoveryPlaceFeedTimer) clearTimeout(discoveryPlaceFeedTimer);
  discoveryPlaceFeedTimer = null;
  if (api.authMode() !== "cloud") {
    discoveryPlaceFeed = { key, status: "error", posts: [], hasMore: false, nextOffset: 0,
      error: "Connect your online account to browse public place posts.", moreError: false, fetchedAt: Date.now() };
    if (tab === "search" && searchSection === "places") renderSearchPreservingInput();
    return;
  }
  const requestId = ++discoveryPlaceFeedRequestId;
  const offset = append ? discoveryPlaceFeed.nextOffset : 0;
  discoveryPlaceFeed = { ...discoveryPlaceFeed, key, status: append ? "loadingMore" : "loading",
    error: "", moreError: false, ...(append ? {} : { posts: [], hasMore: false, nextOffset: 0 }) };
  const params = new URLSearchParams({ offset: String(offset), limit: "18" });
  if (serverQuery) params.set("q", serverQuery);
  try {
    const result = await requestCloudApi(`/api/places/feed?${params}`);
    if (requestId !== discoveryPlaceFeedRequestId || discoveryPlaceFeed.key !== key) return;
    const posts = (Array.isArray(result?.posts) ? result.posts : []).map(post => {
      const media = Array.isArray(post.media) ? post.media : [];
      const video = media.some(item => String(item?.contentType || "").startsWith("video/"));
      return {
        ...post,
        caption: post.text || "",
        created: post.createdAt,
        kind: media.length > 1 ? "carousel" : video ? "video" : media.length ? "photo" : "text",
        media: postMediaReferences({ media }),
        mediaPosters: media.map(item => {
          const poster = item?.thumbnailReference || item?.thumbnailUrl || null;
          return poster && !isDefaultAvatarMediaReference(poster) ? poster : null;
        }),
        author: post.author ? { ...post.author, avatar: post.author.avatar || "" } : null,
      };
    });
    const combined = append
      ? [...discoveryPlaceFeed.posts, ...posts.filter(post => !discoveryPlaceFeed.posts.some(old => old.id === post.id))]
      : posts;
    discoveryPlaceFeed = {
      key, status: "ready", posts: combined, hasMore: result?.hasMore === true,
      nextOffset: Number.isSafeInteger(result?.nextOffset) ? result.nextOffset : offset + posts.length,
      error: "", moreError: false, fetchedAt: Date.now(),
    };
  } catch {
    if (requestId !== discoveryPlaceFeedRequestId || discoveryPlaceFeed.key !== key) return;
    discoveryPlaceFeed = { ...discoveryPlaceFeed, status: discoveryPlaceFeed.posts.length ? "ready" : "error",
      error: "Public place posts couldn’t be loaded.", moreError: append, fetchedAt: Date.now() };
  }
  if (requestId === discoveryPlaceFeedRequestId && tab === "search" && searchSection === "places") renderSearchPreservingInput();
}
function isCommunitySurfaceMediaPost(post) {
  return ["community", "both"].includes(post?.destination) && profilePostMedia(post).length > 0;
}
function discoveryFeedSource() {
  const posts = api.authMode() === "cloud"
    ? api.cloudDiscoveryFeedPosts()
    : api.posts();
  return posts.filter(post => !isCommunitySurfaceMediaPost(post) && isFeedHomePost(post) && profilePostMedia(post).length);
}
function loadDiscoveryFeed(force = false) {
  ensureDiscoveryOwner();
  if (api.authMode() !== "cloud") return;
  const status = api.cloudDiscoveryFeedStatus();
  if (status.loading || (!force && status.loaded)) return;
  const requestId = ++discoveryFeedRequestId;
  void api.refreshCloudDiscoveryFeed({ force }).then(() => {
    if (requestId !== discoveryFeedRequestId || tab !== "search" || searchSection !== "trending") return;
    renderSearchPreservingInput();
  }).catch(() => {
    if (requestId !== discoveryFeedRequestId || tab !== "search" || searchSection !== "trending") return;
    renderSearchPreservingInput();
  });
}
function loadMoreDiscoveryFeed() {
  if (api.authMode() !== "cloud") return;
  const status = api.cloudDiscoveryFeedStatus();
  if (status.loading || !status.hasMore) return;
  const requestId = ++discoveryFeedRequestId;
  void api.loadMoreCloudDiscoveryFeed().then(() => {
    if (requestId !== discoveryFeedRequestId || tab !== "search" || searchSection !== "trending") return;
    renderSearchPreservingInput();
  }).catch(() => {
    if (requestId !== discoveryFeedRequestId || tab !== "search" || searchSection !== "trending") return;
    renderSearchPreservingInput();
  });
}
function isDiscoveryVideoPost(post) {
  return post?.kind === "video" || post?.mediaTypes?.some(type => String(type).startsWith("video/"));
}
function discoveryFeedTile(post) {
  const media = profilePostMedia(post)[0] || "";
  const isVideo = Boolean(media) && isDiscoveryVideoPost(post);
  const localAttrs = isLocalMedia(media)
    ? `data-local-media="${esc(media)}" data-local-media-owner="${esc(post.author)}"`
    : `src="${esc(renderMediaUrl(media))}"`;
  const rawPoster = post.mediaPosters?.[0];
  const poster = isDefaultAvatarMediaReference(rawPoster) ? "" : rawPoster;
  const caption = String(post.caption || post.text || "").trim();
  const label = caption ? caption.slice(0, 100) : isVideo ? "Open video post" : "Open photo post";
  const mediaMarkup = post.creativeProject
    ? creativeMediaMarkup(post, esc, false, true)
    : isVideo
      ? `<video class="explore-feed-video" ${localAttrs}${poster ? ` poster="${esc(renderMediaUrl(poster))}"` : ""} muted playsinline preload="metadata"></video>`
      : `<img class="explore-feed-image" ${localAttrs} alt="" loading="lazy" />`;
  const videoTile = isVideo && !post.creativeProject;
  if (videoTile) {
    const author = post.author && typeof post.author === "object" ? post.author : {};
    const authorId = String(author.id || post.authorId || "");
    const authorName = String(author.displayName || author.name || author.username || "Oldtime member");
    const avatar = author.avatar ? profileMediaSource(author.avatar) : "";
    const likes = Number(post.likeCount ?? post.likes?.length ?? 0);
    return `<article class="explore-video-card places-post">
      <button type="button" class="places-post-main explore-video-main" data-discovery-feed-post="${esc(post.id)}" aria-label="${esc(`${label}, video`)}">
        <span class="places-post-media">
          ${mediaMarkup}
          <span class="places-post-type" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg></span>
        </span>
      </button>
      <div class="places-post-detail">
        ${caption ? `<p class="places-post-caption">${esc(caption)}</p>` : ""}
        <div class="places-post-byline">
          ${authorId
            ? `<button type="button" class="places-post-author" data-profile="${esc(authorId)}">${avatar ? `<img ${avatar} alt="" loading="lazy" decoding="async">` : ""}<span>${esc(authorName)}</span></button>`
            : `<span class="places-post-author">${avatar ? `<img ${avatar} alt="" loading="lazy" decoding="async">` : ""}<span>${esc(authorName)}</span></span>`}
          <span class="places-post-stats" aria-label="${discoveryCompactNumber(likes)} likes"><span aria-hidden="true">♡</span> ${discoveryCompactNumber(likes)}</span>
        </div>
      </div>
    </article>`;
  }
  return `<button type="button" class="explore-feed-tile" data-discovery-feed-post="${esc(post.id)}" aria-label="${esc(`${label}${isVideo ? ", video" : ""}`)}">
    ${mediaMarkup}
    ${isVideo ? `<span class="explore-feed-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg></span>` : ""}
  </button>`;
}
function localSearchResultsMarkup(query, type = "all") {
  const q = String(query || "").trim().toLowerCase().replace(/^[@#]/, "");
  const resultTypes = [["all", "Top"], ["people", "People"], ["hashtags", "Topics"], ["videos", "Videos"], ["places", "Places"]];
  const filters = `<div class="xe-chips" role="tablist" aria-label="Search results">${resultTypes.map(([id, label]) =>
    `<button type="button" role="tab" class="xe-chip ${type === id ? "on" : ""}" aria-selected="${type === id}" data-local-search-type="${id}">${label}</button>`).join("")}</div>`;
  const me = api.me();
  const blocked = user => Boolean(me && api.blocked(me.id, user.id));
  const people = api.db().users.filter(user => user.id !== me?.id && user.isPrivate !== true && user.private !== true && !blocked(user))
    .filter(user => !q || [user.username, user.name, user.bio, ...(user.interests || [])]
      .some(value => String(value || "").toLowerCase().includes(q)))
    .slice(0, type === "all" ? 6 : 30)
    .map(user => ({ profile: {
      id: user.id, username: user.username, displayName: user.name || user.username, avatar: user.avatar,
      bio: user.bio, interests: user.profileVisibility?.interests === false ? undefined : user.interests,
    }, reason: "new-to-oldtime", mutualFollowCount: 0, sharedInterests: [] }));
  const topics = localTrendingTopics().filter(topic => !q || topic.topic.includes(q)).slice(0, type === "all" ? 4 : 30);
  const videos = discoveryFeedSource().filter(post => isDiscoveryVideoPost(post) &&
    (!q || `${post.caption || post.text || ""} ${(post.tags || []).join(" ")}`.toLowerCase().includes(q)))
    .slice(0, type === "all" ? 6 : 24);
  const sections = [];
  if ((type === "all" || type === "people") && people.length) {
    sections.push(`<section class="xe-section"><h2>People</h2><div class="xe-people-list xe-people-card-grid">${people.map(discoveryPersonMarkup).join("")}</div></section>`);
  }
  if ((type === "all" || type === "hashtags") && topics.length) {
    sections.push(`<section class="xe-section"><h2>${q ? "Topics" : "Trending topics"}</h2>${topics.map(trendingTopicMarkup).join("")}</section>`);
  }
  if ((type === "all" || type === "videos") && videos.length) {
    sections.push(`<section class="xe-section"><h2>${q ? "Videos" : "Videos for you"}</h2><div class="xe-grid" aria-label="Search videos">${videos.map(discoveryFeedTile).join("")}</div></section>`);
  }
  if (type === "places") sections.push(`<div class="xe-empty"><b>Places need an online connection</b><p>Reconnect to search public tagged places.</p></div>`);
  if (!sections.length) sections.push(`<div class="xe-empty"><b>${q ? `Nothing found for “${esc(q)}”` : "Nothing to show yet"}</b><p>${q ? "Try another name, topic, video, or place." : "Search for a name, topic, video, or place."}</p></div>`);
  return `${filters}${sections.join("")}`;
}
function search() {
  ensureDiscoveryOwner();
  const showCombinedSearchLanding = searchSection === "trending" &&
    !discoveryTopic && !discoveryFeedQuery.trim();
  if (showCombinedSearchLanding) {
    loadDiscoveryTrends();
    loadSearchExploreFeeds();
  }
  if (searchSection === "trending" && !discoveryTopic && api.authMode() !== "cloud") loadDiscoveryFeed();
  if (searchSection === "places") {
    scheduleDiscoveryPlaces();
    scheduleDiscoveryPlaceFeed();
    requestAnimationFrame(() => {
      if (tab !== "search" || searchSection !== "places") return;
      mountPlaceDetailMap(discoveryPlaceMapVisible ? app.querySelector("[data-search-place-map]") : null);
    });
  } else if (placeDetailMapHost?.hasAttribute("data-search-place-map")) {
    disposePlaceDetailMap();
  }

  const me = api.me();
  const q = searchQ.trim().toLowerCase().replace(/^[@#]/, "");
  let body = "";
  let input = "";
  let exploreTopics = [];
  let exploreTopicOptions = [];
  let exploreHiddenTopics = [];
  let exploreActiveTopic = "";
  if (searchSection === "trending" && discoveryTopic) {
    loadDiscoveryTopicPosts(discoveryTopic);
    const state = discoveryTopicPosts;
    const topicVideos = state.posts.filter(isDiscoveryVideoPost);
    body = `<button type="button" class="discovery-topic-back" data-topic-back>‹ <span>Trending</span></button>
      <div class="discovery-topic-title"><span>#${esc(discoveryTopic)}</span><small>Public videos · recent activity</small></div>
      ${state.status === "loading" && !state.posts.length ? `<div class="discovery-state" role="status">Loading videos…</div>` : ""}
      ${state.status === "error" ? `<div class="discovery-state" role="status">Videos for this topic could not be loaded. <button class="discovery-retry" type="button" data-topic-retry>Try again</button></div>` : ""}
      ${state.status === "success" && !topicVideos.length ? `<div class="discovery-state" role="status">No public videos are available for this topic right now.</div>` : ""}
      <div class="explore-feed-grid discovery-topic-posts" aria-label="Videos in this topic">${topicVideos.map(discoveryFeedTile).join("")}</div>
      ${state.hasMore ? `<button type="button" class="discovery-load-more" data-topic-more ${state.status === "loading" ? "disabled" : ""}>${state.status === "loading" ? "Loading…" : "Load more videos"}</button>` : ""}`;
  } else if (exploreIsCloud() && searchSection !== "places") {
    ({ input, body, topics: exploreTopics, topicOptions: exploreTopicOptions,
      hiddenTopics: exploreHiddenTopics, activeTopic: exploreActiveTopic } = exploreEco.markup({
      homeTopic: discoveryHomeTopic,
       showTypeFilters: searchSection === "search",
      searching: searchSection === "search",
    }));
  } else if (searchSection === "search") {
    input = `<label class="search-explore-search">${ic.search}<input class="search" id="q" type="search" maxlength="120" placeholder="Search Oldtime" aria-label="Search Oldtime" value="${esc(searchQ)}" autocomplete="off" /></label>`;
    body = localSearchResultsMarkup(searchQ, localSearchType);
  } else if (searchSection === "trending") {
    const posts = discoveryFeedSource();
    const visiblePosts = posts.filter(post => isDiscoveryVideoPost(post) && matchesDiscoveryPost(post, {
      query: discoveryFeedQuery,
    }) && matchesHomeTopicPost(post, discoveryHomeTopic, me));
    const status = api.authMode() === "cloud"
      ? api.cloudDiscoveryFeedStatus()
      : { loaded: true, loading: false, error: "", hasMore: false };
    input = `<label class="discovery-search-wrap explore-feed-search">${ic.search}<input class="search discovery-search" id="q" type="search" placeholder="Search videos" value="${esc(discoveryFeedQuery)}" aria-label="Search videos" /></label>`;
    body = `${status.loading && !posts.length ? `<div class="explore-feed-skeleton" role="status" aria-label="Loading Explore posts">${Array.from({ length: 9 }, () => `<span></span>`).join("")}</div>` : ""}
      ${status.error && !posts.length ? `<div class="discovery-state" role="status">Explore posts couldn’t be loaded. <button type="button" class="discovery-retry" data-discovery-feed-retry>Try again</button></div>` : ""}
      ${!status.loading && !status.error && !visiblePosts.length ? `<div class="discovery-empty explore-feed-empty"><b>${posts.some(isDiscoveryVideoPost) ? "No matching videos" : "No videos to explore yet"}</b><p>${posts.some(isDiscoveryVideoPost) ? "Try another word or interest." : "Public videos will appear here."}</p></div>` : ""}
      ${visiblePosts.length ? `<div class="discovery-section-heading explore-discover-heading"><h2>Videos for you</h2><span>Public videos</span></div>` : ""}
      <div class="explore-feed-grid" aria-label="Explore videos">${visiblePosts.map(discoveryFeedTile).join("")}</div>
      ${status.error && posts.length ? `<div class="discovery-state explore-feed-load-state" role="status">More posts couldn’t be loaded. <button type="button" class="discovery-retry" data-discovery-feed-retry>Try again</button></div>` : ""}
      ${status.hasMore ? `<button type="button" class="discovery-load-more explore-feed-more" data-discovery-feed-more ${status.loading ? "disabled" : ""}>${status.loading ? "Loading…" : "Load more"}</button>` : ""}`;
  } else if (searchSection === "places") {
    input = `<label class="discovery-search-wrap">${ic.search}<input class="search discovery-search" id="q" type="search" placeholder="Search places" aria-label="Search places" value="${esc(discoveryPlaceQuery)}" /></label>`;
    body = renderDiscoveryPlaces({
      landing: discoveryPlaces.landing || (!discoveryPlaceQuery.trim()?{loved:[],nearby:[],suggested:[],trending:[]}:null),
      location: {status:nearbyLocationStatus==="located"?"granted":nearbyLocationStatus,label:placesBrowse.locationLabel},
      places: discoveryPlaces.places.map(item => ({
        ...item,
        previewReference: item.previewReference || null,
      })),
      loading: discoveryPlaces.status === "loading" || discoveryPlaces.status === "idle",
      error: discoveryPlaces.error || "",
      query: discoveryPlaceQuery,
      feed: discoveryPlaceFeed,
      mapVisible: discoveryPlaceMapVisible,
    });
  } else {
    const videos = api.posts().filter(post => !isCommunitySurfaceMediaPost(post) && isDiscoveryVideoPost(post) &&
      (!q || String(post.caption || post.text || "").toLowerCase().includes(q) ||
        (post.tags || []).some(tag => String(tag).toLowerCase().includes(q))))
      .filter(post => matchesHomeTopicPost(post, discoveryHomeTopic, me));
    input = `<input class="search" id="q" type="search" placeholder="Search Oldtime" aria-label="Search Oldtime" value="${esc(searchQ)}" />`;
    body = `<div class="explore-feed-grid" aria-label="Search videos">${videos.slice(0, 24).map(discoveryFeedTile).join("")}</div>
      ${!videos.length ? `<div class="empty"><b>${q ? "No matching videos" : "No videos to explore yet"}</b><p>${q ? "Try another word or interest." : "Public videos will appear here."}</p></div>` : ""}`;
  }
  const searchLandingDiscovery = showCombinedSearchLanding
    ? searchExploreLandingMarkup({ compact: !searchExploreAllExpanded })
    : "";

  const topicEntries = [{ id: "all", label: "For You", source: "home" }];
  const seenTopicIds = new Set(["all"]);
  const hiddenTopicIds = new Set(exploreHiddenTopics);
  let dynamicTopicCount = 0;
  for (const topic of [...exploreTopics, ...exploreTopicOptions]) {
    const id = String(topic?.id || "").trim();
    const label = String(topic?.label || "").trim();
    if (!id || !label || seenTopicIds.has(id) || hiddenTopicIds.has(id) || dynamicTopicCount >= 12) continue;
    seenTopicIds.add(id);
    dynamicTopicCount++;
    topicEntries.push({ id, label, source: "explore" });
  }
  topicEntries.push(...HOME_TOPICS.filter(topic => topic.id !== "all" && !seenTopicIds.has(topic.id) && !hiddenTopicIds.has(topic.id))
    .map(topic => ({ ...topic, source: "home" })));
  const homeTopicTabs = !discoveryTopic && !["search", "places"].includes(searchSection) && !(exploreIsCloud() && exploreEco.isSearching())
    ? `<div class="discovery-home-topic-tabs" aria-label="Discover controls">
      <nav class="discovery-topic-scroll" role="tablist" aria-label="Discover topics">${topicEntries.map(topic => {
      const selected = topic.source === "explore"
        ? exploreActiveTopic === topic.id
        : !exploreActiveTopic && discoveryHomeTopic === topic.id;
      const action = topic.source === "explore"
        ? `data-discovery-explore-topic="${esc(topic.id)}"`
        : `data-discovery-home-topic="${esc(topic.id)}"`;
      return `<button type="button" class="discovery-category ${selected ? "on" : ""}" role="tab" aria-selected="${selected}" ${action}>${esc(topic.label)}</button>`;
    }).join("")}</nav>
      <button type="button" class="discovery-filter-button" id="discover-menu-toggle" aria-label="Discover filters and settings" aria-haspopup="menu" aria-controls="discover-browse-menu" aria-expanded="false">
        ${icon("sliders")}
      </button>
      <div class="discovery-browse-menu" id="discover-browse-menu" role="menu" aria-label="Discover options" hidden>
        ${exploreIsCloud() && searchSection === "trending" ? `<div class="discovery-browse-label" role="presentation">Video order</div>
          ${exploreEco.sortModes().map(([value, label]) => `<button type="button" role="menuitemradio" aria-checked="${exploreEco.currentSort() === value}" data-xe-sort="${value}">${esc(label)}</button>`).join("")}
          <div class="discovery-browse-separator" role="separator"></div>` : ""}
        ${exploreIsCloud() ? `<button type="button" role="menuitem" data-xe-tune aria-label="Customize Discover feed">Customize feed</button>` : ""}
      </div>
    </div>`
    : "";
  const videoPreviewRail = exploreIsCloud() && searchSection === "trending" && !discoveryTopic
    ? exploreEco.videoPreviewRailMarkup()
    : "";
  const videosSelected = searchSection !== "places";
  const searchHeaderOpen = ["search", "places"].includes(searchSection);
  const searchHeaderPlaceholder = searchSection === "places" ? "Search places" : "Search Oldtime";
  const searchHeaderInput = input
    .replace(/placeholder="[^"]*"/, `placeholder="${searchHeaderPlaceholder}"`)
    .replace(/aria-label="[^"]*"/, `aria-label="${searchHeaderPlaceholder}"`);
  const searchHubTabs = searchSection !== "search" ? `<nav class="search-hub-tabs" role="tablist" aria-label="Search">
    <button type="button" role="tab" aria-selected="${videosSelected}" class="${videosSelected ? "on" : ""}" data-search-hub="videos">Videos</button>
    <button type="button" role="tab" aria-selected="${!videosSelected}" class="${!videosSelected ? "on" : ""}" data-search-hub="places">${searchPlacesMapGlyph()}<span>Places</span></button>
  </nav>` : "";
  shell(`<section class="screen on search-screen"><div class="scroll page">
    <header class="community-header search-app-header">
      ${!discoveryTopic && searchHeaderOpen ? `<div class="search-header-field"><div class="search-header-control">${searchHeaderInput}<button type="button" class="search-header-close discovery-search-toggle" id="discovery-search-toggle" aria-expanded="true" aria-label="Close search">${ic.close}</button></div></div>` : "<h1>Search</h1>"}
      <div class="community-header-actions">
        ${searchHeaderOpen ? "" : `<button type="button" class="community-search-button discovery-search-toggle" id="discovery-search-toggle" aria-expanded="false" aria-label="Search Oldtime">${ic.search}</button>`}
      </div>
    </header>
    ${searchHubTabs}
    ${searchLandingDiscovery}
    ${homeTopicTabs}
    ${videoPreviewRail}
    <div class="discovery-body">${body}</div>
  </div></section>`);
  app.querySelectorAll("[data-search-discovery-expand]").forEach(button => button.onclick = () => {
    searchExploreAllExpanded = !searchExploreAllExpanded;
    renderSearchPreservingInput();
  });
  const discoverySearchToggle = $("#discovery-search-toggle");
  if (discoverySearchToggle) discoverySearchToggle.onclick = () => {
    const closing = ["search","places"].includes(searchSection);
    searchSection = closing ? "trending" : "search";
    if (closing) {
      searchQ = ""; discoveryFeedQuery = ""; discoveryPeopleQuery = ""; discoveryPlaceQuery = "";
      searchExploreAllExpanded = false;
      discoveryHomeTopic = "all";
      exploreEco.clearSearch();
    } else {
      localSearchType = "all";
      if (exploreIsCloud()) exploreEco.openSearch();
    }
    discoveryTopic = "";
    render();
    if (searchSection === "search") requestAnimationFrame(() => $("#q")?.focus({ preventScroll: true }));
  };
  const discoverMenuToggle = $("#discover-menu-toggle");
  const discoverMenu = $("#discover-browse-menu");
  if (discoverMenuToggle && discoverMenu) {
    const closeDiscoverMenu = ({ restoreFocus = false } = {}) => {
      discoverMenu.hidden = true;
      discoverMenuToggle.setAttribute("aria-expanded", "false");
      if (restoreFocus) discoverMenuToggle.focus();
    };
    discoverMenuToggle.onclick = () => {
      const opening = discoverMenu.hidden;
      discoverMenu.hidden = !opening;
      discoverMenuToggle.setAttribute("aria-expanded", String(opening));
      if (opening) discoverMenu.querySelector("button:not(:disabled)")?.focus();
    };
    const searchScreen = app.querySelector(".search-screen");
    searchScreen.addEventListener("click", event => {
      if (!event.target.closest(".discovery-home-topic-tabs")) closeDiscoverMenu();
    });
    searchScreen.addEventListener("keydown", event => {
      if (event.key === "Escape" && !discoverMenu.hidden) {
        event.preventDefault();
        closeDiscoverMenu({ restoreFocus: true });
        return;
      }
      if (!discoverMenu.hidden && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        const items = [...discoverMenu.querySelectorAll("button:not(:disabled)")];
        if (!items.length) return;
        const current = items.indexOf(document.activeElement);
        const step = event.key === "ArrowDown" ? 1 : -1;
        const next = current < 0 ? (step > 0 ? 0 : items.length - 1) : (current + step + items.length) % items.length;
        event.preventDefault();
        items[next].focus();
      }
    });
    app.querySelectorAll("[data-xe-tune]").forEach(button => button.addEventListener("click", () => {
      closeDiscoverMenu();
    }));
  }
  const discoveryBack = $("#back");
  if (discoveryBack) discoveryBack.onclick = () => {
    if (discoveryTopic) { discoveryTopic = ""; discoveryTopicPosts = { topic: "", status: "idle", posts: [], hasMore: false, nextOffset: 0, error: "" }; render(); return; }
    if (!navigateBack()) { tab = "updates"; profileId = null; viewer = null; render(); }
  };
  app.querySelectorAll("[data-search-hub]").forEach(button => button.onclick = () => {
    const section = button.dataset.searchHub;
    if (section === "places") {
      const enteredQuery = String($("#q")?.value || "").trim();
      if (enteredQuery) discoveryPlaceQuery = enteredQuery.slice(0, 120);
      searchSection = "places";
    } else {
      searchSection = "trending";
    }
    discoveryTopic = "";
    render();
    requestAnimationFrame(() => $("#q")?.blur());
  });
  const searchInput = $("#q");
  if (searchInput) searchInput.oninput = event => {
    const position = event.target.selectionStart;
    if (searchSection === "trending") discoveryFeedQuery = event.target.value;
    else if (searchSection === "places") discoveryPlaceQuery = event.target.value;
    else searchQ = event.target.value;
    renderSearchPreservingInput();
    $("#q")?.setSelectionRange(position, position);
  };
  if (exploreIsCloud()) exploreEco.bind(app, { bindQuery: searchSection !== "places" });
  app.querySelectorAll("[data-local-search-type]").forEach(button => button.onclick = () => {
    const nextType = button.dataset.localSearchType || "all";
    if (nextType === "places") {
      openSearchPlaces(searchQ);
      return;
    }
    localSearchType = nextType;
    renderSearchPreservingInput();
  });
  $("#people-search-retry")?.addEventListener("click", () => { peopleSearch = { query: "", status: "idle", profiles: [], error: "" }; render(); });
  app.querySelectorAll("[data-tag]").forEach(button => button.onclick = () => { searchQ = button.dataset.tag; render(); });
  app.querySelectorAll("[data-profile]").forEach(button => button.onclick = event => {
    if (event.target.closest("[data-avatar-hit]")) openPersonAvatar(button.dataset.profile);
    else navigateToProfile(button.dataset.profile);
  });
  app.querySelectorAll("[data-open]").forEach(button => button.onclick = () => openPostViewer(button.dataset.open));
  app.querySelectorAll("[data-discovery-category]").forEach(button => button.onclick = () => {
    discoveryPeopleCategory = button.dataset.discoveryCategory;
    render();
  });
  app.querySelectorAll("[data-discovery-home-topic]").forEach(button => button.onclick = () => {
    const nextTopic = button.dataset.discoveryHomeTopic || "all";
    if (!HOME_TOPICS.some(topic => topic.id === nextTopic)) return;
    discoveryHomeTopic = nextTopic;
    if (["people", "places"].includes(searchSection)) searchSection = "trending";
    discoveryTopic = "";
    if (exploreIsCloud()) exploreEco.setTopic("");
    render();
  });
  app.querySelectorAll("[data-discovery-explore-topic]").forEach(button => button.onclick = () => {
    const nextTopic = button.dataset.discoveryExploreTopic || "";
    if (!nextTopic) return;
    discoveryHomeTopic = "all";
    if (["people", "places"].includes(searchSection)) searchSection = "trending";
    discoveryTopic = "";
    exploreEco.setTopic(nextTopic);
    render();
  });
  app.querySelectorAll("[data-discovery-feed-post]").forEach(button => button.onclick = async () => {
    const id = button.dataset.discoveryFeedPost;
    button.disabled = true;
    try {
      if (api.authMode() === "cloud") await api.loadCloudPost(id);
      const post = discoveryFeedSource().find(item => item.id === id);
      void post;
      openPostViewer(id, "", { source: "explore" });
    } catch (error) {
      button.disabled = false;
      toast(error?.message || "This post could not be opened.");
    }
  });
  app.querySelectorAll("[data-discovery-feed-retry]").forEach(button => button.onclick = () => loadDiscoveryFeed(true));
  app.querySelectorAll("[data-discovery-feed-more]").forEach(button => button.onclick = loadMoreDiscoveryFeed);
  app.querySelectorAll("[data-discovery-profile]").forEach(button => button.onclick = () => navigateToProfile(button.dataset.discoveryProfile));
  app.querySelectorAll("[data-discovery-follow]").forEach(button => button.onclick = async () => {
    button.disabled = true;
    discoveryPeople.key = "";
    await follow(button.dataset.discoveryFollow);
  });
  app.querySelectorAll("[data-trending-topic]").forEach(button => button.onclick = () => {
    discoveryTopic = button.dataset.trendingTopic;
    discoveryTopicPosts = { topic: discoveryTopic, status: "idle", posts: [], hasMore: false, nextOffset: 0, error: "" };
    render();
  });
  app.querySelectorAll("[data-topic-back]").forEach(button => button.onclick = () => {
    discoveryTopic = "";
    render();
  });
  app.querySelectorAll("[data-trends-retry]").forEach(button => button.onclick = () => loadDiscoveryTrends(true));
  app.querySelectorAll("[data-search-feeds-retry]").forEach(button => button.onclick = () => loadSearchExploreFeeds(true));
  app.querySelectorAll("[data-search-pin-feed]").forEach(button => button.onclick = () => {
    void pinSearchExploreFeed(button.dataset.searchPinFeed, button);
  });
  app.querySelectorAll("[data-people-retry]").forEach(button => button.onclick = () => scheduleDiscoveryPeople(discoveryPeopleQuery, discoveryPeopleCategory, true));
  app.querySelectorAll("[data-topic-retry]").forEach(button => button.onclick = () => {
    discoveryTopicPosts = { topic: discoveryTopic, status: "idle", posts: [], hasMore: false, nextOffset: 0, error: "" };
    render();
  });
  app.querySelectorAll("[data-topic-more]").forEach(button => button.onclick = () => loadDiscoveryTopicPosts(discoveryTopic, true));
  app.querySelectorAll("[data-discovery-post]").forEach(button => button.onclick = async () => {
    const id = button.dataset.discoveryPost;
    button.disabled = true;
    try {
      if (api.authMode() === "cloud") await api.loadCloudPost(id);
      openPostViewer(id, "", { source: "search" });
    } catch (error) { button.disabled = false; toast(error?.message || "This post could not be opened."); }
  });
  app.querySelectorAll("[data-people-more]").forEach(button => button.onclick = loadMoreDiscoveryPeople);
  app.querySelectorAll("[data-discovery-places-retry]").forEach(button => button.onclick = () => scheduleDiscoveryPlaces(discoveryPlaceQuery, true));
  app.querySelectorAll("[data-discovery-place-map-toggle]").forEach(button => button.onclick = () => {
    discoveryPlaceMapVisible = !discoveryPlaceMapVisible;
    render();
  });
  app.querySelectorAll("[data-discovery-place-feed-retry]").forEach(button => button.onclick = () => loadDiscoveryPlaceFeed({ query: discoveryPlaceQuery, force: true }));
  app.querySelectorAll("[data-discovery-place-feed-more]").forEach(button => button.onclick = () => loadDiscoveryPlaceFeed({ query: discoveryPlaceQuery, append: true }));
  app.querySelectorAll(".discovery-places [data-action=\"open-post\"]").forEach(button => button.onclick = async () => {
    const postId = button.dataset.postId;
    if (!postId) return;
    try {
      if (!api.post(postId)) await api.loadCloudPost(postId);
      openPostViewer(postId, "", { source: "search" });
    } catch (error) {
      toast(error.message || "That post could not be opened.");
    }
  });
  app.querySelectorAll(".discovery-places [data-place-profile]").forEach(button => button.onclick = () => {
    navigateToProfile(button.dataset.placeProfile);
  });
  app.querySelectorAll(".discovery-places [data-action=\"select-place\"]").forEach(button => button.onclick = () => {
    tab = "updates";
    selectPlace({
      id: button.dataset.placeId,
      label: button.dataset.placeLabel,
      source: button.dataset.placeSource,
      lat: button.dataset.placeLat,
      lon: button.dataset.placeLon,
    });
  });
}

function notes() {
  const me = api.me();
  const reqs = api.db().requests.filter(r => r.to === me.id);
  const friendReqs = (Array.isArray(api.db().friendRequests) ? api.db().friendRequests : [])
    .filter(r => r.to === me.id && api.user(r.from));
  if (api.authMode() !== "cloud") mutate(db => db.notes.forEach(n => { if (n.user === me.id) n.read = true; }));
  const status = notificationState();
  if (status.loaded && !status.loading && !status.error) {
    void readAccountNotifications().then(changed => { if (changed && tab === "notes") render(); })
      .catch(() => toast("Notification read status could not be saved. Try again."));
  }
  const ownerNotes = accountNotifications().filter(note => note.user === me.id);
  const counts = notificationGroupCounts(ownerNotes);
  const selectedGroup = NOTIFICATION_GROUPS.find(group => group.id === notificationFilter);
  const overview = notificationFilter === "all";
  const filteredRequests = notificationFilter === "requests" ? reqs : [];
  const filteredFriendRequests = notificationFilter === "requests" ? friendReqs : [];
  const filteredNotes = overview || notificationFilter === "requests" ? []
    : filterNotificationGroup(ownerNotes, notificationFilter, me.following || [])
      .sort((a, b) => (b.created || 0) - (a.created || 0));
  const notificationTitle = overview ? "Notifications" : notificationFilter === "requests" ? "Requests"
    : notificationFilter === "following" ? "People you follow" : selectedGroup?.title || "All activity";
  const pendingRequests = reqs.length + friendReqs.length;
  const emptyMessage = notificationFilter === "requests" ? "No follow or Friend requests right now."
    : notificationFilter === "following" ? "No activity from people you follow yet."
      : selectedGroup?.empty || "You’re caught up.";
  const overviewMarkup = overview ? `<div class="notification-categories">
    ${NOTIFICATION_GROUPS.filter(group => group.id !== "activity" || counts.activity).map(group => `<button type="button" class="notification-category" data-notification-filter="${group.id}">
      <span class="notification-category-icon" aria-hidden="true">${ic[group.icon]}</span><span><b>${group.title}</b><small>${status.error ? "Check your connection to see activity" : !status.loaded && api.authMode() === "cloud" ? "Loading activity…" : counts[group.id] ? `${counts[group.id]} recent` : "No recent activity"}</small></span><span class="notification-category-arrow" aria-hidden="true">›</span>
    </button>`).join("")}
    <button type="button" class="notification-category" data-notification-filter="requests"><span class="notification-category-icon" aria-hidden="true">${ic.user}</span><span><b>Requests</b><small>${pendingRequests ? `${pendingRequests} pending` : "No pending requests"}</small></span><span class="notification-category-arrow" aria-hidden="true">›</span></button>
    <button type="button" class="notification-category" data-creator-open="announcements"><span class="notification-category-icon" aria-hidden="true">${ic.bell}</span><span><b>From Oldtime</b><small>Updates and your announcement preferences</small></span><span class="notification-category-arrow" aria-hidden="true">›</span></button>
    </div><div class="notification-overview-links"><button type="button" data-notification-filter="everything">All activity</button><button type="button" data-notification-filter="following">People you follow</button></div>` : "";
  const activityRoute = getAccountTools().accountType === "creator" ? "creator-studio" : getAccountTools().accountType === "business" ? "business-dashboard" : "personal-activity";
   shell(`<section class="screen on notifications-screen"><div class="scroll page"><div class="notifications-header"><button id="back" class="icon" aria-label="${overview ? "Back to previous screen" : "Back to notifications"}" title="Back">${ic.back}</button><div class="h1">${notificationTitle}</div><button type="button" class="notification-insights-button" data-creator-open="${activityRoute}">Analytics</button></div>
    ${overviewMarkup}
    ${filteredFriendRequests.map(r => `<div class="listbtn"><img src="${api.user(r.from)?.avatar || ""}" alt="" style="width:36px;height:36px;border-radius:50%;object-fit:cover" /><div><b>@${api.user(r.from)?.username || "member"}</b> wants to be Friends<div class="row"><button class="btn small" data-friend-accept="${r.from}">Accept</button><button class="btn ghost small" data-friend-decline="${r.from}">Decline</button></div></div></div>`).join("")}
    ${filteredRequests.map(r => `<div class="listbtn"><img src="${api.user(r.from)?.avatar || ""}" alt="" style="width:36px;height:36px;border-radius:50%;object-fit:cover" /><div><b>@${api.user(r.from)?.username || "member"}</b> requested to follow<div class="row"><button class="btn small" data-acc="${r.from}">Accept</button><button class="btn ghost small" data-dec="${r.from}">Decline</button></div></div></div>`).join("")}
    ${notificationFilter === "requests" ? "" : status.error ? `<div class="notification-load-status" role="alert">${esc(status.error)} <button type="button" id="notifications-retry">Retry</button></div>` : !status.loaded && api.authMode() === "cloud" ? `<div class="notification-load-status" role="status">Loading notifications…</div>` : ""}
    ${filteredNotes.map(n => `<button class="listbtn notification-row ${n.read ? "" : "is-unread"}" data-note="${esc(n.id)}"><img src="${api.user(n.actor)?.avatar || ""}" alt="" style="width:36px;height:36px;border-radius:50%;object-fit:cover" /><div><b>@${esc(api.user(n.actor)?.username || "someone")}</b> ${esc(n.body)}<div class="sub">${ago(n.created)}</div></div></button>`).join("") || (overview || (notificationFilter !== "requests" && (status.error || (!status.loaded && api.authMode() === "cloud"))) || filteredRequests.length || filteredFriendRequests.length ? "" : `<div class="notification-empty" role="status">${ic.bell}<p>${emptyMessage}</p></div>`)}
    ${status.hasMore && !overview && notificationFilter !== "requests" ? `<button type="button" class="btn ghost small" id="notifications-more">${status.loading ? "Loading…" : "Older notifications"}</button>` : ""}
  </div></section>`);
  $("#back").onclick = () => { if (overview) leaveNotifications(); else { notificationFilter = "all"; notes(); } };
  app.querySelectorAll("[data-notification-filter]").forEach(button => button.onclick = () => { notificationFilter = button.dataset.notificationFilter; notes(); });
  const reloadNotifications = options => {
    void loadAccountNotifications(options).then(() => { if (tab === "notes") render(); }).catch(() => { if (tab === "notes") render(); });
  };
  if ($("#notifications-retry")) $("#notifications-retry").onclick = () => reloadNotifications({ force: true });
  if ($("#notifications-more")) $("#notifications-more").onclick = () => reloadNotifications({ more: true });
   app.querySelectorAll("[data-acc]").forEach(b => b.onclick = async () => {
     const from = b.dataset.acc;
     if (api.authMode() === "cloud") {
       try { await api.respondCloudFollowRequest(from, true); render(); }
       catch (error) { toast(error.message || "Follow request could not be accepted."); }
       return;
     }
     mutate(db => { const meU = db.users.find(u => u.id === me.id); const them = db.users.find(u => u.id === from); if (!meU.followers.includes(from)) meU.followers.push(from); if (!them.following.includes(me.id)) them.following.push(me.id); db.requests = db.requests.filter(r => !(r.from === from && r.to === me.id)); });
     render();
   });
   app.querySelectorAll("[data-dec]").forEach(b => b.onclick = async () => {
     const from = b.dataset.dec;
     if (api.authMode() === "cloud") {
       try { await api.respondCloudFollowRequest(from, false); render(); }
       catch (error) { toast(error.message || "Follow request could not be declined."); }
       return;
     }
     mutate(db => { db.requests = db.requests.filter(r => !(r.from === from && r.to === me.id)); });
     render();
   });
  app.querySelectorAll("[data-friend-accept]").forEach(b => b.onclick = () => respondToFriendRequest(b.dataset.friendAccept, true));
  app.querySelectorAll("[data-friend-decline]").forEach(b => b.onclick = () => respondToFriendRequest(b.dataset.friendDecline, false));
   app.querySelectorAll("[data-note]").forEach(b => b.onclick = async () => {
     const n = accountNotifications().find(x => x.id === b.dataset.note);
    if (!n) return;
     if (n.kind === "chat-mention" && n.conversationId && n.messageId) {
       notificationsReturnStack.push(captureNavigationState());
       chatId = n.conversationId;
       profileId = null;
       viewer = null;
       tab = "chat";
       render();
       requestAnimationFrame(() => requestAnimationFrame(() => {
         const message = [...document.querySelectorAll("[data-msg]")].find(item => item.dataset.msg === n.messageId);
         message?.scrollIntoView?.({ block: "center", behavior: "smooth" });
       }));
       return;
     }
     if (n.kind === "story-question" && n.story) {
       const owner = api.cloudAccountId();
       const { openPrivateQuestionInbox } = await import("./private-question-inbox.js");
       if (owner !== api.cloudAccountId()) return;
       openPrivateQuestionInbox(n.story, { questionId: n.questionId, toast, onAnswer: async seed => {
         const { openStatusCapture } = await import("./status-capture.js");
         if (owner !== api.cloudAccountId()) return;
         openStatusCapture({ ...seed, source: "landing", toast, onPosted: () => render() });
       } });
       return;
     }
     if (n.kind === "story-answer") {
       if (!n.story) return toast("The answer was shared with a limited audience or is no longer available.");
       b.disabled = true;
       try {
         const target = await api.fetchCloudStoryById(n.story);
         if (tab !== "notes" || api.me()?.id !== me.id) return;
         notificationsReturnStack.push(captureNavigationState());
         openStory(target.author, target.id);
       } catch (error) { toast(error.message || "This answer is no longer available."); }
       finally { b.disabled = false; }
       return;
     }
     if (n.post && api.authMode() === "cloud") {
       b.disabled = true;
       try { await api.loadCloudPost(n.post); }
       catch (error) { toast(error.message || "This post is no longer available."); b.disabled = false; return; }
       if (tab !== "notes" || api.me()?.id !== me.id) return;
     }
    notificationsReturnStack.push(captureNavigationState());
     if (n.story) { openStory(me.id, n.story); }
    else if (n.post) { viewer = n.post; profileId = null; tab = "updates"; render(); }
    else if (n.actor) { profileId = n.actor; viewer = null; tab = "updates"; render(); }
  });
}

async function migrateLegacyAccountDataInBackground(onProgress = () => {}) {
  const owner = api.cloudAccountId();
  if (!owner || !api.me()) throw new Error("The signed-in account is unavailable.");
  const conciseMigrationStatus = result => {
    const confirmed = Number(result?.confirmed ?? result?.migrated ?? 0);
    const pending = Number(result?.pending ?? 0);
    const unsupported = Number(result?.unsupported ?? 0);
    const existing = Number(result?.existing ?? 0);
    const parts = [];
    if (confirmed) parts.push(`${confirmed} confirmed`);
    if (pending) parts.push(`${pending} still need cloud confirmation`);
    if (unsupported) parts.push(`${unsupported} need review`);
    if (existing) parts.push(`${existing} already have a cloud copy; original kept`);
    return parts.length ? parts.join(" · ") : "Cloud records checked.";
  };
  const steps = [
    ["Profile and account settings", async () => {
      await api.loadCloudAccountState();
      return "Account data loaded from your online account.";
    }],
    ["Posts", async () => conciseMigrationStatus(await api.migrateCloudTextPosts({ retry: true }))],
    ["Stories", async () => {
      await api.refreshCloudStories();
      const result = await api.migrateCloudStories({ retry: true });
      if (result.confirmed) await api.refreshCloudStories();
      return conciseMigrationStatus(result);
    }],
    ["Private chat archives", async () => {
      const result = await api.migrateLegacyChatArchives({ retry: true });
      await api.refreshCloudChats();
      return conciseMigrationStatus(result);
    }],
    ["Community content and media", async () => {
      const [{ loadBlastSocialCloudState }, { loadBlastVideoNoteCloudState }] = await Promise.all([
        import("./blast-store.js"), import("./blast-video-note-store.js"),
      ]);
      await loadBlastSocialCloudState();
      await loadBlastVideoNoteCloudState();
      return "Community account data checked online.";
    }],
  ];
  const results = [];
  for (const [label, action] of steps) {
    if (api.cloudAccountId() !== owner) {
      results.push({ label, status: "Stopped because the signed-in account changed.", warning: true });
      onProgress(results);
      break;
    }
    const row = { label, status: "Checking…" };
    results.push(row);
    onProgress(results);
    try {
      row.status = await action();
      row.warning = /need cloud confirmation|need review|pending/i.test(row.status);
    } catch (error) {
      row.status = error?.message || "Could not verify the cloud copy.";
      row.warning = true;
    }
    onProgress(results);
  }
  return results;
}

let libraryPage = null;
function settings() {
  if (settingsView.startsWith("campaign")) settingsView = "home";
  if(settingsView==="review-queue"){
    const owner=api.cloudAccountId(),key=`${owner}:review-queue`;
    if(libraryPage?.key===key&&libraryPage.host.isConnected)return;
    libraryPage?.close();
    shell('<section class="screen on light"><div id="moderation-queue-host"><p role="status">Loading…</p></div></section>');
    const host=$("#moderation-queue-host");let live=true,dispose=null;
    libraryPage={key,host,close(){live=false;dispose?.();}};
    import("./moderation-queue.js").then(({mountModerationQueue})=>{
      if(!live||!host.isConnected||api.cloudAccountId()!==owner)return;
      dispose=mountModerationQueue({host,request:requestCloudApi,esc,toast,
        alive:()=>live&&api.cloudAccountId()===owner,
        back:()=>{settingsView="home";render();},
        openPost:id=>{libraryPage?.close();libraryPage=null;settingsView="home";openPostViewer(id);},
        openPlace:id=>{libraryPage?.close();libraryPage=null;settingsView="home";selectPlace({id,label:"Place",source:id.startsWith("osm:")?"osm":"custom"});},
      });
    }).catch(error=>{
      console.warn("Review queue could not open",error);
        if(live&&host.isConnected){
          host.innerHTML=`<div role="alert" class="route-load-error"><p>We couldn’t open the review queue.</p><button type="button" id="review-queue-retry">Try again</button><button type="button" id="review-queue-back">Back to Settings</button></div>`;
          host.querySelector("#review-queue-retry")?.addEventListener("click",()=>{
            if(!live)return;
            libraryPage?.close();libraryPage=null;render();
          });
          host.querySelector("#review-queue-back")?.addEventListener("click",()=>{
            if(!live)return;
            libraryPage?.close();libraryPage=null;settingsView="home";render();
          });
        }
    });
    return;
  }
  if (["saved","archive"].includes(settingsView)) {
    const key = `${api.cloudAccountId()}:${settingsView}`;
    if (libraryPage?.key === key && libraryPage.host.isConnected) return;
    libraryPage?.close();
    shell(`<section class="screen on light"><div class="acl" id="account-library" role="region" aria-label="${settingsView==="saved"?"Saved":"Archive"}"><p role="status">Loading…</p></div></section>`);
    const host=$("#account-library"),owner=api.cloudAccountId(),mode=settingsView;
    let live=true,controller=null;
    libraryPage={key,host,close(){live=false;if(controller?.destroy)controller.destroy();else controller?.cleanup?.();}};
    import("./settings-library-route.js").then(module=>{
      if(!live||!host.isConnected||api.cloudAccountId()!==owner)return;
      controller=module.mountLibrary({host,mode,api,requestCloudApi,app,esc,icons:ic,toast,
        back(){settingsView="home";render();},
        openPost:id=>openPostViewer(id),
        openAudio:sound=>openAudioPanel({postId:sound.sourcePostId||sound.id,sheet:$("#sheet"),esc,icons:ic,toast}),
        create:options=>openUniversalCreation(options)});
    }).catch(()=>{
      if(!live||!host.isConnected)return;
      host.innerHTML=`<p>Couldn't open this page.</p><button id="library-retry">Try again</button><button id="library-back">Back to Settings</button>`;
      host.querySelector("#library-retry").onclick=()=>{libraryPage?.close();libraryPage=null;render();};
      host.querySelector("#library-back").onclick=()=>{settingsView="home";render();};
    });
    return;
  }
  if(libraryPage){libraryPage.close();libraryPage=null;}
  const me = api.me();
  if (!api.db().settings) mutate(db => { db.settings = { readReceipts: true, lastSeen: "everyone" }; });
  const prefs = api.db().settings;
  const blocked = api.authMode() === "cloud"
    ? api.cloudBlocks().map(who => ({ by: me.id, who }))
    : api.db().blocks.filter(b => b.by === me.id);
  if (api.authMode() === "cloud" && settingsView === "blocked" && !api.cloudBlocksLoaded()) {
    const owner = api.cloudAccountId();
    void api.refreshCloudBlocks().then(() => {
      if (api.cloudAccountId() === owner && settingsView === "blocked") render();
    }).catch(error => toast(error.message || "Blocked accounts could not be loaded."));
  }
  const titles = { home: "Settings", password: "Password", privacy: "Account privacy", "close-friends": "Close Friends", chat: "Chat privacy", notifications: "Notifications", blocked: "Blocked accounts", help: "Help & Support", about: "About", campaigns: "Campaigns", "privacy-center": "Privacy Center" };
  const editableSettingsViews = new Set(["privacy", "close-friends", "chat", "notifications"]);
  const settingsDraft = {
    isPrivate: Boolean(me.private),
    taggingAudience: api.cloudAccountState()?.taggingPreferences?.whoCanTag || "everyone",
    showCity: me.profileVisibility?.city !== false,
    showInterests: me.profileVisibility?.interests !== false,
    readReceipts: prefs.readReceipts !== false,
    lastSeen: prefs.lastSeen || "everyone",
    notifications: me.notifs !== false,
    closeFriends: new Set(api.authMode() === "cloud" ? api.cloudCloseFriends() : (Array.isArray(me.closeFriends) ? me.closeFriends : []))
  };
  const initialSettingsDraft = { ...settingsDraft, closeFriends: new Set(settingsDraft.closeFriends) };
  const sameSet = (left, right) => left.size === right.size && [...left].every(id => right.has(id));
  const hasUnsavedSettings = () => {
    if (settingsView === "privacy") {
      return settingsDraft.isPrivate !== initialSettingsDraft.isPrivate ||
        settingsDraft.taggingAudience !== initialSettingsDraft.taggingAudience ||
        settingsDraft.showCity !== initialSettingsDraft.showCity ||
        settingsDraft.showInterests !== initialSettingsDraft.showInterests;
    }
    if (settingsView === "close-friends") return !sameSet(settingsDraft.closeFriends, initialSettingsDraft.closeFriends);
    if (settingsView === "chat") {
      return settingsDraft.readReceipts !== initialSettingsDraft.readReceipts ||
        settingsDraft.lastSeen !== initialSettingsDraft.lastSeen;
    }
    if (settingsView === "notifications") return settingsDraft.notifications !== initialSettingsDraft.notifications;
    return false;
  };
  if (api.authMode() === "cloud" && settingsView === "privacy" && !api.cloudPrivacyLoaded()) {
    const owner = api.cloudAccountId();
    void api.refreshCloudPrivacy().then(isPrivate => {
      if (api.cloudAccountId() !== owner || settingsView !== "privacy" || hasUnsavedSettings()) return;
      if (settingsDraft.isPrivate !== isPrivate) {
        settingsDraft.isPrivate = isPrivate;
        initialSettingsDraft.isPrivate = isPrivate;
        render();
      }
    }).catch(error => toast(error.message || "Account privacy could not be loaded."));
  }
  if (api.authMode() === "cloud" && settingsView === "privacy" && !api.cloudAccountStateLoaded()) {
    const owner = api.cloudAccountId();
    void api.loadCloudAccountState().then(state => {
      if (api.cloudAccountId() !== owner || settingsView !== "privacy" || hasUnsavedSettings()) return;
      const audience = state.taggingPreferences?.whoCanTag || "everyone";
      settingsDraft.taggingAudience = audience;
      initialSettingsDraft.taggingAudience = audience;
      render();
    }).catch(error => toast(error.message || "Tagging preferences could not be loaded."));
  }
  if (api.authMode() === "cloud" && settingsView === "sound-reuse" && !api.cloudAccountStateLoaded()) {
    const owner = api.cloudAccountId();
    void api.loadCloudAccountState().then(() => {
      if (api.cloudAccountId() === owner && settingsView === "sound-reuse") render();
    }).catch(error => toast(error.message || "Sound reuse settings could not be loaded."));
  }
  const updateSettingsSaveState = () => {
    const saveButton = $("#settings-save");
    if (!saveButton) return;
    const dirty = hasUnsavedSettings();
    hasPendingSettingsChanges = dirty;
    saveButton.disabled = !dirty;
    const status = $("#settings-save-status");
    if (status) status.textContent = dirty ? "Unsaved changes" : "";
  };
  let content = "";
  let extra = null;
  const entry = (iconName, label, summary, view, id = "") => {
    const value = view === "privacy" ? (me.private ? "Private" : "Public")
      : view === "close-friends" ? String((me.closeFriends || []).length)
      : view === "blocked" ? String(blocked.length)
      : view === "notifications" ? (me.notifs === false ? "Off" : "On")
      : view === "chat" ? `${prefs.readReceipts === false ? "Receipts off" : "Receipts on"} · ${prefs.lastSeen || "everyone"}`
      : "";
    return `<button type="button" class="settings-entry" data-testid="button-settings-${id || view}" ${view ? `data-settings="${view}"` : ""} ${id ? `id="${id}"` : ""}>
      <span class="settings-entry-icon">${ic[iconName] || ic.info}</span>
      <span class="settings-entry-copy"><b>${label}</b>${summary ? `<small>${summary}</small>` : ""}</span>
      ${value ? `<small class="settings-entry-value">${value}</small>` : ""}
      <span class="settings-entry-chevron" aria-hidden="true">${ic.chevronRight}</span>
    </button>`;
  };
  if (settingsView === "home") {
    content = `<div class="settings-home" id="settings-home">
      <label class="settings-search"><span aria-hidden="true">${ic.search}</span><input id="settings-search" type="search" placeholder="Search settings" aria-label="Search settings" /></label>
      <div class="settings-groups">
      <section class="settings-group" data-settings-group><h2>Your account</h2>
        <button type="button" class="settings-entry" data-creator-open="account-type"><span class="settings-entry-icon">${ic.user}</span><span class="settings-entry-copy"><b>Account type</b><small>${esc(getAccountTools().accountType.replace(/^./, value => value.toUpperCase()))} · Your tools, your choice.</small></span></button>
        <button type="button" class="settings-entry" data-creator-open="${getAccountTools().accountType==="creator"?"creator-studio":getAccountTools().accountType==="business"?"business-dashboard":"personal-activity"}"><span class="settings-entry-icon">${getAccountTools().accountType==="personal"?ic.activity:ic.user}</span><span class="settings-entry-copy"><b>${getAccountTools().accountType==="creator"?"Creator Studio":getAccountTools().accountType==="business"?"Business Dashboard":"Analytics"}</b><small>Your recorded profile visits, views and engagement.</small></span></button>
        ${getAccountTools().accountType==="creator"?'<button type="button" class="settings-entry" data-creator-open="creator-center"><span class="settings-entry-icon">'+ic.user+'</span><span class="settings-entry-copy"><b>Creator Center</b><small>Your progress and creator status.</small></span></button>':""}
        <button type="button" class="settings-entry" data-creator-open="blue-badge"><span class="settings-entry-icon">${ic.official}</span><span class="settings-entry-copy"><b>Blue Badge</b><small>Membership and benefits.</small></span></button>
        ${entry("edit", "Edit profile", "Update your photo, bio and interests.", "", "edit")}
        ${entry("lock", "Password", "Change your account password.", "password")}
      </section>
      <section class="settings-group" data-settings-group><h2>Your content</h2>
        ${entry("bookmark","Saved","Posts, videos, collections and your saved sounds.","saved")}
        ${entry("archive","Archive","Private stories, posts and memories.","archive")}
      </section>
      ${settingGroups.map(group => `<section class="settings-group" data-settings-group><h2>${group.title}</h2>${group.items.map(([label, summary, id]) => {
        const direct = ({ privacy:"privacy", "sound-reuse":"sound-reuse", "close-friends":"close-friends", chat:"chat", notifications:"notifications", blocked:"blocked", "profile-visibility":"privacy" })[id];
        const iconName = ({ privacy:"accountPrivacy", "sound-reuse":"music", "close-friends":"users", chat:"chatPrivacy", notifications:"bell", blocked:"blocked", "profile-visibility":"eye" })[id] || "gear";
        return entry(iconName, label, summary, direct || `setting-${id}`);
      }).join("")}</section>`).join("")}
      <section class="settings-group" data-settings-group><h2>Help and support</h2>
        ${entry("help", "Help and support", "Quick answers and practical guides.", "help")}
        ${entry("official", "Oldtime Official", "Guides, official updates and tip preferences.", "help-guides")}
        ${entry("privacyCenter", "Privacy center", "Manage your privacy and data.", "privacy-center")}
        ${entry("document", "Terms of Service", "Review the current terms.", "legal-terms")}
        ${entry("privacyCenter", "Privacy Policy", "How your information is handled.", "legal-privacy")}
        ${entry("about", "About Oldtime", "Learn how this app works.", "about")}
      </section>
      <section class="settings-group" data-settings-group><h2>Advanced</h2>
        ${entry("clearData", "Clear all app data", "Clear this device only. Your online account stays intact.", "", "reset")}
      </section>
      <section class="settings-group settings-account-actions" data-settings-group>
        <h2>Account actions</h2>
        ${api.authMode() === "cloud" ? entry("trash", "Delete account", "Permanently delete your account and content.", "", "delete-account") : ""}
        ${entry("logout", "Log out", "", "", "out")}
      </section>
      </div>
      <div class="settings-empty-search" id="settings-no-results" role="status" hidden>No settings match that search.</div>
    </div>`;
  } else if(settingsView==="help-guides"){
    const accountId=api.cloudAccountId()||me.id;
    content=renderGuideLibrary(accountId,esc);
    titles[settingsView]="Oldtime Official";
    extra={bind:()=>bindGuideLibrary(app,{accountId,toast,open:id=>showHelpfulWalkthrough({
      id,app,esc,navigate:navigateHelpfulPrompt,accountId,isSafe:isHelpfulSurfaceSafe,toast
    }),preview:id=>showHelpfulWalkthrough({
      id,app,esc,navigate:navigateHelpfulPrompt,accountId,isSafe:isHelpfulSurfaceSafe,toast,preview:true
    }),esc,openRoute:navigateHelpfulPrompt})};
  } else if (settingsView.startsWith("campaign") || settingsView === "help" || settingsView.startsWith("help-") || settingsView === "privacy-center" || settingsView === "sound-reuse" || settingsView.startsWith("privacy-topic-")) {
    extra = extraScreen(settingsView, { api, me, db: api.db(), mutate, toast, campaignId: selectedCampaignId, navigate: route => {
      if(navigationStack.at(-1)?.helpfulArticle)delete navigationStack.at(-1).helpfulArticle;
      if(["help-blast","help-blast-invite","help-note","help-friends","help-messages","help-communities","help-create"].includes(route))return navigateHelpfulPrompt(route);
      if (route === "edit-profile") return openEditProfile();
      if (["account-type","personal-activity","creator-studio","business-dashboard","monthly-recap","best-practices","inspiration","blue-badge"].includes(route)) return navigateFromDrawer(route);
      if (route.startsWith("campaign:")) selectedCampaignId = route.slice(9);
      else if (route === "campaign-edit") selectedCampaignId = settingsView.startsWith("campaign:") ? settingsView.slice(9) : selectedCampaignId;
      openSettingsSubview(route);
    } });
    content = extra.content;
    if (settingsView === "help") {
      content = `<p class="oldtime-support-entry"><a href="${import.meta.env.BASE_URL}support">Support: questions and answers</a> · <a href="mailto:support@heyoldtime.com">Email support</a></p>${content}`;
    }
    titles[settingsView] = extra.title;
  } else if (settingsView === "password") {
    content = api.authProvider() === "cognito"
      ? `<p class="sub">Choose “Forgot your password?” on the secure sign-in page to reset your password.</p><button class="btn primary" id="cognito-password" type="button">Open secure sign-in</button><div id="cognito-account-link" style="display:contents"></div>`
      : `<div id="cognito-account-link" style="display:contents"></div><form class="settings-password-form" id="password-form"><input class="field" id="cp" type="password" autocomplete="current-password" placeholder="Current password" aria-label="Current password" required />
      <input class="field" id="np" type="password" autocomplete="new-password" placeholder="New password (8–128 characters)" aria-label="New password" minlength="8" maxlength="128" required />
      <input class="field" id="confirm-pass" type="password" autocomplete="new-password" placeholder="Confirm password" aria-label="Confirm password" minlength="8" maxlength="128" required />
      <button class="btn" id="sp" type="submit" style="margin-top:8px">Save password</button></form>`;
  } else if (settingsView === "privacy") {
    content = `
      <button type="button" class="listbtn" id="private-toggle" data-testid="button-toggle-private" aria-pressed="${settingsDraft.isPrivate}">Private account · ${settingsDraft.isPrivate ? "On" : "Off"}</button>
      <div class="profile-visibility-settings">
        <b>Profile details</b>
        <button type="button" class="listbtn" data-profile-visibility="city" data-testid="button-toggle-city-visibility" aria-pressed="${settingsDraft.showCity}">Show city on profile · ${settingsDraft.showCity ? "On" : "Off"}</button>
        <button type="button" class="listbtn" data-profile-visibility="interests" data-testid="button-toggle-interest-visibility" aria-pressed="${settingsDraft.showInterests}">Show interests on profile · ${settingsDraft.showInterests ? "On" : "Off"}</button>
      </div>
      ${api.authMode() === "cloud" ? listVisibilitySettingsMarkup() : ""}
      ${emailManualActionAvailable() ? `<button type="button" class="listbtn" data-ev-settings data-testid="button-verify-email">Confirm email</button>` : ""}`;
    content += `<div class="settings-choice-block tagging-preferences"><b>Who can tag you?</b><div class="seg">
      ${[["everyone","Everyone"],["following","People you follow"],["nobody","No one"]].map(([value,label]) =>
        `<button type="button" data-tag-audience="${value}" class="${settingsDraft.taggingAudience === value ? "on" : ""}" aria-pressed="${settingsDraft.taggingAudience === value}">${label}</button>`).join("")}
      </div><p class="sub" id="tag-audience-description">${settingsDraft.taggingAudience === "nobody" ? "No one can mention you in posts, comments, or Story replies." : settingsDraft.taggingAudience === "following" ? "Only accounts you follow can mention you in posts, comments, or Story replies." : "Anyone can mention you in posts, comments, or Story replies."}</p></div>`;
  } else if (settingsView === "close-friends") {
    content = `
      <div class="sub close-friends-count" id="close-friends-count">${settingsDraft.closeFriends.size} added</div>
      <p class="sub">Only confirmed Friends can be added to Close Friends.</p>
      <input class="search" id="close-friends-search" type="search" placeholder="Search Friends" aria-label="Search Friends for Close Friends" />
      <div id="close-friends-list" aria-live="polite"></div>`;
  } else if (settingsView === "chat") {
    content = `
      <button type="button" class="listbtn" id="receipts-toggle" data-testid="button-toggle-read-receipts" aria-pressed="${settingsDraft.readReceipts}">Read receipts · ${settingsDraft.readReceipts ? "On" : "Off"}</button>
      <div class="settings-choice-block"><b>Last seen</b><div class="seg">${["everyone", "contacts", "nobody"].map(value => `<button type="button" data-last-seen="${value}" class="${settingsDraft.lastSeen === value ? "on" : ""}" aria-pressed="${settingsDraft.lastSeen === value}">${value[0].toUpperCase() + value.slice(1)}</button>`).join("")}</div></div>`;
  } else if (settingsView === "notifications") {
    content = `
      <section class="settings-group"><h2>Push and in-app</h2>
      <button type="button" class="listbtn" id="notifs-toggle" data-testid="button-toggle-notifications" aria-pressed="${settingsDraft.notifications}">Notifications · ${settingsDraft.notifications ? "On" : "Off"}</button></section>
      <section class="settings-group"><h2>Announcements and creator updates</h2>
      <button type="button" class="settings-entry" data-creator-open="announcements"><span class="settings-entry-icon">${ic.bell}</span><span class="settings-entry-copy"><b>Update preferences</b><small>Choose announcements, creator updates and offers.</small></span><span aria-hidden="true">›</span></button></section>`;
  } else if (settingsView === "blocked") {
    content = blocked.map(b => `<div class="listbtn"><span>@${esc(api.user(b.who)?.username || "unknown")}</span><button data-un="${esc(b.who)}">Unblock</button></div>`).join("") || `<div class="sub">No blocked users.</div>`;
  } else if (["legal-privacy", "legal-terms", "legal-guidelines"].includes(settingsView)) {
    const documentId = settingsView.slice("legal-".length);
    titles[settingsView] = LEGAL_DOCUMENTS[documentId].title;
    content = legalDocumentMarkup(documentId) + legalNavigation(import.meta.env.BASE_URL, documentId);
  } else if (settingsView === "about") {
    content = `<div class="about-legal">
      <section class="about-legal-intro"><svg viewBox="0 0 64 48" aria-hidden="true"><rect x="10" y="8" width="34" height="28" rx="5"/><rect x="18" y="14" width="34" height="28" rx="5"/><circle cx="35" cy="28" r="6"/><path d="M26 14l3-4h12l3 4"/></svg><div><b>Oldtime</b><p>A social app for sharing photos, videos, Stories and communities with the people you choose.</p></div></section>
      <section class="settings-group about-legal-links" aria-label="Legal and support">
        <h2>Legal and support</h2>
         <button type="button" class="settings-entry" data-settings="legal-privacy"><span class="settings-entry-icon">${ic.document}</span><span class="settings-entry-copy"><b>Privacy Policy</b><small>How your information is used.</small></span></button>
        <button type="button" class="settings-entry" data-settings="privacy-center"><span class="settings-entry-icon">${ic.lock}</span><span class="settings-entry-copy"><b>Privacy Center</b><small>Privacy controls and data topics.</small></span></button>
        <button type="button" class="settings-entry" data-settings="help"><span class="settings-entry-icon">${ic.mediaComment}</span><span class="settings-entry-copy"><b>Help &amp; Support</b><small>Answers and practical guides.</small></span></button>
         <button type="button" class="settings-entry" data-settings="legal-terms"><span class="settings-entry-icon">${ic.document}</span><span class="settings-entry-copy"><b>Terms of Service</b><small>Using Oldtime.</small></span></button>
         <button type="button" class="settings-entry" data-settings="legal-guidelines"><span class="settings-entry-icon">${ic.shield}</span><span class="settings-entry-copy"><b>Community Guidelines</b><small>Keeping our community safe.</small></span></button>
      </section>
      <p class="about-legal-note">Oldtime does not claim certification under any specific compliance program.</p>
    </div>`;
  }
  const hasEditableSettings = editableSettingsViews.has(settingsView);
  const saveBar = hasEditableSettings ? `<footer class="settings-save-bar" aria-live="polite">
    <span id="settings-save-status"></span>
    <button type="button" id="settings-save" data-testid="button-save-settings" disabled>Save changes</button>
  </footer>` : "";
  const settingsArtKey = {home:"interests",personal:"cover",about:"welcome",blocked:"safety",security:"information","close-friends":"audience"};
  const settingsArtwork = settingsView !== "home" && /^(privacy|chat|notifications|blocked|close-friends|security|personal|about|interests)$/.test(settingsView)
    ? tipIllustration(settingsArtKey[settingsView] || settingsView) : "";
  shell(`<section class="screen on account-settings-screen ${settingsView === "home" ? "settings-home-view" : ""} ${hasEditableSettings ? "settings-has-save" : ""}"><div class="scroll settings-scroll">
    <header class="settings-header ${settingsView === "home" ? "settings-home-header" : ""}">
      ${settingsView === "home"
        ? `<span class="settings-home-header-spacer" aria-hidden="true"></span>
          <div><h1>${titles.home}</h1><p>@${esc(me.username)}</p></div>
          <button id="settings-back" class="settings-home-done" data-testid="button-settings-back" aria-label="Done">Done</button>`
        : `<button id="settings-back" class="settings-back" data-testid="button-settings-back" aria-label="Back to Settings">${ic.back}</button>
          <div><h1>${titles[settingsView] || "Settings"}</h1></div>
          <span class="${settingsArtwork ? "settings-header-art" : ""}" aria-hidden="true">${settingsArtwork}</span>`}
    </header>
    <main class="settings-content">${content}</main>
  </div>${saveBar}</section>`, "light");
  void mountCognitoAction($("#cognito-account-link"), { intent: "link",
    connected: api.authProvider() === "cognito", onError: toast });
  $("#cognito-password") && ($("#cognito-password").onclick = async () => {
    const button = $("#cognito-password");
    button.disabled = true;
    try { await beginCognitoSignIn("login"); }
    catch (error) { if (button.isConnected) button.disabled = false; toast(error.message); }
  });
  if (extra) {
    extra.bind();
    app.querySelectorAll("[data-exp-nav]").forEach(button => {
      if (button.closest("#help-results")) return;
      button.onclick = () => {
      const route = button.dataset.expNav;
      if(navigationStack.at(-1)?.helpfulArticle)delete navigationStack.at(-1).helpfulArticle;
      if(["help-blast","help-blast-invite","help-note","help-friends","help-messages","help-communities","help-create"].includes(route))return navigateHelpfulPrompt(route);
      if (route === "edit-profile") return openEditProfile();
      if (["account-type","personal-activity","creator-studio","business-dashboard","monthly-recap","best-practices","inspiration","blue-badge"].includes(route)) return navigateFromDrawer(route);
      if (route.startsWith("campaign:")) selectedCampaignId = route.slice(9);
      else if (route === "campaign-edit") selectedCampaignId = settingsView.startsWith("campaign:") ? settingsView.slice(9) : selectedCampaignId;
      openSettingsSubview(route);
      };
    });
  }
  if (settingsView === "close-friends") {
    let remoteCandidates = [];
    let searchVersion = 0;
    let cloudListReady = api.authMode() !== "cloud" || api.cloudCloseFriendsLoaded();
    let cloudListError = "";
    const renderCloseFriends = (query = "") => {
      const current = api.me();
      const selected = settingsDraft.closeFriends;
      const normalizedQuery = query.trim().toLowerCase();
      const cloudMode = api.authMode() === "cloud";
      if (cloudMode && !cloudListReady) {
        $("#close-friends-count").textContent = `${selected.size} added`;
        $("#close-friends-list").innerHTML = `<div class="empty">${esc(cloudListError || "Loading your Close Friends…")}</div>`;
        return;
      }
      const cloudSelected = [...selected].map(id => api.user(id)).filter(Boolean);
      const candidates = (cloudMode
        ? [...new Map([...cloudSelected, ...remoteCandidates].map(person => [person.id, person])).values()]
        : api.db().users.filter(person => api.areFriends(current.id, person.id) && !api.blocked(current.id, person.id)))
        .filter(person => !normalizedQuery || `${person.name || person.displayName || ""} ${person.username || ""}`.toLowerCase().includes(normalizedQuery))
        .sort((a, b) => Number(selected.has(b.id)) - Number(selected.has(a.id)) ||
          (a.name || a.displayName || a.username).localeCompare(b.name || b.displayName || b.username));
      $("#close-friends-count").textContent = `${selected.size} added`;
      $("#close-friends-list").innerHTML = candidates.map(person => {
        const added = selected.has(person.id);
        return `<button type="button" class="listbtn close-friend-row ${added ? "is-selected" : ""}" data-close-friend="${esc(person.id)}" aria-pressed="${added}">
          <img ${profileMediaSource(person.avatar || "")} alt="" />
          <span class="close-friend-person"><b>${esc(person.name || person.displayName || person.username)}</b><small>@${esc(person.username)}</small></span>
          <span class="close-friend-state">${added ? "Added" : "Add"}</span>
        </button>`;
      }).join("") || `<div class="empty">${normalizedQuery ? "No accounts match that search." : cloudMode ? "Search by username to add people." : "Become Friends with someone first to add them here."}</div>`;
      app.querySelectorAll("[data-close-friend]").forEach(button => {
        button.onclick = () => {
          const id = button.dataset.closeFriend;
          if (!cloudMode && (!api.areFriends(current.id, id) || api.blocked(current.id, id))) {
            selected.delete(id);
            renderCloseFriends($("#close-friends-search").value);
            updateSettingsSaveState();
            return toast("Only confirmed Friends can be added to Close Friends");
          }
          if (selected.has(id)) selected.delete(id);
          else selected.add(id);
          updateSettingsSaveState();
          renderCloseFriends($("#close-friends-search").value);
        };
      });
    };
    $("#close-friends-search").oninput = event => {
      const query = event.currentTarget.value;
      renderCloseFriends(query);
      if (api.authMode() !== "cloud" || query.trim().length < 2) {
        remoteCandidates = [];
        renderCloseFriends(query);
        return;
      }
      const request = ++searchVersion;
      void api.searchCloudUsers(query).then(profiles => {
        if (request !== searchVersion || !$("#close-friends-list")?.isConnected) return;
        remoteCandidates = profiles;
        renderCloseFriends(query);
      }).catch(error => toast(error.message || "Account search could not be completed."));
    };
    renderCloseFriends();
    if (api.authMode() === "cloud") {
      const search = $("#close-friends-search");
      cloudListReady = api.cloudCloseFriendsLoaded();
      if (!cloudListReady) {
        void Promise.all([api.refreshCloudCloseFriends(), api.refreshCloudBlocks()]).then(([ids]) => {
          if (!$("#close-friends-list")?.isConnected) return;
          cloudListReady = true;
          settingsDraft.closeFriends = new Set(ids);
          initialSettingsDraft.closeFriends = new Set(ids);
          renderCloseFriends(search.value);
          updateSettingsSaveState();
        }).catch(error => {
          cloudListError = error.message || "Close Friends could not be loaded. Try again.";
          toast(cloudListError);
          renderCloseFriends(search.value);
        });
      }
    }
  }
  const save = (change, message) => {
    try { mutate(change); } catch (e) { toast(e.message); return false; }
    render();
    if (message) toast(message);
    return true;
  };
  const saveSettingsButton = $("#settings-save");
  if (saveSettingsButton) saveSettingsButton.onclick = async () => {
    if (!hasUnsavedSettings()) return;
    try {
      if (api.authMode() === "cloud" && settingsView === "privacy") {
        await api.updateCloudPrivacy(settingsDraft.isPrivate);
        if (settingsDraft.taggingAudience !== initialSettingsDraft.taggingAudience) {
          await api.updateCloudAccountState({ taggingPreferences: { whoCanTag: settingsDraft.taggingAudience } });
        }
      } else if (api.authMode() === "cloud" && settingsView === "close-friends") {
        const savedIds = await api.replaceCloudCloseFriends([...settingsDraft.closeFriends]);
        settingsDraft.closeFriends = new Set(savedIds);
        initialSettingsDraft.closeFriends = new Set(savedIds);
        hasPendingSettingsChanges = false;
        render();
        toast("Close Friends saved");
        return;
      } else if (api.authMode() === "cloud" && settingsView === "chat") {
        await api.updateCloudAccountState({ chatPreferences: {
          readReceipts: settingsDraft.readReceipts,
          lastSeen: settingsDraft.lastSeen,
        } });
      } else if (api.authMode() === "cloud" && settingsView === "notifications") {
        await api.updateCloudAccountState({ notificationEnabled: settingsDraft.notifications });
      }
      mutate(db => {
        const account = db.users.find(user => user.id === me.id);
        if (!account) throw new Error("Account unavailable");
        if (settingsView === "privacy") {
          account.private = settingsDraft.isPrivate;
          account.taggingPreferences = { whoCanTag: settingsDraft.taggingAudience };
          account.profileVisibility = {
            ...account.profileVisibility,
            city: settingsDraft.showCity,
            interests: settingsDraft.showInterests
          };
        } else if (settingsView === "close-friends") {
          account.closeFriends = [...settingsDraft.closeFriends].filter(id =>
            id !== account.id && api.areFriends(account.id, id) && !api.blocked(account.id, id)
          );
        } else if (settingsView === "chat") {
          db.settings = {
            ...db.settings,
            readReceipts: settingsDraft.readReceipts,
            lastSeen: settingsDraft.lastSeen
          };
        } else if (settingsView === "notifications") {
          account.notifs = settingsDraft.notifications;
        }
      });
    } catch (error) {
      toast(error.message || "Couldn't save settings");
      return;
    }
    hasPendingSettingsChanges = false;
    render();
    toast("Settings saved");
  };
  $("#settings-back").onclick = () => {
    if ((hasPendingSettingsChanges || hasUnsavedSettings()) && !confirm("Discard your unsaved settings changes?")) return;
    hasPendingSettingsChanges = false;
    if (settingsView.startsWith("help-article-") &&
      navigationStack.at(-1)?.helpfulArticle === settingsView && navigateBack()) return;
    if (settingsViewStack.length) {
      const previous = settingsViewStack.pop();
      if (settingsView.startsWith("campaign") && !previous.startsWith("campaign")) selectedCampaignId = null;
      settingsView = previous;
      render();
    }
    else if (settingsView.startsWith("campaign:")) { settingsView = "campaigns"; selectedCampaignId = null; render(); }
    else if (settingsView === "campaign-edit") { settingsView = selectedCampaignId ? `campaign:${selectedCampaignId}` : "campaigns"; render(); }
    else if (settingsView === "campaign-create") { settingsView = "campaigns"; render(); }
    else if (settingsView.startsWith("help-article-")) {
      settingsView = "help"; render();
    }
    else if (settingsView.startsWith("privacy-topic-")) { settingsView = "privacy-center"; render(); }
    else if (settingsView !== "home") { settingsView = "home"; render(); }
    else if (!navigateBack()) { tab = "updates"; profileId = me.id; render(); }
  };
  app.querySelectorAll("[data-settings]").forEach(b => b.onclick = () => {
    settingsViewStack.length = 0;
    settingsView = b.dataset.settings;
    render();
  });
  $("#edit") && ($("#edit").onclick = openEditProfile);
  $("#settings-search") && ($("#settings-search").oninput = event => {
    const query = event.currentTarget.value.trim().toLowerCase();
    let visibleEntries = 0;
    app.querySelectorAll(".settings-group").forEach(group => {
      const entries = [...group.querySelectorAll(".settings-entry")];
      let visibleInGroup = 0;
      entries.forEach(button => {
        const matches = !query || button.textContent.toLowerCase().includes(query);
        button.hidden = !matches;
        if (matches) visibleInGroup += 1;
      });
      group.hidden = visibleInGroup === 0;
      visibleEntries += visibleInGroup;
    });
    const empty = $("#settings-no-results");
    if (empty) empty.hidden = !query || visibleEntries > 0;
  });
  if(settingsView==="home"&&api.authMode()==="cloud"){
    const owner=api.cloudAccountId(),search=$("#settings-search");
    settings.moderationAccess??=new Map();
    if(!settings.moderationAccess.has(owner))settings.moderationAccess.set(owner,
      requestCloudApi("/api/moderation/access").then(result=>result.allowed===true).catch(()=>false));
    void settings.moderationAccess.get(owner).then(allowed=>{
      if(!allowed||!search?.isConnected||api.cloudAccountId()!==owner||$("#review-queue-open"))return;
      const button=document.createElement("button");button.id="review-queue-open";button.className="mq-launch";
      button.type="button";button.textContent="Review queue";
      button.onclick=()=>{settingsView="review-queue";render();};
      search.closest("label").insertAdjacentElement("afterend",button);
    });
  }
  $("#password-form") && ($("#password-form").onsubmit = async event => {
    event.preventDefault();
    const currentPassword = $("#cp").value;
    const password = $("#np").value;
    if (password.length < 8 || password.length > 128) return toast("Password must be 8–128 characters");
    if (password !== $("#confirm-pass").value) return toast("Passwords do not match");
    try {
      if (api.authMode() === "cloud") {
        await api.changePassword(currentPassword, password);
      } else {
        if (currentPassword !== api.me().password) return toast("Current password is wrong");
        if (!save(db => { db.users.find(u => u.id === me.id).password = password; })) return;
      }
      settingsView = "home";
      render();
      toast("Password updated");
    } catch (error) {
      toast(error.message || "Couldn’t update your password");
    }
  });
  $("#private-toggle") && ($("#private-toggle").onclick = () => {
    settingsDraft.isPrivate = !settingsDraft.isPrivate;
    $("#private-toggle").setAttribute("aria-pressed", String(settingsDraft.isPrivate));
    $("#private-toggle").textContent = `Private account · ${settingsDraft.isPrivate ? "On" : "Off"}`;
    updateSettingsSaveState();
  });
  app.querySelectorAll("[data-tag-audience]").forEach(button => button.onclick = () => {
    settingsDraft.taggingAudience = button.dataset.tagAudience;
    app.querySelectorAll("[data-tag-audience]").forEach(option => {
      const selected = option.dataset.tagAudience === settingsDraft.taggingAudience;
      option.classList.toggle("on", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    const copy = {
      everyone: "Anyone can mention you in posts, comments, or Story replies.",
      following: "Only accounts you follow can mention you in posts, comments, or Story replies.",
      nobody: "No one can mention you in posts, comments, or Story replies.",
    };
    $("#tag-audience-description").textContent = copy[settingsDraft.taggingAudience];
    updateSettingsSaveState();
  });
  if (settingsView === "privacy") bindListVisibilitySettings();
  app.querySelector("[data-ev-settings]")?.addEventListener("click", () => void openEmailVerificationSheet({ sheet: $("#sheet"), toast, esc }));
  app.querySelectorAll("[data-profile-visibility]").forEach(button => button.onclick = () => {
    const key = button.dataset.profileVisibility === "city" ? "showCity" : "showInterests";
    settingsDraft[key] = !settingsDraft[key];
    const label = button.dataset.profileVisibility === "city" ? "Show city on profile" : "Show interests on profile";
    button.setAttribute("aria-pressed", String(settingsDraft[key]));
    button.textContent = `${label} · ${settingsDraft[key] ? "On" : "Off"}`;
    updateSettingsSaveState();
  });
  $("#receipts-toggle") && ($("#receipts-toggle").onclick = () => {
    settingsDraft.readReceipts = !settingsDraft.readReceipts;
    $("#receipts-toggle").setAttribute("aria-pressed", String(settingsDraft.readReceipts));
    $("#receipts-toggle").textContent = `Read receipts · ${settingsDraft.readReceipts ? "On" : "Off"}`;
    updateSettingsSaveState();
  });
  app.querySelectorAll("[data-last-seen]").forEach(button => button.onclick = () => {
    settingsDraft.lastSeen = button.dataset.lastSeen;
    app.querySelectorAll("[data-last-seen]").forEach(option => {
      const selected = option.dataset.lastSeen === settingsDraft.lastSeen;
      option.classList.toggle("on", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    updateSettingsSaveState();
  });
  $("#notifs-toggle") && ($("#notifs-toggle").onclick = () => {
    settingsDraft.notifications = !settingsDraft.notifications;
    $("#notifs-toggle").setAttribute("aria-pressed", String(settingsDraft.notifications));
    $("#notifs-toggle").textContent = `Notifications · ${settingsDraft.notifications ? "On" : "Off"}`;
    updateSettingsSaveState();
  });
  app.querySelectorAll("[data-un]").forEach(b => b.onclick = async () => {
    if (api.authMode() === "cloud") {
      try {
        await api.replaceCloudBlocks(api.cloudBlocks().filter(id => id !== b.dataset.un));
        render();
        toast("Unblocked");
      } catch (error) { toast(error.message || "The account could not be unblocked."); }
      return;
    }
    save(db => { db.blocks = db.blocks.filter(x => !(x.by === me.id && x.who === b.dataset.un)); }, "Unblocked");
  });
   $("#save-report") && ($("#save-report").onclick = () => {
    const reason = $("#problem").value.trim();
    if (!reason) return toast("Describe the problem first");
     save(db => db.reports.push({ id: "h" + Date.now(), by: me.id, target: "app", reason, at: Date.now() }), "Report saved");
  });
  $("#out") && ($("#out").onclick = () => { logoutAccount(); settingsView = "home"; tab = "updates"; chatId = null; profileId = null; viewer = null; render(); });
  $("#delete-account")?.addEventListener("click", () => openAccountDeletion({
    request: requestCloudApi, accountId: api.cloudAccountId(), currentAccountId: api.cloudAccountId,
    toast, onDeleted: () => {
      logoutAccount(); settingsView = "home"; tab = "updates"; chatId = null; profileId = null; viewer = null; render();
    },
  }));
  $("#reset") && ($("#reset").onclick = () => {
    if (!confirm("Permanently delete all Oldtime data in this browser, including accounts, posts, stories, messages, and settings?")) return;
    api.reset();
    settingsView = "home";
    tab = "updates";
    profileId = null;
    viewer = null;
    render();
  });
}

const params = new URLSearchParams(location.search);
let pendingPlaceId=params.get("place")||"";
function resolvePendingPlaceLink(){
  if(!pendingPlaceId||!api.me())return;
  const id=pendingPlaceId;pendingPlaceId="";
  selectPlace({id,label:params.get("label")||"Place",source:id.startsWith("osm:")?"osm":"custom"});
}
let pendingSharedComment = params.get("comment") || "";
let pendingStoryId = params.get("story") || "";
let pendingProfileUsername = params.get("user") || "";
let pendingProfileOpening = false;
let pendingStoryOpening = false;
if (params.get("post")) viewer = params.get("post");
if (params.get("user")) profileId = api.user(params.get("user"))?.id || null;
async function resolvePendingProfileLink() {
  if (!pendingProfileUsername || pendingProfileOpening || !api.me()) return;
  const username = pendingProfileUsername;
  const owner = api.cloudAccountId();
  pendingProfileOpening = true;
  try {
    await openProfileUsername(username, owner);
    if (owner === api.cloudAccountId() && username === pendingProfileUsername) pendingProfileUsername = "";
  } catch (error) {
    if (owner === api.cloudAccountId() && username === pendingProfileUsername) {
      pendingProfileUsername = "";
      toast(error.message || "Profile unavailable.");
    }
  } finally {
    pendingProfileOpening = false;
  }
}
async function resolvePendingStoryLink() {
  if (!pendingStoryId || pendingStoryOpening || !api.me()) return;
  const requestedId = pendingStoryId;
  const requestingAccount = api.cloudAccountId();
  pendingStoryOpening = true;
  try {
    await api.refreshCloudStories();
    if (requestingAccount !== api.cloudAccountId() || requestedId !== pendingStoryId) return;
    const story = api.stories().find(item => item.id === requestedId);
    pendingStoryId = "";
    if (!story || !api.canSeeStory(story)) { toast("Story unavailable"); return; }
    openStory(story.author, story.id);
  } catch (error) {
    if (requestingAccount === api.cloudAccountId() && requestedId === pendingStoryId) {
      pendingStoryId = "";
      toast(error.message || "Story could not be opened.");
    }
  } finally {
    pendingStoryOpening = false;
  }
}
installStableDataRefresh({
  render,
  shouldDefer: () => Boolean($("#sheet.on") || $("#storyview.on") ||
    document.querySelector(".emoji-overlay,.creative-editor,.creative-response")),
});
window.addEventListener("oldtime-emoji-closed", () => {
  if (!deferredEmojiRender || document.querySelector(".emoji-overlay")) return;
  deferredEmojiRender = false;
  render();
});
function handleUnhandledClientError(error) {
  const message = String(error?.message || "");
  if (!message) return;
  const crossOriginLoad = /cross[- ]origin|cross origin|\bcors\b|resource sharing policy|script error/i.test(message);
  console.warn("[Oldtime runtime]", {
    name: String(error?.name || "Error"),
    category: crossOriginLoad ? "cross-origin-resource" : "unhandled-client-error",
  });
  if (!crossOriginLoad) toast("Something went wrong. Please try again.");
}
window.addEventListener("error", event => handleUnhandledClientError(event.error));
window.addEventListener("unhandledrejection", event => handleUnhandledClientError(event.reason));
void (async () => {
  let result = null, failure = "";
  try {
    result = await completeCognitoSignIn();
    if (!result) await api.restoreCloudAccount();
  }
  catch (error) { failure = error.message || "Secure sign-in could not be completed."; }
  render();
  if (failure) {
    const field = $("#err");
    if (field) field.textContent = failure;
    else toast(failure);
  } else if (result === "link") toast("Secure sign-in connected");
  void finishStartup();
})();
