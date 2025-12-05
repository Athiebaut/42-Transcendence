import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { generateTwoFactorAuthenticationSecret, generateQrCodeDataURL } from "../2FA-JWT/src/auth/auth.service.ts";

export class UserService {

	private id: number;
	private PrismaClient: PrismaClient;

	constructor(id: number) {
		this.id = id;
		this.PrismaClient = new PrismaClient;
	}

	async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
		return this.PrismaClient.user.update({
			where: { id: userId },
			data: { twoFactorAuthenticationSecret: secret },
		});
	}

	async turnOnTwoFactorAuthentication(userId: number) {
		return this.PrismaClient.user.update({
			where: { id: userId },
			data: { isTwoFactorAuthenticationEnabled: true },
		});
	}
}

export default async function adfRoute(app: FastifyInstance) {
	app.get("/a2fregister", async (request, reply) => {
		const user = request.user;

		const { otpauthUrl } = await generateTwoFactorAuthenticationSecret(user);
		const qrCodeUrl = await generateQrCodeDataURL(otpauthUrl);
		return ();
	});
}