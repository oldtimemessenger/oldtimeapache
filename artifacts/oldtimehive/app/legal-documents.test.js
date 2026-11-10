import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  LEGAL_DOCUMENTS, LEGAL_DISCLAIMER, LEGAL_IDENTITY, LEGAL_EFFECTIVE_DATE,
  publicDocumentRoute, legalBase, legalNavigation, legalDocumentMarkup,
} from "./legal-documents.js";
import { SUPPORT_QUESTIONS, supportDocumentMarkup, filterSupportAnswers } from "./support-content.js";

test("public routes respect the artifact prefix and reject unrelated paths", () => {
  for (const id of ["privacy", "terms", "guidelines", "support"]) {
    assert.equal(publicDocumentRoute(`/${id}`), id);
    assert.equal(publicDocumentRoute(`/oldtime/${id}/`, "/oldtime/"), id);
    assert.equal(publicDocumentRoute(`/${id}`, "/oldtime/"), null);
    assert.equal(publicDocumentRoute(`/oldtime/${id}/extra`, "/oldtime/"), null);
  }
  assert.equal(publicDocumentRoute("/"), null);
  assert.equal(publicDocumentRoute("/constructor"), null);
  assert.equal(publicDocumentRoute("/privacy-policy"), null);
  assert.equal(publicDocumentRoute("/oldtimer/support", "/oldtime/"), null);
  assert.equal(legalBase("/"), "/");
  assert.equal(legalBase("oldtime"), "/oldtime/");
});

test("owner-approved legal documents identify the operator without internal review notices", () => {
  for (const id of Object.keys(LEGAL_DOCUMENTS)) {
    const html = legalDocumentMarkup(id);
    assert.ok(html.includes(LEGAL_IDENTITY.operator));
    assert.ok(html.includes(LEGAL_IDENTITY.contact));
    assert.ok(html.includes(LEGAL_DISCLAIMER.replaceAll("’", "’")));
    assert.ok(html.includes(`Effective ${LEGAL_EFFECTIVE_DATE}`));
    assert.doesNotMatch(html, /Draft — not effective|Owner approvals still required|operator must confirm|must approve|proposed for review|before this draft/i);
    assert.ok(LEGAL_DOCUMENTS[id].sections.length >= 7);
  }
  assert.throws(() => legalDocumentMarkup("other"), /Unknown legal document/);
  const privacy = legalDocumentMarkup("privacy");
  assert.match(privacy, /at least 16/);
  assert.match(privacy, /not currently end-to-end encrypted/);
  assert.doesNotMatch(privacy, /RevenueCat/i);
  for (const provider of ["Cloudflare", "Resend", "OpenFreeMap", "Photon", "Google"]) {
    assert.ok(privacy.includes(provider));
  }
  assert.match(privacy, /retryable storage deletion/);
  assert.match(privacy, /Web Analytics is also enabled through domain-level automatic installation/);
  assert.match(privacy, /Time Travel database-recovery history/);
  assert.match(privacy, /no configured third-party tools/);
  assert.match(privacy, /applicable Cloudflare product and plan settings/);
  assert.match(privacy, /Apple in-app subscriptions are available/);
  assert.match(privacy, /Apple-signed transactions and server notifications/);
  assert.doesNotMatch(privacy, /Apple-approved|GDPR certified|Placeholder:/);
  const terms = legalDocumentMarkup("terms");
  assert.match(terms, /optional monthly Apple subscription/);
  assert.doesNotMatch(terms, /Purchases are not currently enabled/);
  assert.match(terms, /price, billing period and renewal terms/);
  assert.match(terms, /does not itself cancel an Apple subscription/);
  assert.match(terms, /Gifts and promotional discounts are not currently available/);
  assert.match(terms, /Eligible Apple subscriptions can be restored/);
});

test("navigation links expose public documents and support under the current base", () => {
  const html = legalNavigation("/preview/", "support");
  for (const id of ["privacy", "terms", "guidelines", "support"]) {
    assert.ok(html.includes(`href="/preview/${id}"`));
  }
  assert.match(html, /href="\/preview\/support" aria-current="page"/);
  assert.ok(html.includes(`mailto:${LEGAL_IDENTITY.contact}`));
  assert.doesNotMatch(html, /href="#"/);
});

test("support has useful answers and a real contact link, without a pretend ticket form", () => {
  const html = supportDocumentMarkup();
  assert.equal(SUPPORT_QUESTIONS.length, 14);
  assert.equal((html.match(/class="oldtime-support-answer"/g) || []).length, 14);
  assert.ok(html.includes(`href="mailto:${LEGAL_IDENTITY.contact}"`));
  assert.match(html, /id="support-search" type="search"/);
  assert.match(html, /aria-live="polite"/);
  assert.doesNotMatch(html, /<form|ticket submitted|24\/7|guaranteed|AI-powered/i);
  assert.doesNotMatch(html, /Draft — not effective|legal advice/);
});

test("support filtering hides unmatched answers/groups and announces empty results", () => {
  const answers = SUPPORT_QUESTIONS.map(([, question, answer]) => ({
    textContent: `${question} ${answer}`, hidden: false,
  }));
  const groups = [...new Set(SUPPORT_QUESTIONS.map(([group]) => group))].map(category => ({
    hidden: false,
    querySelectorAll: () => answers.filter((_, index) => SUPPORT_QUESTIONS[index][0] === category),
  }));
  const status = { textContent: "" };
  const root = {
    querySelectorAll: selector => selector === ".oldtime-support-answer" ? answers : groups,
    querySelector: () => status,
  };
  assert.ok(filterSupportAnswers(root, " LOCATION ") >= 1);
  assert.ok(answers.some(answer => answer.hidden));
  assert.ok(groups.some(group => group.hidden));
  assert.match(status.textContent, /answers? found/);
  assert.equal(filterSupportAnswers(root, "<no-match>"), 0);
  assert.ok(groups.every(group => group.hidden));
  assert.match(status.textContent, /No matching answers/);
  assert.equal(filterSupportAnswers(root, ""), 14);
  assert.ok(groups.every(group => !group.hidden));
  assert.equal(status.textContent, "");
});

test("public document entry bypasses auth, storage-reset and health-check startup", () => {
  const entry = readFileSync(new URL("./release-entry.js", import.meta.url), "utf8");
  const branch = entry.indexOf("const documentId = publicDocumentRoute");
  assert.ok(branch > -1);
  assert.ok(branch < entry.indexOf("if (localStorage.getItem(freshStartMarker)"));
  assert.match(entry.slice(branch, entry.indexOf("if (localStorage.getItem(freshStartMarker)")), /mountLegalPage[\s\S]*return;/);
  const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
  assert.ok(app.includes("content = legalDocumentMarkup(documentId) + legalNavigation("));
  assert.match(app, /if \(settingsView === "help"\)[\s\S]{0,250}support/);
  const auth = readFileSync(new URL("./auth-design.js", import.meta.url), "utf8");
  assert.equal((auth.match(/\$\{legalNavigation\(/g) || []).length, 1);
  const login = auth.slice(auth.indexOf("export function loginMarkup"), auth.indexOf("export function passwordRecoveryRequestMarkup"));
  assert.doesNotMatch(login, /legalNavigation|oldtime-legal-links|mailto:/);
  assert.match(login, /id="forgot-password"/);
  assert.match(login, /id="signup"/);
  const signup = auth.slice(auth.indexOf("export function signupMarkup"));
  assert.match(signup, /By creating an account, you agree/);
  assert.match(signup, /Terms of Service and Community Guidelines/);
  assert.match(signup, /Privacy Policy linked below/);
});
