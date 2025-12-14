import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { z } from "zod"
import { TwoFactorService } from '../services/2fa.service.js';
import {logoutHandler} from "./auth.controller.js";
import { prisma } from "../middleware/prisma.js"

const ACCESS_TOKEN_EXPIRES = '1h';
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

const verifyJwt = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, isSecondFactorAuthenticated: boolean };
};

const registerSchema = z.object({
	email: z.string().trim().email("Invalid email"),
	username: z.string().trim().max(32, "Username to long").min(3, "Username must be at least 3 characters long"),
	password: z.string().min(8, "Password must be at least 8 characters long").regex(/[A-Z]/, "Password must contain at least 1 uppercase letter").regex(/[0-9]/, "Password must contain at least 1 number"),
	passwordConfirm: z.string().min(1, "Confirm your password"),
}).refine((v) => v.password === v.passwordConfirm, {
	message: "Passwords do not match",
	path: ["passwordConfirm"]
});

type RegisterBody = z.infer<typeof registerSchema>;

export default async function authRoutes(fastify: FastifyInstance) {
	fastify.post("/register", async (request: FastifyRequest<{Body: RegisterBody}>,reply: FastifyReply) => {
		const parsed = registerSchema.safeParse(request.body);
		if (!parsed.success) {
			const flat = parsed.error.flatten();
			return reply.status(400).send({
				error: "VALIDATION_ERROR",
				message: "Validation error",
				fieldErrors: flat.fieldErrors,
				formErrors: flat.formErrors,
			});
		}
		const {email, username, password} = parsed.data;


		const emailLower = email.toLowerCase();
		const usernameLower = username.toLowerCase();

		const existingUser = await prisma.user.findFirst({
			where: { OR: [{ emailLower }, { usernameLower }] },
			select: { id: true, emailLower: true, usernameLower: true},
		});
		if (existingUser?.emailLower === emailLower) {
			return reply.status(409).send({ error: "Un compte est deja cree avec ce mail" });
		}
		if (existingUser?.usernameLower === usernameLower) {
			return reply.status(409).send({ error: "Un compte est deja cree avec ce username" });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await prisma.user.create({
			data: {
				username,
				usernameLower,
				email,
				emailLower,
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
    const handle2FATurnOn = async (request, reply) => {
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
    };
    fastify.post("/auth/2fa/turn-on", handle2FATurnOn);
    // Compatibility with older front versions
    fastify.post("/auth/2fa/enable", handle2FATurnOn);

    fastify.post("/auth/2fa/disable", async (request, reply) => {
        const authHeader = request.headers.authorization;
        try {
            if (!authHeader) throw new Error();
            const decoded = verifyJwt(authHeader.split(" ")[1]);
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
            if (!user) {
                return reply.status(404).send({ error: "User not found" });
            }
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    twoFactorAuthenticationSecret: null,
                    isTwoFactorAuthenticationEnabled: false
                }
            });
            return reply.send({ message: "2FA disabled" });
        } catch (error) {
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
