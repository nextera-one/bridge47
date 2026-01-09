import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ReadNotificationSmsDto } from './dto/read-notification_sms.dto';
import { NotificationSmsService } from './notification_sms.service';
import { SmsService } from './sms.service';

/**
 * Ensure the SMS has been claimed for processing before attempting to send.
 */
function isSendable(sms: ReadNotificationSmsDto): boolean {
  return !!sms.to_direct && sms.sent;
}

@Injectable()
export class NotificationSmsScheduler {
  private readonly logger = new Logger(NotificationSmsScheduler.name);
  private isRunning = false; // in‑memory lock

  // pulled from your environment/config
  private readonly maxSendRetries: number;
  private readonly fetchAttempts: number;
  private readonly fetchDelay: number;

  constructor(
    private readonly notificationSmsService: NotificationSmsService,
    private readonly smsService: SmsService,
    private readonly configService: ConfigService,
  ) {
    this.maxSendRetries = this.configService.get<number>('sms.maxSendRetries', 5);
    this.fetchAttempts  = this.configService.get<number>('sms.fetch.maxAttempts', 3);
    this.fetchDelay     = this.configService.get<number>('sms.fetch.delayMs', 2000);
  }

  /** Every 30 seconds: claim & send pending SMS */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleSendSms() {
    if (this.isRunning) {
      this.logger.warn('Skipping run: previous job still in progress.');
      return;
    }
    this.isRunning = true;

    try {
      const smsBatch = await this.claimSmsForProcessing();
      if (!smsBatch.length) {
        this.logger.log('No pending SMS to send.');
        return;
      }
      this.logger.log(`Claimed ${smsBatch.length} SMS messages for processing.`);

      for (const sms of smsBatch) {
        await this.processSms(sms);
      }
    } catch (err: any) {
      this.logger.error('Failed to claim or process SMS batch.', err.stack);
    } finally {
      this.isRunning = false;
    }
  }

  private async processSms(sms: ReadNotificationSmsDto): Promise<void> {
    if (!isSendable(sms)) return;

    try {
      await this.smsService.send({
        to: sms.to_direct,
        message: sms.message,
      });

      await this.notificationSmsService.update(sms.id, {
        sent: true,
        error: null,
      });
      this.logger.log(`Sent SMS ${sms.id} → ${sms.to_direct}`);
    } catch (err: any) {
      this.logger.error(`Error sending SMS ${sms.id}: ${err.message}`, err.stack);
      await this.notificationSmsService.update(sms.id, {
        sent: false,
        error: err.message,
      });
    }
  }

  /**
   * Atomically finds a batch of 'pending' SMS (under retry limit),
   * marks them 'processing', and returns them.
   */
  private async claimSmsForProcessing(): Promise<ReadNotificationSmsDto[]> {
    try {
      return await this.notificationSmsService.findAndMarkForProcessing(
        false,
        true,
        this.maxSendRetries,
      );
    } catch (err: any) {
      this.logger.error(`Failed to claim pending SMS: ${err.message}`, err.stack);
      throw err;
    }
    // Note: if you still need to retry this fetch, you can wrap the above call
    // in a loop using this.fetchAttempts & this.fetchDelay, as in the email scheduler.
  }
}
