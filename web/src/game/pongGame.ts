import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene } from "@babylonjs/core";
import { resetPaddles, setupScene } from "./scene/sceneSetup";
import { setupControls } from "./controls/gameControls";
import { createBallPhysics, type ComposedPhysicsSystem } from "./physics/BallPhysicsComposed";
import type { GameMode } from "./config/gameModeConfig";
import { showVictoryScreen } from './ui/Victory';
import { showTournamentMatchEnd } from './tournament/MatchEnd';
import { clearTournament } from "./tournament/TournamentLogic";
import { initGameUI, updateGameTimer } from "./ui/gameUI";
import { userService } from "../services/userService";
import { historyService } from "../services/historyService";


let engine: Engine | null = null;
let scene: Scene | null = null;
let ballPhysics: ComposedPhysicsSystem | null = null;
let gameStartTime: number = 0;

/**
 * Met à jour l'affichage du score dans l'interface utilisateur
 */
function updateScoreDisplay(player1Score: number, player2Score: number): void {
    const player1ScoreElement = document.getElementById("player1-score");
    const player2ScoreElement = document.getElementById("player2-score");
    
    if (player1ScoreElement) {
        player1ScoreElement.textContent = player1Score.toString();
    }
    
    if (player2ScoreElement) {
        player2ScoreElement.textContent = player2Score.toString();
    }
}

/**
 * Initialise le jeu Pong avec Babylon.js
 * @returns Promise<boolean> - true si l'initialisation réussit
 */
export async function initPongGame(mode: GameMode = 'pvp1v1'): Promise<boolean> {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    
    if (!canvas) {
        console.error("Canvas with id 'gameCanvas' not found");
        return false;
    }

    // Nettoyage préventif de l'état précédent
    disposePongGame();
    
    gameStartTime = Date.now(); // ⏱️ On lance le chrono

    if (mode === 'tournament') {
        window.addEventListener('beforeunload', clearTournament);
    }

    try {
        console.log(`🎮 Initializing Pong - Mode: ${mode}`);
        // Initialisation du moteur 3D
        engine = new Engine(canvas, true);
        scene = new Scene(engine);

        // Configuration de la scène de jeu
        setupScene(scene, mode);
        setupControls(scene, engine, mode);

        initGameUI(mode);
        
        // Initialisation du système de physique
        ballPhysics = createBallPhysics(scene, mode);
        ballPhysics.onScoreUpdate = updateScoreDisplay;
        
        ballPhysics.onGameOver = async (winner: number) => {
            if (!ballPhysics) return;
            
            const score = ballPhysics.score;

            // 💾 SAUVEGARDE DE L'HISTORIQUE
            const user = userService.getUser();
            const duration = Date.now() - gameStartTime;
            const scoreString = `${score.player1} - ${score.player2}`;
            if (user) {
                try {
                    // Déterminer la position du joueur local (1 ou 2) en comparant les noms affichés
                    const leftNameEl = document.querySelector('#player1-info h3') as HTMLElement | null;
                    const rightNameEl = document.querySelector('#player2-info h3') as HTMLElement | null;
                    const username = user.username;
                    let playerPosition: number | undefined;
                    if (leftNameEl?.textContent?.trim() === username) playerPosition = 1;
                    else if (rightNameEl?.textContent?.trim() === username) playerPosition = 2;

                    // Calculer le résultat pour l'utilisateur (win|loss|draw)
                    let result: string | undefined;
                    const p1 = score.player1;
                    const p2 = score.player2;
                    if (typeof playerPosition === 'number') {
                      const myScore = playerPosition === 1 ? p1 : p2;
                      const opScore = playerPosition === 1 ? p2 : p1;
                      if (myScore > opScore) result = 'win';
                      else if (myScore < opScore) result = 'loss';
                      else result = 'draw';
                    } else {
                      // Fallback: determine winner by comparing absolute scores (may be inaccurate if we don't know who's who)
                      if (p1 > p2) result = 'win';
                      else if (p1 < p2) result = 'loss';
                      else result = 'draw';
                    }

                    if (mode === 'tournament') {
                        // pour les tournois, la sauvegarde sera gérée par le flow de tournoi
                    } else {
                        await historyService.saveMatch(user.id, scoreString, duration, mode, undefined, undefined, playerPosition, result);
                        console.log("✅ Partie sauvegardée !");
                    }
                } catch (e) {
                    console.error("Erreur sauvegarde historique", e);
                }
            }

            if (mode === 'tournament') {
                await showTournamentMatchEnd(winner, score, duration, () => {
                    if (scene) resetPaddles(scene, mode);
                    ballPhysics?.resetGame();
                });
            } else {
                showVictoryScreen(winner, score, mode, () => {
                    if (scene) resetPaddles(scene, mode);
                    ballPhysics?.resetGame();
                    gameStartTime = Date.now(); // Reset chrono
                });
            }
        };
        // Démarrage de la boucle de rendu
        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
                updateGameTimer(gameStartTime);
            }
        });
        
        console.log("Babylon.js game initialized successfully");
        return true;
        
    } catch (error) {
        console.error("Error initializing game:", error);
        disposePongGame(); // Nettoyage en cas d'erreur
        return false;
    }
}

/**
 * Libère toutes les ressources du jeu pour éviter les fuites mémoire
 */
export function disposePongGame(): void {
    try {
        // Nettoyage dans l'ordre inverse de création
        ballPhysics = null;
        
        if (scene) {
            scene.dispose();
            scene = null;
        }
        
        if (engine) {
            engine.dispose();
            engine = null;
        }
        
        console.log("Pong game disposed successfully");
    } catch (error) {
        console.error("Error disposing game:", error);
    }
}
