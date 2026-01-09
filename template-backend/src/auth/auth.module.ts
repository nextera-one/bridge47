import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, Module } from '@nestjs/common';

import { NotificationEmails } from '../notification_emails/entities/notification_emails.entity';
import { NotificationEmailsService } from '../notification_emails/notification_emails.service';
import { AuthTokens } from '../auth_tokens/entities/auth_tokens.entity';
import { AuthTokensService } from '../auth_tokens/auth_tokens.service';
import { Users } from '../users/entities/users.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AuthTokens, Users, NotificationEmails])],
  controllers: [AuthController],
  providers: [AuthService, AuthTokensService, NotificationEmailsService],
  exports: [AuthService, AuthTokensService, NotificationEmailsService],
})
export class AuthModule {}
