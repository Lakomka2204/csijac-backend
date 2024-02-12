import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { VideoService } from "./video.service";
import { VideoController } from "./video.controller";
import { VideoMiddleware } from "./video.middleware";
import { AuthService } from "src/auth/auth.service";

@Module({
  providers:[VideoService,AuthService],
  controllers:[VideoController],
})
export class VideoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(VideoMiddleware).forRoutes(VideoController);
  }
}