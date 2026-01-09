import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  /**
   * Send an SMS message
   * @param to recipient phone number
   * @param message SMS text content
   */
  async send({ to, message }: { to: string; message: string }): Promise<void> {
    try {
      // Example placeholder logic - replace with actual provider integration
      if (!to || !message) {
        throw new Error('Missing to or message field');
      }

      // Simulate sending delay
      await new Promise((res) => setTimeout(res, 100));

      // Log instead of sending for now
      this.logger.log(`Mock SMS sent to ${to}: "${message}"`);

      // In real usage, call an HTTP API or SDK here
      // await axios.post(SMS_API_URL, { to, message, ...authHeaders });
    } catch (err) {
      this.logger.error(`Failed to send SMS to ${to}`, err as any);
      throw err;
    }
  }
}
