import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationSms } from './entities/notification_sms.entity';
import { NotificationSmsController } from './notification_sms.controller';
import { NotificationSmsService } from './notification_sms.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationSms])],
  controllers: [NotificationSmsController],
  providers: [NotificationSmsService],
  exports: [NotificationSmsService],
})
export class NotificationSmsModule {}
