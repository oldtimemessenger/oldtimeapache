# Oldtime — privacy implementation audit

Audit date: 2026-11-08.

**Scope:** current PWA, Cloudflare Worker source, existing iOS WebView
wrapper, and the read-only Cloudflare configuration checks recorded below.
This is a technical audit for drafting public legal pages, not legal advice,
an approved Privacy Policy or a complete operational compliance audit.
A qualified lawyer should review the final documents. No production data,
infrastructure settings or retention jobs were changed.

## Proposed public documents

- `/privacy` — Privacy Policy.
- `/terms` — Terms of Service.
- `/guidelines` — Community Guidelines.

Use one shared content source for public routes and the corresponding in-app
legal screens. Public pages must work without sign-in and include navigation
between the documents. Do not publish an owner-contact placeholder as an
approved policy.

## Confirmed data handling

| Area | Confirmed implementation | Consequence for the policy |
| --- | --- | --- |
| Account registration | Email, username, display name, birthday/age information, interests and account/profile state are processed. The Worker uses salted scrypt password derivation and hashed session tokens. | Explain account/security purposes; never say passwords are stored as plaintext, but do not promise absolute security. |
| Age | `lib/api-zod/src/signup-age.ts` sets and validates a minimum age of **16**; the Worker applies that validation to signup. | Do not use a generic “13 and older” clause. Existing age controls are not independent proof of every user's actual age. |
| Profiles and social activity | Profiles, avatars/covers, following/friend relationships, privacy choices, blocks, posts, comments, likes, reposts, saves and notification/activity state are handled by Cloudflare-backed features. | Explain public/chosen audiences and controls. Recipients can copy or capture material; private settings cannot revoke copies outside the service. |
| Photos, video and audio | Media references/metadata are in D1 and uploaded files in R2. Creation tools and uploads process photos, videos, voice notes and original sounds. Device camera/microphone/library access supports user-initiated features. | Describe uploaded media separately from device permission access and publication audiences. Do not claim the whole device library is uploaded. |
| Private messages | `chats.ts` stores message bodies, metadata, author/conversation IDs and media associations in the backend. | Do **not** call ordinary chat end-to-end encrypted. Describe account/conversation access controls without equating them to E2EE. Reports may include relevant message content. |
| Calls | Calls use browser WebRTC with Cloudflare signaling. `comms/config.js` lists Google's public STUN endpoints and supports configured TURN relays. No call-recording feature was established in the reviewed call path. | Explain connection/signaling processing and possible peer-network disclosure. Do not promise hidden IP addresses, universal peer-to-peer connections, or recording behavior beyond verified functionality. Confirm any deployed TURN provider before naming it. |
| Location | Explicit location requests support Places and chat-location sharing. A location sent in chat becomes message content; named place tags can be attached to posts. | Distinguish permission to obtain a location from the user's decision to send/publish it. Turning off device permission does not by itself delete previously shared coordinates or post tags. Do not imply continuous background tracking. |
| Analytics | `analytics.ts` records first-party actor/content events, playback/view sessions and aggregates used for creator metrics and activity. Performance endpoints log bounded normalized samples. | Disclose engagement analytics and performance diagnostics. Do not promise that no usage data is collected. |
| Security/network information | The Worker reads the Cloudflare connecting IP and hashes it into rate-limit keys. Network providers necessarily process connection requests. | Distinguish the application's hashed rate-limit identifier from providers' network/log processing; do not assert that no provider sees IP information. |
| Device storage | The active session is persisted in sessionStorage. The release entry and store also contain legacy-recovery/test/local-state handling; the PWA has app-shell caching. | “Cloudflare is the authoritative backend” does not mean “nothing is stored on the device.” Explain sessions, caching and technical storage accurately. |

## Processors and network recipients found in source

1. **Cloudflare Workers, D1 and R2:** application requests, relational records
   and media hosting/storage. Cloudflare realtime services support chat/call
   signaling.
2. **Cloudflare Workers AI:** publication-safety checks are invoked from post
   and Story creation/edit paths. Those checks can process publication text
   and media. Do not omit this processing or confuse it with a general-purpose
   recommendation classifier.
3. **Resend:** account email-verification and password-recovery email delivery,
   including recipient email addresses and the account-action email. The source
   has this integration; successful live delivery was not verified by this audit.
4. **OpenFreeMap/OpenStreetMap-based mapping:** rendering the selected map
   requires requests for map resources, which can reveal network/request
   information and the area being displayed.
5. **Photon by komoot:** place-search requests are made by the Worker to its
   search endpoint. Describe sharing needed for place lookup rather than
   claiming all search processing is exclusively internal.
