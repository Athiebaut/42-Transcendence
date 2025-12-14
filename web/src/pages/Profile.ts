import { statCards, friendStatus, type FriendActionVariant } from "../data/profile";
import { t } from "../i18n";
import { logout } from "../utils/auth";
import { userService } from "../services/userService";
import { historyService} from "../services/historyService";
import { loadTournament, getRoundName } from '../game/tournament/TournamentLogic';


// const resultStyles: Record<string, string> = {
//   "profile.match.result.win": "bg-emerald-500/15 text-emerald-300",
//   "profile.match.result.loss": "bg-rose-500/15 text-rose-300",
//   "profile.match.result.draw": "bg-slate-500/20 text-slate-200",
// };

const friendActionStyles: Record<FriendActionVariant, string> = {
  primary: "px-3 py-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/10 text-[0.7rem] sm:text-xs text-emerald-300 hover:bg-emerald-500/20 transition-colors",
  secondary: "px-3 py-1.5 rounded-full border border-slate-600 bg-black/40 text-[0.7rem] sm:text-xs hover:bg-white/5 transition-colors",
  muted: "text-[0.7rem] sm:text-xs text-slate-500",
};

export default function Profile(): string {
  const user = userService.getUser();
  const username = user?.username || "HonkMaster";

  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden text-slate-100">
      <!-- Halo de lumière / ambiance -->
      <div class="pointer-events-none absolute inset-0 opacity-60">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <!-- HEADER du dashboard -->
      <header class="z-20 px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <a href="/" data-nav class="flex items-center gap-2">
          <span class="text-2xl">🦢</span>
          <span class="font-semibold tracking-tight">Honk Village</span>
        </a>

        <nav class="flex items-center gap-3 text-xs sm:text-sm">
          <a href="/play" data-nav class="px-3 py-1.5 rounded-full border border-white/10 bg-black/30 hover:bg-white/5 transition-colors">
            🎮 ${t("profile.header.playPong")}
          </a>
          <a href="/profile" data-nav class="hidden sm:inline text-emerald-300 font-semibold">
            ${t("nav.profile")}
          </a>
          <!-- MODIFICATION : Ajout de l'ID et changement du href -->
          <a href="#" id="profile-logout-btn" class="hidden sm:inline text-slate-300 hover:text-white transition-colors">
            ${t("nav.logout")}
          </a>
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
                  <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-300 to-rose-400 flex items-center justify-center text-3xl shadow-lg overflow-hidden">
                    ${user?.avatarUrl ? `<img src="${user.avatarUrl}" class="w-full h-full object-cover" />` : '🦢'}
                  </div>
                  <div>
                    <p class="text-xs uppercase tracking-[0.25em] text-slate-400">${t("profile.title")}</p>
                    <h1 class="text-xl sm:text-2xl font-semibold" id="dashboard-username">
                      ${username}
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
                  href="/play"
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

              <div class="overflow-x-auto max-h-80 overflow-y-auto custom-scrollbar">
                <table class="w-full text-xs sm:text-sm">
                  <thead class="text-slate-400 uppercase text-[0.65rem] tracking-wide bg-slate-900/70">
                    <tr>
                      <th class="px-3 py-2 text-center">${t("profile.history.table.score")}</th>
                      <th class="px-3 py-2 text-center">${t("profile.history.table.mode")}</th>
                      <th class="px-3 py-2 text-right">${t("profile.history.table.result")}</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800" id="history-table-body">
                    <tr>
                      <td colspan="3" class="p-4 text-center text-slate-500 text-xs">
                        Chargement de l'historique...
                      </td>
                    </tr>
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

// AJOUT : Fonction pour attacher les événements (appelée par le routeur)
export function setupProfile() {
  const logoutBtn = document.getElementById("profile-logout-btn");
  
  logoutBtn?.addEventListener("click", async (event) => {
    event.preventDefault();
    
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
      await logout();
    }
  });
  // CHARGEMENT DIFFÉRÉ DE L'HISTORIQUE
  loadHistory();
}

function formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
}

