import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserMiddleware } from "./user.middleware";
import { UserController } from "./user.controller";
import { AuthService } from "src/auth/auth.service";



@Module({
  providers:[UserService,AuthService],
  controllers:[UserController],
  exports:[UserService]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(UserMiddleware).forRoutes(UserController);
  }
}