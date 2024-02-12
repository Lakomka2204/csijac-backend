import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from "@nestjs/common";
import { VideoService } from "./video.service";

@Controller("video")
export class VideoController {
  constructor(
    private readonly videoService: VideoService
  ){}
    @Get(":id")
    async get() {

    }
}