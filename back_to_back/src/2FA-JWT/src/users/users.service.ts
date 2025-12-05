import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorAuthenticationSecret: secret },
    });
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorAuthenticationEnabled: true },
    });
  }
}
