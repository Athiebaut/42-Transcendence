import { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../middleware/prisma.js';


const ACCESS_TOKEN_EXPIRES = '1h';
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

export default async function userRoutes(app: FastifyInstance) {
	app.post('/login', async (request, reply) => {
		const { LogEmail, LogPassword } = request.body as { LogEmail: string; LogPassword: string };
		if (!LogEmail || !LogPassword)
			return reply.status(400).send({ error: 'Email and password required' });
		const user = await prisma.user.findUnique({
			where: { email: LogEmail.toLowerCase() },
		});
		if (!user || !(await bcrypt.compare(LogPassword, user.passwordHash))) {
			return reply.status(401).send({ error: 'Invalid credentials' });
		}
		const isAuthenticated = !user.isTwoFactorAuthenticationEnabled;

		const token = jwt.sign(
			{
				userId: user.id,
				isSecondFactorAuthenticated: isAuthenticated
			},
			process.env.JWT_SECRET!,
			{ expiresIn: ACCESS_TOKEN_EXPIRES }
		);

		const refreshTokenPayload = { userId: user.id };
		const refreshToken = jwt.sign(
			refreshTokenPayload,
			process.env.JWT_SECRET!,
			{ expiresIn: `${REFRESH_TOKEN_EXPIRES_IN_DAYS}d` }
		);

		const expirationDate = new Date(); // Crée la date actuelle
		expirationDate.setDate(expirationDate.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS); // Ajoute 7 jours
		await prisma.refreshToken.create({
			data: {
				token: refreshToken,
				userId: user.id,
				expiresAt: expirationDate,
			},
		});


		// 4. Envoi du Refresh Token dans un cookie HttpOnly sécurisé
		reply.setCookie('refreshToken', refreshToken, {
			path: '/', // Accessible depuis toutes les routes
			httpOnly: true, // Non accessible par JavaScript client (sécurité)
			secure: process.env.NODE_ENV === 'production', // Seulement via HTTPS en production
			expires: expirationDate,
			sameSite: 'strict', // Protection CSRF
		});

		return reply.send({
			message: user.isTwoFactorAuthenticationEnabled ? '2FA required' : 'Login successful',
			token: token,
			is2faEnabled: user.isTwoFactorAuthenticationEnabled
		});
	});
}
