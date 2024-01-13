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
import { AuthUserDto } from './dto/auth-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { AppService } from 'src/app.service';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly appService: AppService,
  ) {}
  @Post('register')
  async register(
    @Req() req: Request,
    @Body() user: AuthUserDto,
    @Res() res: Response,
  ) {
    user = plainToClass(AuthUserDto,user);
    const errors = await validate(user);
    if (errors.length > 0)
      throw new HttpException(errors,HttpStatus.BAD_REQUEST,{cause:errors});
    const ip =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const ua = req.headers['user-agent'] as string;
    if (!ua) throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    const dbUser = await this.userService.getByName(user.username);
    if (dbUser)
      throw new HttpException('CONFLICT', HttpStatus.CONFLICT);
    user.password = await this.appService.encryptPassword(user.password);
    const { id } = await this.userService.create(user);
    const { token } = await this.authService.create({ ip, ua, user_id: id });
    res.header('Authorization', 'Bearer ' + token);
    res.status(HttpStatus.CREATED).send();
  }
  @Post('login')
  async login(
    @Req() req: Request,
    @Body() user: AuthUserDto,
    @Res() res: Response,
  ) {
    if (JSON.stringify(user) === '{}')
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    const ip =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const ua = req.headers['user-agent'] as string;
    if (!ua) throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    const dbUser = await this.userService.getByName(user.username);
    if (!dbUser) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    const passCheck = await this.appService.checkPassword(
      user.password,
      dbUser.password,
    );
    if (!passCheck)
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    let auth = await this.authService.getByIpUa({ ip, ua });
    if (!auth)
      auth = await this.authService.create({ ip, ua, user_id: dbUser.id });
    res.header('Authorization', 'Bearer ' + auth.token);
    res.status(HttpStatus.ACCEPTED).send();
  }
}
