import { t } from "../utils/i18n";
import { isAuthenticated } from "../utils/auth";
import type { GameMode } from '../game/config/gameModeConfig';

export default function Pong(): string {
  const loggedIn = isAuthenticated();
  return `
    <div id="pong-container" class="min-h-screen flex flex-col relative overflow-hidden">
      <!-- Fond léger -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl"></div>
      </div>

      <!-- HEADER -->
      <header
        class="relative z-10 px-4 sm:px-6 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur"
      >
        <a href="/" data-nav class="flex items-center gap-2 group">
          <span class="text-2xl transition-transform group-hover:scale-110">🦢</span>
          <span class="font-semibold tracking-tight text-slate-100">
            ${t("settings.backVillage")}
          </span>
        </a>

        <div class="hidden sm:flex flex-col items-center text-xs text-slate-400">
          <span class="uppercase tracking-[0.25em] text-slate-500">
            ${t("header.pong.label")}
          </span>
          <span>${t("header.pong.helper")}</span>
        </div>

        <nav class="flex items-center gap-3 text-xs sm:text-sm text-slate-300 justify-end">
          <a href="/play" data-nav class="hover:text-white transition-colors">${t("nav.playModes")}</a>
          <span class="hidden sm:inline text-slate-700">•</span>
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
      <main class="relative z-10 flex-1 px-4 sm:px-6 lg:px-10 py-6">
        <div class="w-full max-w-screen-2xl mx-auto flex flex-col gap-6">
          <!-- Zone principale: infos joueurs + jeu au centre -->
          <section
            class="grid gap-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,3.4fr)_minmax(0,0.7fr)] items-stretch"
          >
            <!-- Joueur gauche -->
            <article id="player1-info" class="glass-panel card-shadow rounded-2xl p-4 flex flex-col gap-4">
              <div class="flex items-center gap-3">
                <div
                  class="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400/80 to-emerald-600/40 flex items-center justify-center text-xl"
                >
                  🦢
                </div>
                <div>
                  <p class="text-xs uppercase tracking-[0.3em] text-emerald-200/70">${t("pong.player.left")}</p>
                  <h3 id="pong-player-left-name" class="text-lg font-semibold text-white">Oie Verte</h3>
                </div>
              </div>
              <div class="space-y-2 text-xs text-slate-200/80">
                <p>${t("pong.player.racket")}: <span id="pong-player-left-skin" class="font-semibold text-white">Classique</span></p>
                <p>${t("pong.player.maxSpeed")}: <span id="pong-player-left-speed" class="font-semibold text-white">36 km/h</span></p>
                <p>${t("pong.player.honkPower")}: <span id="pong-player-left-power" class="font-semibold text-white">x1.2</span></p>
              </div>
            </article>

            <!-- Jeu centré -->
            <section class="glass-panel card-shadow rounded-2xl p-3 sm:p-5 flex items-center justify-center">
              <div class="w-full aspect-[32/15] lg:aspect-[21/9] bg-black/90 rounded-2xl overflow-hidden flex items-center justify-center min-h-[520px] sm:min-h-[620px]">
                <canvas
                  id="gameCanvas"
                  class="w-full h-full block"
                ></canvas>
              </div>
            </section>

            <!-- Joueur droite -->
            <article id="player2-info" class="glass-panel card-shadow rounded-2xl p-4 flex flex-col gap-4">
              <div class="flex items-center gap-3 justify-end">
                <div class="text-right">
                  <p class="text-xs uppercase tracking-[0.3em] text-sky-200/70">${t("pong.player.right")}</p>
                  <h3 id="pong-player-right-name" class="text-lg font-semibold text-white">Oie Bleue</h3>
                </div>
                <div
                  class="h-12 w-12 rounded-full bg-gradient-to-br from-sky-400/80 to-sky-600/40 flex items-center justify-center text-xl"
                >
                  🦢
                </div>
              </div>
              <div class="space-y-2 text-xs text-slate-200/80 text-right">
                <p>${t("pong.player.racket")}: <span id="pong-player-right-skin" class="font-semibold text-white">Arcanique</span></p>
                <p>${t("pong.player.maxSpeed")}: <span id="pong-player-right-speed" class="font-semibold text-white">33 km/h</span></p>
                <p>${t("pong.player.honkPower")}: <span id="pong-player-right-power" class="font-semibold text-white">x1.1</span></p>
              </div>
            </article>
          </section>

          <!-- Panneaux secondaires sous le jeu -->
          <section class="grid gap-4 md:grid-cols-3 text-xs sm:text-sm">
            <div class="glass-panel card-shadow rounded-2xl p-4 space-y-3">
              <h2 class="text-sm sm:text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>📊</span>
                <span>${t("pong.scoreboard.title")}</span>
              </h2>
              <div class="flex items-center justify-between text-sm sm:text-base text-slate-100">
                <div class="flex flex-col items-start">
                  <span class="text-xs text-slate-300">${t("pong.player.left")}</span>
                  <span id="player1-score" class="text-2xl font-bold">0</span>
                </div>
                <div class="flex flex-col items-end">
                  <span class="text-xs text-slate-300">${t("pong.player.right")}</span>
                  <span id="player2-score" class="text-2xl font-bold">0</span>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs sm:text-sm text-slate-300">
                <span>${t("pong.scoreboard.round")} : <span id="pong-round">1</span></span>
                <span>${t("pong.scoreboard.time")} : <span id="pong-timer">00:00</span></span>
              </div>
            </div>

            <div class="glass-panel card-shadow rounded-2xl p-4 space-y-3">
              <h2 class="text-sm sm:text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>🎮</span>
                <span>${t("pong.controls.title")}</span>
              </h2>
              <ul class="space-y-1.5 text-[0.75rem] sm:text-xs text-slate-200/90">
                <li>${t("pong.controls.left")} <span class="font-semibold">W / S</span></li>
                <li>${t("pong.controls.right")} <span class="font-semibold">↑ / ↓</span></li>
                <li>${t("pong.controls.pause")}</li>
              </ul>
            </div>

            <div class="glass-panel card-shadow rounded-2xl p-4 space-y-3">
              <h2 class="text-sm sm:text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>⚙️</span>
                <span>${t("pong.settings.title")}</span>
              </h2>
              <div class="space-y-1 text-[0.75rem] sm:text-xs text-slate-200/90">
                <p>${t("pong.settings.mode")} : <span id="pong-mode" class="font-semibold text-white">Classique</span></p>
                <p>${t("pong.settings.speed")} : <span id="pong-speed" class="font-semibold text-white">Normal</span></p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  `;
}


