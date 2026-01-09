import { PartialType } from '@nestjs/swagger';
import { CreateNotificationEmailsDto } from './create-notification_emails.dto';

export class UpdateNotificationEmailsDto extends PartialType(
  CreateNotificationEmailsDto,
) {}
