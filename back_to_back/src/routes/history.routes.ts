import { FastifyInstance, FastifyRequest, FastifySchema } from "fastify";
import { PrismaClient } from "@prisma/client";
import {verifToken2FA} from "../middleware/auth.js";

const prisma = new PrismaClient();

const gameHistorySchema: FastifySchema = {
	body: {
		type: 'object',
		required: ['playerId', 'durationMs', 'score', 'mode'],
		properties: {
			playerId: { type: 'integer', description: "ID de l'utilisateur qui enregistre la partie." },
			durationMs: { type: 'integer', description: 'Durée de la partie en millisecondes.' },
			score: { type: 'string', description: 'Le score final ou résultat.' },
				mode: { type: 'string', description: 'Le mode de jeu.' },
				tournamentRound: { type: 'integer', description: 'Round du tournois si applicable.'},
				tournamentPlayersCount: { type: 'integer', description: 'Nombre total de joueurs dans le tournoi (optionnel).'},
				playerPosition: { type: 'integer', description: 'Position du joueur dans le match (1 ou 2) (optionnel).'}
		}
	}
};
interface GameHistoryBody {
	playerId: number;
	durationMs: number;
	score: string;
	mode: string;
	tournamentRound?: number;
	tournamentPlayersCount?: number;
	playerPosition?: number;
}
export default async function history(app: FastifyInstance) {
	app.addHook("preHandler", verifToken2FA);
	app.post("/history", { schema: gameHistorySchema },
		async (request: FastifyRequest<{ Body: GameHistoryBody}>, reply)=> {
			const { playerId, durationMs, score, mode, tournamentRound, tournamentPlayersCount, playerPosition } = request.body;

			try {
				const newGame = await prisma.gameHistory.create({
					data: {
						durationMs: durationMs,
						score: score,
						playerId: playerId,
						mode: mode,
						tournamentRound: tournamentRound ?? null,
						tournamentPlayersCount: tournamentPlayersCount ?? null,
						playerPosition: playerPosition ?? null,
						User: {
							connect: { id: playerId }
						}
					}
				});

				reply.code(201).send({
					message: 'Historique de partie enregistre avec succes.',
					game: newGame
				});
			} catch (error) {
				request.log.error(error);
				reply.code(500).send({message: "Erreur lors de l'enregistrement de l'historique de partie"});
			}
	});
	interface PlayerParams {
		playerId: number;
	}
	app.get<{ Params: PlayerParams }>('/history/:playerId', async (request, reply) => {
		const playerId = request.params.playerId;

		if (isNaN(Number(playerId))) {
			reply.code(400).send({ message: "L'ID du joueur doit etre un nombre" });
			return ;
		}

		try {
			const history = await prisma.gameHistory.findMany({
				where: {
					playerId: Number(playerId),
				},
				orderBy: {
					date: 'desc',
				},
				select: {
					durationMs: true,
					score: true,
					date: true,
					mode: true,
					tournamentRound: true,
					tournamentPlayersCount: true,
					playerPosition: true
				}

			});
			// if (history.length === 0) {
			// 	reply.code(404).send({ message: "Aucune partie trouve pour ce joueur." });
			// 	return ;
			// }
			reply.code(200).send({
				player: playerId,
				history: history
			});
		} catch (error) {
			request.log.error(error);
			reply.code(500).send({ message: "Erreur lors de la recupe de l'historique" });
		}
	});
}
