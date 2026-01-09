// src/common/interceptors/audit.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../constants';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    // 1) if controller or handler is @Public(), just pass through
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) {
      return next.handle();
    }

    // 2) otherwise stamp audit fields on validated DTO (req.body)
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as { id: string } | undefined;
    const now = new Date();
    const method = req.method.toUpperCase();

    // helper to only set if the prop exists
    const stamp = (obj: any) => {
      if (method === 'POST') {
        if ('created_at' in obj) obj.created_at = now;
        if ('created_by' in obj) obj.created_by = user?.id;
      }
      if ('updated_at' in obj) obj.updated_at = now;
      if ('updated_by' in obj) obj.updated_by = user?.id;
    };

    if (Array.isArray(req.body)) {
      req.body.forEach((item) => {
        if (item && typeof item === 'object') stamp(item);
      });
    } else if (req.body && typeof req.body === 'object') {
      stamp(req.body);
    }

    return next.handle();
  }
}
