import { renderHeaderQuickLinks } from "../components/ui/HeaderQuickLinks";

export default function PrivacyPolicy(): string {
  const lastUpdated = "Avril 2024";

  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden bg-slate-950 text-slate-100">
      <div class="pointer-events-none absolute inset-0 opacity-60">
        <div class="absolute -top-36 -left-32 w-80 h-80 bg-emerald-400/25 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-36 w-96 h-96 bg-sky-500/20 rounded-full blur-[120px]"></div>
      </div>

      <header class="relative z-10 px-4 sm:px-6 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <a href="/" data-nav class="inline-flex items-center text-sm text-emerald-300 hover:text-emerald-200">
          ← Retour à l'accueil
        </a>
        ${renderHeaderQuickLinks("flex items-center gap-3 text-xs sm:text-sm text-slate-300")}
      </header>

      <main class="relative z-10 flex-1 px-4 sm:px-6 pb-16 pt-10">
        <section class="max-w-5xl mx-auto text-center space-y-3">
          <p class="uppercase text-xs tracking-[0.3em] text-emerald-300/80">Legal</p>
          <h1 class="text-3xl sm:text-4xl font-bold text-white">Politique de confidentialité</h1>
          <p class="text-sm text-slate-400">Dernière mise à jour : ${lastUpdated}</p>
          <p class="text-base text-slate-300 max-w-3xl mx-auto">
            Cette politique décrit la manière dont Honk Village (projet ft_transcendence) collectera,
            utilisera et protégera vos données lorsque vous créez un compte, jouez à Pong ou utilisez
            les fonctionnalités sociales du village.
          </p>
        </section>

        <section class="max-w-5xl mx-auto mt-10 space-y-6">
          <article class="glass-panel border border-white/10 rounded-3xl p-6 space-y-3">
            <h2 class="text-2xl font-semibold text-white">1. Données collectées</h2>
            <p class="text-slate-300">
              Nous collectons uniquement les informations nécessaires pour faire fonctionner le jeu et
              assurer la sécurité :
            </p>
            <ul class="list-disc pl-6 space-y-1 text-slate-300">
              <li>Identifiants de compte : adresse e-mail 42, pseudo affiché, avatar et préférences.</li>
              <li>Données de jeu : historique des matchs, ladder, paramètres de raquette et configuration du ping.</li>
              <li>Signaux techniques : adresse IP publique, empreinte de navigateur et tokens utilisés pour sécuriser l'API.</li>
              <li>Cookies locaux : uniquement pour maintenir votre session et vos préférences linguistiques.</li>
            </ul>
          </article>

          <article class="glass-panel border border-white/10 rounded-3xl p-6 space-y-3">
            <h2 class="text-2xl font-semibold text-white">2. Utilisation des données</h2>
            <p class="text-slate-300">
              Les données sont utilisées pour :
            </p>
            <ul class="list-disc pl-6 space-y-1 text-slate-300">
              <li>Authentifier les joueurs et synchroniser leur progression cross-device.</li>
              <li>Détecter les comportements anormaux (multi-comptes, scripts, latence volontaire).</li>
              <li>Fournir les fonctionnalités communautaires : liste d'amis, temps réel sur le dashboard, messages du village.</li>
              <li>Analyser des métriques anonymisées pour équilibrer les modes de jeu.</li>
            </ul>
          </article>

          <article class="glass-panel border border-white/10 rounded-3xl p-6 space-y-3">
            <h2 class="text-2xl font-semibold text-white">3. Partage et conservation</h2>
            <p class="text-slate-300">
              Les données sont hébergées sur l'infrastructure du projet (Docker + Postgres auto-hébergé).
              Nous ne vendons ni ne louons aucune information. L'accès est limité aux membres de l'équipe projet.
            </p>
            <p class="text-slate-300">
              Les journaux techniques sont conservés 30 jours pour la sécurité. Les comptes inactifs plus de
              12 mois sont anonymisés lors de la purge des saisons.
            </p>
          </article>

          <article class="glass-panel border border-white/10 rounded-3xl p-6 space-y-3">
            <h2 class="text-2xl font-semibold text-white">4. Vos droits</h2>
            <ul class="list-disc pl-6 space-y-1 text-slate-300">
              <li>Accès : exportez vos données depuis les paramètres de profil.</li>
              <li>Rectification : vous pouvez modifier pseudo, avatar et paramètres depuis le dashboard.</li>
              <li>Suppression : envoyez une demande via le support pour anonymiser/détruire vos données.</li>
              <li>Opposition : désactivez à tout moment les notifications e-mail ou les analytics anonymes.</li>
            </ul>
          </article>

          <article class="glass-panel border border-white/10 rounded-3xl p-6 space-y-3">
            <h2 class="text-2xl font-semibold text-white">5. Contact</h2>
            <p class="text-slate-300">
              Pour toute question ou demande RGPD, contactez l'équipe à
              <a href="mailto:privacy@honk.village" class="text-emerald-300 underline">privacy@honk.village</a>
              ou directement via le canal intra du projet.
            </p>
          </article>
        </section>
      </main>
    </div>
  `;
}
