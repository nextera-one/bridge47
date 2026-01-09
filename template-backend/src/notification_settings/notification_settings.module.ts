import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationSettings } from './entities/notification_settings.entity';
import { NotificationSettingsController } from './notification_settings.controller';
import { NotificationSettingsService } from './notification_settings.service';
import { NotificationSettingsSubscriber } from './subscribers/notification_settings.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationSettings])],
  controllers: [NotificationSettingsController],
  providers: [NotificationSettingsService, NotificationSettingsSubscriber],
  exports: [NotificationSettingsService],
})
export class NotificationSettingsModule {}
