import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TwoFactorService {
	static async generateSecret(email: string) {
		const secret = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri(email, 'FT_TRANSCENDENCE', secret);
		return { secret, otpauthUrl };
	}

	static async generateQrCode(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	}

	static verifyCode(token: string, secret: string) {
		return authenticator.verify({ token, secret });
	}

	static async saveSecret(userId: number, secret: string) {
		return prisma.user.update({
			where: { id: userId },
			data: { twoFactorAuthenticationSecret: secret }
		});
	}

	static async enable2FA(userId: number) {
		return prisma.user.update({
			where: { id: userId },
			data: { isTwoFactorAuthenticationEnabled: true }
		});
	}
}
