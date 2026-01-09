import { PartialType } from '@nestjs/swagger';
import { CreateNotificationSettingsDto } from './create-notification_settings.dto';

export class UpdateNotificationSettingsDto extends PartialType(
  CreateNotificationSettingsDto,
) {}
