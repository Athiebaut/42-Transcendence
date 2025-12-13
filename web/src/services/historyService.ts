import { api } from "./api";

export interface GameHistoryEntry {
  id: number;
  playerId: number;
  score: string;
  durationMs: number;
  date: string;
  mode: string; // AJOUT : mode de jeu
}

export const historyService = {
  /**
   * Sauvegarde une partie terminée
   */
  async saveMatch(playerId: number, score: string, durationMs: number, mode: string) {
    return api.post("/history", {
      playerId,
      score,
      durationMs,
      mode, // ENVOI du mode
    });
  },

  /**
   * Récupère l'historique d'un joueur
   */
  async getHistory(playerId: number) {
    // Le backend renvoie { history: [...] }
    return api.get<{ history: GameHistoryEntry[] }>(`/history/${playerId}`);
  }
};
