import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

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
			{ expiresIn: '1h' }
		);

		return reply.send({
			message: user.isTwoFactorAuthenticationEnabled ? '2FA required' : 'Login successful',
			token,
			is2faEnabled: user.isTwoFactorAuthenticationEnabled
		});
	});
}
