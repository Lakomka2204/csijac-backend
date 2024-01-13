import { Body, Controller, Get, HttpException, HttpStatus, Post, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request } from "express";
import { changeUser } from "./user.models";


@Controller("user")
export class UserController {
  constructor(private userService:UserService){}
  @Get()
  async me(@Req() req: Request) {
    return await this.userService.me(req.headers.authorization);
  }
  @Post()
  async changeme(@Req() req: Request, @Body() user: changeUser) {
    if (Object.keys(user).length == 0)
      throw new HttpException("BAD_REQUEST",HttpStatus.BAD_REQUEST);
    const changed = await this.userService.changeUser(req.headers.authorization,user);
    if (!changed) throw new HttpException("NOT CHANGED",HttpStatus.NO_CONTENT);
  }
  @Get("sessions")
  async userSessions(@Req() req:Request) {
    return this.userService.getUserSessions(req.headers.authorization);
  }
}