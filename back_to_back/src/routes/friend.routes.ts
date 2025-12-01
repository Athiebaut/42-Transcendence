import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken";
import { z } from "zod";

const prisma = new PrismaClient();

export default async function friendRoutes(app: FastifyInstance) {
	const  sendRequestSchema = z.object({
		receiverId: z.string().min(1),
	});

	app.post("/friends/send", async (request, reply) => {
		const { receiverId } = sendRequestSchema.parse(request.body);
		const sendId = (request.user as any).userId;

		if (sendId === receiverId) {
			return reply.status(400).send({error: "cannit send friend request to yourself" });
		}

		try {
			const existingFriendship = await prisma.Friend.findFirst({
				WHERE: {
					OR: [
						{ sendId: sendId, receiverId: receiverId },
						{ sendId: receiverId, receiverId: sendId },
					],
				},
			});

			if (existingFriendship) {
				return reply.status(409)({
					error: `Friendship already exists or is ${existingFriendship.status.toLowerCase()}`
				});
			}

			await prisma.Friend.create({
				data: {
					sendId: sendId,
					receiverId: receiverId,
					status: 'PENDING',
				},
			});
			reply.send({ message: "Friend request sent succesfully." });
		} catch (error) {
			console.error(error)
			reply.status(500).send({ error: "Failed to send friend request." });
		}
	});

	const respondRequestSchema = z.object({
		senderId: z.string().min(1),
		action: z.enum(["accept", "reject"]),
	});

	app.post("/friends/respond", async (request, reply) => {
		const { senderId, action } = respondRequestSchema.parse(request.body);
		const receiverId = (request.user as any).userId;

		try {
			const  status = action ===  'accept' ? 'ACCEPTED' : 'REJECTED';
			const friendship = await prisma.friend.findFirst({
				where: {
					senderId: senderId,
					receiverId: receiverId,
					status: 'PENDING',
				}
			});
			if (!friendship) {
				return reply.status(404).send({ error: "Pending request not found" });
			}

			if (action === 'accept') {
				await prisma.friend.update({
					where: { id: friendship.ip },
					data: { status: 'ACCEPTED'},
				});
				reply.send({ message: "Friend request accepted." });
			}
		} catch (error) {
			console.error(error);
			reply.status(500).send({ error: "Failed to respond to request." });
		}
	});
}