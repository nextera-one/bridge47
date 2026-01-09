import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

import { MailService } from '../mail/mail.service';
import DataObject from '../model/data_object';
import { ReadNotificationEmailsDto } from './dto/read-notification_emails.dto';
import { NotificationEmailsService } from './notification_emails.service';

// A type guard to ensure the email has the necessary properties for sending.
function isSendable(email: ReadNotificationEmailsDto): boolean {
  return !!email.to_direct && email.sent;
}

@Injectable()
export class NotificationEmailsScheduler {
  private readonly logger = new Logger(NotificationEmailsScheduler.name);
  private isRunning = false; // Simple in-memory lock to prevent concurrency

  // Configuration values fetched from ConfigService
  private readonly maxSendRetries: number;
  private readonly fetchAttempts: number;
  private readonly fetchDelay: number;

  constructor(
    private readonly notificationEmailsService: NotificationEmailsService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {
    // It's better to fetch config values once in the constructor
    this.maxSendRetries = this.configService.get<number>('email.maxSendRetries', 5);
    this.fetchAttempts = this.configService.get<number>('email.fetch.maxAttempts', 3);
    this.fetchDelay = this.configService.get<number>('email.fetch.delayMs', 2000);
  }

  /** Every 30 seconds: claims and sends pending emails. */
  @Cron(CronExpression.EVERY_30_SECONDS) // Using built-in enum is cleaner
  async handleSendEmails() {
    // 1. Prevent overlapping runs
    if (this.isRunning) {
      this.logger.warn('Skipping run as a previous one is still in progress.');
      return;
    }
    this.isRunning = true;

    try {
      // 2. Claim a batch of emails to process by updating their status
      // This is the most critical change to prevent other workers from sending the same email.
      // This operation should be atomic in your service/repository.
      const emailsToProcess = await this.claimEmailsForProcessing();
      if (!emailsToProcess || emailsToProcess.length === 0) {
        this.logger.log('No pending emails to send.');
        return;
      }

      this.logger.log(`Claimed ${emailsToProcess.length} emails for processing.`);

      // 3. Process each claimed email
      for (const email of emailsToProcess) {
        await this.processEmail(email);
      }
    } catch (err: any) {
      // This catches errors from the claiming step
      this.logger.error('Failed to claim or process email batch.', err.stack);
    } finally {
      // 4. Release the lock regardless of outcome
      this.isRunning = false;
    }
  }

  /**
   * Processes a single email: sends it, and updates its status to 'sent' or 'failed'.
   */
  private async processEmail(email: ReadNotificationEmailsDto): Promise<void> {
    if (!isSendable(email)) {
      return; // Should not happen if claim logic is correct, but a good safeguard.
    }

    try {
      await this.mailService.sendNotification(
        email.to_direct,
        email.subject,
        email.message,
        [email.attachments['logo'] as DataObject],
      );

      await this.notificationEmailsService.update(email.id, {
        sent: true, // Update status to 'sent'
        error: null,
      });

      this.logger.log(`Sent email ${email.id} → ${email.to_direct}`);
    } catch (err: any) {
      this.logger.error(`Error sending email ${email.id}: ${err.message}`, err.stack);
      
      // Update status to 'failed' to prevent infinite retries
      await this.notificationEmailsService.update(email.id, {
        sent: false,
        error: err.message,
      });
    }
  }

  /**
   * Fetches emails that are 'pending' and have not exceeded the retry limit,
   * then marks them as 'processing'. This should be an atomic DB transaction.
   */
  private async claimEmailsForProcessing(): Promise<ReadNotificationEmailsDto[]> {
    // This assumes your service has a method to atomically find and update.
    // This is a common pattern to implement in a repository layer.
    // The goal is to "lock" the rows you are about to process.
    try {
        const emails = await this.notificationEmailsService.findAndMarkForProcessing(
          false, 
          true,
          this.maxSendRetries
        );
        return emails;
    } catch (err: any) {
        this.logger.error(`Failed to claim pending emails: ${err.message || err}`, err);
        // We throw here to let the main handler catch it and log the failure.
        throw err;
    }
    // Note: The original retry logic for fetching has been simplified,
    // as robust connection management is often handled at the ORM/driver level.
    // If needed, the original while-loop could be re-introduced here.
  }
}