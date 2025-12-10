import { api } from "../services/api";

export default function Register(): string {
  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <header class="relative z-10 px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <a
          href="/"
          data-nav
          class="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors text-sm"
        >
          <span class="text-lg">🦢</span>
          <span class="font-semibold tracking-tight">Retour au village</span>
        </a>

        <nav class="flex items-center gap-3 text-xs sm:text-sm">
          <a
            href="/login"
            data-nav
            class="px-4 py-2 rounded-full border border-white/20 bg-black/30 text-xs font-medium hover:bg-white/10 transition-colors"
          >
            J'ai déjà un compte
          </a>
        </nav>
      </header>

      <main class="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-8 flex items-center">
        <div class="w-full max-w-6xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          <div class="space-y-6">
            <div class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs sm:text-sm font-medium bg-black/40 border border-white/10 backdrop-blur">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-slate-100">
                Une nouvelle oie rejoint le village.
              </span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Prépare ton honk,
              <span class="block text-glow mt-1">
                et laisse ton oie faire sa grande entrée.
              </span>
            </h1>

            <p class="text-sm sm:text-base text-slate-200/80 max-w-xl">
              Crée un compte pour débloquer la personnalisation, suivre ta progression,
              défier les autres villageois et établir ton héritage d'oie.
            </p>

            <div class="grid gap-3 sm:grid-cols-3">
              <p class="flex items-start gap-2 text-sm sm:text-base text-slate-100">
                <span class="mt-0.5">🥇</span>
                <span>
                  Classement et historique de matchs conservés à chaque honk.
                </span>
              </p>
              <p class="flex items-start gap-2 text-sm sm:text-base text-slate-100">
                <span class="mt-0.5">🎭</span>
                <span>
                  Cosmétiques exclusifs à débloquer pour ton oie.
                </span>
              </p>
              <p class="flex items-start gap-2 text-sm sm:text-base text-slate-100">
                <span class="mt-0.5">🧑‍🤝‍🧑</span>
                <span>
                  Rejoins tes amis et crée des salons privés.
                </span>
              </p>
            </div>
          </div>

          <div class="relative">
            <div class="relative glass-panel card-shadow rounded-2xl overflow-hidden">
              <div class="pointer-events-none absolute inset-0">
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/15 blur-3xl"></div>
                <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-500/15 blur-3xl"></div>
              </div>

              <div class="relative p-6 sm:p-8 space-y-6">
                <div class="space-y-2 text-center sm:text-left">
                  <h2 class="text-xl sm:text-2xl font-semibold tracking-tight">
                    Créer mon oie
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-300">
                    Quelques infos suffisent pour rejoindre le village.
                  </p>
                </div>

                <form class="space-y-4" id="registrationForm" novalidate method="post" action="/register">
                  <div class="space-y-1">
                    <label
                      for="username"
                      class="block text-xs font-medium text-slate-200/90 tracking-wide"
                    >
                      Nom d'oie
                    </label>
                    <input
                      id="username"
                      type="text"
                      name="username"
                      autocomplete="username"
                      class="
                        w-full rounded-lg
                        border border-[#d4c4a0]/90
                        bg-[#3a5548]/90
                        px-3 py-2
                        text-sm text-slate-100
                        placeholder:text-slate-300
                        focus:outline-none
                        focus:ring-2 focus:ring-emerald-400/70
                        focus:border-emerald-300/80
                      "
                      placeholder="OieLégendaire"
                    />
                  </div>

                  <div class="space-y-1">
                    <label
                      for="email"
                      class="block text-xs font-medium text-slate-200/90 tracking-wide"
                    >
                      Adresse e-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      autocomplete="email"
                      class="
                        w-full rounded-lg
                        border border-[#d4c4a0]/90
                        bg-[#3a5548]/90
                        px-3 py-2
                        text-sm text-slate-100
                        placeholder:text-slate-300
                        focus:outline-none
                        focus:ring-2 focus:ring-emerald-400/70
                        focus:border-emerald-300/80
                      "
                      placeholder="toi@honk-village.gg"
                    />
                  </div>

                  <div class="space-y-1">
                    <label
                      for="password"
                      class="block text-xs font-medium text-slate-200/90 tracking-wide"
                    >
                      Mot de passe
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      autocomplete="new-password"
                      class="
                        w-full rounded-lg
                        border border-[#d4c4a0]/90
                        bg-[#3a5548]/90
                        px-3 py-2
                        text-sm text-slate-100
                        placeholder:text-slate-300
                        focus:outline-none
                        focus:ring-2 focus:ring-emerald-400/70
                        focus:border-emerald-300/80
                      "
                      placeholder="••••••••"
                    />
                  </div>

                  <div class="space-y-1">
                    <label
                      for="password_confirm"
                      class="block text-xs font-medium text-slate-200/90 tracking-wide"
                    >
                      Confirmation du mot de passe
                    </label>
                    <input
                      id="password_confirm"
                      type="password"
                      name="password_confirm"
                      autocomplete="new-password"
                      class="
                        w-full rounded-lg
                        border border-[#d4c4a0]/90
                        bg-[#3a5548]/90
                        px-3 py-2
                        text-sm text-slate-100
                        placeholder:text-slate-300
                        focus:outline-none
                        focus:ring-2 focus:ring-emerald-400/70
                        focus:border-emerald-300/80
                      "
                      placeholder="••••••••"
                    />
                  </div>

                  <div class="flex items-start gap-2 text-xs sm:text-sm">
                    <input
                      id="terms"
                      type="checkbox"
                      class="mt-0.5 h-3 w-3 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/60"
                    />
                    <label for="terms" class="text-slate-200/90">
                      J'accepte que mon oie puisse faire des bêtises et les conditions d'utilisation.
                    </label>
                  </div>

                  <button
                    type="submit"
                    class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500/90 text-slate-950 text-sm sm:text-base font-semibold py-2.5 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/25"
                  >
                    <span>Créer mon oie</span>
                    <span>🦢</span>
                  </button>
                </form>

                <!-- Séparateur -->
                <div class="flex items-center gap-3 text-[0.7rem] text-slate-500">
                  <div class="h-px flex-1 bg-slate-800"></div>
                  <span>ou</span>
                  <div class="h-px flex-1 bg-slate-800"></div>
                </div>

                <button
                  type="button"
                  class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/80 text-xs sm:text-sm text-slate-100 py-2.5 hover:bg-slate-800 transition-colors"
                >
                  <span class="text-lg">🪙</span>
                  <span>Continuer avec Google</span>
                </button>

                <div class="text-center text-xs sm:text-sm text-slate-300">
                  <p>
                    Tu as déjà une oie ?
                    <a
                      href="/login"
                      data-nav
                      class="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline"
                    >
                      Se connecter
                    </a>
                  </p>
                  <p class="mt-1 text-[0.7rem] text-slate-500">
                    Ton honk pourra toujours être entendu, même si tu perds un match de Pong.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
}

export function setupRegister() {
  const form = document.getElementById('registrationForm') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      const formData = new FormData(form);
      const dataToSend = {
          username: formData.get('username'), 
          email: formData.get('email'),
          password: formData.get('password'), 
      };

      try {
          // APPEL SIMPLIFIÉ
          const result = await api.post('/register', dataToSend);
          
          console.log('Inscription réussie !', result);
          alert('Inscription réussie !');
          window.location.href = '/login';
      } catch (error: any) {
          // L'erreur est déjà formatée par notre ApiClient
          alert('Erreur : ' + error.message);
      }
  });
}