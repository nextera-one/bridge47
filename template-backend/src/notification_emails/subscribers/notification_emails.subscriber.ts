import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { NotificationEmails } from '../entities/notification_emails.entity';
//import DtoUtil from '../../util/dto.util';

@EventSubscriber()
export class NotificationEmailsSubscriber
  implements EntitySubscriberInterface<NotificationEmails>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return NotificationEmails;
  }

  async afterInsert(event: InsertEvent<NotificationEmails>): Promise<void> {
    console.log(event);
  }

  async afterUpdate(event: UpdateEvent<NotificationEmails>): Promise<void> {
    console.log(event);
  }

  async afterRemove(event: RemoveEvent<NotificationEmails>): Promise<void> {
    console.log(event);
  }
}
