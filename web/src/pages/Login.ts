export default function Login(): string {
  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden">
      <!-- Fond ambiance village / halos de lumière -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <!-- HEADER -->
      <header
        class="relative z-10 px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur"
      >
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
            href="/register"
            data-nav
            class="px-4 py-2 rounded-full border border-white/20 bg-black/30 text-xs font-medium hover:bg-white/10 transition-colors"
          >
            Créer un compte
          </a>
        </nav>
      </header>

      <!-- CONTENU -->
      <main class="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-8 flex items-center">
        <div
          class="w-full max-w-6xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center"
      >
          <!-- Colonne gauche : texte -->
          <div class="space-y-6">
            <div class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs sm:text-sm font-medium bg-black/40 border border-white/10 backdrop-blur">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-slate-100">
                Le village ne dort jamais, ton classement non plus.
              </span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Bienvenue de retour,
              <span class="block text-glow mt-1">
                le village n'attend que ton honk.
              </span>
            </h1>

            <p class="text-sm sm:text-base text-slate-200/80 max-w-xl">
              Connecte-toi pour retrouver ton oie, ton classement, ton historique de parties,
              et toutes les bêtises que tu as déjà laissées derrière toi.
            </p>

            <div class="mt-6 space-y-3">
              <p class="font-semibold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                <span class="text-lg">🏅</span>
                <span>Pourquoi te connecter ?</span>
              </p>

              <div class="grid gap-3 sm:grid-cols-3">
                <p class="flex items-start gap-2 text-sm sm:text-base text-slate-100">
                  <span class="mt-0.5">📊</span>
                  <span>
                    Retrouve ton classement et ta progression au sein du village.
                  </span>
                </p>
                <p class="flex items-start gap-2 text-sm sm:text-base text-slate-100">
                  <span class="mt-0.5">🧑‍🤝‍🧑</span>
                  <span>
                    Rejoins tes amis directement dans leurs parties en cours.
                  </span>
                </p>
                <p class="flex items-start gap-2 text-sm sm:text-base text-slate-100">
                  <span class="mt-0.5">🎨</span>
                  <span>
                    Accède à tes cosmétiques d'oie débloqués au fil des matchs.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Colonne droite : card de login -->
          <div class="relative">
            <div
              class="relative glass-panel card-shadow rounded-2xl overflow-hidden"
            >
              <!-- Liserés lumineux -->
              <div class="pointer-events-none absolute inset-0">
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/15 blur-3xl"></div>
                <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-500/15 blur-3xl"></div>
              </div>

              <div class="relative p-6 sm:p-8 space-y-6">
                <div class="space-y-2 text-center sm:text-left">
                  <h2 class="text-xl sm:text-2xl font-semibold tracking-tight">
                    Connexion au village
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-300">
                    Entre tes identifiants pour retrouver ton oie.
                  </p>
                </div>

                <!-- Formulaire -->
                <form class="space-y-4">
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
                      placeholder="toi@honk.fr"
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
                      autocomplete="current-password"
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

                  <div class="flex items-center justify-between text-xs sm:text-sm">
                    <label class="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        class="h-3 w-3 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/60"
                      />
                      <span class="text-slate-200/90">Rester connecté·e</span>
                    </label>

                    <button
                      type="button"
                      class="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>

                  <button
                    type="submit"
                    class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500/90 text-slate-950 text-sm sm:text-base font-semibold py-2.5 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/25"
                  >
                    <span>Se connecter</span>
                    <span>🦢</span>
                  </button>
                </form>

                <!-- Séparateur -->
                <div class="flex items-center gap-3 text-[0.7rem] text-slate-500">
                  <div class="h-px flex-1 bg-slate-800"></div>
                  <span>ou</span>
                  <div class="h-px flex-1 bg-slate-800"></div>
                </div>

                <!-- Bouton Google -->
                <button
                  type="button"
                  class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/80 text-xs sm:text-sm text-slate-100 py-2.5 hover:bg-slate-800 transition-colors"
                >
                  <span class="text-lg">🪙</span>
                  <span>Continuer avec Google</span>
                </button>

                <div class="text-center text-xs sm:text-sm text-slate-300">
                  <p>
                    Pas encore d'oie ?
                    <a
                      href="/register"
                      data-nav
                      class="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline"
                    >
                      Créer un compte
                    </a>
                  </p>
                  <p class="mt-1 text-[0.7rem] text-slate-500">
                    En te connectant, tu acceptes que l'oie puisse
                    parfois faire des bêtises sur ton interface.
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
