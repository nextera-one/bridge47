import { PartialType } from '@nestjs/swagger';
import { CreateNotificationSmsDto } from './create-notification_sms.dto';

export class UpdateNotificationSmsDto extends PartialType(
  CreateNotificationSmsDto,
) {}
