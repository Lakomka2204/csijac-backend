import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthWithIP } from './auth.models';
import { AppService } from 'src/app.service';

@Injectable()
export class AuthService {
  constructor(private appService: AppService) {}
  client = new PrismaClient({ errorFormat: 'pretty' });
  async register(user: AuthWithIP): Promise<string> {
    const { username, password, ip, ua } = user;
    const dbUser = await this.client.users.findFirst({
      where: { username },
    });
    if (dbUser)
      throw new HttpException('User already exists', HttpStatus.FORBIDDEN);
    const { id } = await this.client.users.create({
      data: {
        username,
        password: await this.appService.encryptPassword(password),
      },
      select: { id: true },
    });
    const { token } = await this.client.auth.create({
      data: { ip, ua, user_id: id },
      select: { token: true },
    });
    return token;
  }
  async login(user: AuthWithIP) {
    const { username, password, ip, ua } = user;
    const dbUser = await this.client.users.findFirst({
      select: { id: true, password: true },
      where: { username },
    });
    if (!dbUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (!(await this.appService.checkPassword(password, dbUser.password)))
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    const { token, id } = await this.client.auth.findFirst({
      select: { token: true, id: true },
      where: { ip, ua, user_id: dbUser.id },
    });
    if (id) {
      await this.client.auth.update({
        where: { id },
        data: {
          last_accessed_at: new Date(),
        },
      });
      return token;
    } else {
      const { token: newToken } = await this.client.auth.create({
        data: { ip, ua, user_id: dbUser.id },
        select: { token: true },
      });
      return newToken;
    }
  }
}
