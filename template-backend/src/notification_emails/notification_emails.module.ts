import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailService } from '../mail/mail.service';
import { NotificationEmails } from './entities/notification_emails.entity';
import { NotificationEmailsScheduler } from './notification-emails.scheduler';
import { NotificationEmailsController } from './notification_emails.controller';
import { NotificationEmailsService } from './notification_emails.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEmails])],
  controllers: [NotificationEmailsController],
  providers: [
    NotificationEmailsService,
    NotificationEmailsScheduler,
    MailService,
  ],
  exports: [NotificationEmailsService],
})
export class NotificationEmailsModule {}
