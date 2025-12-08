import { FastifyInstance, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { verifToken } from "../middleware/auth.js";

const prisma = new PrismaClient();

const gameHistorySchema: FastifySchema = {
	body: {
		type: 'object',
		required: ['playerId', 'durationMs', 'opponentId', 'score'],
		properties: {
			playerId: { type: 'integer', description: "ID de l'utilisateur qui enregistre la partie." },
			durationMs: { type: 'integer', description: 'Durée de la partie en millisecondes.' },
			opponentId: { type: 'integer', description: "ID de l'adversaire." },
			score: { type: 'string', description: 'Le score final ou résultat.' },
		}
	}
};

interface GameHistoryBody {
	playerId: number;
	durationMs: number;
	opponentId: number;
	score: string;
}
export default async function history(app: FastifyInstance) {
	app.post("history", { schema: gameHistoryShema },
		async (request: FastifyRequest<{ Body: GameHistoryBody}>, reply)=> {
			const { playerId, durationMs, opponentId, score } = request.body;

			try {
				const newGame = await prisma.gameHistory.create({
					data: {
						durationMs: durationMs,
						opponentId: opponentId,
						score: score,
						player: {
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

	app.get<{ Params: PlayerParams }>('/history/:playerId' async (request, reply) => {
		const playerId = request.params.playerId;

		if (isNaN(playerId)) {
			reply.code(400).send({ message: "L'ID du joueur doit etre un nombre" });
			return ;
		}

		try {
			const history = await prisma.gameHistory.findMany({
				where: {
					playerId: Number(playerId),
				},
				oderBy: {
					createAt: 'desc',
				},
				select: {
					durationMs: true,
					opponentId: true,
					score: true,
					createAt: true
				}
			});
			if (history.length === 0) {
				reply.code(404).send({ message: "Aucune partie trouve pour ce joueur." });
				return ;
			}

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