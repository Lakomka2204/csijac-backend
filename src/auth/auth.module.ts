import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "src/user/user.service";
import { AppService } from "src/app.service";
@Module({
  providers:[AuthService,UserService,AppService],
  controllers: [AuthController],
})
export class AuthModule{}