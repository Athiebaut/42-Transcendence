// web/src/router.ts

import type { GameMode } from "./game/config/gameModeConfig";
import { isAuthenticated } from "./utils/auth";
import { applyTranslations, t } from "./utils/i18n";

type RouteHandler = () => string;
type RouteModule = { default: RouteHandler };

const routeLoaders: Record<string, () => Promise<RouteModule>> = {
  "/": () => import("./pages/Home"),
  "/home": () => import("./pages/Home"),
  "/login": () => import("./pages/Login"),
  "/register": () => import("./pages/Register"),
  "/help": () => import("./pages/Help"),
  "/dashboard": () => import("./pages/Dashboard"),
  "/profil": () => import("./pages/Profil"),
  "/pong": () => import("./pages/Pong"),
  "/play": () => import("./pages/Play"),
  "/profile-settings": () => import("./pages/ProfileSettings"),
};

const setupLoaders: Record<string, () => Promise<() => void>> = {
  "/register": async () => (await import("./pages/Register")).setupRegister,
  "/login": async () => (await import("./pages/Login")).setupLogin,
};

const protectedRoutes = new Set(["/profil", "/profile-settings"]);

let gooseModulePromise: Promise<typeof import("./utils/goose3d")> | null = null;
function loadGooseModule() {
  if (!gooseModulePromise) {
    gooseModulePromise = import("./utils/goose3d");
  }
  return gooseModulePromise;
}

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

  if (isAuthenticated() && (targetPath === "/login" || targetPath === "/register")) {
    app.innerHTML = renderAuthBlockedPage(targetPath);
    applyTranslations(app);
    return;
  }

  const loader = routeLoaders[targetPath] ?? (async () => ({ default: NotFound }));
  const module = await loader();
  const handler = module.default ?? NotFound;

  // Oie visible sur toutes les pages SAUF Pong
  const isPongPage = targetPath === "/pong";
  const goose = await loadGooseModule();
  goose.setGoose3DActive(!isPongPage);

  // Nettoyer le jeu Pong précédent si on quitte la page Pong
  if (previousPath === "/pong" && targetPath !== "/pong") {
    const { disposePongGame } = await import("./pages/Pong");
    await disposePongGame();
  }

  app.innerHTML = handler();
  applyTranslations(app);

  // Initialiser le jeu Pong si on arrive sur la page Pong
  if (isPongPage) {
    const { initPongGame } = await import("./pages/Pong");

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode") || "pvp1v1";

    await initPongGame(mode as GameMode);
  }

  const setupLoader = setupLoaders[targetPath];
  if (setupLoader) {
    const setup = await setupLoader();
    setup?.();
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

function renderAuthBlockedPage(route: "/login" | "/register"): string {
  const titleKey = route === "/login" ? "auth.blocked.loginTitle" : "auth.blocked.registerTitle";
  const messageKey = route === "/login" ? "auth.blocked.loginMessage" : "auth.blocked.registerMessage";

  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden text-slate-100 px-4 py-16">
      <div class="pointer-events-none absolute inset-0 opacity-60">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 max-w-2xl w-full mx-auto village-window p-8 sm:p-10 text-center space-y-5">
        <p class="text-xs uppercase tracking-[0.4em] text-emerald-300">
          ${t("auth.blocked.badge")}
        </p>
        <h1 class="text-3xl sm:text-4xl font-bold">
          ${t(titleKey)}
        </h1>
        <p class="text-base text-[var(--color-text-muted)]">
          ${t(messageKey)}
        </p>
        <div class="flex flex-wrap gap-3 justify-center pt-2">
          <a href="/profil" data-nav class="wood-sign-btn text-sm px-5 py-2">
            ${t("auth.blocked.ctaProfile")}
          </a>
          <a href="/play" data-nav class="btn-secondary">
            ${t("auth.blocked.ctaPlay")}
          </a>
        </div>
      </div>
    </div>
  `;
}
