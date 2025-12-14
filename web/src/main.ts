// web/src/main.ts

import { renderRoute } from "./router";
import { initBackgroundRotator, forceBackgroundChange } from "./utils/backgroundRotator";
import { mountDecorControls, refreshDecorControls } from "./components/ui/DecorControls";
import { initI18n } from "./i18n";
import { mountLanguageSwitcher } from "./components/ui/LanguageSwitcher";
import { userService } from "./services/userService";
import "./style.css";
import "./village-theme.css";

type RefreshOptions = {
  preserveBackground?: boolean;
};

function refreshCurrentRoute(options: RefreshOptions = {}) {
  renderRoute(window.location.pathname);
  if (!options.preserveBackground) {
    forceBackgroundChange();
  }
  refreshDecorControls();
}

async function bootstrap() {
  initI18n();
  // Initialiser la rotation aléatoire des fonds
  // Options: 'random' (change à chaque page), 'session' (garde pendant la session), 'daily' (change une fois par jour)
  initBackgroundRotator("random");
  mountDecorControls();
  mountLanguageSwitcher();

  const oauthToken = consumeOAuthToken();
  
  // AJOUT : Vérification de la session au démarrage
  if (oauthToken || localStorage.getItem("token")) {
    if (oauthToken) {
      localStorage.setItem("token", oauthToken);
    }
    await userService.fetchProfile();
  }
  
  // Ajouter le bouton de changement manuel (optionnel)
  // initBackgroundSelector();
  
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) {
    console.error("#app container not found");
    return;
  }

  // Lancer l’oie une fois au démarrage (lazy import pour limiter le bundle initial)
  const { initGoose3D } = await import("./goose3d");
  initGoose3D();

  // Première route
  refreshCurrentRoute({ preserveBackground: true });

  // Gestion des boutons back/forward
  window.addEventListener("popstate", () => {
    refreshCurrentRoute();
  });

  // Navigation interne via <a data-nav>
  document.body.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const link = target.closest("a[data-nav]") as HTMLAnchorElement | null;
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    event.preventDefault();
    window.history.pushState({}, "", href);
    refreshCurrentRoute();
  });

  window.addEventListener("languagechange", () => {
    refreshCurrentRoute({ preserveBackground: true });
  });
}

bootstrap();
function consumeOAuthToken(): string | null {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    params.delete("token");
    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", newUrl);
    return token;
  }
  return null;
}
