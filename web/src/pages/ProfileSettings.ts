import { t } from "../i18n";
import { api, ApiError } from "../services/api";
import { userService, type User } from "../services/userService";
import { applyFormApiError, clearFormErrors } from "../services/helper.ts";

export default function ProfileSettings(): string {
  const user = userService.getUser();
  const email = user?.email || "";
  const username = user?.username || "";
  const avatarUrl = user?.avatarUrl || "";
  const is2FAEnabled = user?.isTwoFactorAuthenticationEnabled || false;
  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-32 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <header class="relative z-10 px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <a href="/" data-nav class="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors text-sm">
          <span class="text-lg">🦢</span>
          <span class="font-semibold tracking-tight">${t("settings.backVillage")}</span>
        </a>

        <nav class="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
          <a href="/profile" data-nav class="hover:text-white transition-colors">${t("nav.profile")}</a>
          <span class="text-slate-600">•</span>
          <a href="/play" data-nav class="hover:text-white transition-colors">${t("nav.playModes")}</a>
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
            <!-- Formulaire Identité -->
            <article class="glass-panel card-shadow rounded-2xl p-6 space-y-4">
              <header class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-emerald-200 uppercase tracking-[0.3em]">${t("settings.identity")}</p>
                  <h2 class="text-xl font-semibold text-white">${t("settings.identity")}</h2>
                </div>
                <span class="text-2xl">🪶</span>
              </header>
              <form id="profile-identity-form" class="space-y-4">
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  ${t("form.username")}
                  <input type="text" name="username" value="${username}" class="w-full rounded-lg border border-[#d4c4a0]/70 bg-[#3a5548]/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300" placeholder="${t("profile.settings.placeholder.username")}" />
                  <p id="error-username" class="text-xs text-red-300"></p>
                </label>
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  ${t("form.email")}
                  <input type="email" name="email" value="${email}" class="w-full rounded-lg border border-[#d4c4a0]/70 bg-[#3a5548]/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300" placeholder="${t("profile.settings.placeholder.email")}" />
                  <p id="error-email" class="text-xs text-red-300"></p>
                </label>
                <p id="error-identity-global" class="text-xs text-red-300"></p>
                <button type="submit" class="btn-main w-full justify-center">${t("form.save")}</button>
              </form>
            </article>

            <!-- Formulaire Mot de passe -->
            <article class="glass-panel card-shadow rounded-2xl p-6 space-y-4">
              <header class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-amber-200 uppercase tracking-[0.3em]">${t("settings.password")}</p>
                  <h2 class="text-xl font-semibold text-white">${t("settings.password")}</h2>
                </div>
                <span class="text-2xl">🔒</span>
              </header>
              <form id="profile-password-form" class="space-y-4">
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  ${t("form.password.current")}
                  <input type="password" name="currentPassword" class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300" placeholder="••••••••" />
                  <p id="error-currentPassword" class="text-xs text-red-300"></p>
                </label>
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  ${t("form.password.new")}
                  <input type="password" name="newPassword" class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300" placeholder="••••••••" />
                  <p id="error-newPassword" class="text-xs text-red-300"></p>
                </label>
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  ${t("form.password.confirm")}
                  <input type="password" name="confirmPassword" class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300" placeholder="••••••••" />
                  <p id="error-confirmPassword" class="text-xs text-red-300"></p>
                </label>
                <button type="submit" class="btn-main w-full justify-center bg-amber-400/90 text-slate-950 hover:bg-amber-300">${t("form.update")}</button>
                <p id="error-password-global" class="text-xs text-red-300"></p>
              </form>
            </article>

            <!-- Formulaire Avatar -->
            <article class="glass-panel card-shadow rounded-2xl p-6 space-y-4">
              <header class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-sky-200 uppercase tracking-[0.3em]">${t("settings.avatar")}</p>
                  <h2 class="text-xl font-semibold text-white">${t("settings.avatar")}</h2>
                </div>
                <span class="text-2xl">🎭</span>
              </header>
              <div class="flex items-center gap-4">
                <div id="avatar-preview" class="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-amber-300 flex items-center justify-center text-3xl shadow-lg overflow-hidden">
                  ${avatarUrl ? `<img src="${avatarUrl}" alt="Avatar" class="w-full h-full object-cover" />` : '🦢'}
                </div>
                <div class="text-xs text-slate-300">
                  <p>${t("profile.settings.avatarHint")}</p>
                  <p class="text-slate-500 mt-1">${t("profile.settings.avatarFormats")}</p>
                </div>
              </div>
              <form id="profile-avatar-form" class="space-y-4">
                <label class="block text-xs font-medium text-slate-200/80">
                  ${t("profile.settings.uploadLabel")}
                  <input type="file" name="avatar" accept="image/png,image/jpeg,image/jpg" class="mt-1 w-full rounded-lg border border-dashed border-slate-600 bg-black/30 px-3 py-5 text-center text-slate-300 focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300" />
                </label>
                <div class="flex gap-3">
                  <button type="submit" class="btn-main flex-1 justify-center">${t("form.upload")}</button>
                  <button type="button" id="reset-avatar-btn" class="btn-secondary flex-1 justify-center text-center">${t("form.reset")}</button>
                  <p id="error-global" class="text-xs text-red-300"></p>
                </div>
              </form>
            </article>

            <!-- Formulaire 2FA -->
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
                  <p class="font-semibold">${t("profile.settings.2faStatus")} <span class="${is2FAEnabled ? 'text-emerald-300' : 'text-rose-300'}" id="2fa-status">${is2FAEnabled ? t("profile.settings.2faEnabled") : t("profile.settings.2faDisabled")}</span></p>
                  <p class="text-slate-400 mt-1">${t("profile.settings.2faLastChange")}</p>
                </div>
                <button type="button" id="toggle-2fa-btn" class="btn-main">${is2FAEnabled ? t("profile.settings.2faDisable") : t("profile.settings.2faEnable")}</button>
              </div>
              <div id="2fa-qr-container" class="hidden">
                <!-- Le QR code sera inséré ici dynamiquement -->
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  `;
}

export function setupProfileSettings() {
  setupIdentityForm();
  setupPasswordForm();
  setupAvatarForm();
  setup2FAToggle();
}

async function fetchToApiError(response: Response): Promise<never> {
  const errorData = await response.json().catch(() => ({}));
  const message =
      (typeof (errorData as any)?.message === "string" && (errorData as any).message) ||
      (typeof (errorData as any)?.error === "string" && (errorData as any).error) ||
      `Erreur ${response.status}`;
  throw new ApiError(message, response.status, errorData);
}

// Gestion du formulaire d'identité (username + email)
function setupIdentityForm() {
  const form = document.getElementById("profile-identity-form") as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearFormErrors(["username", "email"], "error-identity-global");

    const formData = new FormData(form);
    const username = formData.get("username")?.toString().trim();
    const email = formData.get("email")?.toString().trim();

    try {
      const response = await fetch("/back_to_back/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username, email }),
      });

      if (!response.ok) await fetchToApiError(response);

      const result = await response.json();
      if (result.user) localStorage.setItem("user", JSON.stringify(result.user));
      alert(result.message || "Profil mis à jour avec succès !");
    } catch (err: unknown) {
      applyFormApiError(err, {
        fieldNames: ["username", "email"],
        globalId: "error-identity-global",
      });
    }
  });
}
// Gestion du formulaire de mot de passe
function setupPasswordForm() {
  const form = document.getElementById("profile-password-form") as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearFormErrors(["currentPassword", "newPassword", "confirmPassword"], "error-password-global");

    const formData = new FormData(form);
    const currentPassword = formData.get("currentPassword")?.toString();
    const newPassword = formData.get("newPassword")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    try {
      const response = await fetch("/back_to_back/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      if (!response.ok) await fetchToApiError(response);

      const result = await response.json();
      alert(result.message || "Mot de passe mis à jour avec succès !");
      form.reset();
    } catch (err: unknown) {
      applyFormApiError(err, {
        fieldNames: ["currentPassword", "newPassword", "confirmPassword"],
        globalId: "error-password-global",
      });
    }
  });
}

// Gestion du formulaire d'avatar
function setupAvatarForm() {
  const form = document.getElementById("profile-avatar-form") as HTMLFormElement | null;
  const resetBtn = document.getElementById("reset-avatar-btn");
  
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const avatarFile = formData.get("avatar") as File;

    if (!avatarFile || avatarFile.size === 0) {
      alert("Veuillez sélectionner un fichier");
      return;
    }

    if (avatarFile.size > 2 * 1024 * 1024) {
      alert("Le fichier ne doit pas dépasser 2 Mo");
      return;
    }

    try {
      // Utiliser FormData pour l'upload
      const uploadFormData = new FormData();
      uploadFormData.append("avatar", avatarFile);

      const response = await fetch("/back_to_back/profile/avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'upload");
      }

      const result = await response.json();

      // Mettre à jour le localStorage et l'aperçu
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
        updateAvatarPreview(result.user.avatarUrl);
      }

      alert(result.message || "Avatar mis à jour avec succès !");
      form.reset();
    } catch (error: any) {
      alert("Erreur : " + error.message);
    }
  });

  // Bouton de réinitialisation
  resetBtn?.addEventListener("click", async () => {
    if (!confirm("Voulez-vous vraiment réinitialiser votre avatar ?")) return;

    try {
      const result = await api.delete<{ message: string; user: User }>("/profile/avatar");

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
        updateAvatarPreview(null);
      }

      alert(result.message || "Avatar réinitialisé !");
    } catch (error: any) {
      applyFormApiError(error, {
        fieldNames: ["email", "password", "passwordConfirm"],
        globalId: "error-global",
      });
    }
  });
}

// Gestion du toggle 2FA
function setup2FAToggle() {
  const toggleBtn = document.getElementById("toggle-2fa-btn");
  const qrContainer = document.getElementById("2fa-qr-container");

  toggleBtn?.addEventListener("click", async () => {
    // CORRECTION : On utilise userService.getUser() ici aussi
    const user = userService.getUser();
    const is2FAEnabled = user?.isTwoFactorAuthenticationEnabled || false;

    try {
      if (!is2FAEnabled) {
        // Activer 2FA - récupérer le QR code
        const result = await api.get<{ qrCodeUrl: string }>("/auth/2fa/generate");

        if (result.qrCodeUrl && qrContainer) {
          qrContainer.innerHTML = `
            <div class="p-4 bg-white rounded-lg">
              <p class="text-slate-900 text-sm mb-2">Scanne ce QR code avec ton app d'authentification :</p>
              <img src="${result.qrCodeUrl}" alt="QR Code 2FA" class="mx-auto" />
            </div>
          `;
          qrContainer.classList.remove("hidden");
        }

        alert("Scanne le QR code et active la 2FA depuis ton app d'authentification");
      } else {
        // Désactiver 2FA
        if (!confirm("Voulez-vous vraiment désactiver la 2FA ?")) return;

        await api.post("/auth/2fa/disable", {});
        
        alert("2FA désactivée avec succès !");
        window.location.reload();
      }
    } catch (error: any) {
      applyFormApiError(error, {
        fieldNames: ["email", "password", "passwordConfirm"],
        globalId: "error-global",
      });
    }
  });
}

// Helper pour mettre à jour l'aperçu de l'avatar
function updateAvatarPreview(avatarUrl: string | null) {
  const preview = document.getElementById("avatar-preview");
  if (!preview) return;

  if (avatarUrl) {
    preview.innerHTML = `<img src="${avatarUrl}" alt="Avatar" class="w-full h-full object-cover" />`;
  } else {
    preview.innerHTML = "🦢";
  }
}