async function loadHistory() {
    const user = userService.getUser();
    if (!user) return;

    const tbody = document.getElementById("history-table-body");
    if (!tbody) return;

    try {
        const data = await historyService.getHistory(user.id);
        const history = data.history || [];

        if (history.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="3" class="p-4 text-center text-slate-500 text-xs">
              Aucune partie jouée pour le moment.
            </td>
          </tr>
        `;
            return;
        }

        const modeMap: Record<string, string> = {
            pvp1v1: t("profile.match.mode.1v1"),
            pvp2v2: t("profile.match.mode.2v2"),
            vsai: t("profile.match.mode.vIA"),
            tournament: t("profile.match.mode.tournament"),
        };

        function getRoundLabel(round: number, totalPlayers?: number) {
          // Si on a le nombre total de joueurs, on calcule le nombre de rounds
          if (typeof totalPlayers === 'number' && totalPlayers >= 2) {
            const totalRounds = Math.log2(totalPlayers);
            if (!Number.isFinite(totalRounds) || Math.floor(totalRounds) !== totalRounds) {
              // non puissance de 2 -> fallback heuristique
            } else {
              const roundsFromEnd = totalRounds - round + 1;
              if (roundsFromEnd === 1) return "🏆 Finale";
              if (roundsFromEnd === 2) return "⚔️ Demi-finales";
              if (roundsFromEnd === 3) return "🎯 Quarts de finale";
              if (roundsFromEnd === 4) return "1/8 de finale";
              if (roundsFromEnd === 5) return "1/16 de finale";
              return `Tour ${round}`;
            }
          }

          // Fallback simple si on ne connait pas la taille du tournoi
          if (round <= 1) return "Premier tour";
          if (round === 2) return "Deuxième tour";
          if (round === 3) return "Quarts de finale";
          if (round === 4) return "Demi-finales";
          if (round >= 5) return "Finale";
          return `Tour ${round}`;
        }

        tbody.innerHTML = history.map(match => {
            const parts = match.score.split('-').map(s => parseInt(s.trim()));
            let myScore = 0;
            let opScore = 0;
            if (typeof (match as any).playerPosition === 'number') {
              const pos = (match as any).playerPosition as number;
              if (pos === 1) {
                myScore = parts[0] || 0;
                opScore = parts[1] || 0;
              } else {
                myScore = parts[1] || 0;
                opScore = parts[0] || 0;
              }
            } else {
              // fallback: assume first score is user
              myScore = parts[0] || 0;
              opScore = parts[1] || 0;
            }

            const isWin = myScore > opScore;
            const isDraw = myScore === opScore;

            let resultClass = "bg-rose-500/15 text-rose-300";
            let resultText = t("profile.match.result.loss") || "Défaite";
            
            if (isWin) {
                resultClass = "bg-emerald-500/15 text-emerald-300";
                resultText = t("profile.match.result.win") || "Victoire";
            } else if (isDraw) {
                resultClass = "bg-slate-500/20 text-slate-200";
                resultText = t("profile.match.result.draw") || "Égalité";
            }

            const dateObj = new Date(match.date);
            const dateStr = dateObj.toLocaleDateString();
            const durationStr = formatDuration(match.durationMs); // Conversion

            let modeLabel = modeMap[match.mode] || match.mode;
            if (match.mode === 'tournament') {
              // Prefer tournamentRound + tournamentPlayersCount stockés en DB. Sinon fallback sur le tournoi en session.
              const totalPlayersFromMatch = (match as any).tournamentPlayersCount as number | undefined;
              if (typeof match.tournamentRound === 'number') {
                const roundLabel = getRoundLabel(match.tournamentRound, totalPlayersFromMatch);
                modeLabel = `${modeLabel} — ${roundLabel}`;
              } else {
                try {
                  const tournament = loadTournament();
                  if (tournament) {
                    const roundName = getRoundName(tournament);
                    modeLabel = `${modeLabel} — ${roundName}`;
                  }
                } catch (e) {
                  // ignore if no tournament data in session
                }
              }
            }

            return `
              <tr>
                <td class="px-3 py-2 text-center font-mono text-slate-300">${match.score}</td>
                <td class="px-3 py-2 text-center">
                  <span class="text-xs text-slate-400">${modeLabel}</span>
                  <div class="text-[0.6rem] text-slate-500 mt-0.5">⏱️ ${durationStr}</div>
                </td>
                <td class="px-3 py-2 text-right">
                  <div class="flex flex-col items-end gap-1">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full ${resultClass} text-[0.65rem] font-medium">
                      ${resultText}
                    </span>
                    <span class="text-[0.65rem] text-slate-500">${dateStr}</span>
                  </div>
                </td>
              </tr>
            `;
        }).join('');

    } catch (error) {
        console.error("Erreur chargement historique", error);
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="p-4 text-center text-rose-400 text-xs">
                    Erreur lors du chargement de l'historique.
                </td>
            </tr>
        `;
    }
}