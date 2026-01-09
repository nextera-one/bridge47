import { WsException } from '@nestjs/websockets';
// src/common/guards/ws-jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

import { AuthTokensService } from '../../auth_tokens/auth_tokens.service';
import { DefaultErrorCodes } from '../../error_codes/default_error_codes';
import CurrentUser from '../../model/current_user.model';
import DtoUtil from '../utils/dto.util';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly authTokens: AuthTokensService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const { token, fingerprint } = client.handshake.auth;

    if (!token) {
      throw new WsException('TOKEN_MISSING');
    }
    if (!fingerprint) {
      throw new WsException('FINGERPRINT_MISSING');
    }

    try {
      // 1. Verify the JWT signature
      await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('JWT_SECRET_KEY'),
      });

      // 2. Find the token in the database
      const authEntity = await this.authTokens.findOneBy('jwt', token);
      if (!authEntity) {
        throw new WsException(DefaultErrorCodes.INVALID_TOKEN);
      }

      // 3. Check the fingerprint
      if (authEntity.fingerprint !== String(fingerprint)) {
        throw new WsException('INVALID_FINGERPRINT');
      }

      // 4. Check if the associated user is valid
      const user = authEntity.users_data;
      if (!user || !(user as any).id) {
        // simplified check from your JwtAuthGuard
        throw new WsException('USER_INACTIVE_OR_BLOCKED');
      }

      // 5. Attach the user object to the socket for use in the gateway
      (client as any).user = DtoUtil.convertToDto(CurrentUser, user);

      return true;
    } catch (err) {
      throw new WsException(err.message || 'INVALID_TOKEN');
    }
  }
}
