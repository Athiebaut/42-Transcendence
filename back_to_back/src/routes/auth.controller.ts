// src/controllers/auth.controller.ts (Assurez-vous que cette fonction est exportée)

import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../middleware/prisma';

export async function logoutHandler(request: FastifyRequest, reply: FastifyReply) {

	// 1. Extraction du Refresh Token du cookie
	const refreshToken = request.cookies.refreshToken;

	// Toujours nettoyer le cookie, même si on ne trouve pas le token dans la DB
	reply.clearCookie('refreshToken', {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
	});

	if (!refreshToken) {
		return reply.status(200).send({ message: "Déconnexion réussie." });
	}

	try {
		// 2. RÉVOCATION CÔTÉ SERVEUR (PRISMA)
		// On trouve et supprime le token de rafraîchissement dans la base de données.
		// Utiliser deleteMany est plus sûr si, par accident, plusieurs tokens existent.
		const result = await prisma.refreshToken.deleteMany({
			where: {
				token: refreshToken,
			},
		});

		// 3. Réponse
		if (result.count > 0) {
			console.log(`Révoqué ${result.count} Refresh Token(s) de la DB.`);
		}

		reply.status(200).send({ message: "Déconnexion réussie et token révoqué." });

	} catch (error) {
		console.error("Erreur lors de la déconnexion:", error);
		reply.status(500).send({ message: "Erreur interne du serveur." });
	}
}