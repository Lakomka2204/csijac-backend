import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
  private static readonly client = new PrismaClient({ errorFormat: 'pretty' });
  async create(user: AuthUserDto) {
    if (
      await UserService.client.users.findFirst({ where: { username: user.username } })
    )
      throw new Error('User already exists');
    return await UserService.client.users.create({ data: user });
  }
  async get(id: string) {
    return await UserService.client.users.findFirst({ where: { id } });
  }
  async getByName(username: string) {
    return await UserService.client.users.findFirst({ where: { username } });
  }
  async edit(id: string, user: EditUserDto) {
    if (user.password)
      await UserService.client.auth.deleteMany({ where: { user_id: id } });
    return await UserService.client.users.update({ data: user, where: { id } });
  }
  async delete(id: string) {
    return await UserService.client.users.delete({ where: { id } });
  }
}
