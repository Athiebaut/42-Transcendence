import { FastifyInstance } from "fastify";
import { prisma } from "../middleware/prisma.js";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";
import {verifToken2FA} from "../middleware/auth.js";

const updateIdentitySchema = z
	.object({
		email: z.string().email().optional(),
		username: z.string().min(3).max(32).optional(),
	})
	.refine((v) => v.email !== undefined || v.username !== undefined, {
		message: "Nothing to update",
		path: ["email"],
	});

const updatePasswordSchema = z
	.object({
		currentPassword: z.string().min(1),
		newPassword: z.string().min(8),
		confirmPassword: z.string().min(8),
	})
	.refine((v) => v.newPassword === v.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export default async function profileAccountRoutes(app: FastifyInstance) {
	app.addHook("preHandler", verifToken2FA);

	// PATCH /profile : update username/email only
	app.patch("/profile", async (request, reply) => {
		const userId = (request.user as any)?.userId as number | undefined;
		if (!userId) return reply.status(401).send({ error: "Unauthorized" });

		const parsed = updateIdentitySchema.safeParse(request.body);
		if (!parsed.success) {
			return reply.status(400).send({ error: "Invalid data", details: parsed.error.issues });
		}

		const body = parsed.data;

		const data: Prisma.UserUpdateInput = {};
		if (body.email !== undefined) {
			data.email = body.email;
			data.emailLower = body.email.toLowerCase();
		}
		if (body.username !== undefined) {
			data.username = body.username;
			data.usernameLower = body.username.toLowerCase();
		}

		// Prevent collisions (case-insensitive via *Lower fields)
		if (data.emailLower || data.usernameLower) {
			const exists = await prisma.user.findFirst({
				where: {
					AND: [
						{ id: { not: userId } },
						{
							OR: [
								data.emailLower ? { emailLower: data.emailLower as string } : undefined,
								data.usernameLower ? { usernameLower: data.usernameLower as string } : undefined,
							].filter(Boolean) as any,
						},
					],
				},
				select: { id: true },
			});

			if (exists) return reply.status(409).send({ error: "Email or username already taken" });
		}

		const user = await prisma.user.update({
			where: { id: userId },
			data,
			select: { id: true, email: true, username: true, avatarUrl: true },
		});

		return reply.send({ message: "Profile updated", user });
	});

	// PUT /profile/password : update password only
	app.put("/profile/password", async (request, reply) => {
		const userId = (request.user as any)?.userId as number | undefined;
		if (!userId) return reply.status(401).send({ error: "Unauthorized" });

		const parsed = updatePasswordSchema.safeParse(request.body);
		if (!parsed.success) {
			console.log(parsed.error.issues);
			return reply.status(400).send({ error: "Invalid data", details: parsed.error.issues });
		}

		const { currentPassword, newPassword } = parsed.data;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { passwordHash: true },
		});

		if (!user) return reply.status(404).send({ error: "User not found" });

		const ok = await bcrypt.compare(currentPassword, user.passwordHash);
		if (!ok) return reply.status(401).send({ error: "Invalid current password" });

		const passwordHash = await bcrypt.hash(newPassword, 10);

		await prisma.user.update({
			where: { id: userId },
			data: { passwordHash },
		});

		return reply.send({ message: "Password updated" });
	});

	app.get("/profile", async (request, reply) => {
		const userId = (request.user as any).userId;

		const profile = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				username: true,
				email: true,
				avatarUrl: true,
			},
		});

		if (!profile)
			return reply.status(404).send({ error: "User not found" });
		return reply.send(profile);
	});
}
