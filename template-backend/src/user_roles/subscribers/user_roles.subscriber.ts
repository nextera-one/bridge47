import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import { UserRoles } from "../entities/user_roles.entity";

@EventSubscriber()
export class UserRolesSubscriber implements EntitySubscriberInterface<UserRoles> {
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
    return UserRoles;
  }

  /**
   * This method is called after a new UserRoles entity is inserted into the database.
   * @param {InsertEvent<UserRoles>} event - The event object containing the inserted entity.
   */
  async afterInsert(event: InsertEvent<UserRoles>): Promise<void> {
    // TODO: Implement logic to run after an insert operation, e.g., logging, auditing, sending notifications.
    console.log("AFTER INSERT:", event.entity);
  }

  /**
   * This method is called after a UserRoles entity is updated in the database.
   * @param {UpdateEvent<UserRoles>} event - The event object containing the updated entity and other metadata.
   */
  async afterUpdate(event: UpdateEvent<UserRoles>): Promise<void> {
    // TODO: Implement logic to run after an update operation.
    console.log("AFTER UPDATE:", event.entity);
  }

  /**
   * This method is called after a UserRoles entity is removed from the database.
   * @param {RemoveEvent<UserRoles>} event - The event object containing the removed entity.
   */
  async afterRemove(event: RemoveEvent<UserRoles>): Promise<void> {
    // TODO: Implement logic to run after a remove operation.
    console.log("AFTER REMOVE:", event.entity);
  }
}
