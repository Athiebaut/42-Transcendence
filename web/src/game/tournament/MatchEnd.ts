import { 
    loadTournament, 
    saveTournament, 
    recordMatchResult, 
    getCurrentMatch, 
    getRoundName,
    clearTournament,
    type Tournament 
} from './TournamentLogic';

import { renderFirstMatchHTML, renderNextMatchHTML, renderChampionHTML } from './MatchEndHtml';
import { disposePongGame, initPongGame } from '../pongGame';
import { initTournamentSetup, renderTournamentSetup } from './TournamentSetup';
import { resetPlayerNames, updatePlayerNames } from '../ui/displayPlayerNames';
import { userService } from '../../services/userService';
import { historyService } from '../../services/historyService';

/**
 * Affiche l'écran de fin de match en tournoi
 */
export async function showTournamentMatchEnd(
    winner: number, 
    score: { player1: number; player2: number },
    durationMs: number,
    onNextMatch: () => void
): Promise<void> {
    const tournament = loadTournament();
    if (!tournament) {
        console.error('Aucun tournoi en cours');
        return;
    }
    
    const currentMatch = getCurrentMatch(tournament);
    if (!currentMatch) return;
    
    const winnerName = winner === 1 ? currentMatch.player1 : currentMatch.player2;
    const loserName = winner === 1 ? currentMatch.player2 : currentMatch.player1;
    
    const updatedTournament = recordMatchResult(tournament, winner as 1 | 2, score);
    saveTournament(updatedTournament);

    // Si l'utilisateur connecté a joué ce match, et qu'il est éliminé (ou que le tournoi est fini),
    // enregistrer CE match dans l'historique (dernier match joué par l'utilisateur)
    try {
        const user = userService.getUser();
        if (user && (currentMatch.player1 === user.username || currentMatch.player2 === user.username)) {
            const playedUsername = user.username;
            // Déterminer si l'utilisateur a gagné en comparant le score côté auquel il jouait
            const userIsPlayer1 = currentMatch.player1 === playedUsername;
            const userScore = userIsPlayer1 ? score.player1 : score.player2;
            const opponentScore = userIsPlayer1 ? score.player2 : score.player1;
            const didUserWin = userScore > opponentScore;

            // Détecter si le match était la finale en se basant sur le round et le nombre total de joueurs
            const totalPlayers = updatedTournament.players.length;
            const totalRounds = Math.log2(totalPlayers);
            const isFinalRound = Number.isFinite(totalRounds) && Math.floor(totalRounds) === totalRounds && currentMatch.round === totalRounds;
            const playedInFinal = updatedTournament.isFinished || isFinalRound;
            // (removed debug logs)

            // On enregistre si l'utilisateur a été éliminé (il a perdu) ou si c'était la finale (même s'il a gagné)
            const shouldSave = (!didUserWin) || playedInFinal;
            if (shouldSave) {
                const scoreString = `${score.player1} - ${score.player2}`;
                const roundNumber = currentMatch.round;
                const playerPosition = userIsPlayer1 ? 1 : 2;
                try {
                    await historyService.saveMatch(user.id, scoreString, durationMs, 'tournament', roundNumber, totalPlayers, playerPosition);
                } catch (e) {
                    console.error('Erreur sauvegarde historique tournoi', e);
                }
            }
        }
    } catch (e) {
        console.error('Erreur lors de la sauvegarde conditionnelle du tournoi', e);
    }
    
    if (updatedTournament.isFinished) {
        showChampionScreen(updatedTournament);
    } else {
        showNextMatchScreen(updatedTournament, winnerName!, loserName!, score, onNextMatch);
    }
}

/**
 * Affiche l'écran du premier match
 */
export function showFirstMatchScreen(onStart: () => void): void {
    const tournament = loadTournament();
    if (!tournament) return;
    
    const container = document.getElementById('pong-container');
    if (!container) return;
    
    const firstMatch = getCurrentMatch(tournament);
    if (!firstMatch) return;
    
    const roundName = getRoundName(tournament);
    container.insertAdjacentHTML('beforeend', renderFirstMatchHTML(tournament, roundName, firstMatch));
    
    document.getElementById('next-match-btn')?.addEventListener('click', () => {
        hideTournamentMatchEnd();
        updatePlayerNames('tournament');
        onStart();
    });
}


export function hideTournamentMatchEnd(): void {
    document.getElementById('tournament-match-end')?.remove();
}

function setupNextMatchButton(onNext: () => void): void {
    document.getElementById('next-match-btn')?.addEventListener('click', () => {
        hideTournamentMatchEnd();
        updatePlayerNames('tournament');
        onNext();
    });
}

function setupQuitButton(): void {
    document.getElementById('quit-tournament-btn')?.addEventListener('click', () => {
        clearTournament();
        resetPlayerNames();
        hideTournamentMatchEnd();
        window.location.href = '/play';
    });
}

function setupNewTournamentButton(): void {
    document.getElementById('new-tournament-btn')?.addEventListener('click', () => {
        clearTournament();
        hideTournamentMatchEnd();
        resetPlayerNames();
        disposePongGame();
        startNewTournament();
    });
}

function showNextMatchScreen(
    tournament: Tournament,
    winnerName: string,
    loserName: string,
    score: { player1: number; player2: number },
    onNextMatch: () => void
): void {
    const container = document.getElementById('pong-container');
    if (!container) return;
    
    const nextMatch = getCurrentMatch(tournament);
    const roundName = getRoundName(tournament);
    
    container.insertAdjacentHTML('beforeend', renderNextMatchHTML(tournament, roundName, winnerName, loserName, score, nextMatch));
    
    setupNextMatchButton(onNextMatch);
    setupQuitButton();
}

function showChampionScreen(tournament: Tournament): void {
    const container = document.getElementById('pong-container');
    if (!container) return;
    
    container.insertAdjacentHTML('beforeend', renderChampionHTML(tournament));
    
    setupNewTournamentButton();
    setupQuitButton();
}

function startNewTournament(): void {
    const container = document.getElementById('pong-container');
    if (!container) return;
    
    container.insertAdjacentHTML('beforeend', renderTournamentSetup());
    
    initTournamentSetup(() => {
        initPongGame('tournament');
    });
}