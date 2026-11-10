import { LEGAL_DOCUMENTS, legalBase, legalDocumentMarkup, legalNavigation } from "./legal-documents.js";
import { SUPPORT_DOCUMENT, supportDocumentMarkup, filterSupportAnswers } from "./support-content.js";
import "./legal.css";

export function mountLegalPage(id, base = "/") {
  const doc = id === "support" ? SUPPORT_DOCUMENT : LEGAL_DOCUMENTS[id];
  if (!doc) throw new Error("Unknown legal document.");
  document.title = `${doc.title} — Oldtime`;
  const metadata = (attribute, key, content) => {
    let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(attribute, key);
      document.head.append(tag);
    }
    tag.setAttribute("content", content);
  };
  metadata("name", "description", doc.description);
  metadata("name", "robots", "index, follow");
  metadata("property", "og:title", document.title);
  metadata("property", "og:description", doc.description);
  metadata("property", "og:type", "website");

  const app = document.getElementById("app");
  if (!app) throw new Error("The legal page container is unavailable.");
  app.className = "oldtime-legal-page";
  app.removeAttribute("inert");
  app.removeAttribute("aria-hidden");
  app.innerHTML = `<div class="oldtime-legal-shell">
    <header><a class="oldtime-legal-home" href="${legalBase(base)}">Oldtime</a><a href="${legalBase(base)}">Back to app</a></header>
    <main id="legal-content"><h1>${doc.title}</h1>${id === "support" ? supportDocumentMarkup() : legalDocumentMarkup(id)}</main>
    <footer>${legalNavigation(base, id)}<p>Oldtime · Last-Mile Technology</p></footer>
  </div>`;
  app.querySelector("#support-search")?.addEventListener("input", event => {
    filterSupportAnswers(app, event.target.value);
  });
  const opening = document.getElementById("oldtime-startup");
  if (opening) {
    opening.dataset.ready = "true";
    opening.remove();
  }
}
