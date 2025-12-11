import { t } from "../utils/i18n";

export default function Terms(): string {
  const sections = [
    { title: t("terms.acceptance.title"), content: t("terms.acceptance.content") },
    { title: t("terms.fairplay.title"), content: t("terms.fairplay.content") },
    { title: t("terms.security.title"), content: t("terms.security.content") },
    { title: t("terms.contact.title"), content: t("terms.contact.content") },
  ];

  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden text-slate-100">
      <div class="pointer-events-none absolute inset-0 opacity-60">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl"></div>
      </div>

      <header class="relative z-10 px-4 sm:px-6 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <a href="/" data-nav class="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors text-sm">
          <span class="text-lg">🦢</span>
          <span class="font-semibold tracking-tight">${t("settings.backVillage")}</span>
        </a>
        <div class="hidden sm:flex flex-col items-center text-xs text-slate-400">
          <span class="uppercase tracking-[0.25em] text-slate-500">${t("terms.title")}</span>
          <span>${t("terms.subtitle")}</span>
        </div>
        <div></div>
      </header>

      <main class="relative z-10 flex-1 px-4 sm:px-6 py-10 flex justify-center">
        <article class="village-window max-w-4xl w-full p-6 sm:p-10 space-y-6">
          <div class="space-y-3 text-center">
            <p class="text-xs uppercase tracking-[0.4em] text-amber-300">${t("terms.badge")}</p>
            <h1 class="text-3xl sm:text-4xl font-bold text-white">${t("terms.title")}</h1>
            <p class="text-sm text-[var(--color-text-muted)]">${t("terms.intro")}</p>
          </div>
          <div class="space-y-6 text-sm sm:text-base text-slate-200/90">
            ${sections
              .map(
                ({ title, content }) => `
                  <section class="space-y-2">
                    <h2 class="text-base sm:text-lg font-semibold text-white">${title}</h2>
                    <p>${content}</p>
                  </section>
                `
              )
              .join("")}
          </div>
        </article>
      </main>
    </div>
  `;
}
