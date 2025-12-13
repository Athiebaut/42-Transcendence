// AJOUT : export devant l'interface
export interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  // AJOUT : Champ manquant pour la 2FA
  isTwoFactorAuthenticationEnabled?: boolean;
}

const USER_KEY = "user";

export const userService = {
  /**
   * Stocke les infos utilisateur
   */
  setUser(user: User): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Erreur lors du stockage de l'utilisateur", error);
    }
  },

  /**
   * Récupère les infos utilisateur
   */
  getUser(): User | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Supprime les infos utilisateur
   */
  clearUser(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
  },

  /**
   * Récupère les infos depuis le backend
   */
  async fetchProfile(): Promise<User | null> {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const response = await fetch("/back_to_back/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // AJOUT : Si le token est invalide (401) ou l'user introuvable (404 - cas du reset DB)
      if (response.status === 401 || response.status === 404) {
        console.warn("Session invalide ou utilisateur inexistant, déconnexion forcée.");
        this.clearUser();
        localStorage.removeItem("token");
        // Optionnel : rediriger vers login si on n'y est pas déjà
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
           window.location.href = "/login";
        }
        return null;
      }

      if (!response.ok) throw new Error("Failed to fetch profile");

      const user = await response.json();
      this.setUser(user);
      return user;
    } catch (error) {
      console.error("Erreur lors de la récupération du profil", error);
      return null;
    }
  },
};