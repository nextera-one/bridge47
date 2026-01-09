// src/common/guards/jwt-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ClsService } from 'nestjs-cls';
import { Request } from 'express';

import { AuthTokensService } from '../../auth_tokens/auth_tokens.service';
import { DefaultErrorCodes } from '../../error_codes/default_error_codes';
import CurrentUser from '../../model/current_user.model';
import { ReadUsersDto } from 'src/users/dto/read-users.dto';
import { UsersService } from '../../users/users.service';
import DtoUtil from '../utils/dto.util';
import { IS_PUBLIC_KEY } from '../constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly authTokens: AuthTokensService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
    private readonly cls: ClsService,
  ) {}

  private extractToken(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    const req = ctx.switchToHttp().getRequest<Request>();
    const token = this.extractToken(req);
    //check fingerprint
    const fingerprint = req.headers['x-fingerprint'];
    if (!fingerprint) {
      throw new UnauthorizedException('FINGERPRINT_MISSING');
    }
    const rayId = req.headers['x-ray-id'];
    if (!rayId) {
      throw new UnauthorizedException('RAY_ID_MISSING');
    }

    this.cls.set('fingerprint', fingerprint);
    this.cls.set('rayId', rayId);
    if (isPublic) {
      // If public, we still optionally populate req.user if token present, execlude auth/logout
      await this.verifyToken(isPublic, token, req);
      return true;
    }

    // Non-public: token required
    if (!token) {
      throw new UnauthorizedException('TOKEN_MISSING');
    }
    await this.verifyToken(isPublic, token, req);

    const authEntity = await this.authTokens.findOneBy('jwt', token);
    if (!authEntity) {
      throw new UnauthorizedException(DefaultErrorCodes.INVALID_TOKEN);
    }

    if (authEntity.fingerprint !== String(fingerprint)) {
      throw new UnauthorizedException('INVALID_FINGERPRINT');
    }

    if (!authEntity.users_data) {
      throw new UnauthorizedException('INVALID_USER');
    }

    const user = authEntity.users_data; //await this.usersService.findOne(authEntity.users_data.id);
    if (!user || !(user as any).id) {
      //!user.active || user.blocked
      throw new UnauthorizedException('USER_INACTIVE_OR_BLOCKED');
    }
    // attach to request
    (req as any).user = DtoUtil.convertToDto(CurrentUser, user);
    this.cls.set('user', user);
    this.cls.set('userId', (user as any).id);
    return true;
  }

  verifyToken = async (isPublic: boolean, token: string, req: Request) => {
    if (token && token !== 'null' && token !== 'undefined' && token !== '') {
      try {
        const authEntity = await this.authTokens.findOneBy('jwt', token);
        if (authEntity) {
          await this.jwtService.verifyAsync(token, {
            secret: this.config.get<string>('JWT_SECRET_KEY'),
          });
          const user = authEntity.users_data as ReadUsersDto;
          if (user) {
            if (!user.active) {
              throw new UnauthorizedException(DefaultErrorCodes.USER_INACTIVE);
            }
            if (user.blocked) {
              throw new UnauthorizedException(DefaultErrorCodes.USER_BLOCKED);
            }
            (req as any).user = DtoUtil.convertToDto(CurrentUser, user);
          } else {
            if (!isPublic)
              throw new UnauthorizedException(DefaultErrorCodes.INVALID_TOKEN);
          }
        } else {
          if (!isPublic)
            throw new UnauthorizedException(DefaultErrorCodes.INVALID_TOKEN);
        }
      } catch {
        if (!isPublic)
          throw new UnauthorizedException(DefaultErrorCodes.INVALID_TOKEN);
      }
    }
  };
}
