import { t } from "../i18n";

export default function Help(): string {
  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden">
      <!-- Halos pour matcher le style global -->
      <div class="pointer-events-none absolute inset-0 opacity-60">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <header class="relative z-10 px-4 sm:px-6 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <a
          href="/"
          data-nav
          class="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors text-sm"
        >
          <span class="text-lg">🦢</span>
          <span class="font-semibold tracking-tight">${t("settings.backVillage")}</span>
        </a>

        <div class="hidden sm:flex flex-col items-center text-xs text-slate-400">
          <span class="uppercase tracking-[0.25em] text-slate-500">
            ${t("header.help.label")}
          </span>
          <span>${t("header.help.helper")}</span>
        </div>
      </header>

      <main class="relative z-10 flex-1 flex items-center justify-center px-6 py-16 text-center">
        <div class="village-window max-w-3xl w-full p-8 sm:p-12 space-y-6">
          <p class="text-xs uppercase tracking-[0.4em] text-emerald-300/80">${t("help.badge")}</p>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            ${t("help.title")}
          </h1>
          <p class="text-base sm:text-lg text-slate-200/85">${t("help.subtitle")}</p>
          <p class="text-sm text-slate-400">${t("help.caption")}</p>
        </div>
      </main>
    </div>
  `;
}
