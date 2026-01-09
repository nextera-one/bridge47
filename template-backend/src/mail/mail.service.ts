// src/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { SendMailOptions } from 'nodemailer';
import * as nodemailer from 'nodemailer';

import DataObject from '../model/data_object';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const ttlsEnabled =
      this.configService.get<boolean>('MAIL_SMTP_TTLS') !== false &&
      this.configService.get<string>('MAIL_SMTP_TTLS') !== 'false';
    const transporterOptions = {
      host: this.configService.get<string>('MAIL_SMTP_HOST'),
      port: Number(this.configService.get('MAIL_SMTP_PORT')),
      secure:
        Number(this.configService.get('MAIL_SMTP_PORT')) === 465 && ttlsEnabled, // true for SSL (port 465), false for STARTTLS (port 587)
      requireTLS: ttlsEnabled, // Use TLS/STARTTLS based on environment settings
      auth: {
        user: this.configService.get<string>('MAIL_SMTP_USER'),
        pass: this.configService.get<string>('MAIL_SMTP_PASS'),
      },
      connectionTimeout: 10000, // max time to connect
      greetingTimeout: 5000, // max time to wait for greeting after connection
      socketTimeout: 10000, // max idle time before closing socket
    } as nodemailer.TransportOptions;
    this.transporter = nodemailer.createTransport(transporterOptions);
  }

  /**
   * Send a generic email.
   */
  async sendMail(options: SendMailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail(options);
      this.logger.log(`Email sent: ${info.messageId}`);
    } catch (err) {
      this.logger.error('Failed to send email', err);
      throw err;
    }
  }

  /**
   * Send a notification email from your NotificationEmailsService
   */
  async sendNotification(
    to: string,
    subject: string,
    template: string, // template name e.g. 'welcome'
    attachments?: Array<DataObject>,
  ): Promise<void> {
    const mailOptions: SendMailOptions = {
      from: `"We Notify" <${this.configService.get('MAIL_SMTP_USER')}>`,
      to,
      subject,
      html: template,
      attachments,
    };

    const result = await this.sendMail(mailOptions);
    console.log(result);
  }
}
