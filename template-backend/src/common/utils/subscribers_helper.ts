import { DataSource, EntityManager, EntitySubscriberInterface } from 'typeorm';

import { Base } from '../../base/base.entity';

export default class SubscribersHelper {
  public static appendSubscriber = <T extends EntitySubscriberInterface<any>>(
    dataSource: DataSource,
    subscriber: T,
    entity: typeof Base,
  ) => {
    if (dataSource && dataSource.subscribers) {
      //search dataSource.subscribers array if WorkSpaceSubscriber is already registered and remove it
      const arr = dataSource.subscribers.filter(
        (subscriber) => !(subscriber instanceof entity),
      );
      dataSource.subscribers.length = 0;
      dataSource.subscribers.push(...arr);
      dataSource.subscribers.push(subscriber);
    }
  };

  public static save = async <T extends Base>(
    entity: T,
    manager: EntityManager,
  ): Promise<T> => {
    try {
      return await manager.save(entity);
    } catch (error) {
      throw error;
    }
  };
}
