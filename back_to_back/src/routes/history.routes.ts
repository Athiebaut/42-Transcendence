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
	app.post("history", { schema: gameHistorySchema },
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

	app.get<{ Params: PlayerParams }>('/history/:playerId', async (request, reply) => { // <-- Retrait de l'accolade fermante juste avant 'async'
    const playerId = request.params.playerId;

    // Assurez-vous que PlayerParams garantit que playerId est une string avant la conversion
    if (isNaN(Number(playerId))) { // Le problème initial utilisait isNaN(playerId) sur une string, Number() est plus sûr ici.
        reply.code(400).send({ message: "L'ID du joueur doit être un nombre" });
        return;
    }

    try {
        const history = await prisma.gameHistory.findMany({
            where: {
                playerId: Number(playerId),
            },
            // CORRECTION: 'oderBy' doit être 'orderBy'
            orderBy: {
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
            reply.code(404).send({ message: "Aucune partie trouvée pour ce joueur." });
            return;
        }

        reply.code(200).send({
            player: playerId,
            history: history
        });
    } catch (error) {
        request.log.error(error);
        reply.code(500).send({ message: "Erreur lors de la récup de l'historique" });
    }
}); // <-- L'accolade de fin est maintenant ici pour fermer la fonction de gestion de la route.
// Il peut y avoir d'autres accolades fermantes nécessaires APRES cette ligne, selon le contexte englobant.
}