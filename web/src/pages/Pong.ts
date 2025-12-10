import type { GameMode } from '../game/config/gameModeConfig';

export default function Pong(): string {
  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden">
      <!-- Fond léger -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl"></div>
      </div>

      <!-- HEADER -->
      <header
        class="relative z-10 px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur"
      >
        <a href="/" data-nav class="flex items-center gap-2 group">
          <span class="text-2xl transition-transform group-hover:scale-110">🦢</span>
          <span class="font-semibold tracking-tight text-slate-100">
            Honk Village
          </span>
        </a>

        <nav class="flex items-center gap-3 text-xs sm:text-sm">
          <a
            href="/home"
            data-nav
            class="px-3 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/70 text-slate-100 hover:bg-slate-800 hover:border-slate-500 transition-colors"
          >
            Retour au village
          </a>
        </nav>
      </header>

      <!-- CONTENU -->
      <main class="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div
          class="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)] items-stretch"
        >
          <!-- ZONE DE JEU, GRANDE -->
          <section class="glass-panel card-shadow rounded-2xl p-3 sm:p-4 flex items-center justify-center">
            <div class="w-full aspect-[16/9] bg-black/90 rounded-xl overflow-hidden flex items-center justify-center">
              <canvas
                id="pong-canvas"
                class="w-full h-full block"
              ></canvas>
            </div>
          </section>

          <!-- INFOS / STATS, PLUS PETITES -->
          <aside class="flex flex-col gap-4 text-xs sm:text-sm">
            <div class="glass-panel card-shadow rounded-2xl p-4 space-y-2">
              <h2 class="text-sm sm:text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>📊</span>
                <span>Score & manche</span>
              </h2>
              <div class="flex items-center justify-between text-sm sm:text-base text-slate-100">
                <div class="flex flex-col items-start">
                  <span class="text-xs text-slate-300">Joueur gauche</span>
                  <span id="pong-score-left" class="text-xl font-bold">0</span>
                </div>
                <div class="flex flex-col items-end">
                  <span class="text-xs text-slate-300">Joueur droite</span>
                  <span id="pong-score-right" class="text-xl font-bold">0</span>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs sm:text-sm text-slate-300 mt-2">
                <span>Manche : <span id="pong-round">1</span></span>
                <span>Temps : <span id="pong-timer">00:00</span></span>
              </div>
            </div>

            <div class="glass-panel card-shadow rounded-2xl p-4 space-y-2">
              <h2 class="text-sm sm:text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>🎮</span>
                <span>Contrôles</span>
              </h2>
              <ul class="space-y-1 text-[0.75rem] sm:text-xs text-slate-200/90">
                <li>Joueur gauche : <span class="font-semibold">W / S</span></li>
                <li>Joueur droite : <span class="font-semibold">↑ / ↓</span></li>
                <li>P : Pause / reprendre</li>
              </ul>
            </div>

            <div class="glass-panel card-shadow rounded-2xl p-4 space-y-2">
              <h2 class="text-sm sm:text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>⚙️</span>
                <span>Paramètres</span>
              </h2>
              <div class="space-y-1 text-[0.75rem] sm:text-xs text-slate-200/90">
                <p>Mode : <span id="pong-mode">Classique</span></p>
                <p>Vitesse : <span id="pong-speed">Normal</span></p>
              </div>
            </div>
          </aside>
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
      text.textContent = 'Error loading game';
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
