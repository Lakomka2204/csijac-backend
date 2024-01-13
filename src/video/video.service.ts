import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class VideoService {
  private client = new PrismaClient({errorFormat:"pretty"});
  async getVideo(id:string) {
    
  }
}