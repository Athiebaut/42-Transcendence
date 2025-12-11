import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { TwoFactorService } from '../services/2fa.service.js';
import {logoutHandler} from "./auth.controller.js";
import { prisma } from "../middleware/prisma.js"

const ACCESS_TOKEN_EXPIRES = '1h';
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

const verifyJwt = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, isSecondFactorAuthenticated: boolean };
};

export default async function authRoutes(fastify: FastifyInstance) {
	fastify.post("/register", async (request, reply) => {
		const { email, password, username } = request.body as {
			email: string;
			password: string;
			username: string;
		};
		console.log(email);
		if (!email || !password || !username)
			return reply.status(400).send({ error: "Champs manquants" });
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email))
			return reply.status(400).send({ error: "Email invalide" });
		const existingUser = await prisma.user.findFirst({
			where: { OR: [{ email }, { username }] },
		});
		if (existingUser)
			return reply.status(400).send({ error: "Un compte est deja cree avec ce mail" });
		const existUsername = await prisma.user.findFirst({
			where: { OR: [{ email }, { username }] },
		});
		if (existUsername)
			return reply.status(400).send({ error: "Username deja utiliser" });
		if (password.length < 8)
			return reply.status(400).send({
				error: "Le mot de passe doit contenir 8 caractères minimum",
			});
		if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
			return reply.status(400).send({
				error: "Le mot de passe doit contenir au moins une majuscule et un chiffre",
			});
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await prisma.user.create({
			data: {
				username,
				usernameLower: username.toLowerCase(),
				email,
				emailLower: email.toLowerCase(),
				passwordHash: hashedPassword,
			},
		});
		const token = jwt.sign(
			{
				userId: newUser.id,
			},
			process.env.JWT_SECRET!,
			{ expiresIn: ACCESS_TOKEN_EXPIRES }
		);
		const refreshTokenPayload = { userId: newUser.id };
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
				userId: newUser.id,
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
			message: "Inscription réussie",
			user: {
				id: newUser.id,
				email: newUser.email,
				username: newUser.username,
			},
		});
	});

    fastify.get("/auth/2fa/generate", async (request, reply) => {
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader) return reply.status(401).send({ error: "No token" });
            const decoded = verifyJwt(authHeader.split(" ")[1]);
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
            if (!user) return reply.status(404).send({ error: "User not found" });
            const { secret, otpauthUrl } = await TwoFactorService.generateSecret(user.email);
            await TwoFactorService.saveSecret(user.id, secret);
            const qrCodeUrl = await TwoFactorService.generateQrCode(otpauthUrl);
            return reply.send({ qrCodeUrl, secret });
        } catch (err) {
            return reply.status(401).send({ error: "Unauthorized" });
        }
    });
    fastify.post("/auth/2fa/turn-on", async (request, reply) => {
        const { code } = request.body as { code: string };
        const authHeader = request.headers.authorization;
        try {
            if (!authHeader) throw new Error();
            const decoded = verifyJwt(authHeader.split(" ")[1]);
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
            if (!user || !user.twoFactorAuthenticationSecret)
                return reply.status(400).send({ error: "2FA not initiated" });
            const isValid = TwoFactorService.verifyCode(code, user.twoFactorAuthenticationSecret);
            if (!isValid) return reply.status(400).send({ error: "Invalid code" });
            await TwoFactorService.enable2FA(user.id);
            const newToken = jwt.sign(
                { userId: user.id, isSecondFactorAuthenticated: true },
                process.env.JWT_SECRET!,
                { expiresIn: '1h' }
            );
            return reply.send({ message: "2FA activated", token: newToken });
        } catch (e) {
            return reply.status(401).send({ error: "Unauthorized" });
        }
    });
    fastify.post("/auth/2fa/authenticate", async (request, reply) => {
        const { code } = request.body as { code: string };
        const authHeader = request.headers.authorization;
        try {
            if (!authHeader) throw new Error();
            const decoded = verifyJwt(authHeader.split(" ")[1]);
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
            if (!user || !user.twoFactorAuthenticationSecret)
                return reply.status(400).send({ error: "2FA not set up" });
            const isValid = TwoFactorService.verifyCode(code, user.twoFactorAuthenticationSecret);
            if (!isValid) return reply.status(400).send({ error: "Invalid code" });
            const newToken = jwt.sign(
                { userId: user.id, isSecondFactorAuthenticated: true },
                process.env.JWT_SECRET!,
                { expiresIn: '1h' }
            );
            return reply.send({ message: "Success", token: newToken });
        } catch (e) {
            return reply.status(401).send({ error: "Unauthorized or Invalid Token" });
        }
    });
	fastify.post('/logout', logoutHandler);
}