export async function initPongGame(mode: GameMode = 'pvp1v1') {
  try {
    console.log(`🎮 Initializing Pong with mode: ${mode}`);

    // Si mode tournoi, afficher l'écran d'inscription d'abord
    if (mode === 'tournament') {
      const { renderTournamentSetup, initTournamentSetup } = await import('../game/tournament/TournamentSetup');
      
      // Injecter l'écran d'inscription
      const container = document.getElementById('pong-container');
      if (container) {
        container.insertAdjacentHTML('afterbegin', renderTournamentSetup());
      }

      // Attendre que les joueurs s'inscrivent
      initTournamentSetup((aliases) => {
        console.log('🏆 Tournoi démarré avec:', aliases);
        
        // Sauvegarder les alias
        sessionStorage.setItem('tournamentAliases', JSON.stringify(aliases));
        
        // Lancer le jeu
        startGame(mode);
      });
      
      return;
    }

    // Mode normal : lancer directement
    await startGame(mode);

  } catch (error) {
    console.error('Error loading Pong game:', error);
  }
}

async function startGame(mode: GameMode) {
  const { initPongGame: init } = await import('../game/pongGame');
  const success = await init(mode);

  const text = document.querySelector('#game-status') as HTMLElement;
  if (text) {
    if (success) {
      text.style.display = 'none';
    } else {
      text.textContent = t("pong.error");
      text.className = 'text-red-500 mt-4 text-sm';
      text.style.display = 'block';
    }
  }
}

export async function disposePongGame() {
  try {
    const { disposePongGame } = await import('../game/pongGame');
    disposePongGame();
  } catch (error) {
    console.error('Error disposing Pong game:', error);
  }
}
