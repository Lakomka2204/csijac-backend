import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
  client = new PrismaClient({ errorFormat: 'pretty' });
  async create(user: AuthUserDto) {
    return await this.client.users.create({data:user});
  }
  async get(id:string) {
    return await this.client.users.findFirst({where:{id}});
  }
  async getByName(username:string) {
    return await this.client.users.findFirst({where:{username}});
  }
  async edit(id:string,user: EditUserDto) {
    return await this.client.users.update({data:user,where:{id}});
  }
  async delete(id:string) {
    return await this.client.users.delete({where:{id}});
  }
}
