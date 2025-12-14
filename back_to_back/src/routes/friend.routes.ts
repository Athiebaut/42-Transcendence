import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { verifToken2FA } from "../middleware/auth.js";
import { isOnline, getLastSeen } from "../lib/presence.js";

const prisma = new PrismaClient();

export default async function friendRoutes(app: FastifyInstance) {
	app.addHook("preHandler", verifToken2FA);

	const sendRequestSchema = z.object({
		receiverUsername: z.string().min(1),
	});

	app.post("/friends/send", async (request, reply) => {
		const { receiverUsername } = sendRequestSchema.parse(request.body as any);
		const senderId = (request.user as any)?.userId as number | undefined;
		if (!senderId) return reply.status(401).send({ error: "Unauthorized" });

		try {
			const receiver = await prisma.user.findFirst({
				where: { usernameLower: receiverUsername.toLowerCase() },
				select: { id: true, username: true, avatarUrl: true },
			});
			if (!receiver) return reply.status(404).send({ error: "User not found" });
			if (receiver.id === senderId) return reply.status(400).send({ error: "Cannot send friend request to yourself" });

			const existing = await prisma.friend.findFirst({
				where: {
					OR: [
						{ senderId, receiverId: receiver.id },
						{ senderId: receiver.id, receiverId: senderId },
					],
				},
			});
			if (existing) return reply.status(409).send({ error: `Friendship already exists or is ${existing.status.toLowerCase()}` });

			const created = await prisma.friend.create({
				data: { senderId, receiverId: receiver.id, status: 'PENDING' },
			});
			return reply.code(201).send({ message: "Friend request sent", friendship: created });
		} catch (err) {
			request.log.error(err);
			return reply.status(500).send({ error: "Failed to send friend request." });
		}
	});

	const respondRequestSchema = z.object({
		senderId: z.number().int(),
		action: z.enum(["accept", "reject"]),
	});

	app.post("/friends/respond", async (request, reply) => {
		const { senderId, action } = respondRequestSchema.parse(request.body as any);
		const receiverId = (request.user as any)?.userId as number | undefined;
		if (!receiverId) return reply.status(401).send({ error: "Unauthorized" });

		try {
			const friendship = await prisma.friend.findFirst({
				where: { senderId, receiverId, status: 'PENDING' },
			});
			if (!friendship) return reply.status(404).send({ error: "Pending request not found" });

			const newStatus = action === 'accept' ? 'ACCEPTED' : 'REJECTED';
			const updated = await prisma.friend.update({
				where: { id: friendship.id },
				data: { status: newStatus },
			});
			return reply.send({ message: `Friend request ${action}ed.`, friendship: updated });
		} catch (err) {
			request.log.error(err);
			return reply.status(500).send({ error: "Failed to respond to request." });
		}
	});

	app.get("/friends", async (request, reply) => {
		const userId = (request.user as any)?.userId as number | undefined;
		if (!userId) return reply.status(401).send({ error: "Unauthorized" });

		const rows = await prisma.friend.findMany({
			where: { OR: [{ senderId: userId }, { receiverId: userId }] },
			include: { 
				sender: { select: { id: true, username: true, avatarUrl: true } }, 
				receiver: { select: { id: true, username: true, avatarUrl: true } } 
			},
		});

		const response = { accepted: [], pendingSent: [], pendingReceived: [] } as any;
		for (const f of rows) {
			const other = f.senderId === userId ? f.receiver : f.sender;
			const withStatus = { ...other, isOnline: isOnline(other.id), lastSeen: getLastSeen(other.id) };
			if (f.status === 'ACCEPTED') response.accepted.push(withStatus);
			else if (f.status === 'PENDING') {
				if (f.senderId === userId) response.pendingSent.push(withStatus);
				else response.pendingReceived.push(withStatus);
			}
		}

		return reply.send(response);
	});

	app.delete('/friends/:otherId', async (request, reply) => {
		const userId = (request.user as any)?.userId as number | undefined;
		if (!userId) return reply.status(401).send({ error: 'Unauthorized' });

		const otherId = Number((request.params as any)?.otherId);
		if (!otherId || !Number.isFinite(otherId)) return reply.status(400).send({ error: 'Invalid otherId' });

		try {
			const friendship = await prisma.friend.findFirst({
				where: {
					OR: [
						{ senderId: userId, receiverId: otherId },
						{ senderId: otherId, receiverId: userId },
					],
				},
			});
			if (!friendship) return reply.status(404).send({ error: 'Friendship not found' });

			await prisma.friend.delete({ where: { id: friendship.id } });
			return reply.send({ message: 'Friendship removed' });
		} catch (err) {
			request.log.error(err);
			return reply.status(500).send({ error: 'Failed to remove friendship.' });
		}
	});
}