import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
// src/notifications/notifications.gateway.ts
import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

// Extend Socket interface to include 'user'
declare module 'socket.io' {
  interface Socket {
    user?: CurrentUser;
  }
}

import { AuthTokensService } from '../auth_tokens/auth_tokens.service';
import { WsJwtGuard } from '../common/guards/ws-jwt.guard';
import DtoUtil from '../common/utils/dto.util';
import { DefaultErrorCodes } from '../error_codes/default_error_codes';
import CurrentUser from '../model/current_user.model';
import { NotificationsService } from './notifications.service';

@UseGuards(WsJwtGuard) // Protect the entire gateway
@WebSocketGateway({
  cors: {
    origin: '*', // Adjust for your frontend URL in production
    credentials: false,
  },
  transports: ['websocket', 'polling'],
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly authTokens: AuthTokensService,
  ) {}

  afterInit() {
    this.server.use(async (socket: Socket, next) => {
      try {
        const { token, fingerprint } = socket.handshake.auth ?? {};
        if (!token) return next(new Error('TOKEN_MISSING'));
        if (!fingerprint) return next(new Error('FINGERPRINT_MISSING'));

        // Verify JWT (throws on invalid/expired)
        await this.jwtService.verifyAsync(token, {
          secret: this.config.get<string>('JWT_SECRET_KEY'),
        });

        // Look up token in DB
        const authEntity = await this.authTokens.findOneBy('jwt', token);
        if (!authEntity)
          return next(new Error(DefaultErrorCodes.INVALID_TOKEN));
        if (String(authEntity.fingerprint) !== String(fingerprint)) {
          return next(new Error('INVALID_FINGERPRINT'));
        }

        const user = authEntity.users_data;
        if (!user || !(user as any).id)
          return next(new Error('USER_INACTIVE_OR_BLOCKED'));

        // Attach the user for later usage
        socket.user = DtoUtil.convertToDto(CurrentUser, user);
        return next();
      } catch (e: any) {
        return next(new Error(e?.message || 'INVALID_TOKEN'));
      }
    });
  }

  // This method is called after the WsJwtGuard successfully authenticates the user
  // handleConnection(client: Socket) {
  //   const user = (client as any).user as CurrentUser;
  //   if (user && user.id) {
  //     this.notificationsService.registerClient(user.id, client);
  //   }
  // }

  // handleDisconnect(client: Socket) {
  //   const user = (client as any).user as CurrentUser;
  //   if (user && user.id) {
  //     this.notificationsService.removeClient(user.id);
  //   }
  // }

  handleConnection(client: Socket) {
    if (client.user?.id) {
      this.notificationsService.registerClient(client.user.id, client);
    }
  }

  handleDisconnect(client: Socket) {
    if (client.user?.id) {
      this.notificationsService.removeClient(client.user.id);
    }
  }
}
