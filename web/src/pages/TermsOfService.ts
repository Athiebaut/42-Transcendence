import { t } from "../i18n";

export default function TermsOfService(): string {
  const lastUpdated = "Avril 2024";

  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden bg-slate-950 text-slate-100">
      <div class="pointer-events-none absolute inset-0 opacity-60">
        <div class="absolute -top-36 -left-32 w-80 h-80 bg-emerald-400/25 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-36 w-96 h-96 bg-rose-500/15 rounded-full blur-[120px]"></div>
      </div>

      <header class="relative z-10 px-4 sm:px-6 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <a href="/" data-nav class="inline-flex items-center text-sm text-emerald-300 hover:text-emerald-200">
          ← Retour à l'accueil
        </a>
        <nav class="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
          <a href="/play" data-nav class="hover:text-white transition-colors">
            ${t("nav.playModes")}
          </a>
          <span class="hidden sm:inline text-slate-700">•</span>
          <a href="/profile" data-nav class="hover:text-white transition-colors">
            ${t("nav.profile")}
          </a>
        </nav>
      </header>

      <main class="relative z-10 flex-1 px-4 sm:px-6 pb-16 pt-10">
        <section class="max-w-5xl mx-auto text-center space-y-3">
          <p class="uppercase text-xs tracking-[0.3em] text-emerald-300/80">Legal</p>
          <h1 class="text-3xl sm:text-4xl font-bold text-white">Conditions d'utilisation</h1>
          <p class="text-sm text-slate-400">Dernière mise à jour : ${lastUpdated}</p>
          <p class="text-base text-slate-300 max-w-3xl mx-auto">
            En jouant à Honk Village vous acceptez les règles suivantes afin de garantir un environnement
            compétitif, bienveillant et conforme aux exigences scolaires du projet ft_transcendence.
          </p>
        </section>

        <section class="max-w-5xl mx-auto mt-10 space-y-6">
          <article class="glass-panel border border-white/10 rounded-3xl p-6 space-y-3">
            <h2 class="text-2xl font-semibold text-white">1. Comptes et accès</h2>
            <ul class="list-disc pl-6 space-y-1 text-slate-300">
              <li>Un compte Honk Village est lié à votre identité 42 ; les comptes partagés sont interdits.</li>
              <li>Vous devez protéger vos identifiants. Toute activité réalisée avec votre token vous est attribuée.</li>
              <li>Nous pouvons suspendre un compte lors de tentatives d'accès non autorisées ou de fraude.</li>
            </ul>
          </article>

          <article class="glass-panel border border-white/10 rounded-3xl p-6 space-y-3">
            <h2 class="text-2xl font-semibold text-white">2. Conduite en jeu</h2>
            <ul class="list-disc pl-6 space-y-1 text-slate-300">
              <li>Pas de triche : scripts, macros, altération du WebSocket ou désynchronisation volontaire.</li>
              <li>Respect : pas de propos haineux dans le chat temps réel ni de pseudo offensant.</li>
              <li>Fair-play : l'abandon répété ou les AFK prolongés peuvent mener à un bannissement de ladder.</li>
            </ul>
          </article>

          <article class="glass-panel border border-white/10 rounded-3xl p-6 space-y-3">
            <h2 class="text-2xl font-semibold text-white">3. Contenus et propriété</h2>
            <p class="text-slate-300">
              Le code, les assets graphiques et les éléments 3D de la village map appartiennent à l'équipe projet.
              Vous conservez la propriété de vos créations (avatars personnalisés), mais nous disposons d'une licence
              limitée pour les afficher en jeu.
            </p>
          </article>

          <article class="glass-panel border border-white/10 rounded-3xl p-6 space-y-3">
            <h2 class="text-2xl font-semibold text-white">4. Disponibilité du service</h2>
            <p class="text-slate-300">
              Le service est fourni “tel quel”. Des maintenances ou coupures réseau peuvent survenir pendant les tests.
              Nous mettons nos meilleurs oisillons pour maintenir le cluster Docker, mais nous ne garantissons pas un uptime continu.
            </p>
          </article>

          <article class="glass-panel border border-white/10 rounded-3xl p-6 space-y-3">
            <h2 class="text-2xl font-semibold text-white">5. Résolution des litiges</h2>
            <p class="text-slate-300">
              En cas de contestation sur un match ou une sanction, ouvrez un ticket via le tableau de bord ou écrivez à
              <a href="mailto:legal@honk.village" class="text-emerald-300 underline">legal@honk.village</a>.
              Les décisions finales sont prises par l'équipe pédagogique encadrant le projet.
            </p>
          </article>
        </section>
      </main>
    </div>
  `;
}
