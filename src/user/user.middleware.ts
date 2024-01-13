import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: Request, _res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth) throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    const [scheme, token] = auth.split(' ');
    if (!scheme || scheme != 'Bearer') throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    const ip =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    if (!ip) throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    const ua = req.headers['user-agent'] as string;
    if (!ua) throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    const authStatus = await this.userService.checkAuth(token, { ip, ua });
    if (authStatus == true) {
      req.headers.authorization = token;
      next();
    }
    else throw new HttpException(authStatus.toUpperCase(), HttpStatus.FORBIDDEN);
  }
}
