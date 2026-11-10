// Owner-approved documents shared by public pages and Settings.
export const LEGAL_IDENTITY = Object.freeze({
  operator: "Last-Mile Technology",
  contact: "support@heyoldtime.com",
  jurisdiction: "Texas, USA",
});

export const LEGAL_EFFECTIVE_DATE = "November 10, 2026";
export const LEGAL_DISCLAIMER = "These documents explain Oldtime’s policies. They do not provide legal advice about your individual circumstances.";

export const LEGAL_DOCUMENTS = {
  privacy: {
    title: "Privacy Policy",
    description: "How Oldtime processes account information, posts, messages, media, location and activity, and how to request help with your information.",
    sections: [
      ["Who we are", [
        "Oldtime is operated by Last-Mile Technology, based in Texas, USA. This policy applies to Oldtime’s website and its iOS website wrapper. For privacy questions or requests, contact support@heyoldtime.com.",
      ]],
      ["Information we process", [
        "Account information includes your name, username, email address, birthday/age information, password credentials, profile details, avatar, cover image, interests and privacy preferences. Passwords are processed using salted password hashing; the service does not need to store your password as readable account data.",
        "Content includes posts, captions, comments, Stories, replies, reactions, saved items, collections, creative projects and drafts, photos, videos, voice notes, original sounds, and information or files you choose to send in conversations.",
        "Social and usage information includes follows, friendships, blocks, content reports, notifications, message delivery/read information when enabled, content views, playback activity, engagement events and creator statistics. Technical information includes session identifiers, request/network information, security rate-limit identifiers and performance/error diagnostics.",
      ]],
      ["Why we use information", [
        "We use information to register and authenticate accounts; store and deliver content and messages; connect people; personalize discovery using interests and activity; provide creator metrics; operate calls, search and location features; manage privacy choices; prevent abuse; investigate reports; and maintain service reliability.",
        "Account emails support verification, password recovery and account security. Personalization and analytics use activity associated with accounts or content.",
      ]],
      ["Content audiences and private messages", [
        "Your account privacy and the audience selected for content affect who can access it. Public profiles and public posts may be seen or shared outside your immediate followers. Review audience, blocked-account and conversation controls before sharing.",
        "Messages and shared attachments are stored by the service and access is restricted by account and conversation permissions. Ordinary chat is not currently end-to-end encrypted. Do not treat a private conversation as a guarantee that no authorized service processing can occur.",
        "Recipients may copy, download, forward or capture material. Deleting content or changing an audience cannot erase copies already held outside Oldtime.",
      ]],
      ["Camera, microphone, photos and location", [
        "Camera, microphone and photo-library access support actions you initiate, such as capture, uploads, voice notes and calls. Device permission does not mean Oldtime uploads your entire library. You can manage these permissions in your browser or device settings; denying access may prevent the corresponding feature from working.",
        "Location permission supports requested location features. Locations you explicitly send become conversation content, and place tags on posts are shared with the post’s audience. Withdrawing device location permission does not delete locations previously sent or posted. This policy does not authorize continuous background location tracking.",
        "Displaying maps or searching for places involves external map resources or place-search requests. A map provider can receive network information and information about the displayed area.",
      ]],
      ["Calls", [
        "Calls use WebRTC, with Cloudflare-based signaling to establish and manage the connection. Connectivity discovery uses public Google STUN services; a configured TURN relay may carry media when required. Direct connections can reveal network addresses to the other participant. Oldtime does not provide call recording.",
        "WebRTC transport protection is separate from ordinary stored chat. Do not assume the same encryption or retention behavior applies to every communications feature.",
      ]],
      ["Service providers", [
        "Cloudflare (Workers, D1, R2 and realtime services) processes application requests, account/content records, uploaded media and signaling on the service’s behalf. Cloudflare Workers AI is used for publication-safety checks that can process publication text and media. Cloudflare Web Analytics is enabled for website traffic and page-performance measurement, and Cloudflare stores sampled API diagnostic logs.",
        "Resend processes recipient email addresses and account-action email content for verification and password recovery.",
        "OpenFreeMap supplies map resources based on OpenStreetMap/OpenMapTiles data. Photon by komoot receives place-search queries through the application backend.",
        "Google receives requests associated with the public STUN services used for call connectivity and the Google-hosted font resources used by the website. These requests can include network and request information.",
        "If you choose an external Apple Maps or Google Maps directions link, the selected destination and associated requests are sent to that mapping service. These links are separate from embedded maps inside Oldtime.",
         "Apple in-app subscriptions are available for paid digital features in the iOS app. Apple processes purchase and renewal payments; Oldtime’s Cloudflare backend verifies Apple-signed transactions and server notifications to manage subscription access, including renewals, refunds and revocations. Oldtime does not receive your full payment-card details from Apple.",
        "Information is disclosed to the recipients and audiences you choose. Applicable legal obligations, security investigations or an organizational change may also require disclosure, subject to applicable law.",
      ]],
      ["Device storage and analytics", [
        "The app uses sessionStorage to maintain sign-in and technical browser storage/caches to operate the PWA. Cloudflare is the authoritative backend for account-owned data; that does not mean nothing is stored on your device. Signing out and device/browser storage controls affect local sessions and caches.",
        "First-party analytics measure content views, playback and engagement, including account-linked events and creator statistics. Cloudflare Web Analytics is also enabled through domain-level automatic installation; it is separate from Oldtime’s account-linked creator metrics. Performance diagnostics and sampled Cloudflare Worker logs help investigate slow feeds, playback problems and errors. The live Zaraz configuration has no configured third-party tools; that is not a blanket guarantee about every cookie, external link or off-platform operational practice.",
      ]],
      ["Retention and account deletion", [
        "We keep account information, content and messages while needed to provide the service, including saved content and conversation history, unless you delete them or request account deletion. Some information may be retained when reasonably needed for security, abuse investigations, legal obligations or disputes. Retention depends on the information and its purpose; there is no single period covering every category.",
        "Configured cleanup targets raw analytics events and playback sessions older than 120 days, daily analytics aggregates older than 730 days, and unused uploads older than 72 hours when active uploads and references do not protect them. Session grants expire after 30 days. These are source-configured thresholds, not guarantees of deletion at an exact time; scheduled cleanup is bounded and may require retries.",
        "You can request permanent account deletion from the in-app account settings. The flow requires confirmation and account verification. Backend deletion removes the account and associated records according to database relationships and queues owned media for retryable storage deletion. Do not assume all files, backups or recipient-held copies disappear instantly.",
        "Cloudflare D1 keeps Time Travel database-recovery history, and Cloudflare stores sampled Worker logs. Recovery copies and diagnostic logs are retained under the applicable Cloudflare product and plan settings and may remain temporarily after deletion from the active service. Incomplete-upload cleanup does not erase completed files.",
        "Stories stop being available to their selected audience when they expire. Expiry does not mean immediate physical erasure of stored data, and an archive should not be treated as a permanent backup. Keep your own copy of media you want to retain.",
      ]],
      ["Security and international processing", [
        "The service uses secured network connections, salted password hashing, session controls and server-side access checks. No system can guarantee absolute security. Protect your credentials and contact support if you suspect account misuse.",
        "Last-Mile Technology is based in the United States. Your information may be processed in the United States and other locations where our service providers operate, which may have different data-protection laws. Applicable privacy rights are not waived by using Oldtime.",
      ]],
      ["Your requests and choices", [
        "You can edit your profile, manage privacy/audiences, block accounts, report content and use account-deletion controls. Depending on where you live and the law that applies, you may also have rights to access or receive a copy of information, correct it, request deletion, restrict or object to processing, or withdraw consent where processing relies on consent.",
        "Send requests, questions or appeals to support@heyoldtime.com. Identify the account and the request without emailing your password. Reasonable identity verification may be necessary. Account-information requests are handled through support; Oldtime does not currently provide a self-service full-account export. We handle requests according to applicable legal requirements.",
      ]],
      ["Young people", [
        "Oldtime requires users to be at least 16. Do not register if you are under 16. If you believe an underage account or child-safety issue exists, report it in the app or contact support@heyoldtime.com so we can investigate and take appropriate action.",
      ]],
      ["Changes and contact", [
        "We will update the effective date when this policy changes. For material changes, we will provide notice in the app or by email as appropriate and as required by law. Contact Last-Mile Technology at support@heyoldtime.com for privacy matters. Mandatory rights under applicable privacy laws are not waived by this document.",
      ]],
    ],
  },
  terms: {
    title: "Terms of Service",
    description: "Terms for Oldtime accounts, content, acceptable use, subscriptions, service availability and account closure.",
    sections: [
      ["Operator and acceptance", [
        "Oldtime is operated by Last-Mile Technology, Texas, USA. By creating an account or using Oldtime, you agree to these Terms of Service and the Community Guidelines. The Privacy Policy explains how information is handled. Contact support@heyoldtime.com with questions.",
      ]],
      ["Accounts and eligibility", [
        "You must be at least 16 and legally able to use the service. Provide accurate registration and age information, protect your account credentials, and notify support of unauthorized access. Do not impersonate another person or evade restrictions by creating replacement accounts.",
      ]],
      ["The service", [
        "Oldtime supports social posts, media, Stories, discovery, private messaging, calls and optional location sharing. Features and audiences have separate controls. Oldtime is not an emergency communication or emergency-location service; contact local emergency services directly when needed.",
      ]],
      ["Your content and permissions", [
        "You retain ownership of content you create, subject to other people’s rights. You must have permission to upload and share it, including relevant image, privacy, music and intellectual-property rights. Attribution alone does not replace permission.",
        "You grant Last-Mile Technology a non-exclusive, worldwide, royalty-free license to host, store, reproduce, technically adapt and deliver your content as needed to operate Oldtime according to your audiences and enabled sharing features. This is not a transfer of ownership or permission to use private messages in advertising. Removing content ends future ordinary display subject to deletion processing, existing permitted copies and applicable legal obligations.",
      ]],
      ["Conduct and safety", [
        "Follow the Community Guidelines. Do not share child sexual exploitation material, non-consensual intimate material, credible threats, hateful attacks, scams, malware, illegal content or another person’s private information without a lawful basis. Do not harass others, infringe intellectual-property rights, automate abuse, bypass access controls or disrupt the service.",
        "Content can be reported and accounts blocked in the app. Publication checks include automated safety processing. We may investigate and restrict content/accounts for safety, legal obligations or violations, subject to applicable law. Contact support@heyoldtime.com about a moderation decision.",
      ]],
      ["Privacy and third-party services", [
        "The Privacy Policy describes account, content, message, location and analytics processing. Ordinary stored chat is not currently end-to-end encrypted. Use care when sharing sensitive information. Third-party resources and links may have their own terms and privacy practices.",
      ]],
      ["Paid features", [
         "Blue Badge is an optional monthly Apple subscription for digital features. The available benefits, price, billing period and renewal terms are shown in the iOS purchase flow before you confirm. A badge does not endorse the account or exempt it from the Community Guidelines.",
         "Apple subscriptions renew automatically unless canceled through your Apple account’s subscription settings. Apple manages payment and renewal billing; Oldtime’s Cloudflare backend verifies Apple-signed transactions and server notifications to manage access. Deleting Oldtime or deleting your Oldtime account does not itself cancel an Apple subscription. Cancel it separately with Apple if you do not want it to renew.",
         "Eligible Apple subscriptions can be restored in the iOS app. Refund requests for Apple purchases are handled through Apple, subject to Apple’s policies and applicable law. Gifts and promotional discounts are not currently available; no discount or gift charge applies unless a supported offer is explicitly presented and accepted.",
      ]],
      ["Availability and responsibility", [
        "The service is provided as available, subject to applicable law. Continuous availability, error-free uploads, universal call connectivity or recovery of every deleted item cannot be guaranteed. Features may change for operational or safety reasons. Content from members is their responsibility and is not professional legal, medical or financial advice from Oldtime.",
      ]],
      ["Intellectual property", [
        "The Oldtime brand, service design and software are owned by or licensed to their respective rights holders. Your permission to use the service does not transfer those rights. Open-source components and third-party content remain subject to their applicable licenses.",
      ]],
      ["Account closure", [
        "You can stop using Oldtime and request account deletion in the app. Account verification and confirmation are required. Associated records and media are processed through backend deletion and retryable media cleanup; recipient-held copies are outside Oldtime’s control. Safety or legal obligations may limit particular requests as allowed by law.",
        "Access may be restricted or terminated for violations or service-protection reasons, subject to applicable law. You can contact support@heyoldtime.com to request review of an account restriction. The Privacy Policy explains account information and deletion.",
      ]],
      ["Limits of liability", [
        "To the extent permitted by law, Last-Mile Technology is not liable for indirect or consequential damages, and its aggregate liability is limited to the greater of US $100 or amounts you paid for Oldtime in the 12 months before the claim. These limits do not exclude liability or consumer rights that cannot lawfully be limited.",
      ]],
      ["Governing law and updates", [
        "Texas law and applicable United States federal law govern these terms, without overriding mandatory consumer or privacy protections applicable to you. These terms do not establish mandatory arbitration, a class-action waiver or an exclusive court venue.",
        "We will update the effective date when these terms change. For material changes, we will provide notice in the app or by email as appropriate and as required by law. For questions, contact Last-Mile Technology at support@heyoldtime.com.",
      ]],
    ],
  },
  guidelines: {
    title: "Community Guidelines",
    description: "Oldtime community rules covering safety, privacy, authentic participation, reporting and appeals.",
    sections: [
      ["Respect and safety", [
        "Treat people with respect. Do not threaten, stalk, bully or target someone with repeated harassment. Hateful attacks or encouragement of violence against people based on protected characteristics are not allowed.",
      ]],
      ["Protect children and intimate privacy", [
        "No child sexual exploitation or abuse material, grooming, sexual solicitation of minors, non-consensual intimate imagery or threats to share it. Oldtime is for people 16 and older; meeting the signup age does not make sexual exploitation or harmful conduct acceptable.",
      ]],
      ["Dangerous and illegal conduct", [
        "Do not encourage imminent self-harm, credible violence, exploitation or dangerous criminal activity. Do not trade prohibited goods, distribute malware, run scams or solicit account credentials. Contextual reporting, education and help-seeking should not be confused with encouragement of harm.",
      ]],
      ["Privacy, location and consent", [
        "Do not expose someone’s private address, identity documents, contact details, precise location or private conversations without permission or another lawful basis. Do not pressure someone to share their location or join a call. Respect blocks, audiences and consent.",
      ]],
      ["Rights and authentic participation", [
        "Share material you created or have the necessary rights to use. Do not impersonate another person, fabricate affiliations, manipulate engagement through abusive automation, spam or evade account restrictions. Credit does not replace a license or consent.",
      ]],
      ["Report, block and get help", [
        "Use the app’s report controls for harmful content or messages, and block accounts to limit unwanted contact. Contact support@heyoldtime.com if you need help identifying a report or raising a safety concern. Do not send passwords or unnecessary sensitive documents.",
        "For immediate danger, contact local emergency services; Oldtime does not provide emergency response.",
      ]],
      ["Enforcement and appeals", [
        "Last-Mile Technology may review reports, use automated publication-safety checks, remove or restrict content and limit accounts as appropriate to the issue and applicable law. Automated checks can make mistakes. Contact support@heyoldtime.com to request review of a decision.",
        "Restrictions depend on the issue and may include content removal, feature limits or account suspension. We may act immediately to address serious safety concerns or legal obligations. Report and appeal outcomes depend on the circumstances; Oldtime does not promise an immediate response. Material guideline changes will be announced in the app or by email as appropriate and as required by law.",
      ]],
    ],
  },
};

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);

