import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Notifications } from '../entities/notifications.entity';

@EventSubscriber()
export class NotificationsSubscriber
  implements EntitySubscriberInterface<Notifications>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Notifications;
  }

  async afterInsert(event: InsertEvent<Notifications>): Promise<void> {
    console.log('AFTER INSERT:', event.entity);
  }

  async afterUpdate(event: UpdateEvent<Notifications>): Promise<void> {
    console.log('AFTER UPDATE:', event.entity);
  }

  async afterRemove(event: RemoveEvent<Notifications>): Promise<void> {
    console.log('AFTER REMOVE:', event.entity);
  }
}
