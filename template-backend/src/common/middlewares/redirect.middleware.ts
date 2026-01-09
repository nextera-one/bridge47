import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Only redirect GET / exactly
    if (req.method === 'GET' && req.path === '/') {
      return res.redirect(302, '/api/v1');
    }
    next();
  }
}
