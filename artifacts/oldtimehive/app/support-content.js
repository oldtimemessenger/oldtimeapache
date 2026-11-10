import { LEGAL_IDENTITY } from "./legal-documents.js";

export const SUPPORT_DOCUMENT = {
  title: "Support",
  description: "Answers to common Oldtime questions about accounts, messages, Stories, calls, location sharing and reporting a problem.",
};

// Keep answers tied to working features, not promised response times or services.
export const SUPPORT_QUESTIONS = [
  ["Accounts", "I can’t sign in. What should I do?",
    "Use the username or email linked to your account. If you don’t remember your password, choose “Forgot password?” on the sign-in screen. If you still can’t get in, email support with your username and what you see on screen. Don’t send your password."],
  ["Accounts", "Where’s my password reset email?",
    "Check your spam folder and make sure you entered the email linked to your account. A reset request doesn’t confirm whether an account exists. If the email doesn’t arrive, contact support. Never share a reset link or verification code."],
  ["Accounts", "Can I change my email address?",
    "Start the email change from your account settings, then confirm it using the email we send to the new address. Your current sign-in email stays in place until the change is confirmed."],
  ["Accounts", "How old do I need to be?",
    "You need to be at least 16 to use Oldtime."],
  ["Messages and calls", "Why isn’t my message sending?",
    "Check your connection and look for a sending or error message in the conversation. Keep any unsent text until you know it went through. If it keeps failing, send support a screenshot, your device/browser and roughly when it happened. Leave private conversations out of the screenshot where possible."],
  ["Messages and calls", "How do I make a call or turn on video?",
    "Open a direct chat and use the call button. You can turn the camera on during the call. Allow microphone access for audio and camera access for video. If either was blocked, check Oldtime’s permissions in your browser or device settings."],
  ["Messages and calls", "Where can I share or request a location?",
    "Open the conversation’s chat details/settings and look for Share location and Request location together. Sharing your location needs your permission. A location you send appears in the conversation with an in-app map; requesting one doesn’t let you track someone without their agreement."],
  ["Messages and calls", "Are my messages end-to-end encrypted?",
    "No. Ordinary messages are stored by Oldtime and protected by account and conversation access controls. That is different from end-to-end encryption. Only share information you’re comfortable sending through the service."],
  ["Posts and Stories", "My photo or video won’t send. What now?",
    "Keep the editor open and check your connection. If an error says your post or Status is still there, try again from that screen. Don’t publish a second copy if the first one was already confirmed. If it keeps failing, send support the exact error, your device/browser and whether it was a photo or video."],
  ["Posts and Stories", "How do I open a post shared in a Story?",
    "Tap the shared post itself to open its original post. A Community text post should open as a post, not as a full-screen picture. If it doesn’t, send support a screenshot and tell us which Story you opened."],
  ["Posts and Stories", "Why can’t someone see my post or Story?",
    "Check the audience you selected, your account privacy and whether either account has blocked the other. Stories can also expire. Being able to see something on your own account doesn’t mean everyone else has access."],
  ["Privacy and safety", "How do I report someone or block an account?",
    "Use the report option on the content or conversation you’re concerned about. You can also block the account. If you can’t reach the report control, email support with the username and a link or a brief description. For immediate danger, contact local emergency services."],
  ["Privacy and safety", "How do I delete my account?",
    "Open Settings, find Delete account and follow the confirmation steps. You’ll need to verify the account. Deletion isn’t the same as signing out or removing the app. Media cleanup can take additional processing, and deleting your account can’t remove screenshots or downloads held by other people."],
  ["Privacy and safety", "How can I ask about my personal information?",
    "Email support@heyoldtime.com with your username and what you want to access, correct or delete. We may need to verify the account before acting. Don’t include your password, a verification code or unnecessary identity documents."],
];

const esc = value => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);

export function supportDocumentMarkup() {
  const groups = [...new Set(SUPPORT_QUESTIONS.map(([group]) => group))];
  return `<section class="oldtime-support-intro"><p>Something not working? Start here. If you still need help, email <a href="mailto:${LEGAL_IDENTITY.contact}">${LEGAL_IDENTITY.contact}</a>.</p>
    <p>Include your username, your device and what happened. Never send your password or a sign-in code.</p>
    <label for="support-search">Find an answer</label><input id="support-search" type="search" placeholder="Try “password”, “video” or “location”" autocomplete="off" aria-controls="support-answers" />
    <p id="support-search-status" class="oldtime-support-count" role="status" aria-live="polite"></p></section>
    <div id="support-answers">${groups.map(group => `<section class="oldtime-support-group"><h2>${esc(group)}</h2>${SUPPORT_QUESTIONS.filter(([category]) => category === group).map(([, question, answer]) => `<details class="oldtime-support-answer"><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join("")}</section>`).join("")}</div>
    <section class="oldtime-support-contact"><h2>Still need help?</h2><p>Tell us what you were trying to do and what went wrong. A screenshot helps—just cover anything private first.</p><a href="mailto:${LEGAL_IDENTITY.contact}">Email support</a><p>Support is handled by Last-Mile Technology.</p></section>`;
}

export function filterSupportAnswers(root, query) {
  const normalized = String(query).trim().toLocaleLowerCase();
  let count = 0;
  root.querySelectorAll(".oldtime-support-answer").forEach(answer => {
    answer.hidden = !answer.textContent.toLocaleLowerCase().includes(normalized);
    if (!answer.hidden) count += 1;
  });
  root.querySelectorAll(".oldtime-support-group").forEach(group => {
    group.hidden = ![...group.querySelectorAll(".oldtime-support-answer")].some(answer => !answer.hidden);
  });
  const status = root.querySelector("#support-search-status");
  if (status) status.textContent = !normalized ? "" : count ? `${count} ${count === 1 ? "answer" : "answers"} found` : "No matching answers. Try another word or email support.";
  return count;
}
