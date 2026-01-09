import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { ErrorCodes } from '../entities/error_codes.entity';

@EventSubscriber()
export class ErrorCodesSubscriber
  implements EntitySubscriberInterface<ErrorCodes>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ErrorCodes;
  }

  async afterInsert(event: InsertEvent<ErrorCodes>): Promise<void> {
    console.log('AFTER INSERT:', event.entity);
  }

  async afterUpdate(event: UpdateEvent<ErrorCodes>): Promise<void> {
    console.log('AFTER UPDATE:', event.entity);
  }

  async afterRemove(event: RemoveEvent<ErrorCodes>): Promise<void> {
    console.log('AFTER REMOVE:', event.entity);
  }
}
