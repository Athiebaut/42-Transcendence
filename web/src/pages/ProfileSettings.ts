import { api } from "../services/api";

interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  isTwoFactorAuthenticationEnabled?: boolean;
}

// Fonction pour récupérer l'utilisateur du localStorage
function getCurrentUser(): User | null {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
}

export default function ProfileSettings(): string {
  const user = getCurrentUser();
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
            <!-- Formulaire Identité -->
            <article class="glass-panel card-shadow rounded-2xl p-6 space-y-4">
              <header class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-emerald-200 uppercase tracking-[0.3em]">Identité</p>
                  <h2 class="text-xl font-semibold text-white">Nom d'oie & e-mail</h2>
                </div>
                <span class="text-2xl">🪶</span>
              </header>
              <form id="profile-identity-form" class="space-y-4">
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  Nom d'utilisateur
                  <input 
                    type="text" 
                    name="username" 
                    value="${username}"
                    class="w-full rounded-lg border border-[#d4c4a0]/70 bg-[#3a5548]/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300" 
                    placeholder="MaîtreHonk" 
                  />
                </label>
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  Adresse e-mail
                  <input 
                    type="email" 
                    name="email" 
                    value="${email}"
                    class="w-full rounded-lg border border-[#d4c4a0]/70 bg-[#3a5548]/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300" 
                    placeholder="toi@honk.fr" 
                  />
                </label>
                <button type="submit" class="btn-main w-full justify-center">Enregistrer</button>
              </form>
            </article>

            <!-- Formulaire Mot de passe -->
            <article class="glass-panel card-shadow rounded-2xl p-6 space-y-4">
              <header class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-amber-200 uppercase tracking-[0.3em]">Secret</p>
                  <h2 class="text-xl font-semibold text-white">Mot de passe</h2>
                </div>
                <span class="text-2xl">🔒</span>
              </header>
              <form id="profile-password-form" class="space-y-4">
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  Mot de passe actuel
                  <input 
                    type="password" 
                    name="currentPassword"
                    class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300" 
                    placeholder="••••••••" 
                  />
                </label>
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  Nouveau mot de passe
                  <input 
                    type="password" 
                    name="newPassword"
                    class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300" 
                    placeholder="••••••••" 
                  />
                </label>
                <label class="space-y-1 block text-xs font-medium text-slate-200/80">
                  Confirmation
                  <input 
                    type="password" 
                    name="confirmPassword"
                    class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300" 
                    placeholder="••••••••" 
                  />
                </label>
                <button type="submit" class="btn-main w-full justify-center bg-amber-400/90 text-slate-950 hover:bg-amber-300">Mettre à jour</button>
              </form>
            </article>

            <!-- Formulaire Avatar -->
            <article class="glass-panel card-shadow rounded-2xl p-6 space-y-4">
              <header class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-sky-200 uppercase tracking-[0.3em]">Apparence</p>
                  <h2 class="text-xl font-semibold text-white">Avatar</h2>
                </div>
                <span class="text-2xl">🎭</span>
              </header>
              <div class="flex items-center gap-4">
                <div id="avatar-preview" class="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-amber-300 flex items-center justify-center text-3xl shadow-lg overflow-hidden">
                  ${avatarUrl ? `<img src="${avatarUrl}" alt="Avatar" class="w-full h-full object-cover" />` : '🦢'}
                </div>
                <div class="text-xs text-slate-300">
                  <p>Affiche ton humeur du jour ou ta dernière victoire.</p>
                  <p class="text-slate-500 mt-1">PNG/JPG, 2 Mo max.</p>
                </div>
              </div>
              <form id="profile-avatar-form" class="space-y-4">
                <label class="block text-xs font-medium text-slate-200/80">
                  Importer un fichier
                  <input 
                    type="file" 
                    name="avatar"
                    accept="image/png,image/jpeg,image/jpg"
                    class="mt-1 w-full rounded-lg border border-dashed border-slate-600 bg-black/30 px-3 py-5 text-center text-slate-300 focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-300" 
                  />
                </label>
                <div class="flex gap-3">
                  <button type="submit" class="btn-main flex-1 justify-center">Téléverser</button>
                  <button type="button" id="reset-avatar-btn" class="btn-secondary flex-1 justify-center text-center">Réinitialiser</button>
                </div>
              </form>
            </article>

            <!-- Formulaire 2FA -->
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
                  <p class="font-semibold">État actuel : <span class="${is2FAEnabled ? 'text-emerald-300' : 'text-rose-300'}" id="2fa-status">${is2FAEnabled ? 'activé' : 'désactivé'}</span></p>
                  <p class="text-slate-400 mt-1">Dernier changement : jamais</p>
                </div>
                <button type="button" id="toggle-2fa-btn" class="btn-main">${is2FAEnabled ? 'Désactiver' : 'Activer'}</button>
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

    // AJOUT : Validation de la longueur pour correspondre au backend (min 3 caractères)
    if (username.length < 3) {
      alert("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return;
    }

    try {
      // On utilise api.put avec FormData directement
      const result = await api.put<{ message: string; user: User }>("/profile", formData);

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
      const result = await api.put<{ message: string }>("/profile/password", {
        currentPassword,
        newPassword,
      });

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
  const toggleBtn = document.getElementById("toggle-2fa-btn");
  const qrContainer = document.getElementById("2fa-qr-container");

  toggleBtn?.addEventListener("click", async () => {
    const user = getCurrentUser();
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
      alert("Erreur : " + error.message);
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