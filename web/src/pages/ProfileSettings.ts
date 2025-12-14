import { t } from "../i18n";
import { api } from "../services/api";
import { userService, type User } from "../services/userService";
import { renderHeaderQuickLinks } from "../components/ui/HeaderQuickLinks";
import { renderHeaderContextMessage } from "../components/ui/HeaderContextMessage";

export default function ProfileSettings(): string {
  const user = userService.getUser();
  const username = user?.username || "";
  const email = user?.email || "";
  const avatarUrl = user?.avatarUrl || "";
  const is2FAEnabled = user?.isTwoFactorAuthenticationEnabled || false;

  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-32 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <header class="relative z-10 px-4 sm:px-6 py-4 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <div class="relative w-full">
          ${renderHeaderContextMessage("header.profileSettings.title", "header.profileSettings.subtitle")}
          <div class="flex flex-wrap items-center gap-3 w-full">
            <div class="flex items-center gap-2">
              <a href="/" data-nav class="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors text-sm">
                <span class="text-lg">🦢</span>
                <span class="font-semibold tracking-tight">${t("settings.backVillage")}</span>
              </a>
            </div>
            <div class="ml-auto flex items-center gap-3 justify-end w-full sm:w-auto">
              ${renderHeaderQuickLinks()}
            </div>
          </div>
        </div>
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
                </label>
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  ${t("form.email")}
                  <input type="email" name="email" value="${email}" class="w-full rounded-lg border border-[#d4c4a0]/70 bg-[#3a5548]/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300" placeholder="${t("profile.settings.placeholder.email")}" />
                </label>
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
                </label>
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  ${t("form.password.new")}
                  <input type="password" name="newPassword" class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300" placeholder="••••••••" />
                </label>
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  ${t("form.password.confirm")}
                  <input type="password" name="confirmPassword" class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300" placeholder="••••••••" />
                </label>
                <button type="submit" class="btn-main w-full justify-center bg-amber-400/90 text-slate-950 hover:bg-amber-300">${t("form.update")}</button>
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
              <div id="2fa-qr-section" class="hidden space-y-3 rounded-2xl border border-emerald-400/30 bg-black/20 p-4">
                <p class="text-sm text-slate-200">${t("profile.settings.2faScanInstructions")}</p>
                <div id="2fa-qr-container" class="flex justify-center"></div>
                <form id="2fa-confirm-form" class="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="2fa-code-input"
                    type="text"
                    inputmode="numeric"
                    pattern="[0-9]{6}"
                    maxlength="6"
                    class="flex-1 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-400/60 focus:outline-none"
                    placeholder="${t("profile.settings.2faCodePlaceholder")}"
                  />
                  <div class="flex gap-2 w-full sm:w-auto">
                    <button type="submit" id="2fa-confirm-btn" class="btn-main flex-1 justify-center">${t("profile.settings.2faConfirm")}</button>
                    <button type="button" id="2fa-cancel-btn" class="btn-secondary flex-1 justify-center">${t("profile.settings.2faCancel")}</button>
                  </div>
                </form>
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

// Gestion du formulaire d'identité (username + email)
function setupIdentityForm() {
  const form = document.getElementById("profile-identity-form") as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const username = formData.get("username")?.toString().trim();
    const email = formData.get("email")?.toString().trim();

    if (!username || !email) {
      alert("Tous les champs sont requis");
      return;
    }

    // Validation de la longueur pour correspondre au backend (min 3 caractères)
    if (username.length < 3) {
      alert("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return;
    }

    // Validation du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Veuillez entrer une adresse e-mail valide");
      return;
    }

    try {
      // On utilise fetch directement au lieu de api.put.
      // Cela garantit que le FormData est envoyé en "multipart/form-data"
      // et non transformé en JSON vide par l'utilitaire api.
      const response = await fetch("/back_to_back/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username,
          email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors de la mise à jour");
      }

      const result = await response.json();

      // Mettre à jour le localStorage
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      alert(result.message || "Profil mis à jour avec succès !");
    } catch (error: any) {
      alert("Erreur : " + error.message);
    }
  });
}

// Gestion du formulaire de mot de passe
function setupPasswordForm() {
  const form = document.getElementById("profile-password-form") as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const currentPassword = formData.get("currentPassword")?.toString();
    const newPassword = formData.get("newPassword")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Tous les champs sont requis");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    try {
      const response = await fetch("/back_to_back/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Erreur ${response.status}`);
      }

      const result = await response.json();
      alert(result.message || "Mot de passe mis à jour avec succès !");
      form.reset();
    } catch (error: any) {
      alert("Erreur : " + error.message);
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
      alert("Erreur : " + error.message);
    }
  });
}

