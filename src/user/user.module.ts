import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserMiddleware } from "./user.middleware";
import { UserController } from "./user.controller";



@Module({
  providers:[UserService],
  controllers:[UserController]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(UserMiddleware).forRoutes(UserController);
  }
}