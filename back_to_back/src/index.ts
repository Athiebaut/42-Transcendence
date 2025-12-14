import 'dotenv/config';
import fastify from 'fastify';
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import { PrismaClient } from '@prisma/client';

import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import profileAccountRoutes from './routes/profile.account.routes.js';
import historyRoutes from './routes/history.routes.js';
import authGoogleRoutes from "./routes/auth-google.routes.js";
import avatarRoutes from "./routes/avatar.routes.js";
import friendRoutes from './routes/friend.routes.js';

const app = fastify({ logger: true });
const prisma = new PrismaClient();
app.decorate("prisma", prisma);
app.addHook("onClose", async () => {
	await prisma.$disconnect();
});

const start = async () => {
	try {
		await app.register(multipart);
		await app.register(cors, {
			origin: true,
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowedHeaders: ['content-type', 'authorization']
		});
		app.register(cookie, {
			secret: process.env.JWT_SECRET,
		})
		await app.register(formbody);
		await app.register(authGoogleRoutes);
		await app.register(authRoutes);
		await app.register(userRoutes);
		await app.register(profileAccountRoutes);
		await app.register(friendRoutes);
		await app.register(historyRoutes);
		await app.register(avatarRoutes);
		app.get("/test", async () => ({ message: "API OK" }));
		app.get("/", async () => ({ message: "Serveur en ligne" }));
		await app.ready();
		console.log("\nROUTES ACTIVES :");
		console.log(app.printRoutes());
		console.log("-------------------\n");

		await app.listen({ port: 3042, host: "0.0.0.0" });
		console.log("✅ Serveur lancé sur http://localhost:3042");

	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start();
