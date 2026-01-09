import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import { Files } from "../entities/files.entity";

@EventSubscriber()
export class FilesSubscriber implements EntitySubscriberInterface<Files> {
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
    return Files;
  }

  /**
   * This method is called after a new Files entity is inserted into the database.
   * @param {InsertEvent<Files>} event - The event object containing the inserted entity.
   */
  async afterInsert(event: InsertEvent<Files>): Promise<void> {
    // TODO: Implement logic to run after an insert operation, e.g., logging, auditing, sending notifications.
    console.log("AFTER INSERT:", event.entity);
  }

  /**
   * This method is called after a Files entity is updated in the database.
   * @param {UpdateEvent<Files>} event - The event object containing the updated entity and other metadata.
   */
  async afterUpdate(event: UpdateEvent<Files>): Promise<void> {
    // TODO: Implement logic to run after an update operation.
    console.log("AFTER UPDATE:", event.entity);
  }

  /**
   * This method is called after a Files entity is removed from the database.
   * @param {RemoveEvent<Files>} event - The event object containing the removed entity.
   */
  async afterRemove(event: RemoveEvent<Files>): Promise<void> {
    // TODO: Implement logic to run after a remove operation.
    console.log("AFTER REMOVE:", event.entity);
  }
}
