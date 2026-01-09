// src/mail/mail.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailService } from './mail.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'MAIL_TRANSPORTER',
      useFactory: (cfg: ConfigService) => {
        const nodemailer = require('nodemailer');
        return nodemailer.createTransport({
          host: cfg.get<string>('SMTP_HOST'),
          port: cfg.get<number>('SMTP_PORT'),
          secure: cfg.get<boolean>('SMTP_SECURE'),
          auth: {
            user: cfg.get<string>('SMTP_USER'),
            pass: cfg.get<string>('SMTP_PASS'),
          },
          pool: true,
          maxConnections: 5,
          maxMessages: 100,
        });
      },
      inject: [ConfigService],
    },
    MailService,
  ],
  exports: [MailService, 'MAIL_TRANSPORTER'],
})
export class MailModule {}
