import { Body, Controller, Get, HttpException, HttpStatus, Post, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request } from "express";
import { changeUser } from "./user.models";


@Controller("user")
export class UserController {
  constructor(private userService:UserService){}
  @Get()
  async me(@Req() req: Request) {
    
  }
  @Post()
  async changeme(@Req() req: Request, @Body() user: changeUser) {
    if (JSON.stringify(user) == "{}")
      throw new HttpException("BAD_REQUEST",HttpStatus.BAD_REQUEST);
  }
  @Get("sessions")
  async userSessions(@Req() req:Request) {
    
  }
}