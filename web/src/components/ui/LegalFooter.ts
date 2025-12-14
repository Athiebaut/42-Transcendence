// web/src/components/ui/LegalFooter.ts

export default function LegalFooter(): string {
  const currentYear = new Date().getFullYear();

  return `
    <footer class="border-t border-slate-800/80 bg-slate-950/70 backdrop-blur py-4 px-5 text-[0.7rem] sm:text-xs text-slate-300">
      <div class="max-w-6xl mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
        <div class="flex items-center justify-center sm:justify-start gap-2 text-slate-200">
          <span class="text-base">🦢</span>
          <span class="font-semibold tracking-tight uppercase text-white">Honk Village</span>
          <span class="text-slate-600 hidden sm:inline">•</span>
          <span class="text-slate-500 hidden sm:inline">ft_transcendence — Projet 42</span>
        </div>

        <div class="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1">
          <a
            href="/help"
            class="hover:text-white transition-colors"
            data-i18n="home.footer.help"
          >
            Centre d'aide
          </a>
          <a
            href="/privacy-policy"
            data-nav
            class="hover:text-white transition-colors"
          >
            Politique de confidentialité
          </a>
          <a
            href="/terms-of-service"
            data-nav
            class="hover:text-white transition-colors"
          >
            Conditions d'utilisation
          </a>
          <span data-i18n="home.footer.copy" data-i18n-vars='{"year":"${currentYear}"}'>
            © ${currentYear} — Toutes oies réservées
          </span>
        </div>
      </div>
    </footer>
  `;
}
