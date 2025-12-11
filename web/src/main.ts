// web/src/main.ts

import { renderRoute } from "./router";
import { initGoose3D } from "./goose3d";
import { initBackgroundRotator, forceBackgroundChange } from "./utils/backgroundRotator";
import { mountDecorControls, refreshDecorControls } from "./components/ui/DecorControls";
import { mountAuthDebugToggle } from "./components/ui/AuthDebugToggle";
import "./style.css";
import "./village-theme.css";

function refreshCurrentRoute() {
  renderRoute(window.location.pathname);
  forceBackgroundChange();
  refreshDecorControls();
}

function bootstrap() {
  // Initialiser la rotation aléatoire des fonds
  // Options: 'random' (change à chaque page), 'session' (garde pendant la session), 'daily' (change une fois par jour)
  initBackgroundRotator("random");
  mountDecorControls();
  mountAuthDebugToggle(refreshCurrentRoute);
  
  // Ajouter le bouton de changement manuel (optionnel)
  // initBackgroundSelector();
  
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) {
    console.error("#app container not found");
    return;
  }

  // Lancer l’oie une fois au démarrage
  initGoose3D();

  // Première route
  renderRoute(window.location.pathname);

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
    renderRoute(href);
    forceBackgroundChange();
    refreshDecorControls();
  });
}

bootstrap();
