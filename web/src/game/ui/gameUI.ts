import type { GameMode } from '../config/gameModeConfig';
import { getPlayerName } from './displayPlayerNames';
import { loadTournament, getCurrentMatch } from '../tournament/TournamentLogic';
import { t } from '../../i18n';

export function initGameUI(mode: GameMode): void {
    updateNames(mode);
    updateSettings(mode);
    updateStats(mode);
    updateRound(mode);
    updateControls(mode);
    resetTimer();
}

function updateNames(mode: GameMode): void {
    const p1Name = document.getElementById('pong-player-left-name');
    const p2Name = document.getElementById('pong-player-right-name');

    if (p1Name) p1Name.textContent = getPlayerName(1, mode);
    if (p2Name) p2Name.textContent = getPlayerName(2, mode);

    // Tournament specific logic for names is already in getPlayerName/updatePlayerNames
    // But let's ensure we use the tournament match if applicable
    if (mode === 'tournament') {
        const tournament = loadTournament();
        const currentMatch = tournament ? getCurrentMatch(tournament) : null;
        if (currentMatch) {
            if (p1Name) p1Name.textContent = currentMatch.player1;
            if (p2Name) p2Name.textContent = currentMatch.player2;
        }
    }
}

function updateSettings(mode: GameMode): void {
    const modeEl = document.getElementById('pong-mode');
    const speedEl = document.getElementById('pong-speed');

    if (modeEl) {
        const modeLabels: Record<string, string> = {
            'pvp1v1': 'Duel Classique',
            'pvp2v2': 'Choc des Équipes',
            'vsai': 'Entraînement IA',
            'tournament': 'Tournoi du Village'
        };
        modeEl.textContent = modeLabels[mode] || mode;
    }

    if (speedEl) {
        // Example logic
        speedEl.textContent = mode === 'vsai' ? 'Progressive' : 'Normale';
    }
}

function updateStats(mode: GameMode): void {
    const p1Skin = document.getElementById('pong-player-left-skin');
    const p2Skin = document.getElementById('pong-player-right-skin');
    const p1Speed = document.getElementById('pong-player-left-speed');
    const p1Power = document.getElementById('pong-player-left-power');
    const p2Speed = document.getElementById('pong-player-right-speed');
    const p2Power = document.getElementById('pong-player-right-power');
    
    if (p1Skin) p1Skin.textContent = "Standard";
    if (p2Skin) p2Skin.textContent = mode === 'vsai' ? "Robo-Plumes" : "Standard";

    // Reset labels if they were changed by 2v2 logic previously
    resetLabel(p1Speed, "pong.player.maxSpeed");
    resetLabel(p1Power, "pong.player.honkPower");
    resetLabel(p2Speed, "pong.player.maxSpeed");
    resetLabel(p2Power, "pong.player.honkPower");

    if (p1Speed) p1Speed.textContent = "30 km/h";
    if (p1Power) p1Power.textContent = "x1.0";
    
    if (p2Speed) p2Speed.textContent = mode === 'vsai' ? "45 km/h" : "30 km/h";
    if (p2Power) p2Power.textContent = mode === 'vsai' ? "x1.5" : "x1.0";
}

function resetLabel(element: HTMLElement | null, key: string) {
    if (element && element.parentElement && element.parentElement.firstChild) {
        element.parentElement.firstChild.textContent = `${t(key)} : `;
    }
}

function updateControls(mode: GameMode): void {
    const controlsList = document.getElementById('pong-controls-list');
    if (!controlsList) return;

    if (mode === 'pvp2v2') {
        controlsList.innerHTML = `
            <li>${t("pong.player.left")} J1 <span class="font-semibold">W / S</span></li>
            <li>${t("pong.player.left")} J2 <span class="font-semibold">T / G</span></li>
            <li>${t("pong.player.right")} J1 <span class="font-semibold">↑ / ↓</span></li>
            <li>${t("pong.player.right")} J2 <span class="font-semibold">I / K</span></li>
            <li>${t("pong.controls.pause")}</li>
        `;
    } else {
        // Default controls (1v1, Tournament, AI)
        controlsList.innerHTML = `
            <li>${t("pong.controls.left")} <span class="font-semibold">W / S</span></li>
            <li>${t("pong.controls.right")} <span class="font-semibold">↑ / ↓</span></li>
            <li>${t("pong.controls.pause")}</li>
        `;
    }
}

function updateRound(mode: GameMode): void {
    const roundEl = document.getElementById('pong-round');
    if (!roundEl) return;

    if (mode === 'tournament') {
        const tournament = loadTournament();
        const currentMatch = tournament ? getCurrentMatch(tournament) : null;
        if (currentMatch) {
            roundEl.textContent = currentMatch.round.toString();
        } else {
            roundEl.textContent = "-";
        }
    } else {
        roundEl.textContent = "1";
    }
}

export function updateGameTimer(startTime: number): void {
    const timerEl = document.getElementById('pong-timer');
    if (!timerEl) return;

    const elapsed = Date.now() - startTime;
    const seconds = Math.floor(elapsed / 1000);
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    
    timerEl.textContent = `${m}:${s}`;
}

function resetTimer(): void {
    const timerEl = document.getElementById('pong-timer');
    if (timerEl) timerEl.textContent = "00:00";
}
