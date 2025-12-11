import { userService } from "../services/userService";
import { api } from "../services/api";

const TOKEN_KEY = "token";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(window.localStorage.getItem(TOKEN_KEY));
  } catch {
    return false;
  }
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    userService.clearUser(); // Nettoyer aussi l'utilisateur
  } catch {
    // ignore
  }
}

/**
 * Récupère le nom de l'utilisateur connecté
 */
export function getCurrentUserName(): string | null {
  const user = userService.getUser();
  return user?.username || null;
}

/**
 * Récupère l'utilisateur complet
 */
export function getCurrentUser() {
  return userService.getUser();
}

/**
 * 🆕 Déconnecte l'utilisateur (appelle le backend + nettoie le front)
 */
export async function logout(): Promise<void> {
  if (typeof window === "undefined") return;
  
  try {
    // 1. Appeler l'endpoint backend pour nettoyer le cookie
    await api.post("/auth/logout", {});
  } catch (error) {
    console.error("Erreur lors de l'appel au logout backend", error);
    // On continue quand même pour nettoyer le front
  } finally {
    // 2. Nettoyer le localStorage côté front
    window.localStorage.removeItem(TOKEN_KEY);
    userService.clearUser();
    
    // 3. Rediriger vers la page d'accueil
    window.location.href = "/";
  }
}