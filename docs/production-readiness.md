# Oldtime production-readiness plan

Last reviewed: 2026-11-10  
Repository: `oldtimemessenger/oldtimeapache`  
Production status: **NOT APPROVED FOR PUBLIC LAUNCH**

This document is the launch gate. A merged UI change, passing unit suite, or successful static build does not certify the live service. Each gate needs recorded evidence from the intended production configuration and independent user accounts.

## Current confirmed blockers

These are documented by the application README and configuration guides; they are not assumptions based on appearance.

- **Feature persistence and multi-device behavior:** the README states that many social features still use browser storage under `oldtime-v1`. Profiles, friendships, restricted-content audiences, Stories, chat, reports, and several interactions still need complete server-backed persistence and authorization.
- **Authentication:** Cognito is disabled pending the replacement web app-client ID, exact callback/sign-out configuration, and live sign-in/sign-out verification. Email verification and password recovery have not been live-tested.
- **Media:** the R2/S3-compatible media adapter requires production credentials and bucket configuration. Live upload, retrieval, access control, versioning, cleanup, and failure recovery have not been certified.
- **Privacy and authorization:** server-side enforcement must be verified for private profiles, followers/friends/close-friends audiences, blocks, lists, Stories, chat, comments, media URLs, account deletion, and moderation. Client-side filtering is not an authorization boundary.
- **Realtime and calls:** direct calls require cross-device tests across cellular, Wi-Fi, restrictive NAT/firewall networks, and VPNs. TURN is not configured by default.
- **Release verification:** the Pages frontend and private API Worker must be released in the documented order, then verified on the real production domain. A build or Wrangler dry-run is not a deployment.

## Gate 1 — Automated repository quality

- [ ] CI runs on every pull request and every push to `main`.
- [ ] Frozen dependency install succeeds with the checked-in lockfile.
- [ ] Workspace typecheck passes.
- [ ] Frontend unit/integration suite passes.
- [ ] API unit/integration suite passes.
- [ ] Cloudflare Pages routing/build integration tests pass.
- [ ] Frontend production build succeeds.
- [ ] API Worker Wrangler dry-run succeeds.
- [ ] Browser tests cover primary journeys at mobile and desktop viewports; failures are triaged, not ignored.
- [ ] CI status is green on the exact commit proposed for release.

## Gate 2 — Data ownership and multi-user correctness

For each feature below, confirm data is stored server-side, scoped to the authenticated owner, and consistent across two independently registered accounts and devices. Do not migrate or delete legacy browser data without a tested, recoverable migration.

- [ ] Account/profile edits, avatar and cover media.
- [ ] Follow/friend/block relationships and list visibility.
- [ ] Posts, replies, likes, reposts, bookmarks and view counters.
- [ ] Stories, expiry/archive behavior, audiences, stickers, question answers and mentions.
- [ ] Community posts, threads, feeds and moderation/report state.
- [ ] Inbox, messages, read state, attachments, voice notes and call signaling.
- [ ] Notifications and unread counts.
- [ ] Search, discovery, Places and recommendation feedback.
- [ ] Creator/professional tools and account settings.
- [ ] Drafts and editor projects: clear which are intentionally device-local and which must sync.

For every item, test create/read/update/delete, owner isolation, blocked-user behavior, account switching, session expiry, and retry/offline recovery where relevant.

## Gate 3 — Authentication, privacy and security

- [ ] Configure Cognito production client and production callback/sign-out allowlists; keep client secrets server-only.
- [ ] Test registration, login, logout, refresh/session expiry, email verification, password recovery, and account recovery.
- [ ] Test access control using unrelated accounts for every private/restricted resource.
- [ ] Verify blocked users cannot discover or interact with protected content through API routes, direct media URLs, search, notifications, or realtime events.
- [ ] Verify account deletion removes or anonymizes owned data according to the published retention policy, including media and related records.
- [ ] Review rate limits, upload limits, abuse controls, moderation escalation, request validation, security headers, CORS, secrets, logs and error redaction.
- [ ] Complete dependency and secret scanning; resolve critical/high findings or document approved exceptions.
- [ ] Review privacy policy, terms, community guidelines, reporting, appeals, age requirements and support contact.

## Gate 4 — Media, performance and accessibility

- [ ] Verify upload, multipart resume, transcoding/format support, playback, signed/public access, deletion and orphan cleanup against production R2.
- [ ] Verify photo/video editor operations preserve original media and drafts across app restarts; verify exports on supported iOS/Android browsers.
- [ ] Test slow networks, interrupted uploads, low-memory devices, autoplay restrictions and media decode failures.
- [ ] Measure real-user startup, route transitions, feed scroll, media start, API latency and error rates; define budgets before tuning.
- [ ] Verify safe areas, keyboard behavior, touch targets, reduced motion, contrast, screen-reader labels and focus order.
- [ ] Test current iPhone Safari/PWA and Android Chrome/PWA plus desktop browsers.

## Gate 5 — Operations and release

- [ ] Confirm production Pages project, custom domain/DNS, API service binding, Worker, D1 database, R2 bucket and scheduled jobs.
- [ ] Apply reviewed additive D1 migrations before deploying schema-dependent Worker code; record migration result and backup/restore point.
- [ ] Confirm production environment variables and secrets without exposing values in logs or PRs.
- [ ] Verify backups, restore procedure, retention, incident contacts, alerting, log access and rollback steps.
- [ ] Deploy Worker first, then Pages, following [Cloudflare release procedure](cloudflare-pages.md).
- [ ] Run production smoke tests for registration/login, feed, discovery, post creation, comments, media upload/playback, Stories, chat and privacy boundaries.
- [ ] Confirm service health, error rates and logs after release; document release SHA and rollback decision.

## Existing repository commands

Run from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm --filter @workspace/oldtimehive run test
pnpm --filter @workspace/api-server run test
pnpm run test:cloudflare
pnpm run cloudflare:build
pnpm --filter @workspace/api-server run build
```

The CI workflow added alongside this plan runs these checks for pull requests and pushes to `main`. CI is a necessary gate, not a substitute for the live-environment and cross-device checks above.

## Release decision

**Do not announce production readiness or open public registration until every required gate is either passed with evidence or explicitly accepted by the accountable owner.** Do not mark an item complete from code inspection alone when it requires a live service, real accounts, real devices, or external provider configuration.
