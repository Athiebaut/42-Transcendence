import { statCards, recentMatches, friendStatus, type FriendActionVariant } from "../data/profile";
import { t } from "../i18n";

const resultStyles: Record<string, string> = {
  "profile.match.result.win": "bg-emerald-500/15 text-emerald-300",
  "profile.match.result.loss": "bg-rose-500/15 text-rose-300",
  "profile.match.result.draw": "bg-slate-500/20 text-slate-200",
};

const friendActionStyles: Record<FriendActionVariant, string> = {
  primary: "px-3 py-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/10 text-[0.7rem] sm:text-xs text-emerald-300 hover:bg-emerald-500/20 transition-colors",
  secondary: "px-3 py-1.5 rounded-full border border-slate-600 bg-black/40 text-[0.7rem] sm:text-xs hover:bg-white/5 transition-colors",
  muted: "text-[0.7rem] sm:text-xs text-slate-500",
};

export default function Profil(): string {
  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden text-slate-100">
      <!-- Halo de lumière / ambiance -->
      <div class="pointer-events-none absolute inset-0 opacity-60">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <!-- HEADER du dashboard -->
      <header class="z-20 px-6 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <a href="/" data-nav class="flex items-center gap-2">
          <span class="text-2xl">🦢</span>
          <span class="font-semibold tracking-tight">${t("settings.backVillage")}</span>
        </a>

        <div class="hidden sm:flex flex-col items-center text-xs text-slate-400">
          <span class="uppercase tracking-[0.25em] text-slate-500">
            ${t("header.profil.label")}
          </span>
          <span>${t("header.profil.helper")}</span>
        </div>

        <nav class="flex items-center gap-3 text-xs sm:text-sm text-slate-300 justify-end">
          <a href="/play" data-nav class="hover:text-white transition-colors">${t("nav.playModes")}</a>
        </nav>
      </header>

      <!-- CONTENU PRINCIPAL -->
      <main class="relative z-10 flex-1 px-4 sm:px-6 pb-10 pt-6">
        <div class="max-w-6xl mx-auto space-y-8">
          <!-- Ligne 1 : profil + stats rapides -->
          <section class="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)] items-start">
            <!-- Carte profil / résumé -->
            <article class="glass-panel card-shadow p-5 sm:p-6 space-y-4">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-300 to-rose-400 flex items-center justify-center text-3xl shadow-lg">
                    🦢
                  </div>
                  <div>
                    <p class="text-xs uppercase tracking-[0.25em] text-slate-400">${t("profile.title")}</p>
                    <h1 class="text-xl sm:text-2xl font-semibold" id="dashboard-username">
                      HonkMaster
                    </h1>
                    <p class="text-xs text-slate-400 mt-1">
                      ${t("profile.rank", {
                        rank: `<span class="text-emerald-300 font-medium" id="dashboard-rank">Oie d'élite</span>`,
                      })}
                    </p>
                  </div>
                </div>

                <div class="hidden sm:flex flex-col items-end text-xs text-slate-400">
                  <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    ${t("profile.status.online")}
                  </span>
                  <span class="mt-2">
                    ${t("profile.status.lastMatch", {
                      time: `<span id="dashboard-last-match">il y a 2 h</span>`,
                    })}
                  </span>
                </div>
              </div>

              <!-- Boutons d'actions rapides -->
              <div class="flex flex-wrap gap-3 mt-2">
                <a
                  href="/pong"
                  data-nav
                  class="wood-sign-btn text-sm sm:text-base px-6 py-3"
                >
                  ${t("profile.playRanked")}
                </a>
                <button
                  type="button"
                  class="px-4 py-2 rounded-full border border-slate-600 bg-black/40 text-xs sm:text-sm hover:bg-white/5 transition-colors"
                >
                  ${t("profile.privateLobby")}
                </button>
                <a
                  href="/profile-settings"
                  data-nav
                  class="px-4 py-2 rounded-full border border-slate-700 bg-black/30 text-xs sm:text-sm hover:bg-white/5 transition-colors inline-flex items-center justify-center"
                >
                  ${t("profile.settingsLink")}
                </a>
              </div>
            </article>

            <!-- Carte stats rapides -->
            <article class="glass-panel card-shadow p-5 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <p class="text-xs uppercase tracking-[0.25em] text-slate-400">${t("profile.statsBadge")}</p>
                  <h2 class="text-lg sm:text-xl font-semibold">${t("profile.statsTitle")}</h2>
                </div>
                <span class="text-xs text-slate-500">${t("profile.stats.period")}</span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                ${statCards
                  .map(
                    (card) => `
                  <div class="glass-panel border border-slate-700/70 p-3 rounded-xl">
                    <p class="text-slate-400 text-[0.7rem] uppercase tracking-wide mb-1">${t(card.labelKey)}</p>
                    <p class="text-xl font-semibold">${card.value}</p>
                    <p class="text-[0.7rem] text-slate-400 mt-1">${t(card.infoKey, card.infoVars)}</p>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </article>
          </section>

          <!-- Ligne 2 : matchs récents + amis / villages -->
          <section class="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)] items-start">
            <!-- Matchs récents -->
            <article class="glass-panel card-shadow p-5 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <p class="text-xs uppercase tracking-[0.25em] text-slate-400">${t("profile.history")}</p>
                  <h2 class="text-lg sm:text-xl font-semibold">${t("profile.recentMatches")}</h2>
                </div>
                <button
                  type="button"
                  class="text-[0.7rem] sm:text-xs text-slate-400 hover:text-slate-200 underline-offset-2 hover:underline"
                >
                  ${t("profile.history.button")}
                </button>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-xs sm:text-sm">
                  <thead class="text-slate-400 uppercase text-[0.65rem] tracking-wide bg-slate-900/70">
                    <tr>
                      <th class="px-3 py-2 text-left">${t("profile.history.table.opponent")}</th>
                      <th class="px-3 py-2 text-center">${t("profile.history.table.score")}</th>
                      <th class="px-3 py-2 text-center">${t("profile.history.table.mode")}</th>
                      <th class="px-3 py-2 text-right">${t("profile.history.table.result")}</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800">
                    ${recentMatches
                      .map(
                        (match) => `
                      <tr>
                        <td class="px-3 py-2">
                          <div class="flex items-center gap-2">
                            <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/80 text-slate-950 text-[0.65rem] font-bold">
                              ${match.opponent.slice(0, 2).toUpperCase()}
                            </span>
                            <span>${match.opponent}</span>
                          </div>
                        </td>
                        <td class="px-3 py-2 text-center">${match.score}</td>
                        <td class="px-3 py-2 text-center text-slate-400">${t(match.modeKey)}</td>
                        <td class="px-3 py-2 text-right">
                          <span class="inline-flex items-center px-2 py-1 rounded-full ${resultStyles[match.resultKey]} text-[0.7rem]">
                            ${t(match.resultKey)}
                          </span>
                        </td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            </article>

            <!-- Amis connectés / villages -->
            <article class="glass-panel card-shadow p-5 sm:p-6 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs uppercase tracking-[0.25em] text-slate-400">${t("profile.friends.titleBadge")}</p>
                  <h2 class="text-lg sm:text-xl font-semibold">${t("profile.friends.title")}</h2>
                </div>
                <span class="text-xs text-slate-500">${t("profile.friends.subtitle")}</span>
              </div>

              <div class="space-y-3">
                ${friendStatus
                  .map(
                    (friend) => `
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/80 text-slate-950 text-xs font-bold">
                        ${friend.badge}
                      </span>
                      <div class="text-xs sm:text-sm">
                        <p class="font-medium">${friend.name}</p>
                        <p class="text-slate-400 text-[0.7rem]">${t(friend.statusKey, friend.statusVars)}</p>
                      </div>
                    </div>
                    ${
                      friend.actionVariant === "muted"
                        ? `<span class="${friendActionStyles.muted}">${t(friend.actionKey)}</span>`
                        : `<button type="button" class="${friendActionStyles[friend.actionVariant]}">
                        ${t(friend.actionKey)}
                      </button>`
                    }
                  </div>
                `
                  )
                  .join("")}
              </div>

              <p class="text-[0.7rem] text-slate-500 mt-4">
                ${t("profile.friends.note")}
              </p>
            </article>
          </section>
        </div>
      </main>
    </div>
  `;
}
