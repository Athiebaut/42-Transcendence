import { t } from "../i18n";
import { logout } from "../utils/auth";
import {
  activityFeed,
  campfireStats,
  highlightNotes,
  leagueTiers,
  leaderboard,
} from "../data/dashboard";

export default function Dashboard(): string {
  const podiumCards = leaderboard
    .slice(0, 3)
    .map(
      (player) => `
        <article class="glass-panel card-shadow relative flex flex-1 flex-col gap-3 rounded-2xl border border-white/10 p-5 text-center">
          <div class="pointer-events-none absolute inset-x-8 top-0 h-1 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent"></div>
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${player.gradient} text-slate-900 text-xl font-bold shadow-lg shadow-black/40">
            ${player.badge}
          </div>
          <p class="text-[0.65rem] uppercase tracking-[0.45em] text-amber-200/80">#${player.rank}</p>
          <h3 class="text-xl font-semibold">${player.name}</h3>
          <p class="text-emerald-200 text-sm font-medium">${t("dashboard.winrate")} ${player.winRate}</p>
          <div class="rounded-xl border border-white/10 bg-black/40 py-2 text-sm text-slate-200">
            ${player.points} ${t("dashboard.pointsLabel")} • ${t("dashboard.series")} ${player.streak}
          </div>
        </article>
      `
    )
    .join("");

  const leaderboardRows = leaderboard
    .map(
      (player) => `
        <tr class="border-b border-white/5 last:border-none">
          <td class="px-4 py-3 text-left text-sm text-slate-400">#${player.rank}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${player.gradient} text-slate-900 text-sm font-bold shadow-lg">
                ${player.badge}
              </span>
              <div>
                <p class="text-sm font-semibold text-white">${player.name}</p>
                <p class="text-xs text-slate-400">${t("dashboard.winrate")} ${player.winRate}</p>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 text-right text-amber-200 font-semibold">${player.points}</td>
          <td class="px-4 py-3 text-right text-sm text-emerald-300">${player.streak}</td>
        </tr>
      `
    )
    .join("");

  const leagueCards = leagueTiers
    .map(
      (tier) => `
        <article class="glass-panel card-shadow rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.4em] text-amber-200/70">${t("dashboard.league.label")}</p>
              <h3 class="text-lg font-semibold text-white">${t(tier.nameKey)}</h3>
            </div>
            <span class="text-sm text-emerald-200 font-semibold">${t(tier.thresholdKey)}</span>
          </div>
          <p class="mt-3 text-sm text-slate-300/90">${t(tier.rewardKey)}</p>
          <div class="mt-4 rounded-xl border border-white/10 bg-gradient-to-r ${tier.color} px-4 py-3 text-xs text-slate-100">
            <p>${t("dashboard.league.perk")}</p>
          </div>
        </article>
      `
    )
    .join("");

  const activityItems = activityFeed
    .map(
      (item) => `
        <li class="glass-panel flex items-start gap-3 rounded-2xl border border-white/5 bg-slate-950/60 p-4 shadow-inner shadow-black/30">
          <span class="text-xl">${item.icon}</span>
          <p class="text-sm text-slate-200/90">${t(item.textKey)}</p>
        </li>
      `
    )
    .join("");

  const campfireBlocks = campfireStats
    .map(
      (stat) => `
        <article class="glass-panel border border-slate-800/70 rounded-xl p-4 text-sm">
          <p class="text-xs uppercase tracking-[0.3em] text-slate-300 flex items-center gap-2">
            <span>${stat.icon}</span>
            <span>${t(stat.labelKey)}</span>
          </p>
          <p class="mt-2 text-xl font-semibold text-white">${t(stat.valueKey)}</p>
          <p class="text-xs text-slate-400">${t(stat.hintKey)}</p>
        </article>
      `
    )
    .join("");

  const highlightCards = highlightNotes
    .map(
      (note) => `
        <article class="glass-panel card-shadow rounded-3xl border border-white/10 bg-slate-950/80 p-5">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 text-amber-200/90">
              <span class="text-xl">${note.icon}</span>
              <p class="text-sm uppercase tracking-[0.35em] text-amber-200/70">${t("dashboard.highlight.sectionLabel")}</p>
            </div>
            <span class="rounded-full border border-emerald-400/50 bg-emerald-400/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-emerald-200">
              ${t(note.badgeKey)}
            </span>
          </div>
          <h4 class="mt-3 text-lg font-semibold text-white">${t(note.titleKey)}</h4>
          <p class="mt-2 text-sm text-slate-300/90">${t(note.textKey)}</p>
        </article>
      `
    )
    .join("");

  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden text-slate-100">
      <div class="pointer-events-none absolute inset-0 opacity-60">
        <div class="absolute -top-36 -left-28 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-36 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
      </div>

      <header class="z-20 px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <a href="/" data-nav class="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors">
          <span class="text-lg">🦢</span>
          <span class="font-semibold tracking-tight">Honk village</span>
        </a>
        <nav class="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
          <a href="/play" data-nav class="hover:text-white transition-colors">${t("nav.playModes")}</a>
          <span class="hidden sm:inline text-slate-700">•</span>
          <a href="/profile" data-nav class="hover:text-white transition-colors">${t("nav.profile")}</a>
        </nav>
      </header>

      <main class="relative z-10 flex-1 px-4 sm:px-6 pb-12 pt-6">
        <div class="max-w-6xl mx-auto space-y-8">
          <section class="glass-panel card-shadow p-5 sm:p-6 space-y-5">
            <div class="space-y-3">
              <p class="text-xs uppercase tracking-[0.35em] text-slate-300 flex items-center gap-2">
                <span class="text-base">🏮</span>
                ${t("nav.ladder")}
              </p>
              <h1 class="text-3xl sm:text-4xl font-bold text-white">
                ${t("dashboard.heroTitle")}
              </h1>
              <p class="text-sm text-slate-300">
                ${t("dashboard.heroDescription")}
              </p>
            </div>
            <div class="flex flex-wrap gap-3">
              <a href="/play" data-nav class="wood-sign-btn px-6 py-3 text-base font-semibold">
                ${t("dashboard.challenge")}
              </a>
              <a href="/profile" data-nav class="px-4 py-2 rounded-full border border-emerald-400/40 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/10 transition-colors">
                ${t("dashboard.viewProfile")}
              </a>
            </div>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              ${campfireBlocks}
            </div>
          </section>

          <section class="grid gap-6 md:grid-cols-3">
            ${podiumCards}
          </section>

          <section class="glass-panel card-shadow p-5 sm:p-6 space-y-4">
            <header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.25em] text-slate-400">${t("dashboard.topBadge")}</p>
                <h2 class="text-lg sm:text-xl font-semibold text-white">${t("dashboard.top10")}</h2>
              </div>
              <button class="text-xs text-slate-300 hover:text-white transition-colors underline-offset-4 hover:underline">
                ${t("cta.export")}
              </button>
            </header>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="text-slate-400 uppercase text-[0.65rem] tracking-wide bg-slate-900/70">
                  <tr>
                    <th class="px-4 py-3 text-left">${t("dashboard.rank")}</th>
                    <th class="px-4 py-3 text-left">${t("dashboard.player")}</th>
                    <th class="px-4 py-3 text-right">${t("dashboard.pointsLabel")}</th>
                    <th class="px-4 py-3 text-right">${t("dashboard.series")}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5 text-slate-200">
                  ${leaderboardRows}
                </tbody>
              </table>
            </div>
          </section>

          <section class="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <article class="glass-panel card-shadow p-5 sm:p-6 space-y-4">
              <header class="flex items-center justify-between">
                <div>
                  <p class="text-xs uppercase tracking-[0.35em] text-slate-400">${t("dashboard.league.sectionLabel")}</p>
                  <h3 class="text-lg font-semibold text-white">${t("dashboard.ligues")}</h3>
                </div>
                <span class="text-xs text-emerald-300">${t("dashboard.league.refresh")}</span>
              </header>
              <div class="grid gap-4 md:grid-cols-3">
                ${leagueCards}
              </div>
            </article>

            <article class="glass-panel card-shadow p-5 sm:p-6 space-y-4">
              <header>
                <p class="text-xs uppercase tracking-[0.35em] text-slate-400">${t("dashboard.activity.badge")}</p>
                <h3 class="text-lg font-semibold text-white">${t("dashboard.activity")}</h3>
              </header>
              <ul class="space-y-3">
                ${activityItems}
              </ul>
            </article>
          </section>

          <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            ${highlightCards}
          </section>
        </div>
      </main>
    </div>
  `;
}

export function setupDashboard() {
  // Gestion de la déconnexion via le header
  const headerLogoutBtn = document.getElementById("header-logout-btn");
  
  headerLogoutBtn?.addEventListener("click", async (event) => {
    event.preventDefault(); // Empêche la navigation vers "#"
    
    if (confirm("Voulez-vous vraiment quitter le village ?")) {
      headerLogoutBtn.textContent = "Au revoir...";
      await logout();
    }
  });
}