export function legalBase(base = "/") {
  return `/${String(base).split("/").filter(Boolean).join("/")}${String(base).split("/").filter(Boolean).length ? "/" : ""}`;
}

export function publicDocumentRoute(pathname, base = "/") {
  const prefix = legalBase(base);
  if (!pathname.startsWith(prefix)) return null;
  const id = pathname.slice(prefix.length).replace(/\/$/, "");
  return id === "support" || Object.hasOwn(LEGAL_DOCUMENTS, id) ? id : null;
}

export function legalNavigation(base = "/", active = "") {
  return `<nav class="oldtime-legal-links" aria-label="Legal and support">${Object.entries(LEGAL_DOCUMENTS).map(([id, doc]) =>
    `<a href="${escapeHtml(legalBase(base) + id)}"${active === id ? ' aria-current="page"' : ""}>${escapeHtml(doc.title)}</a>`).join("")}<a href="${escapeHtml(legalBase(base) + "support")}"${active === "support" ? ' aria-current="page"' : ""}>Support</a><a href="mailto:${LEGAL_IDENTITY.contact}">Contact</a></nav>`;
}

export function legalDocumentMarkup(id) {
  const doc = LEGAL_DOCUMENTS[id];
  if (!doc) throw new Error("Unknown legal document.");
  return `<article class="legal-doc oldtime-legal-document" aria-label="${escapeHtml(doc.title)}">
    <p class="oldtime-legal-date">Effective ${escapeHtml(LEGAL_EFFECTIVE_DATE)}</p>
    <p class="oldtime-legal-disclaimer" role="note">${escapeHtml(LEGAL_DISCLAIMER)}</p>
    <p class="oldtime-legal-owner">Last-Mile Technology · Texas, USA · <a href="mailto:${LEGAL_IDENTITY.contact}">${LEGAL_IDENTITY.contact}</a></p>
    ${doc.sections.map(([heading, paragraphs]) => `<section><h2>${escapeHtml(heading)}</h2>${paragraphs.map(text => `<p>${escapeHtml(text)}</p>`).join("")}</section>`).join("")}
  </article>`;
}
