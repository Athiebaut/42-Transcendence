import { api } from "./api";

export interface GameHistoryEntry {
  id: number;
  playerId: number;
  opponentId: number;
  score: string;
  durationMs: number;
  date: string;
}

export const historyService = {
  /**
   * Sauvegarde une partie terminée
   */
  async saveMatch(playerId: number, opponentId: number, score: string, durationMs: number) {
    return api.post("/history", {
      playerId,
      opponentId,
      score,
      durationMs
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
