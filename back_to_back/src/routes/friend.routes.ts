import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken";
import { z } from "zod";
import * as repl from "node:repl";

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

	app.get("/friend", async (request, reply) => {
		const userId = (request.user as any).userId;
		const friendship = await prisma.Friend.findMany({
			where: {
				OR: [
					{ senderId: userId },
					{ receiverId: userId },
				],
			},
			include: {
				sender: { select: {id: true, username: true } },
				receiver: { select: { id: true, username: true } },
			},
		});

		const response = {
			accepted: [],
			pendingSent: [],
			pendingReceived: [],
		};
		friendship.forEach(f => {
			const otherUser = f.senderId === userId ? f.receiver : f.sender;
			if (f.status === 'ACCEPTED') {
				response.accepted.push(otherUser);
			} else if (f.status === 'PENDING'){
				if (f.senderId === userId) {
					response.pendingSent.push(otherUser);
				} else {
					response.pendingReceived.push(otherUser);
				}
			}
		});
		reply.send(response);
	});
}