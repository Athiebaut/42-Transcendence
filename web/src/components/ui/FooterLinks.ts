import { t } from "../../utils/i18n";

let initialized = false;
let copyText: HTMLParagraphElement | null = null;
let helpLink: HTMLAnchorElement | null = null;
let privacyLink: HTMLAnchorElement | null = null;
let termsLink: HTMLAnchorElement | null = null;

function updateTexts() {
  if (!helpLink || !privacyLink || !termsLink || !copyText) return;

  helpLink.textContent = t("footer.links.help");
  privacyLink.textContent = t("footer.links.privacy");
  termsLink.textContent = t("footer.links.terms");
  copyText.textContent = t("footer.links.copy", {
    year: String(new Date().getFullYear()),
  });
}

export function mountFooterLinks() {
  if (initialized) return;
  initialized = true;

  const container = document.createElement("div");
  container.id = "global-legal-footer";
  container.className = "fixed inset-x-0 bottom-4 z-[90000] flex justify-center px-4";

  const inner = document.createElement("div");
  inner.className =
    "flex flex-col gap-1 items-center rounded-full border border-white/10 bg-slate-950/70 px-5 py-2 text-[11px] text-slate-200 shadow-lg backdrop-blur";

  const linksWrapper = document.createElement("div");
  linksWrapper.className = "flex flex-wrap justify-center gap-3 text-xs";

  helpLink = document.createElement("a");
  helpLink.href = "/help";
  helpLink.dataset.nav = "true";
  helpLink.dataset.legalLink = "help";
  helpLink.className = "hover:text-white transition-colors";

  privacyLink = document.createElement("a");
  privacyLink.href = "/privacy";
  privacyLink.dataset.nav = "true";
  privacyLink.dataset.legalLink = "privacy";
  privacyLink.className = "hover:text-white transition-colors";

  termsLink = document.createElement("a");
  termsLink.href = "/terms";
  termsLink.dataset.nav = "true";
  termsLink.dataset.legalLink = "terms";
  termsLink.className = "hover:text-white transition-colors";

  linksWrapper.append(helpLink, privacyLink, termsLink);
  inner.appendChild(linksWrapper);

  copyText = document.createElement("p");
  copyText.className = "text-[10px] text-slate-400";
  inner.appendChild(copyText);

  container.appendChild(inner);
  document.body.appendChild(container);

  updateTexts();
  window.addEventListener("languagechange", updateTexts);
}
