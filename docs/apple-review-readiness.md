# Oldtime — Apple review readiness

Checked on 2026-11-08. Submission target confirmed by the owner:
**the existing PWA in an iOS wrapper**, not a new native/Expo interface.

## Status

**Not yet verified ready for submission.** The current PWA repair checks below
pass, but they do not certify an iOS binary or guarantee App Review approval.
No Cloudflare deployment, Apple submission, source commit, or GitHub sync was
performed in this pass. Production records were not changed.

## Repairs in this pass

- Corrected chat folder assertions to include the existing empty-conversation
  fixture and to check the exact conversation IDs in each folder.
- Preserved an account-scoped thread identity independently of subscription
  cleanup, so returning from Chat details restores the message-reading position.
  Switching conversations still opens at the latest message.
- Routed text-only original posts to the existing white Original post sheet
  rather than the full-screen picture viewer. A comment-specific destination
  still opens the requested comment.
- Retained the current post-action icon while supporting the legacy icon input
  so consumers cannot accidentally render a blank menu trigger.
- Updated obsolete app-unit assertions to reflect the existing no-inbox-search,
  safe media-reference, next-Story prefetch, and stylesheet-order behavior.
- Made profile geometry sampling atomic in the browser test so hydration cannot
  replace the row between separate measurements.
- Checked the existing Expo WebView wrapper and aligned six packages to the
  compatible versions recommended for its current SDK 58, without changing
  its interface or upgrading to a different SDK.

## Evidence

- The latest non-browser JavaScript run under `app/` completed **910 checks**:
  909 passed and one caught the legal page's independent font declaration.
  That declaration now uses the shared interface font. The **11 focused
  authentication, legal and typography checks** pass after the correction;
  the broad run was not repeated after that CSS-only fix.
- Mobile screenshots confirm the sign-in footer is absent and the public
  privacy page renders the effective date without an internal review banner.
  PWA typecheck/build and all four wrapper navigation/viewport checks pass.
- The isolated backend selection passed **14 tests** covering account deletion,
  password recovery, account/audience policy, creation privacy, and moderation.
  These use memory/test fixtures, not the production database.
- The focused browser modes `OLDTIME_CHAT_LAYOUT_ONLY=1` and
  `OLDTIME_PROFILE_POSTS_ONLY=1` pass. They verify the repaired reading-position
  return and the original text-post sheet, as well as their existing chat/profile
  checks, against isolated intercepted APIs.
- PWA typecheck and production build pass. Existing Vite large-chunk warnings
  remain; no claim of Instagram-equivalent performance is made.
- After dependency alignment, the existing wrapper's SDK compatibility check,
  typecheck and four navigation/viewport/configuration tests pass. Its managed
  workflow restarts successfully. No signed binary or physical-device result
  is established.
- The full multi-page browser suite has **not** passed end to end in this pass.
  It exposed the chat scroll and text-viewer defects above. Its latest run
  stopped at profile measurements taken across a hydration rerender; those
  measurements are now collected together, but the complete suite has not been
  rerun after that test correction.
- The separate older `test/` suite also has failing expectations, including
  disabled/retired Sports behavior and superseded UI contracts. Do not restore
  retired features merely to satisfy those assertions, or report that suite
  as passing.

Fixture browser checks demonstrate client behavior, not delivery through the
published Cloudflare service or compatibility with physical iPhones.

## Submission blockers

### 1. Actual wrapper and device validation

The existing `artifacts/oldtime-mobile` package is an Expo WebView wrapper for
the Cloudflare-hosted PWA, matching the selected approach. Its source and static
configuration were inspected. It already declares camera, microphone,
photo-library and location purpose strings, restricts top-level navigation,
and keeps the existing website interface. No signed iOS binary or
physical-device evidence is available in this pass. Validate the actual build:

- WKWebView configuration, trusted origins, navigation and external-link handling.
- Camera, microphone, photo-library and location purpose strings and permission
  denial/retry behavior.
- Safe areas, keyboard resizing, attachment pickers, inline/full-screen playback,
  voice/video calls and location maps.
- Authentication persistence, verification/reset links, foreground/background
  transitions, interrupted uploads, and sign-out.
- Release signing, bundle/version metadata, icons, required privacy manifests,
  App Store Connect privacy declarations, age rating and reviewer access.

Run these on a real iPhone using the actual release wrapper, not only a
Chromium mobile viewport.

The wrapper loads the hosted website, not the workspace preview. Unpublished
PWA fixes will not appear in it until the owner approves a Cloudflare release.
There is no native notification bridge or background-upload service in the
existing wrapper; do not represent browser lifecycle behavior as a native
background-delivery guarantee.

### 2. Publish the owner-approved legal material

The owner approved the custom Privacy Policy, Terms and Community Guidelines
on 2026-11-08. Public `/privacy`, `/terms` and `/guidelines` routes and Settings
share the documents and effective date. Internal approval checklists and draft
warnings are removed; the informational/legal-advice disclaimer remains visible.
Public policy metadata no longer marks the pages as unapproved drafts.

The text distinguishes current service behavior from planned Apple subscriptions:
payments, restoration, gifts and discounts are not represented as operational.
It discloses verified providers, account deletion and retryable media cleanup,
the source-configured analytics/upload cleanup thresholds, and plan-dependent
Cloudflare recovery/log retention without inventing an unverified number of days.
It makes no indefinite Story archive promise and no international certification
or guaranteed support-response claim. Owner approval is not attorney review.

These changes are a workspace release candidate, not proof that the approved
pages are live on Cloudflare. Publish and check the public URLs before using
them in App Store Connect. Also resolve the separate Story archive/cleanup
finding in `docs/privacy-implementation-audit.md`; policy wording is not a
substitute for preserving private archives.

A signed-out `/support` page provides searchable questions and answers and a
real support email link; it does not invent a staffed ticket system or response
times. Signup and in-app Help & Support expose the public help page. Sign-in
does not show the Contact/Privacy/Terms/Guidelines/Support navigation row.
Final-step signup copy explains agreement to the linked terms and guidelines.

Source checks and isolated tests establish that account deletion, report/block
controls and moderation code exist. They do not establish the business's
operational response process, legal compliance or live reviewer access.

### 3. Apple subscriptions

The owner selected Apple billing for digital purchases; physical goods may
use other methods, but no physical products are offered. Blue Badge must use an
auto-renewable subscription product. The iOS wrapper bundle ID is
`com.oldtime.messenger`. The StoreKit bridge and Cloudflare transaction
verification path are in source, but neither source code nor an Apple dashboard
setting proves a working purchase flow. Apple Server API credentials, product
configuration, notification delivery, sandbox testing and the production
activation switch still need verification before claiming paid Blue Badge is
available. Do not replace unrelated products or trust client flags.
Browser-only PWA checkout does not provide StoreKit.

### 4. Release regression and approved production update

Finish the complete browser regression gate, reconcile the older test contracts
with the current product scope, and verify the candidate in the actual wrapper.
Review the final changes with the owner before any source submission/sync, and
obtain current approval before publishing to Cloudflare.

## Apple reference

[App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
were consulted for review access/completeness, user-generated-content safeguards,
minimum functionality and privacy/account deletion. Relevant sections include
1.2, 2.1, 4.2 and 5.1.1.

A website wrapper is not automatically approved: Apple requires useful,
app-like functionality beyond a repackaged website. Only Apple can make the
review decision for the submitted build.
