import GeneratorHelper from '../utils/generator.helper';

/**
 * Generates the string content for a TypeORM Entity Subscriber class.
 * Subscribers are used to listen for specific entity events (e.g., insert, update, remove)
 * and execute code in response to those events.
 *
 * @param {string} tableName - The snake_case name of the database table, used to identify the target entity.
 * @returns {string} A string containing the full TypeScript code for the subscriber.
 */
export function generateSubscriber(tableName: string): string {
  const className = GeneratorHelper.snakeToPascal(tableName);
  return `
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { ${className} } from '../entities/${tableName}.entity';

@EventSubscriber()
export class ${className}Subscriber implements EntitySubscriberInterface<${className}> {
  /**
   * The constructor registers this subscriber with the TypeORM DataSource,
   * making it active and ready to listen for events.
   * @param {DataSource} dataSource - The main application's DataSource, injected by NestJS.
   */
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  /**
   * This method specifies which entity this subscriber will listen to.
   * @returns {Function} The entity class to listen for.
   */
  listenTo() {
    return ${className};
  }

  /**
   * This method is called after a new ${className} entity is inserted into the database.
   * @param {InsertEvent<${className}>} event - The event object containing the inserted entity.
   */
  async afterInsert(event: InsertEvent<${className}>): Promise<void> {
    // TODO: Implement logic to run after an insert operation, e.g., logging, auditing, sending notifications.
    console.log('AFTER INSERT:', event.entity);
  }

  /**
   * This method is called after a ${className} entity is updated in the database.
   * @param {UpdateEvent<${className}>} event - The event object containing the updated entity and other metadata.
   */
  async afterUpdate(event: UpdateEvent<${className}>): Promise<void> {
    // TODO: Implement logic to run after an update operation.
    console.log('AFTER UPDATE:', event.entity);
  }

  /**
   * This method is called after a ${className} entity is removed from the database.
   * @param {RemoveEvent<${className}>} event - The event object containing the removed entity.
   */
  async afterRemove(event: RemoveEvent<${className}>): Promise<void> {
    // TODO: Implement logic to run after a remove operation.
    console.log('AFTER REMOVE:', event.entity);
  }
}
`;
}