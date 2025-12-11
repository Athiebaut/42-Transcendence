import { t } from "../i18n";

export default function ProfileSettings(): string {
  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-32 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <header class="relative z-10 px-4 sm:px-6 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <a href="/" data-nav class="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors text-sm">
          <span class="text-lg">🦢</span>
          <span class="font-semibold tracking-tight">${t("settings.backVillage")}</span>
        </a>

        <div class="hidden sm:flex flex-col items-center text-xs text-slate-400">
          <span class="uppercase tracking-[0.25em] text-slate-500">
            ${t("header.settings.label")}
          </span>
          <span>${t("header.settings.helper")}</span>
        </div>

        <nav class="flex items-center gap-3 text-xs sm:text-sm text-slate-300 justify-end">
          <a href="/play" data-nav class="hover:text-white transition-colors">${t("nav.playModes")}</a>
          <span class="hidden sm:inline text-slate-700">•</span>
          <a href="/profil" data-nav class="hover:text-white transition-colors">${t("nav.profile")}</a>
        </nav>
      </header>

      <main class="relative z-10 flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <div class="max-w-6xl mx-auto space-y-8">
          <section class="space-y-3">
            <p class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs text-slate-200">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>${t("profile.settings")}</span>
            </p>
            <h1 class="text-3xl sm:text-4xl font-bold text-white">${t("profile.subtitle")}</h1>
            <p class="text-sm sm:text-base text-slate-200/80 max-w-2xl">
              ${t("profile.settings.heroDesc")}
            </p>
          </section>

          <div class="grid gap-6 md:grid-cols-2">
            <article class="glass-panel card-shadow rounded-2xl p-6 space-y-4">
              <header class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-emerald-200 uppercase tracking-[0.3em]">${t("settings.identity")}</p>
                  <h2 class="text-xl font-semibold text-white">${t("settings.identity")}</h2>
                </div>
                <span class="text-2xl">🪶</span>
              </header>
              <form class="space-y-4">
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  ${t("form.username")}
                  <input type="text" name="username" class="w-full rounded-lg border border-[#d4c4a0]/70 bg-[#3a5548]/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300" placeholder="${t("profile.settings.placeholder.username")}" />
                </label>
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  ${t("form.email")}
                  <input type="email" name="email" class="w-full rounded-lg border border-[#d4c4a0]/70 bg-[#3a5548]/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300" placeholder="${t("profile.settings.placeholder.email")}" />
                </label>
                <button type="button" class="btn-main w-full justify-center">${t("form.save")}</button>
              </form>
            </article>

            <article class="glass-panel card-shadow rounded-2xl p-6 space-y-4">
              <header class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-amber-200 uppercase tracking-[0.3em]">${t("settings.password")}</p>
                  <h2 class="text-xl font-semibold text-white">${t("settings.password")}</h2>
                </div>
                <span class="text-2xl">🔒</span>
              </header>
              <form class="space-y-4">
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  ${t("form.password.current")}
                  <input type="password" class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300" placeholder="••••••••" />
                </label>
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  ${t("form.password.new")}
                  <input type="password" class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300" placeholder="••••••••" />
                </label>
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  ${t("form.password.confirm")}
                  <input type="password" class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300" placeholder="••••••••" />
                </label>
                <button type="button" class="btn-main w-full justify-center bg-amber-400/90 text-slate-950 hover:bg-amber-300">${t("form.update")}</button>
              </form>
            </article>

            <article class="glass-panel card-shadow rounded-2xl p-6 space-y-4">
              <header class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-sky-200 uppercase tracking-[0.3em]">${t("settings.avatar")}</p>
                  <h2 class="text-xl font-semibold text-white">${t("settings.avatar")}</h2>
                </div>
                <span class="text-2xl">🎭</span>
              </header>
              <div class="flex items-center gap-4">
                <div class="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-amber-300 flex items-center justify-center text-3xl shadow-lg">🦢</div>
                <div class="text-xs text-slate-300">
                  <p>${t("profile.settings.avatarHint")}</p>
                  <p class="text-slate-500 mt-1">${t("profile.settings.avatarFormats")}</p>
                </div>
              </div>
              <label class="block text-xs font-medium text-slate-200/80">
                ${t("profile.settings.uploadLabel")}
                <input type="file" class="mt-1 w-full rounded-lg border border-dashed border-slate-600 bg-black/30 px-3 py-5 text-center text-slate-300 focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300" />
              </label>
              <div class="flex gap-3">
                <button type="button" class="btn-main flex-1 justify-center">${t("form.upload")}</button>
                <button type="button" class="btn-secondary flex-1 justify-center text-center">${t("form.reset")}</button>
              </div>
            </article>

            <article class="glass-panel card-shadow rounded-2xl p-6 space-y-4">
              <header class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-emerald-200 uppercase tracking-[0.3em]">${t("settings.2fa")}</p>
                  <h2 class="text-xl font-semibold text-white">${t("settings.2fa")}</h2>
                </div>
                <span class="text-2xl">🛡️</span>
              </header>
              <p class="text-sm text-slate-300">
                ${t("profile.settings.2faDescription")}
              </p>
              <div class="flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3">
                <div class="text-xs text-slate-200">
                  <p class="font-semibold">${t("profile.settings.2faStatus")} <span class="text-emerald-300">${t("profile.settings.2faDisabled")}</span></p>
                  <p class="text-slate-400 mt-1">${t("profile.settings.2faLastChange")}</p>
                </div>
                <button type="button" class="btn-main">${t("profile.settings.2faEnable")}</button>
              </div>
              <button type="button" class="btn-secondary w-full justify-center">${t("profile.settings.2faKeep")}</button>
            </article>
          </div>
        </div>
      </main>
    </div>
  `;
}
