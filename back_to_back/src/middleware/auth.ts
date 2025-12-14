import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { setLastSeen } from "../lib/presence.js";

type JwtPayload = {
	userId: number;
	isSecondFactorAuthenticated?: boolean;
	// ... other claims if you add more later ...
};

export async function verifToken(request: FastifyRequest, reply: FastifyReply) {
	const authHeader = request.headers.authorization;
	if (!authHeader)
		return reply.status(401).send({ error: "Token manquant" });

	if (!authHeader.startsWith("Bearer "))
		return reply.status(401).send({ error: "Token invalide" });

	const token = authHeader.slice("Bearer ".length).trim();
	if (!token)
		return reply.status(401).send({ error: "Token invalide" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
		request.user = decoded;
		// update presence for this authenticated user
		if (decoded && typeof decoded.userId === 'number') {
			setLastSeen(decoded.userId);
		}
	} catch {
		return reply.status(401).send({ error: "Token invalide" });
	}
}

export async function verifToken2FA(request: FastifyRequest, reply: FastifyReply) {
	await verifToken(request, reply);

	// Si verifToken a déjà répondu (401), on stoppe.
	if (reply.sent) return;

	const user = request.user as JwtPayload | undefined;
	if (!user)
		return reply.status(401).send({ error: "Token invalide" });

	if (user.isSecondFactorAuthenticated === false)
		return reply.status(401).send({ error: "2FA validation required" });
}