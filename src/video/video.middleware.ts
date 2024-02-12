import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class VideoMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}
  async use(req: Request, _res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth) return next();
    const [scheme, token] = auth.split(' ');
    if (!scheme || scheme != 'Bearer')
      return next();
    const ip =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    if (!ip) return next();
    const ua = req.headers['user-agent'] as string;
    if (!ua) return next();
    const authEntry = await this.authService.get(token);
    if (!authEntry) return next();
    if (authEntry.ip != ip || authEntry.ua != ua)
      return next();
    req.headers.authorization = token;
    next();
  }
}
