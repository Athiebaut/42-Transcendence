import { isAuthenticated } from "../../utils/auth";
import { t } from "../../i18n";

export function renderHeaderQuickLinks(className = "flex items-center gap-3 text-xs sm:text-sm text-slate-300"): string {
  const authed = isAuthenticated();
  const mainLinkHref = authed ? "/profile" : "/login";
  const mainLinkLabel = authed ? t("nav.profile") : t("cta.login");

  return `
    <nav class="${className}">
      <a href="/play" data-nav class="hover:text-white transition-colors">
        ${t("nav.playModes")}
      </a>
      <span class="hidden sm:inline text-slate-700">•</span>
      <a href="${mainLinkHref}" data-nav class="hover:text-white transition-colors">
        ${mainLinkLabel}
      </a>
    </nav>
  `;
}
