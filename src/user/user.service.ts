import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";


type authCheck = true | "No login" | "Mismatch IP" | "Mismatch UA";
@Injectable()
export class UserService {
  client= new PrismaClient({errorFormat:"pretty"})
  async checkAuth(token:string,actualUser: {ip:string,ua:string}): Promise<authCheck> {
    const authEntry = await this.client.auth.findFirst({
      select:{ip:true,ua:true,id:true},
      where:{token}
    });
    if (!authEntry) return "No login";
    if (authEntry.ip != actualUser.ip) return "Mismatch IP";
    if (authEntry.ua != actualUser.ua) return "Mismatch UA";
    return true;
  }
}