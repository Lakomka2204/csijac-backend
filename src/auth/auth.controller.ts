import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthBase } from './auth.models';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private userService: AuthService) {}
  @Post('register')
  async register(
    @Req() req: Request,
    @Body() user: AuthBase,
    @Res() res: Response,
  ) {
    if (Object.keys(user).length == 0)
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    const ip =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const ua = req.headers['user-agent'] as string;
    if (!ua) throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    const token = await this.userService.login({
      ...user,
      ua,
      ip,
    });
    res.header('Authorization', 'Bearer ' + token);
    res.status(HttpStatus.CREATED).send();
  }
  @Post('login')
  async login(
    @Req() req: Request,
    @Body() user: AuthBase,
    @Res() res: Response,
  ) {
    if (Object.keys(user).length == 0)
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    const ip =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const ua = req.headers['user-agent'] as string;
    if (!ua) throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    const token = await this.userService.login({
      ...user,
      ua,
      ip,
    });
    res.header('Authorization', 'Bearer ' + token);
    res.status(HttpStatus.ACCEPTED).send();
  }
}
