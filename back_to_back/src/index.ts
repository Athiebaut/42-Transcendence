import 'dotenv/config';
import fastify from 'fastify';
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import multipart from '@fastify/multipart';
import { PrismaClient } from '@prisma/client';

import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import historyRoutes from './routes/history.routes.js';
import authGoogleRoutes from "./routes/auth-google.routes.js";

const app = fastify({ logger: true });
const prisma = new PrismaClient();

const start = async () => {
	try {
		await app.register(multipart);
		await app.register(cors, {
			origin: true,
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowedHeaders: ['content-type', 'authorization']
		});
		await app.register(formbody);
		await app.register(authGoogleRoutes);
		await app.register(authRoutes);
		await app.register(userRoutes);
		await app.register(profileRoutes);
		await app.register(historyRoutes);
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
