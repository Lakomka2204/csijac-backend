import { Injectable } from '@nestjs/common';
import { PrismaClient, users } from '@prisma/client';
import { changeUser } from './user.models';

type authCheck = true | 'No login' | 'Mismatch IP' | 'Mismatch UA';
@Injectable()
export class UserService {
  client = new PrismaClient({ errorFormat: 'pretty' });
  async checkAuth(
    token: string,
    actualUser: { ip: string; ua: string },
  ): Promise<authCheck> {
    const authEntry = await this.client.auth.findFirst({
      select: { ip: true, ua: true, id: true },
      where: { token },
    });
    if (!authEntry) return 'No login';
    if (authEntry.ip != actualUser.ip) return 'Mismatch IP';
    if (authEntry.ua != actualUser.ua) return 'Mismatch UA';
    return true;
  }
  async me(token: string) {
    const prikol = await this.client.auth.findFirst({
      where: { token },
      select: {
        users: {
          select: {
            id: true,
            avatar: true,
            created_at: true,
            username: true,
            display_name: true,
            preferences: true,
          },
        },
      },
    });
    return prikol.users;
  }
  async changeUser(token:string,user: changeUser) {
    const changed = await this.client.users.updateMany({
      where: {
        auth: {
          some: {token},
        },
      },
      data:{...user},
    });
    return !!changed;
  }
  async getUserSessions(token:string) {
    return (await this.client.auth.findFirst({
      where: { token },
      select: {
        users: {
          select: {
            auth:{
              select:{
                ip:true,
                ua:true,
                last_accessed_at:true,
                created_at:true,
                additional_info:true
              }
            }
          },
        },
      },
    })).users.auth;
    
  }
}
