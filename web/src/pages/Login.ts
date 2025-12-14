import { userService } from "../services/userService";
import { api } from "../services/api";
import { t } from "../i18n";
import { renderHeaderQuickLinks } from "../components/ui/HeaderQuickLinks";
import { startGoogleOAuth } from "../utils/oauth";
import { applyFormApiError, clearFormErrors } from "../services/helper.ts";

clearFormErrors(["email", "password", "passwordConfirm"], "error-global")

const loginReasons = [
  { icon: "🏅", textKey: "login.reasons.rank" },
  { icon: "🧑‍🤝‍🧑", textKey: "login.reasons.friends" },
  { icon: "🎨", textKey: "login.reasons.cosmetics" },
];

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
          <span class="font-semibold tracking-tight">${t("settings.backVillage")}</span>
        </a>

        <div class="flex flex-col items-end gap-2 text-xs text-right">
          ${renderHeaderQuickLinks("flex items-center gap-3 text-xs sm:text-sm text-slate-300")}
          <div class="hidden sm:flex flex-col items-end">
            <span class="uppercase tracking-[0.25em] text-slate-500">
              ${t("shared.modeChoice.label")}
            </span>
            <span class="text-slate-400">
              ${t("shared.modeChoice.helper")}
            </span>
          </div>
        </div>
      </header>

      <div class="relative z-10 w-full max-w-5xl mx-auto px-4 py-10">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          
          <!-- Colonne gauche : texte “marketing” façon Wolfy -->
          <div class="space-y-6">
            <p
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs sm:text-[0.7rem] font-medium bg-black/40 border border-white/10 backdrop-blur"
            >
              <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/60">
                <span class="text-[0.7rem]">🦢</span>
              </span>
              <span class="text-slate-100">
                ${t("login.heroBadge")}
              </span>
            </p>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              ${t("login.title")}
              <span class="block text-glow mt-1">
                ${t("login.heroHighlight")}
              </span>
            </h1>

            <p class="text-sm sm:text-base text-slate-200/80 max-w-xl">
              ${t("login.description")}
            </p>

            <div class="space-y-3 text-sm">
              <p class="font-semibold text-slate-100 flex items-center gap-2">
                <span class="text-lg">📊</span>
                <span>${t("login.reasons.title")}</span>
              </p>

              <ul class="space-y-2 text-sm text-slate-200/80">
                ${loginReasons
                  .map(
                    (reason) => `
                      <li class="flex items-start gap-2">
                        <span class="mt-0.5">${reason.icon}</span>
                        <span>${t(reason.textKey)}</span>
                      </li>
                    `
                  )
                  .join("")}
              </ul>
            </div>
          </div>

          <!-- Colonne droite : card de login -->
          <div class="relative">
            <div
              class="relative bg-slate-950/85 border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden"
            >
              <!-- Liserés lumineux -->
              <div class="pointer-events-none absolute inset-0">
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/15 blur-3xl"></div>
                <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-500/15 blur-3xl"></div>
              </div>

              <div class="relative p-6 sm:p-8 space-y-6">
                <div class="space-y-2 text-center sm:text-left">
                  <h2 class="text-xl sm:text-2xl font-semibold tracking-tight">
                    ${t("login.title")}
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-300">
                    ${t("login.subtitle")}
                  </p>
                </div>

                <!-- Formulaire -->
                <form class="space-y-4" id="loginForm">
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
                      class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-400/80"
                      placeholder="${t("login.placeholder.email")}"
                      required
                    />
                    <p id="error-email" class="text-xs text-red-300"></p>
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
                      autocomplete="current-password"
                      class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-400/80"
                      placeholder="${t("login.placeholder.password")}"
                      required
                    />
                    <p id="error-password" class="text-xs text-red-300"></p>
                  </div>

                  <div class="flex items-center justify-between text-[0.7rem] text-slate-400">
                    <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        class="h-3 w-3 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/60"
                      />
                      <p id="error-passwordConfirm" class="text-xs text-red-300"></p>
                      <span>${t("login.remember")}</span>
                    </label>
                    <button
                      type="button"
                      class="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline"
                    >
                      ${t("login.forgot")}
                    </button>
                    <p id="error-global" class="text-xs text-red-300"></p>
                  </div>

                  <button
                    type="submit"
                    class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 text-slate-950 text-sm font-semibold py-2.5 mt-2 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/25"
                  >
                    <span>${t("login.button")}</span>
                    <span>🦢</span>
                  </button>
                </form>

                <div id="login-2fa-section" class="hidden space-y-3 rounded-2xl border border-emerald-400/30 bg-black/30 p-4">
                  <div>
                    <p class="text-xs uppercase tracking-[0.25em] text-emerald-300">${t("login.2fa.title")}</p>
                    <p class="text-sm text-slate-300 mt-1">${t("login.2fa.subtitle")}</p>
                  </div>
                  <form id="login-2fa-form" class="flex flex-col sm:flex-row gap-3">
                    <input
                      id="login-2fa-code"
                      type="text"
                      inputmode="numeric"
                      pattern="[0-9]{6}"
                      maxlength="6"
                      class="flex-1 rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-400/80"
                      placeholder="${t("login.2fa.placeholder")}"
                      required
                    />
                    <div class="flex gap-2 w-full sm:w-auto">
                      <button type="submit" class="btn-main flex-1 justify-center">${t("login.2fa.confirm")}</button>
                      <button type="button" id="login-2fa-cancel" class="btn-secondary flex-1 justify-center">${t("login.2fa.cancel")}</button>
                    </div>
                  </form>
                </div>

                <!-- Séparateur -->
                <div class="flex items-center gap-3 text-[0.7rem] text-slate-500">
                  <div class="h-px flex-1 bg-slate-800"></div>
                  <span>${t("shared.or")}</span>
                  <div class="h-px flex-1 bg-slate-800"></div>
                </div>

                <!-- Bouton Google -->
                <button
                  id="login-google-btn"
                  type="button"
                  class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900/70 border border-slate-700/80 text-xs sm:text-sm text-slate-100 py-2.5 hover:bg-slate-800 transition-colors"
                >
                  <span class="text-lg">🪙</span>
                  <span>${t("login.social.google")}</span>
                </button>

                <!-- Lien vers inscription -->
                <div class="text-center text-[0.75rem] text-slate-400">
                  <span>${t("register.subtitle")}</span>
                  <a
                    href="/register"
                    data-nav
                    class="font-medium text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline ml-1"
                  >
                    ${t("register.button")}
                  </a>
                </div>

                <!-- Petit message fun -->
                <div class="text-center">
                  <p class="text-[0.7rem] text-slate-500 italic">
                    ${t("login.helper")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function setupLogin() {
  const form = document.getElementById("loginForm") as HTMLFormElement | null;
  const twoFaSection = document.getElementById("login-2fa-section");
  const twoFaForm = document.getElementById("login-2fa-form") as HTMLFormElement | null;
  const twoFaCodeInput = document.getElementById("login-2fa-code") as HTMLInputElement | null;
  const twoFaCancelBtn = document.getElementById("login-2fa-cancel") as HTMLButtonElement | null;
  const googleBtn = document.getElementById("login-google-btn") as HTMLButtonElement | null;

  if (!form) {
    console.error("Login form not found");
    return;
  }

  let pendingTwoFAToken: string | null = null;

  const show2FAStep = (token: string) => {
    pendingTwoFAToken = token;
    twoFaSection?.classList.remove("hidden");
    twoFaCodeInput?.focus();
  };

  const reset2FAStep = () => {
    pendingTwoFAToken = null;
    if (twoFaSection && !twoFaSection.classList.contains("hidden")) {
      twoFaSection.classList.add("hidden");
    }
    if (twoFaCodeInput) {
      twoFaCodeInput.value = "";
      twoFaCodeInput.disabled = false;
    }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const email = (formData.get("email") || "").toString().trim();
    const password = (formData.get("password") || "").toString();

    if (!email || !password) {
      alert("Merci de renseigner votre e-mail et votre mot de passe.");
      return;
    }

    try {
      const result = await api.post<{ token?: string; is2faEnabled?: boolean }>("/login", { 
        LogEmail: email,
        LogPassword: password
      });
      
      if (result?.is2faEnabled) {
        if (result.token) {
          show2FAStep(result.token);
          alert(t("login.2fa.prompt"));
        }
        return;
      }

      if (result?.token) {
        localStorage.setItem("token", result.token);

        // 🆕 RÉCUPÉRER LES INFOS UTILISATEUR
        await userService.fetchProfile();

        window.location.href = "/dashboard";
      }
    } catch (e: unknown) {
      applyFormApiError(e, {
        fieldNames: ["email", "password", "passwordConfirm"],
        globalId: "error-global",
      });
    }
  });

  twoFaForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!twoFaCodeInput) return;
    const code = twoFaCodeInput.value.trim();

    if (!pendingTwoFAToken) {
      alert(t("login.2fa.sessionExpired"));
      reset2FAStep();
      return;
    }

    if (!code) {
      alert(t("login.2fa.codeMissing"));
      return;
    }

    try {
      twoFaCodeInput.disabled = true;
      const response = await fetch("/back_to_back/auth/2fa/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pendingTwoFAToken}`
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Invalid code");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        await userService.fetchProfile();
        window.location.href = "/dashboard";
      } else {
        throw new Error("Missing token after 2FA");
      }
    } catch (error: any) {
      alert(error?.message || t("login.2fa.error"));
    } finally {
      if (twoFaCodeInput) {
        twoFaCodeInput.disabled = false;
        twoFaCodeInput.value = "";
        twoFaCodeInput.focus();
      }
    }
  });

  twoFaCancelBtn?.addEventListener("click", () => {
    reset2FAStep();
  });

  googleBtn?.addEventListener("click", () => {
    startGoogleOAuth("/dashboard");
  });
}
