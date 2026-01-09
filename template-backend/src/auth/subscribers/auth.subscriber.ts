import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Auth } from '../entities/auth.entity';

@EventSubscriber()
export class AuthSubscriber implements EntitySubscriberInterface<Auth> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Auth;
  }

  async afterInsert(event: InsertEvent<Auth>): Promise<void> {
    console.log('AFTER INSERT:', event.entity);
  }

  async afterUpdate(event: UpdateEvent<Auth>): Promise<void> {
    console.log('AFTER UPDATE:', event.entity);
  }

  async afterRemove(event: RemoveEvent<Auth>): Promise<void> {
    console.log('AFTER REMOVE:', event.entity);
  }
}
