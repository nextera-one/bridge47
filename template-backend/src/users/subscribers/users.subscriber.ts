import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import { Users } from "../entities/users.entity";

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<Users> {
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
    return Users;
  }

  /**
   * This method is called after a new Users entity is inserted into the database.
   * @param {InsertEvent<Users>} event - The event object containing the inserted entity.
   */
  async afterInsert(event: InsertEvent<Users>): Promise<void> {
    // TODO: Implement logic to run after an insert operation, e.g., logging, auditing, sending notifications.
    console.log("AFTER INSERT:", event.entity);
  }

  /**
   * This method is called after a Users entity is updated in the database.
   * @param {UpdateEvent<Users>} event - The event object containing the updated entity and other metadata.
   */
  async afterUpdate(event: UpdateEvent<Users>): Promise<void> {
    // TODO: Implement logic to run after an update operation.
    console.log("AFTER UPDATE:", event.entity);
  }

  /**
   * This method is called after a Users entity is removed from the database.
   * @param {RemoveEvent<Users>} event - The event object containing the removed entity.
   */
  async afterRemove(event: RemoveEvent<Users>): Promise<void> {
    // TODO: Implement logic to run after a remove operation.
    console.log("AFTER REMOVE:", event.entity);
  }
}
