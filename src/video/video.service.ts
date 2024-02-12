import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { UploadVideo } from "./dto/upload-video.dto";

@Injectable()
export class VideoService {
  private static readonly client = new PrismaClient({errorFormat:"pretty"});
  async getVideoInfo(id:string) {
    return await VideoService.client.videos.findFirst({where:{id}});
  }
  async create(video: UploadVideo) {
    return await VideoService.client.videos.create({data:video});
  }
}