import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Errors } from '../entities/errors.entity';

@EventSubscriber()
export class ErrorsSubscriber implements EntitySubscriberInterface<Errors> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Errors;
  }

  async afterInsert(event: InsertEvent<Errors>): Promise<void> {
    console.log('AFTER INSERT:', event.entity);
  }

  async afterUpdate(event: UpdateEvent<Errors>): Promise<void> {
    console.log('AFTER UPDATE:', event.entity);
  }

  async afterRemove(event: RemoveEvent<Errors>): Promise<void> {
    console.log('AFTER REMOVE:', event.entity);
  }
}
