// web/src/main.ts

import { renderRoute } from "./router";
import { initBackgroundRotator, forceBackgroundChange } from "./utils/backgroundRotator";
import { mountDecorControls, refreshDecorControls } from "./components/ui/DecorControls";
import { mountAuthDebugToggle } from "./components/ui/AuthDebugToggle";
import { initI18n } from "./utils/i18n";
import { mountLanguageSwitcher } from "./components/ui/LanguageSwitcher";
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
  mountAuthDebugToggle(refreshCurrentRoute);
  mountLanguageSwitcher();
  
  // Ajouter le bouton de changement manuel (optionnel)
  // initBackgroundSelector();
  
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) {
    console.error("#app container not found");
    return;
  }

  // Lancer l’oie une fois au démarrage (lazy import pour limiter le bundle initial)
  const { initGoose3D } = await import("./utils/goose3d");
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
