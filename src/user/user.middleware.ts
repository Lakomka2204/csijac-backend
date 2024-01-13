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
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('sex middleware');
    const auth = req.headers.authorization;
    if (!auth) return res.sendStatus(HttpStatus.FORBIDDEN);
    const [scheme, token] = auth.split(' ');
    if (!scheme || scheme != 'Bearer') return res.sendStatus(HttpStatus.FORBIDDEN);
    const ip =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    if (!ip) return res.sendStatus(HttpStatus.FORBIDDEN);
    const ua = req.headers['user-agent'] as string;
    if (!ua) return res.sendStatus(HttpStatus.FORBIDDEN);
    const authStatus = await this.userService.checkAuth(token, { ip, ua });
    if (authStatus == true) next();
    else return res.status(HttpStatus.FORBIDDEN).type("text").send(authStatus);
  }
}
