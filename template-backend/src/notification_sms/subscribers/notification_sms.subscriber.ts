import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { NotificationSms } from '../entities/notification_sms.entity';
//import DtoUtil from '../../util/dto.util';

@EventSubscriber()
export class NotificationSmsSubscriber
  implements EntitySubscriberInterface<NotificationSms>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return NotificationSms;
  }

  async afterInsert(event: InsertEvent<NotificationSms>): Promise<void> {
    console.log(event);
  }

  async afterUpdate(event: UpdateEvent<NotificationSms>): Promise<void> {
    console.log(event);
  }

  async afterRemove(event: RemoveEvent<NotificationSms>): Promise<void> {
    console.log(event);
  }
}
