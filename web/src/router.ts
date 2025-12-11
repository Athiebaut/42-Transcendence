// web/src/router.ts

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profil from "./pages/Profil";
import Dashboard from "./pages/Dashboard";
import Pong from "./pages/Pong";
import Play from "./pages/Play";
import ProfileSettings from "./pages/ProfileSettings";
import { setGoose3DActive } from "./goose3d";
import type { GameMode } from "./game/config/gameModeConfig";
import { setupRegister } from "./pages/Register";
import { setupLogin } from "./pages/Login";
import { isAuthenticated } from "./utils/auth";
import { applyTranslations, t } from "./i18n";

type RouteHandler = () => string;

const routes: Record<string, RouteHandler> = {
  "/": Home,
  "/home": Home,
  "/login": Login,
  "/register": Register,
  "/dashboard": Dashboard,
  "/profil": Profil,
  "/pong": Pong,
  "/play": Play,
  "/profile-settings": ProfileSettings,
};
const protectedRoutes = new Set(["/profil", "/profile-settings"]);

export async function renderRoute(path: string) {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) return;

  const cleanPath = path.split("?")[0].split("#")[0];
  const previousPath = window.location.pathname.split("?")[0].split("#")[0];

  let targetPath = cleanPath;
  if (protectedRoutes.has(targetPath) && !isAuthenticated()) {
    if (window.location.pathname !== "/login") {
      window.history.replaceState({}, "", "/login");
    }
    targetPath = "/login";
  }

  const handler = routes[targetPath] ?? NotFound;

  // Oie visible sur toutes les pages SAUF Pong
  const isPongPage = targetPath === "/pong";
  setGoose3DActive(!isPongPage);

  // Nettoyer le jeu Pong précédent si on quitte la page Pong
  if (previousPath === "/pong" && targetPath !== "/pong") {
    const { disposePongGame } = await import("./pages/Pong");
    await disposePongGame();
  }

  app.innerHTML = handler();
  applyTranslations(app);

  // Initialiser le jeu Pong si on arrive sur la page Pong
  if (targetPath === "/pong") {
    const { initPongGame } = await import("./pages/Pong");
    
    // Extraire le paramètre mode de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') || 'pvp1v1';
    
    await initPongGame(mode as GameMode);
  }

  if (targetPath === "/register") {
    setupRegister();
  }

  if (targetPath === "/login") {
    setupLogin();
  }
  
}

function NotFound(): string {
  return `
    <div class="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold">404</h1>
        <p class="text-lg font-semibold">${t("errors.notFound.title")}</p>
        <p class="text-slate-300">${t("errors.notFound.message")}</p>
        <a href="/" data-nav class="inline-block px-4 py-2 rounded bg-slate-100 text-slate-900 font-medium">
          ${t("errors.notFound.link")}
        </a>
      </div>
    </div>
  `;
}
