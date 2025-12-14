import { t } from "../i18n";

type HelpCard = {
  icon: string;
  title: string;
  description: string;
};

export default function Help(): string {
  const helpCards: HelpCard[] = [
    {
      icon: "📚",
      title: "Guide de démarrage",
      description:
        "Paramètre ta raquette, découvre les différents modes et comprends comment fonctionne le classement.",
    },
    {
      icon: "🛡️",
      title: "Sécurité et compte",
      description:
        "Active la double authentification, récupère ton compte et protège tes données personnelles.",
    },
    {
      icon: "💬",
      title: "Support & feedback",
      description:
        "Besoin d'aide ou d'une nouvelle fonctionnalité ? Notre équipe pédagogique répond sous 24h.",
    },
  ];

  const faqItems = [
    {
      question: "Comment rejoindre une partie ?",
      answer:
        "Rends-toi sur /play, choisis un mode puis laisse-toi guider. Tu peux aussi rejoindre un lien d'invitation direct.",
    },
    {
      question: "Puis-je jouer avec mes amis ?",
      answer:
        "Oui. Crée un lobby privé depuis ton profil et partage le lien. Tu peux définir des règles personnalisées.",
    },
    {
      question: "Comment fonctionne le ladder ?",
      answer:
        "Chaque victoire rapporte des points en fonction du mode. Les saisons durent 4 semaines et remettent les rangs à zéro.",
    },
    {
      question: "J'ai détecté un bug, que faire ?",
      answer:
        "Ouvre un ticket via le formulaire ci-dessous ou contacte l'équipe sur Slack #ft_transcendence_support.",
    },
  ];

  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden bg-slate-950 text-slate-100">
      <div class="pointer-events-none absolute inset-0 opacity-60">
        <div class="absolute -top-36 -left-28 w-80 h-80 bg-emerald-400/25 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-36 w-96 h-96 bg-sky-500/20 rounded-full blur-[120px]"></div>
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

      <main class="relative z-10 flex-1 w-full px-4 sm:px-6 pb-14 pt-10 space-y-10">
        <section class="max-w-6xl mx-auto text-center space-y-4">
          <p class="uppercase text-xs tracking-[0.3em] text-emerald-300/80">Centre d'aide</p>
          <h1 class="text-3xl sm:text-4xl font-bold text-white">Besoin d'un coup de patte ?</h1>
          <p class="text-slate-300 max-w-3xl mx-auto">
            Tu trouveras ici les réponses aux questions fréquentes, les bonnes pratiques pour progresser,
            ainsi que les moyens de nous contacter en cas de problème technique.
          </p>
          <div class="glass-panel border border-white/10 rounded-3xl mt-6 flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-5 text-left">
            <div>
              <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Support prioritaire</p>
              <h2 class="text-xl font-semibold text-white mt-1">Nos tuteurs répondent 7j/7</h2>
              <p class="text-sm text-slate-300 mt-2">
                Nous traitons en priorité les urgences liées au ladder et aux comptes. Utilise le formulaire ci-dessous pour accélérer ta prise en charge.
              </p>
            </div>
            <a href="#contact" class="wood-sign-btn px-5 py-2 text-sm font-semibold">
              Contacter l'équipe
            </a>
          </div>
        </section>

        <section class="max-w-6xl mx-auto grid gap-4 sm:grid-cols-3">
          ${helpCards
            .map(
              (card) => `
                <article class="glass-panel border border-white/10 rounded-2xl p-5 text-center space-y-3">
                  <div class="text-3xl">${card.icon}</div>
                  <h2 class="text-lg font-semibold text-white">${card.title}</h2>
                  <p class="text-sm text-slate-300">${card.description}</p>
                </article>
              `
            )
            .join("")}
        </section>

        <section class="max-w-6xl mx-auto glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
          <header class="space-y-1 text-center">
            <p class="text-xs uppercase tracking-[0.25em] text-slate-400">FAQ</p>
            <h2 class="text-2xl font-semibold text-white">Questions fréquentes</h2>
          </header>
          <div class="space-y-4">
            ${faqItems
              .map(
                (faq) => `
                  <article class="border border-white/5 rounded-2xl bg-black/30 p-4">
                    <h3 class="text-sm font-semibold text-white">${faq.question}</h3>
                    <p class="text-sm text-slate-300 mt-1">${faq.answer}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>

        <section id="contact" class="max-w-6xl mx-auto grid gap-6 md:grid-cols-2">
          <article class="glass-panel border border-emerald-400/30 rounded-2xl p-6 space-y-4">
            <div>
              <p class="text-xs uppercase tracking-[0.25em] text-emerald-300">Contact direct</p>
              <h3 class="text-xl font-semibold text-white">Envoyer un ticket</h3>
            </div>
            <p class="text-sm text-slate-200">
              Décris ton problème, joins une capture d'écran et indique ton identifiant Honk Village.
            </p>
            <form class="space-y-3">
              <input type="text" placeholder="Pseudo ou email 42" class="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400/50 focus:outline-none" />
              <textarea rows="4" placeholder="Explique ton souci…" class="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400/50 focus:outline-none"></textarea>
              <button type="submit" class="w-full wood-sign-btn px-4 py-2 text-sm font-semibold">
                Envoyer
              </button>
            </form>
          </article>

          <article class="glass-panel border border-slate-700 rounded-2xl p-6 space-y-4">
            <div>
              <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Autres canaux</p>
              <h3 class="text-xl font-semibold text-white">Nous contacter</h3>
            </div>
            <ul class="space-y-3 text-sm text-slate-300">
              <li>
                📧 <span class="text-white font-medium">support@honk.village</span>
              </li>
              <li>
                💬 Slack #ft_transcendence_support
              </li>
              <li>
                🕒 Disponibles du lundi au vendredi, 10h – 20h
              </li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  `;
}
