import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { plainToClass } from 'class-transformer';
import { ReturnUserDto } from './dto/return-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { validate } from 'class-validator';
import { AppService } from 'src/app.service';
import { ReturnAuthDto } from 'src/auth/dto/return-auth.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly appService: AppService,
  ) {}
  @Get()
  async me(@Req() req: Request) {
    const auth = await this.authService.get(req.headers.authorization);
    const user = await this.userService.get(auth.user_id);
    return plainToClass(ReturnUserDto, user);
  }
  @Post()
  async changeme(@Req() req: Request, @Body() user: EditUserDto) {
    user = plainToClass(EditUserDto, user);
    const errors = await validate(user);
    if (errors.length > 0) throw new BadRequestException(errors);
    const auth = await this.authService.get(req.headers.authorization);
    if (user.password)
      user.password = await this.appService.encryptPassword(user.password);
    const userChange = await this.userService.edit(auth.user_id, user);
    return plainToClass(ReturnUserDto, userChange);
  }
  @Get('sessions')
  async userSessions(@Req() req: Request) {
    const auth = await this.authService.get(req.headers.authorization);
    const auths = await this.authService.getByUserId(auth.user_id);
    return auths.map((x) =>
      plainToClass(ReturnAuthDto, {
        ...x,
        current: x.token === req.headers.authorization,
      }),
    );
  }
}