// Gestion du toggle 2FA
function setup2FAToggle() {
  const toggleBtn = document.getElementById("toggle-2fa-btn") as HTMLButtonElement | null;
  const qrSection = document.getElementById("2fa-qr-section");
  const qrContainer = document.getElementById("2fa-qr-container");
  const confirmForm = document.getElementById("2fa-confirm-form") as HTMLFormElement | null;
  const codeInput = document.getElementById("2fa-code-input") as HTMLInputElement | null;
  const confirmBtn = document.getElementById("2fa-confirm-btn") as HTMLButtonElement | null;
  const cancelBtn = document.getElementById("2fa-cancel-btn") as HTMLButtonElement | null;
  const statusSpan = document.getElementById("2fa-status");

  if (!toggleBtn) return;

  let is2FAEnabled = userService.getUser()?.isTwoFactorAuthenticationEnabled || false;

  const hideEnrollmentUI = () => {
    qrSection?.classList.add("hidden");
    if (qrContainer) {
      qrContainer.innerHTML = "";
    }
    if (codeInput) {
      codeInput.value = "";
      codeInput.disabled = false;
    }
    if (confirmBtn) confirmBtn.disabled = false;
    if (cancelBtn) cancelBtn.disabled = false;
  };

  const applyState = (enabled: boolean) => {
    is2FAEnabled = enabled;
    if (statusSpan) {
      statusSpan.textContent = enabled
        ? t("profile.settings.2faEnabled")
        : t("profile.settings.2faDisabled");
      statusSpan.classList.remove("text-emerald-300", "text-rose-300");
      statusSpan.classList.add(enabled ? "text-emerald-300" : "text-rose-300");
    }
    toggleBtn.textContent = enabled
      ? t("profile.settings.2faDisable")
      : t("profile.settings.2faEnable");
    if (enabled) {
      hideEnrollmentUI();
    }
  };

  const refreshUserState = async () => {
    const updated = await userService.fetchProfile();
    applyState(updated?.isTwoFactorAuthenticationEnabled ?? false);
  };

  const startEnrollment = async () => {
    toggleBtn.disabled = true;
    try {
      const result = await api.get<{ qrCodeUrl: string }>("/auth/2fa/generate");

      if (result.qrCodeUrl && qrContainer) {
        qrContainer.innerHTML = `
          <div class="p-4 bg-white rounded-lg inline-block">
            <p class="text-slate-900 text-sm mb-2">${t("profile.settings.2faScanInstructions")}</p>
            <img src="${result.qrCodeUrl}" alt="QR Code 2FA" class="mx-auto w-48 h-48 object-contain" />
          </div>
        `;
      }

      qrSection?.classList.remove("hidden");
      codeInput?.focus();
    } catch (error: any) {
      alert(error?.message || "Erreur lors de la génération du QR code");
    } finally {
      toggleBtn.disabled = false;
    }
  };

  toggleBtn.addEventListener("click", async () => {
    if (!is2FAEnabled) {
      await startEnrollment();
      return;
    }

    if (!confirm(t("profile.settings.2faDisableConfirm"))) {
      return;
    }

    toggleBtn.disabled = true;
    try {
      await api.post("/auth/2fa/disable", {});
      await refreshUserState();
      alert(t("profile.settings.2faDisableSuccess"));
    } catch (error: any) {
      alert(error?.message || "Erreur lors de la désactivation de la 2FA");
    } finally {
      toggleBtn.disabled = false;
    }
  });

  confirmForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = codeInput?.value.trim();

    if (!code) {
      alert(t("profile.settings.2faCodeMissing"));
      return;
    }

    if (codeInput) codeInput.disabled = true;
    if (confirmBtn) confirmBtn.disabled = true;
    if (cancelBtn) cancelBtn.disabled = true;

    try {
      const response = await api.post<{ token?: string }>("/auth/2fa/turn-on", { code });
      if (response?.token) {
        localStorage.setItem("token", response.token);
      }
      await refreshUserState();
      alert(t("profile.settings.2faSuccess"));
    } catch (error: any) {
      alert(error?.message || "Erreur lors de l'activation de la 2FA");
    } finally {
      if (codeInput) codeInput.disabled = false;
      if (confirmBtn) confirmBtn.disabled = false;
      if (cancelBtn) cancelBtn.disabled = false;
    }
  });

  cancelBtn?.addEventListener("click", () => {
    hideEnrollmentUI();
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