6. **Google public STUN endpoints:** network-connectivity discovery for calls.
   A separately configured TURN relay would also need appropriate disclosure.

An installed connector, unused package or old source file is not enough to name
a provider as an active production processor. Payment processing, optional
analytics products, ad pixels, logging products and any off-platform operational
tools require owner/provider-configuration confirmation. Do not claim “we never
share data with third parties,” “we sell data,” or “we do not sell/share data for
advertising” solely from this source audit.

### Additional release-source checks

The operator did not know whether additional paid/advertising services were
active. A follow-up source inspection established these narrower findings:

- The Cloudflare membership endpoint in `creators.ts` explicitly returns
  `purchaseSupported: false`, `restorationSupported: false` and
  `billingEnabled: false`. Ordinary membership restoration is rejected.
  Membership records and planned pricing do not establish working billing.
  Do not list an app store or payment processor as currently processing Oldtime
  purchase data solely because code or historical requirements mention it.
- A targeted scan of the current PWA, Cloudflare API and wrapper source found
  no loaded common ad-network/tracking SDKs such as Google Ads/Tag Manager,
  Meta Pixel or TikTok Pixel. This is not a guarantee about scripts injected
  by production hosting settings, off-platform tools or a different deployed
  version, and does not establish a legal “no sale/sharing” representation.
- The website entry loads a Google Fonts stylesheet. Google's disclosure
  therefore needs to cover website font-resource requests as well as STUN.
- Optional directions links in the app lead to Apple Maps or Google Maps.
  These are distinct from the embedded location-map renderer: if a user opens
  an external directions link, the selected destination and network requests
  reach that mapping service.
- Cloudflare Worker observability/logging is enabled in the reviewed
  configuration with sampling. Source configuration does not establish the
  production log/backups retention period or all dashboard-enabled products.
- Domain matches in retired Sports modules, placeholder origins and test
  fixtures are not evidence that those providers receive data from an enabled
  current feature.

These findings concern the checked source, not an authenticated inspection of
live Cloudflare, store-billing, analytics or provider dashboards.

### Read-only live Cloudflare findings — 2026-11-08

The connected Cloudflare integration was used for GET requests only. No
database rows, media objects, secrets or private messages were inspected.

| Setting | Live result | Disclosure consequence |
| --- | --- | --- |
| Pages routing | The existing Oldtime Pages project lists `heyoldtime.com` and `www.heyoldtime.com`. Its production configuration has no Pages analytics tag. | Absence of a Pages analytics tag is not proof that analytics is off. |
| Zone Web Analytics | RUM is `on`; the account's site entry for `heyoldtime.com` has automatic installation enabled. | Disclose Cloudflare Web Analytics separately from app-owned engagement/creator metrics. |
| API observability | Logs are enabled and persisted, with head sampling of 0.2. Invocation logs are disabled; tracing is disabled. Query-string redaction is enabled. | Disclose sampled stored diagnostics. Sampling/redaction are not guarantees that every possible identifier is removed from application log messages. |
| API log exports | Worker Logpush is false and there are no tail consumers. | No external log-export destination was established for this Worker; this does not establish all account-wide/off-platform practices. |
| Zaraz | Automatic script injection is enabled, but the returned configuration has zero tools. | Do not describe Zaraz itself as absent; no third-party advertising or analytics tool was found configured through it. |
| R2 lifecycle | Two enabled multipart-abort rules: 604800 seconds (7 days) and 172800 seconds (2 days). No completed-object deletion transition was returned. | Incomplete-upload cleanup is separate from deletion of completed published media, which depends on application references/cleanup and deletion queues. |
| D1 metadata | Database version is `production`, read replication is disabled, and no jurisdiction value is specified in the returned metadata. | Current-generation D1 supports Time Travel recovery. Do not claim a regional restriction that is not established by these settings. |
| Worker bindings | D1, R2, Workers AI and realtime Durable Objects are bound. | Confirms these Cloudflare products are attached to the live API; it does not prove each user journey works. |

The current OAuth connection cannot access the account-subscriptions endpoint:
Cloudflare returned 403 and stated that this endpoint has no OAuth scope and
requires a billing-permission API token. This is an endpoint-permission
limitation, not evidence that the otherwise working integration expired.
Reconnecting the same OAuth connection would not establish the billing tier.
No broader credential was requested just to complete this audit.

Cloudflare's documentation, consulted on the audit date, states:

- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/):
  Free-plan retention is 3 days and Paid-plan retention is 7 days under the
  currently documented model. The page also announces a pricing/model change
  for December 1, 2026; reconfirm documentation before making a later
  retention commitment.
