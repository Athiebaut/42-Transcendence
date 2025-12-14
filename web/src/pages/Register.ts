import { api } from "../services/api";
import { t } from "../i18n";
import { renderHeaderQuickLinks } from "../components/ui/HeaderQuickLinks";
import { startGoogleOAuth } from "../utils/oauth";

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
          <span class="font-semibold tracking-tight">${t("settings.backVillage")}</span>
        </a>

        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          ${renderHeaderQuickLinks("flex items-center gap-3 text-xs sm:text-sm text-slate-300")}
          <nav class="flex items-center gap-3 text-xs sm:text-sm">
            <a
              href="/login"
              data-nav
              class="px-4 py-2 rounded-full border border-white/20 bg-black/30 text-xs font-medium hover:bg-white/10 transition-colors"
            >
              ${t("login.button")}
            </a>
          </nav>
        </div>
      </header>

      <main class="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-8 flex items-center">
        <div class="w-full max-w-6xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          <div class="space-y-6">
            <div class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs sm:text-sm font-medium bg-black/40 border border-white/10 backdrop-blur">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-slate-100">
                ${t("register.subtitle")}
              </span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              ${t("register.title")}
              <span class="block text-glow mt-1">
                ${t("register.subtitle")}
              </span>
            </h1>

            <p class="text-sm sm:text-base text-slate-200/80 max-w-xl">
              ${t("register.description")}
            </p>

            <div class="grid gap-3 sm:grid-cols-3">
              <p class="flex items-start gap-2 text-sm sm:text-base text-slate-100">
                <span class="mt-0.5">🥇</span>
                <span>
                  ${t("register.benefits.rank")}
                </span>
              </p>
              <p class="flex items-start gap-2 text-sm sm:text-base text-slate-100">
                <span class="mt-0.5">🎭</span>
                <span>
                  ${t("register.benefits.cosmetics")}
                </span>
              </p>
              <p class="flex items-start gap-2 text-sm sm:text-base text-slate-100">
                <span class="mt-0.5">🧑‍🤝‍🧑</span>
                <span>
                  ${t("register.benefits.friends")}
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
                    ${t("register.title")}
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-300">
                    ${t("register.subtitle")}
                  </p>
                </div>

                <form class="space-y-4" id="registrationForm" novalidate method="post" action="/register">
                  <div class="space-y-1">
                    <label
                      for="username"
                      class="block text-xs font-medium text-slate-200/90 tracking-wide"
                    >
                      ${t("form.username")}
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
                      placeholder="${t("form.placeholder.username")}"
                    />
                  </div>

                  <div class="space-y-1">
                    <label
                      for="email"
                      class="block text-xs font-medium text-slate-200/90 tracking-wide"
                    >
                      ${t("form.email")}
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
                      placeholder="${t("form.placeholder.email")}"
                    />
                  </div>

                  <div class="space-y-1">
                    <label
                      for="password"
                      class="block text-xs font-medium text-slate-200/90 tracking-wide"
                    >
                      ${t("form.password")}
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
                      ${t("form.password.confirm")}
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
                      ${t("register.terms")}
                    </label>
                  </div>

                  <button
                    type="submit"
                    class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500/90 text-slate-950 text-sm sm:text-base font-semibold py-2.5 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/25"
                  >
                    <span>${t("register.button")}</span>
                    <span>🦢</span>
                  </button>
                </form>

                <!-- Séparateur -->
                <div class="flex items-center gap-3 text-[0.7rem] text-slate-500">
                  <div class="h-px flex-1 bg-slate-800"></div>
                  <span>${t("shared.or")}</span>
                  <div class="h-px flex-1 bg-slate-800"></div>
                </div>

                <button
                  id="register-google-btn"
                  type="button"
                  class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/80 text-xs sm:text-sm text-slate-100 py-2.5 hover:bg-slate-800 transition-colors"
                >
                  <span class="text-lg">🪙</span>
                  <span>${t("register.social.google")}</span>
                </button>

                <div class="text-center text-xs sm:text-sm text-slate-300">
                  <p>
                    ${t("register.haveAccount")}
                    <a
                      href="/login"
                      data-nav
                      class="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline"
                    >
                      ${t("register.haveAccountLink")}
                    </a>
                  </p>
                  <p class="mt-1 text-[0.7rem] text-slate-500">
                    ${t("register.helper")}
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
  const googleBtn = document.getElementById("register-google-btn") as HTMLButtonElement | null;
  if (!form) return;

  form.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      const formData = new FormData(form);
      const dataToSend = {
          username: formData.get('username'), 
          email: formData.get('email'),
          password: formData.get('password'),
          passwordConfirm: formData.get('password_confirm'),
      };

      try {
          // APPEL SIMPLIFIÉ
          const result = await api.post('/register', dataToSend);
          
          console.log(t("register.alert.success"), result);
          alert(t("register.alert.success"));
          window.location.href = '/login';
      } catch (error: any) {
      alert(t("register.alert.error", { message: error?.message ?? "?" }));
  }
  });

  googleBtn?.addEventListener("click", () => {
    startGoogleOAuth("/dashboard");
  });
}

export function registerWithGoogle() {
  startGoogleOAuth("/dashboard");
}
