import { TypeOrmModule } from '@nestjs/typeorm';
// src/notifications/notifications.module.ts
import { Module } from '@nestjs/common';

import { NotificationsSubscriber } from './subscribers/notifications.subscriber';
// Assuming you have an AuthTokensModule that provides AuthTokensService
import { AuthTokensModule } from '../auth_tokens/auth_tokens.module'; // 1. Import the module

import { Notifications } from './entities/notifications.entity';
import { WsJwtGuard } from '../common/guards/ws-jwt.guard';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notifications]),
    AuthTokensModule, // 2. Add the module to the imports array
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsSubscriber,
    NotificationsGateway,
    WsJwtGuard,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
