import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAuthDto } from './dto/create-auth.dto';
import { GetAuthDto } from './dto/get-auth.dto';

@Injectable()
export class AuthService {
  private static readonly client: PrismaClient = new PrismaClient({ errorFormat: 'pretty' });
  async create(auth: CreateAuthDto) {
    return await AuthService.client.auth.create({data:auth});
  }
  async get(token:string) {
    return await AuthService.client.auth.findFirst({where:{token}});
  }
  async getByUserId(user_id:string) {
    return await AuthService.client.auth.findMany({where:{user_id}});
  }
  async getByIpUaUser(auth: GetAuthDto) {
    return await AuthService.client.auth.findFirst({where:auth});
  }
  async edit(token: string) {
    return await AuthService.client.auth.update({data:{last_accessed_at:new Date()},where:{token}});
  }
  async delete(token:string) {
    return await AuthService.client.auth.delete({where:{token}});
  }
}
