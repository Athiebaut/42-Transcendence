import { api } from "./api";

export interface GameHistoryEntry {
  id: number;
  playerId: number;
  score: string;
  durationMs: number;
  date: string;
  mode: string; // AJOUT : mode de jeu
  tournamentRound?: number;
  tournamentPlayersCount?: number;
  playerPosition?: number;
}

export const historyService = {
  /**
   * Sauvegarde une partie terminée
   */
  async saveMatch(playerId: number, score: string, durationMs: number, mode: string, tournamentRound?: number, tournamentPlayersCount?: number, playerPosition?: number, result?: string) {
    const body: any = {
      playerId,
      score,
      durationMs,
      mode,
    };
    if (typeof tournamentRound === 'number') body.tournamentRound = tournamentRound;
    if (typeof tournamentPlayersCount === 'number') body.tournamentPlayersCount = tournamentPlayersCount;
    if (typeof playerPosition === 'number') body.playerPosition = playerPosition;
    if (typeof result === 'string') body.result = result;
    return api.post("/history", body);
  },

  /**
   * Récupère l'historique d'un joueur
   */
  async getHistory(playerId: number) {
    // Le backend renvoie { history: [...] }
    return api.get<{ history: GameHistoryEntry[] }>(`/history/${playerId}`);
  }
};
