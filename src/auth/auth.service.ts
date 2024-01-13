import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAuthDto } from './dto/create-auth.dto';
import { EditAuthDto } from './dto/edit-auth.dto';
import { GetAuthDto } from './dto/get-auth.dto';

@Injectable()
export class AuthService {
  client = new PrismaClient({ errorFormat: 'pretty' });
  async create(auth: CreateAuthDto) {
    return await this.client.auth.create({data:auth});
  }
  async get(token:string) {
    return await this.client.auth.findFirst({where:{token}});
  }
  async getByUserId(user_id:string) {
    return await this.client.auth.findMany({where:{user_id}});
  }
  async getByIpUa(auth: GetAuthDto) {
    return await this.client.auth.findFirst({where:auth});
  }
  async edit(auth: EditAuthDto) {
    return await this.client.auth.update({data:{last_accessed_at:new Date()},where:auth});
  }
  async delete(token:string) {
    return await this.client.auth.delete({where:{token}});
  }
}
