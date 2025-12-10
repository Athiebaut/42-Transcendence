// web/src/router.ts

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register, { initRegisterPage } from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Pong from "./pages/Pong";
import Play from "./pages/Play";
import { setGoose3DActive } from "./goose3d";
import type { GameMode } from "./game/config/gameModeConfig";

type RouteHandler = () => string;
type RouteInit = () => void | Promise<void>;

const routes: Record<string, RouteHandler> = {
  "/": Home,
  "/login": Login,
  "/register": Register,
  "/dashboard": Dashboard,
  "/play": Play,
  "/pong": Pong,
};

const routeInits: Partial<Record<string, RouteInit>> = {
  "/register": initRegisterPage,
  // tu pourras ajouter ici initLoginPage, initDashboardPage, etc. plus tard
};

export async function renderRoute(path: string) {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) return;

  const cleanPath = path.split("?")[0].split("#")[0];
  const handler = routes[cleanPath] ?? NotFound;

  // Oie visible sur toutes les pages SAUF Pong
  const isPongPage = cleanPath === "/pong";
  setGoose3DActive(!isPongPage);

  // Nettoyer le jeu Pong précédent si on quitte la page Pong
  const previousPath = window.location.pathname.split("?")[0].split("#")[0];
  if (previousPath === "/pong" && cleanPath !== "/pong") {
    const { disposePongGame } = await import("./pages/Pong");
    await disposePongGame();
  }

  // Injection du HTML de la page
  app.innerHTML = handler();

  // Initialisation spécifique à la page (listeners, etc.)
  const init = routeInits[cleanPath];
  if (init) {
    await init();
  }

  // Cas particulier : initialiser le jeu Pong
  if (cleanPath === "/pong") {
    const { initPongGame } = await import("./pages/Pong");
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode") || "pvp1v1";
    await initPongGame(mode as GameMode);
  }

}

function NotFound(): string {
  return `
    <div class="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold">404</h1>
        <p class="text-slate-300">Page not found</p>
        <a href="/" data-nav class="inline-block px-4 py-2 rounded bg-slate-100 text-slate-900 font-medium">
          Back to home
        </a>
      </div>
    </div>
  `;
}
