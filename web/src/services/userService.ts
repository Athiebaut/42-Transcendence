interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
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
      const response = await fetch("/back_to_back/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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