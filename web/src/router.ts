// web/src/router.ts

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Play from "./pages/Play";
import ProfileSettings from "./pages/ProfileSettings";
import Profile from "./pages/Profile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Help from "./pages/Help";
import type { GameMode } from "./game/config/gameModeConfig";
import { setupRegister } from "./pages/Register";
import { setupLogin } from "./pages/Login";
import { isAuthenticated } from "./utils/auth";
import { setupProfileSettings } from "./pages/ProfileSettings";
import { setupDashboard } from "./pages/Dashboard";
import { setupHome } from "./pages/Home";
import { setupProfile } from "./pages/Profile";
import LegalFooter from "./components/ui/LegalFooter";

type RouteHandler = () => string;

let pongModulePromise: Promise<typeof import("./pages/Pong")> | null = null;
function loadPongModule() {
  if (!pongModulePromise) {
    pongModulePromise = import("./pages/Pong");
  }
  return pongModulePromise;
}

let gooseModulePromise: Promise<typeof import("./goose3d")> | null = null;
async function setGooseActive(active: boolean) {
  if (!gooseModulePromise) {
    gooseModulePromise = import("./goose3d");
  }
  const { setGoose3DActive } = await gooseModulePromise;
  setGoose3DActive(active);
}

const routes: Record<string, RouteHandler> = {
  "/": Home,
  "/home": Home,
  "/login": Login,
  "/register": Register,
  "/dashboard": Dashboard,
  "/play": Play,
  "/profile-settings": ProfileSettings,
  "/profile": Profile,
  "/help": Help,
  "/privacy-policy": PrivacyPolicy,
  "/terms-of-service": TermsOfService
};
const protectedRoutes = new Set(["/dashboard", "/profile-settings", "/profile"]);

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
  await setGooseActive(!isPongPage);

  // Nettoyer le jeu Pong précédent si on quitte la page Pong
  if (previousPath === "/pong" && targetPath !== "/pong") {
    const { disposePongGame } = await loadPongModule();
    await disposePongGame();
  }

  const pageHtml =
    targetPath === "/pong"
      ? (await loadPongModule()).default()
      : handler();
  app.innerHTML = `
    <div class="page-content">
      ${pageHtml}
    </div>
    ${LegalFooter()}
  `;

  // Initialiser le jeu Pong si on arrive sur la page Pong
  if (targetPath === "/pong") {
    const { initPongGame } = await loadPongModule();
    
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

  if (targetPath === "/profile-settings") {
    setupProfileSettings();
  }

  if (targetPath === "/dashboard") {
    setupDashboard();
  }
  
  if (targetPath === "/" || targetPath === "/home") {
    setupHome();
  }

  if (targetPath === "/profile") {
    setupProfile();
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
