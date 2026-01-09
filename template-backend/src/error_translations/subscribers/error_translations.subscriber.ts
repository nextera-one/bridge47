import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { ErrorTranslations } from '../entities/error_translations.entity';

@EventSubscriber()
export class ErrorTranslationsSubscriber
  implements EntitySubscriberInterface<ErrorTranslations>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ErrorTranslations;
  }

  async afterInsert(event: InsertEvent<ErrorTranslations>): Promise<void> {
    console.log('AFTER INSERT:', event.entity);
  }

  async afterUpdate(event: UpdateEvent<ErrorTranslations>): Promise<void> {
    console.log('AFTER UPDATE:', event.entity);
  }

  async afterRemove(event: RemoveEvent<ErrorTranslations>): Promise<void> {
    console.log('AFTER REMOVE:', event.entity);
  }
}
