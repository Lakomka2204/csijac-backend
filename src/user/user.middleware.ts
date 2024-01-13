import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}
  async use(req: Request, _res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth) throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    const [scheme, token] = auth.split(' ');
    if (!scheme || scheme != 'Bearer')
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    const ip =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    if (!ip) throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    const ua = req.headers['user-agent'] as string;
    if (!ua) throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    const authEntry = await this.authService.get(token);
    if (!authEntry) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    if (authEntry.ip != ip || authEntry.ua != ua)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    req.headers.authorization = token;
    next();
  }
}
