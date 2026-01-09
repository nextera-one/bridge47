import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { NotificationSettings } from '../entities/notification_settings.entity';

@EventSubscriber()
export class NotificationSettingsSubscriber
  implements EntitySubscriberInterface<NotificationSettings>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return NotificationSettings;
  }

  async afterInsert(event: InsertEvent<NotificationSettings>): Promise<void> {
    console.log('AFTER INSERT:', event.entity);
  }

  async afterUpdate(event: UpdateEvent<NotificationSettings>): Promise<void> {
    console.log('AFTER UPDATE:', event.entity);
  }

  async afterRemove(event: RemoveEvent<NotificationSettings>): Promise<void> {
    console.log('AFTER REMOVE:', event.entity);
  }
}
