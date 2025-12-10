export default function ProfileSettings(): string {
  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-32 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <header class="relative z-10 px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <a href="/" data-nav class="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors text-sm">
          <span class="text-lg">🦢</span>
          <span class="font-semibold tracking-tight">Retour au village</span>
        </a>

        <nav class="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
          <a href="/dashboard" data-nav class="hover:text-white transition-colors">Tableau de bord</a>
          <span class="text-slate-600">•</span>
          <a href="/play" data-nav class="hover:text-white transition-colors">Modes de jeu</a>
        </nav>
      </header>

      <main class="relative z-10 flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <div class="max-w-6xl mx-auto space-y-8">
          <section class="space-y-3">
            <p class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs text-slate-200">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Paramètres du profil</span>
            </p>
            <h1 class="text-3xl sm:text-4xl font-bold text-white">Garde ton oie bien apprêtée</h1>
            <p class="text-sm sm:text-base text-slate-200/80 max-w-2xl">
              Mets à jour ton identité dans le village, renforce la sécurité et personnalise l'apparence de ton oie sans quitter l'étang.
            </p>
          </section>

          <div class="grid gap-6 md:grid-cols-2">
            <article class="glass-panel card-shadow rounded-2xl p-6 space-y-4">
              <header class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-emerald-200 uppercase tracking-[0.3em]">Identité</p>
                  <h2 class="text-xl font-semibold text-white">Nom d'oie & e-mail</h2>
                </div>
                <span class="text-2xl">🪶</span>
              </header>
              <form class="space-y-4">
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  Nom d'utilisateur
                  <input type="text" name="username" class="w-full rounded-lg border border-[#d4c4a0]/70 bg-[#3a5548]/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300" placeholder="MaîtreHonk" />
                </label>
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  Adresse e-mail
                  <input type="email" name="email" class="w-full rounded-lg border border-[#d4c4a0]/70 bg-[#3a5548]/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300" placeholder="toi@honk.fr" />
                </label>
                <button type="button" class="btn-main w-full justify-center">Enregistrer</button>
              </form>
            </article>

            <article class="glass-panel card-shadow rounded-2xl p-6 space-y-4">
              <header class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-amber-200 uppercase tracking-[0.3em]">Secret</p>
                  <h2 class="text-xl font-semibold text-white">Mot de passe</h2>
                </div>
                <span class="text-2xl">🔒</span>
              </header>
              <form class="space-y-4">
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  Mot de passe actuel
                  <input type="password" class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300" placeholder="••••••••" />
                </label>
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  Nouveau mot de passe
                  <input type="password" class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300" placeholder="••••••••" />
                </label>
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  Confirmation
                  <input type="password" class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300" placeholder="••••••••" />
                </label>
                <button type="button" class="btn-main w-full justify-center bg-amber-400/90 text-slate-950 hover:bg-amber-300">Mettre à jour</button>
              </form>
            </article>

            <article class="glass-panel card-shadow rounded-2xl p-6 space-y-4">
              <header class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-sky-200 uppercase tracking-[0.3em]">Apparence</p>
                  <h2 class="text-xl font-semibold text-white">Avatar</h2>
                </div>
                <span class="text-2xl">🎭</span>
              </header>
              <div class="flex items-center gap-4">
                <div class="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-amber-300 flex items-center justify-center text-3xl shadow-lg">🦢</div>
                <div class="text-xs text-slate-300">
                  <p>Affiche ton humeur du jour ou ta dernière victoire.</p>
                  <p class="text-slate-500 mt-1">PNG/JPG, 2 Mo max.</p>
                </div>
              </div>
              <label class="block text-xs font-medium text-slate-200/80">
                Importer un fichier
                <input type="file" class="mt-1 w-full rounded-lg border border-dashed border-slate-600 bg-black/30 px-3 py-5 text-center text-slate-300 focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300" />
              </label>
              <div class="flex gap-3">
                <button type="button" class="btn-main flex-1 justify-center">Téléverser</button>
                <button type="button" class="btn-secondary flex-1 justify-center text-center">Réinitialiser</button>
              </div>
            </article>

            <article class="glass-panel card-shadow rounded-2xl p-6 space-y-4">
              <header class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-emerald-200 uppercase tracking-[0.3em]">Sécurité</p>
                  <h2 class="text-xl font-semibold text-white">Double authentification</h2>
                </div>
                <span class="text-2xl">🛡️</span>
              </header>
              <p class="text-sm text-slate-300">
                Active la protection 2FA pour empêcher les autres oies de s'infiltrer sur ton compte. Tu recevras un QR code à scanner dans ton application d'authentification.
              </p>
              <div class="flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3">
                <div class="text-xs text-slate-200">
                  <p class="font-semibold">État actuel : <span class="text-emerald-300">désactivé</span></p>
                  <p class="text-slate-400 mt-1">Dernier changement : jamais</p>
                </div>
                <button type="button" class="btn-main">Activer</button>
              </div>
              <button type="button" class="btn-secondary w-full justify-center">Je préfère rester comme ça</button>
            </article>
          </div>
        </div>
      </main>
    </div>
  `;
}
