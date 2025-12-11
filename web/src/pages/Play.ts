import { t } from "../utils/i18n";
import { isAuthenticated } from "../utils/auth";

type PlayCard = {
  href: string;
  icon: string;
  circleGradient: string;
  borderClass: string;
  badgeColor: string;
  badgeKey: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  rulesKey: string;
  ctaKey: string;
  ctaColor: string;
};

const playCards: PlayCard[] = [
  {
    href: "/pong?mode=pvp1v1",
    icon: "⚡",
    circleGradient: "bg-gradient-to-br from-emerald-400 to-amber-300",
    borderClass:
      "border border-emerald-500/30 hover:border-emerald-300/70 hover:bg-emerald-500/5",
    badgeColor: "text-emerald-300",
    badgeKey: "play.cards.quick.badge",
    titleKey: "play.cards.quick.title",
    subtitleKey: "play.cards.quick.subtitle",
    descriptionKey: "play.cards.quick.description",
    rulesKey: "play.cards.quick.rules",
    ctaKey: "play.cards.quick.cta",
    ctaColor: "text-emerald-300",
  },
  {
    href: "/pong?mode=pvp2v2",
    icon: "🏅",
    circleGradient: "bg-gradient-to-br from-amber-300 to-rose-400",
    borderClass:
      "border border-amber-500/30 hover:border-amber-300/70 hover:bg-amber-500/5",
    badgeColor: "text-amber-300",
    badgeKey: "play.cards.rank.badge",
    titleKey: "play.cards.rank.title",
    subtitleKey: "play.cards.rank.subtitle",
    descriptionKey: "play.cards.rank.description",
    rulesKey: "play.cards.rank.rules",
    ctaKey: "play.cards.rank.cta",
    ctaColor: "text-amber-300",
  },
  {
    href: "/pong?mode=vsai",
    icon: "🤝",
    circleGradient: "bg-gradient-to-br from-sky-400 to-violet-300",
    borderClass:
      "border border-sky-500/30 hover:border-sky-300/70 hover:bg-sky-500/5",
    badgeColor: "text-sky-300",
    badgeKey: "play.cards.coop.badge",
    titleKey: "play.cards.coop.title",
    subtitleKey: "play.cards.coop.subtitle",
    descriptionKey: "play.cards.coop.description",
    rulesKey: "play.cards.coop.rules",
    ctaKey: "play.cards.coop.cta",
    ctaColor: "text-sky-300",
  },
  {
    href: "/pong?mode=tournament",
    icon: "🌀",
    circleGradient: "bg-gradient-to-br from-rose-400 to-fuchsia-400",
    borderClass:
      "border border-rose-500/30 hover:border-rose-300/70 hover:bg-rose-500/5",
    badgeColor: "text-rose-300",
    badgeKey: "play.cards.chaos.badge",
    titleKey: "play.cards.chaos.title",
    subtitleKey: "play.cards.chaos.subtitle",
    descriptionKey: "play.cards.chaos.description",
    rulesKey: "play.cards.chaos.rules",
    ctaKey: "play.cards.chaos.cta",
    ctaColor: "text-rose-300",
  },
];

export default function Play(): string {
  const loggedIn = isAuthenticated();
  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden text-slate-100">
      <!-- Halos de lumière / ambiance -->
      <div class="pointer-events-none absolute inset-0 opacity-60">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <!-- HEADER -->
      <header
        class="relative z-10 px-4 sm:px-6 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur"
      >
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
            ${t("header.play.label")}
          </span>
          <span>${t("header.play.helper")}</span>
        </div>

        <nav class="flex items-center gap-3 text-xs sm:text-sm text-slate-300 justify-end">
          <a
            href="${loggedIn ? "/profil" : "/login"}"
            data-nav
            class="hover:text-white transition-colors"
          >
            ${loggedIn ? t("nav.profile") : t("nav.login")}
          </a>
        </nav>
      </header>

      <!-- CONTENU -->
      <main class="relative z-10 flex-1 px-4 sm:px-6 pb-10 pt-6">
        <div class="max-w-5xl mx-auto space-y-8">
          <section class="text-center space-y-3">
            <h1 class="text-2xl sm:text-3xl font-bold">
              ${t("play.title")}
            </h1>
            <p class="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              ${t("play.description")}
            </p>
          </section>

          <!-- Cartes de modes -->
          <section class="grid gap-5 sm:grid-cols-2">
            ${playCards
              .map(
                (card) => `
                  <a
                    href="${card.href}"
                    data-nav
                    class="glass-panel card-shadow group relative flex flex-col gap-3 p-5 sm:p-6 ${card.borderClass} transition-colors"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 rounded-full ${card.circleGradient} flex items-center justify-center shadow-lg"
                        >
                          <span class="text-xl">${card.icon}</span>
                        </div>
                        <div class="text-left">
                          <h2 class="font-semibold text-lg">${t(card.titleKey)}</h2>
                          <p class="text-xs text-slate-400">
                            ${t(card.subtitleKey)}
                          </p>
                        </div>
                      </div>
                      <span class="text-[0.65rem] uppercase tracking-[0.2em] ${card.badgeColor}">
                        ${t(card.badgeKey)}
                      </span>
                    </div>

                    <p class="text-sm text-slate-200 mt-1">
                      ${t(card.descriptionKey)}
                    </p>

                    <p class="mt-2 text-[0.7rem] text-slate-400">
                      ${t(card.rulesKey)}
                    </p>

                    <span
                      class="mt-3 inline-flex items-center gap-1 text-[0.75rem] ${card.ctaColor} group-hover:translate-x-0.5 transition-transform"
                    >
                      ${t(card.ctaKey)}
                      <span>→</span>
                    </span>
                  </a>
                `
              )
              .join("")}
          </section>

          <p class="text-[0.7rem] text-slate-500 text-center mt-2">
            ${t("play.notice")}
          </p>
        </div>
      </main>
    </div>
  `;
}