- [D1 limits](https://developers.cloudflare.com/d1/platform/limits/) and
  [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/):
  Time Travel is always on for production-storage databases; the documented
  windows are 7 days on Free and 30 days on Workers Paid.
- [Analytics types](https://developers.cloudflare.com/analytics/types-of-analytics/):
  Web Analytics is a separate website-performance analytics product.

These are documented product/plan windows, not a verified account-specific
retention period or a universal promise about every kind of Cloudflare security
record. The local privacy draft now discloses live Web Analytics, stored
diagnostics and D1 recovery history, while keeping the unverified exact tier
explicitly pending.

## Retention and deletion — what the source does establish

- Session grants have a 30-day expiry in `worker.ts`; expired session rows are
  subject to cleanup.
- Email-change verification links have a 30-minute TTL in
  `email-verification.ts`. Other token categories must not be assigned that
  same TTL without checking their own implementation.
- `media-lifecycle.ts` configures cleanup for unused uploads older than
  72 hours, while checking active uploads and media references.
- Its cleanup also targets raw analytics events and analytics sessions older
  than 120 days, and daily analytics aggregates older than 730 days.
- The Worker separately targets topic-signal days older than 30 days and
  topic metrics older than 90 days.
- The configured scheduled job is daily. These are cleanup thresholds and
  bounded-batch operations, **not guarantees that all physical copies vanish at
  the exact expiry time**. The deployed job, backlog and provider settings were
  not inspected.
- Account deletion requires explicit confirmation/current credentials in the
  app/backend flow. `account-deletion.ts` queues owned R2 object keys and
  deletes the user; related row deletion relies on database constraints and
  triggers. The queue retries storage deletion on failure.
- Deleting account-owned records does not remove a recipient's screenshots,
  exports or other copies held outside Oldtime.
- A precise universal retention period for all messages, reports, account
  records, diagnostic logs, legal holds and infrastructure backups is **not
  established** by this audit. The operator must approve actual practice before
  the final policy states it.

### Story retention issue requiring a product decision

The owner archive route uses `archive_enabled` to expose expired Stories
privately, but the scheduled cleanup currently selects expired Stories based
on `saved_to_profile=0` without testing `archive_enabled`. Accordingly, do not
promise indefinite private Story-archive storage in a policy. Verify and
resolve the intended archive behavior before giving a precise retention
commitment. This audit did not change a cleanup query or delete any Story.

## User controls and limitations

Confirmed source paths include profile/account editing, audience/privacy
controls, blocking, content reporting, account password recovery and in-app
account deletion. These are not proof of a staffed operational privacy-request
process or a complete account-data export feature. Use only rights/request
methods that the operator can actually support; do not promise a working
one-click export without verifying one.

## Identity supplied and outstanding operational confirmations

The operator supplied Last-Mile Technology, Texas, USA, and the public contact
used in the shared legal drafts. Those identity fields are no longer missing.

Required before finalizing the public policy and terms:

- Actual retention, backup/logging practices and any legal-hold exceptions,
  including whether any non-code tools receive user data.
- Confirmation of any additional paid/advertising services or off-platform
  processors not established by the reviewed source and live configuration.
- How privacy requests and content-safety reports are handled operationally.

Present remaining operational confirmations against these findings. Do not substitute guessed
contact addresses, statutory deadlines, arbitration clauses or a made-up
jurisdiction.

## Source pointers

- `lib/api-zod/src/signup-age.ts`
- `artifacts/api-server/src/cloudflare/worker.ts`
- `artifacts/api-server/src/cloudflare/account-deletion.ts`
- `artifacts/api-server/src/cloudflare/chats.ts`
- `artifacts/api-server/src/cloudflare/stories.ts`
- `artifacts/api-server/src/cloudflare/social.ts`
- `artifacts/api-server/src/cloudflare/content-moderation.ts`
- `artifacts/api-server/src/cloudflare/analytics.ts`
- `artifacts/api-server/src/cloudflare/performance-telemetry.ts`
- `artifacts/api-server/src/cloudflare/media-lifecycle.ts`
- `artifacts/api-server/src/cloudflare/email-verification.ts`
- `artifacts/api-server/src/cloudflare/password-recovery.ts`
- `artifacts/api-server/src/cloudflare/places.ts`
- `artifacts/oldtimehive/app/store.js`
- `artifacts/oldtimehive/app/release-entry.js`
- `artifacts/oldtimehive/app/comms/config.js`
- `artifacts/oldtimehive/app/comms/calls.js`
- `artifacts/oldtimehive/app/sports-vector-style.js` (reused by Places maps;
  this does not mean retired Sports recording is active)
- `artifacts/oldtime-mobile/components/OldtimeSurface.native.tsx`
- `artifacts/oldtime-mobile/app.json`
