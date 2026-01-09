import { validate } from 'class-validator';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { format } from 'date-fns';
import { Between, DeleteResult, EntityMetadata, Equal, FindOptionsOrder, FindOptionsWhere, ILike, In, IsNull, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Not, Raw, SelectQueryBuilder } from 'typeorm';

import { Errors } from '../../errors/entities/errors.entity';
import { Logs } from '../../logs/entities/logs.entity';
import { BaseService } from '../../base/base.service';
import DataObject from '../../model/data_object';
import { Base } from '../../base/base.entity';
import { BaseDto } from '../../base/base.dto';
import StringUtil from './string.util';
import DtoUtil from './dto.util';
import Filter, { OrderBy, Where } from './filter';

/**
 * Represents the structure of a paginated API response.
 * @template T The type of the data items.
 */
export interface PageResult<T extends BaseDto | Base> {
  data: T[];
  count: number;
}

/**
 * A static utility class providing generic helper methods for TypeORM repository operations.
 * This class simplifies common tasks like CRUD operations, pagination, filtering, and building complex queries.
 */
export class RepoHelpers {
  private static TABLE_SELECT = {} as DataObject;
  private static FIELDS_MAPPING = {} as DataObject;
  private static FIELDS_REVERSE_MAPPING = {} as DataObject;

  // =================================================================================================
  // ## Internal & Configuration Methods
  // =================================================================================================

  /**
   * @internal
   * Caches the mapping between database column names (e.g., 'user_name') and entity property names (e.g., 'userName').
   * This is used to correctly build queries when filters use property names instead of column names.
   * @param service The `BaseService` instance to get the repository from.
   */
  private static fieldsMapping<T extends Base>(service: BaseService<T>) {
    const repo = service.getRepo();
    if (!RepoHelpers.FIELDS_MAPPING[repo.metadata.tableName]) {
      const columnsMapping = {} as DataObject;
      const columnsReverseMapping = {} as DataObject;
      repo.metadata.columns.forEach((col) => {
        columnsMapping[col.givenDatabaseName] = col.propertyName;
        columnsReverseMapping[col.propertyName] = col.givenDatabaseName;
      });
      RepoHelpers.FIELDS_MAPPING[repo.metadata.tableName] = columnsMapping;
      RepoHelpers.FIELDS_REVERSE_MAPPING[repo.metadata.tableName] =
        columnsReverseMapping;
    }
  }

  // =================================================================================================
  // ## Core Read Operations (Finders)
  // =================================================================================================

  /**
   * Finds a single entity by its primary ID.
   * Throws a `NotFoundException` if the ID is not provided or the entity is not found.
   * @param service The `BaseService` instance.
   * @param id The ID of the entity to find.
   * @param partner Optional partner ID for multi-tenant scenarios.
   * @param relations An array of relation names to eager load.
   * @returns A promise that resolves to the found entity.
   */
  public static async findOne<T extends Base>(
    service: BaseService<T>,
    id: string,

    relations?: Array<string>,
  ): Promise<T> {
    try {
      if (!id || id.trim().length === 0) {
        throw new NotFoundException('Id Was Not Provided');
      }
      const repo = service.getRepo();
      const where: FindOptionsWhere<T> = { id } as FindOptionsWhere<T>;

      const entity =
        relations && relations.length > 0
          ? await repo.findOne({ where, relations })
          : await repo.findOneBy(where);

      if (!entity) {
        throw new NotFoundException('Entity With The Provided Id Not Found');
      }
      return entity;
    } catch (error) {
      console.error('Error in findOne:', error);
      throw new NotFoundException('Failed to find entity by id');
    }
  }

  /**
   * Finds the first entity that matches the given criteria.
   * Throws a `NotFoundException` if criteria are not provided.
   * @param service The `BaseService` instance.
   * @param by A `FindOptionsWhere` object representing the query conditions.
   * @returns A promise that resolves to the found entity or null if not found.
   */
  public static async findOneBy<T extends Base>(
    service: BaseService<T>,
    by: FindOptionsWhere<T>,
  ): Promise<T> {
    if (!by || Object.keys(by).length === 0) {
      throw new NotFoundException('Criteria Was Not Provided');
    }
    const entity = await service.getRepo().findOneBy(by);
    return entity || null;
  }

  /**
   * Finds the first entity that matches given criteria and loads specified relations.
   * Throws a `NotFoundException` if criteria are not provided.
   * @param service The `BaseService` instance.
   * @param by A `FindOptionsWhere` object representing the query conditions.
   * @param relations An array of relation names to eager load.
   * @returns A promise that resolves to the found entity or null if not found.
   */
  public static async findOneByWithRelations<T extends Base>(
    service: BaseService<T>,
    by: FindOptionsWhere<T>,
    relations: Array<string> = [],
  ): Promise<T> {
    if (!by || Object.keys(by).length === 0) {
      throw new NotFoundException('Criteria Was Not Provided');
    }
    const entity = await service
      .getRepo()
      .find({ where: by, relations, skip: 0, take: 1 });
    return entity.length > 0 ? entity[0] : null;
  }

  /**
   * Finds a single entity by its ID and eagerly loads all its relations.
   * Throws a `NotFoundException` if the ID is not provided or the entity is not found.
   * @param service The `BaseService` instance.
   * @param id The ID of the entity to find.
   * @returns A promise that resolves to the found entity with all its relations.
   */
  public static async findOneWithRelations<T extends Base>(
    service: BaseService<T>,
    id: string,
  ) {
    if (!id) {
      throw new NotFoundException('Id Was Not Provided');
    }
    const repo = service.getRepo();
    const entityMetadata: EntityMetadata = repo.metadata;
    const relations = entityMetadata.relations.map(
      (relation) => relation.propertyName,
    );
    const entity = await repo.findOne({
      where: { id } as FindOptionsWhere<T>,
      relations,
    });
    if (!entity) {
      throw new NotFoundException('Entity With The Provided Id Not Found');
    }
    return entity;
  }

  /**
   * Finds all entities, optionally filtering by partner and loading relations.
   * @param service The `BaseService` instance.
   * @param partner Optional partner ID for multi-tenant scenarios.
   * @param relations An array of relation names to eager load.
   * @returns A promise that resolves to an array of found entities.
   */
  public static async findAll<T extends Base>(
    service: BaseService<T>,

    relations?: Array<string>,
  ) {
    const repo = service.getRepo();
    const where: FindOptionsWhere<T> = {} as FindOptionsWhere<T>;
    return relations && relations.length > 0
      ? await repo.find({ where, relations })
      : await repo.find({ where });
  }

  /**
   * Finds all entities by a specific key-value pair, optionally filtering by partner and loading relations.
   * @param service The `BaseService` instance.
   * @param key The entity's property key.
   * @param value The value to search for.
   * @param relations An array of relation names to eager load.
   * @returns A promise that resolves to an array of found entities.
   */
  public static async findAllBy<T extends Base>(
    service: BaseService<T>,
    key: string,
    value: any,
    relations?: Array<string>,
  ) {
    const repo = service.getRepo();
    const where: FindOptionsWhere<T> = { [key]: value } as FindOptionsWhere<T>;
    return relations && relations.length > 0
      ? await repo.find({ where, relations })
      : await repo.find({ where });
  }

  /**
   * Checks if all entities for the given IDs exist in the database.
   * @param service The `BaseService` instance.
   * @param idsArray An array of entity IDs to check.
   * @returns A promise that resolves to `true` if all entities exist, `false` otherwise.
   */
  public static async doesExist<T extends Base>(
    service: BaseService<T>,
    idsArray: string[],
  ): Promise<boolean> {
    if (!idsArray || idsArray.length === 0) return false;
    const repo = service.getRepo();
    const count = await repo.count({
      where: { id: In(idsArray) } as FindOptionsWhere<T>,
    });
    return count === idsArray.length;
  }

  // =================================================================================================
  // ## Core Write Operations (Create, Update, Delete)
  // =================================================================================================

  /**
   * Creates a single new entity from a Data Transfer Object (DTO).
   * Automatically handles setting creator, updater, and log IDs.
   * @param T The entity constructor.
   * @param service The `BaseService` instance.
   * @param dto The DTO containing the data for the new entity.
   * @returns A promise that resolves to the created entity data.
   */
  public static async create<T extends Base, D extends BaseDto>(
    T: new () => T,
    service: BaseService<T>,
    dto: D,
  ): Promise<D> {
    if (!StringUtil.isValidUUID(dto.id)) {
      delete dto.id;
    }
    const convertedDto = DtoUtil.convertToEntity(T, dto);
    const logId = service.getCurrentLogId();
    if (logId) {
      convertedDto.log = logId;
    }
    if (!convertedDto.id) {
      if (!convertedDto.created_by) {
        if (T instanceof Errors || T instanceof Logs) {
          convertedDto.created_by =
            service.getCurrentUserId() || service.getSystemId();
        } else {
          convertedDto.created_by = service.getCurrentUserId();
        }
      }
    }
    if (!convertedDto.updated_by) {
      if (T instanceof Errors || T instanceof Logs) {
        convertedDto.updated_by =
          service.getCurrentUserId() || service.getSystemId();
      } else {
        convertedDto.updated_by = service.getCurrentUserId();
      }
    }
    const result = await service.getRepo().save(convertedDto);
    return Promise.resolve(result);
  }

  /**
   * Creates one or more new entities from an array of DTOs.
   * This is a more flexible version of `create` that handles both single and multiple entities.
   * @param T The entity constructor.
   * @param service The `BaseService` instance.
   * @param dtoOrDtos A single DTO or an array of DTOs.
   * @param options Optional configuration, like a DTO class for converting the output.
   * @returns A promise that resolves to the created entity/entities as DTOs.
   */
  public static async createX<T extends Base, D extends BaseDto>(
    T: new () => T,
    service: BaseService<T>,
    dtoOrDtos: D | D[],
    options?: { dtoClass?: new () => D },
  ): Promise<D | D[]> {
    const repo = service.getRepo();
    const dtoClass = options?.dtoClass;

    const isSystemEntity = (Ctor: Function) => Ctor === Errors || Ctor === Logs;
    const currentUserId = service.getCurrentUserId();
    const systemId = service.getSystemId();
    const logId = service.getCurrentLogId();

    const inputIsArray = Array.isArray(dtoOrDtos);
    const dtos = (inputIsArray ? dtoOrDtos : [dtoOrDtos]) as D[];

    const entities = dtos.map((dto) => {
      if (!StringUtil.isValidUUID((dto as any).id)) {
        delete (dto as any).id;
      }
      const entity = DtoUtil.convertToEntity(T, dto) as T & {
        id?: string;
        created_by?: string;
        updated_by?: string;
        log?: string;
      };

      if (logId && 'log' in entity) entity.log = logId;
      if (!entity.id && !entity.created_by)
        entity.created_by = isSystemEntity(T)
          ? currentUserId || systemId
          : currentUserId;
      if (!entity.updated_by)
        entity.updated_by = isSystemEntity(T)
          ? currentUserId || systemId
          : currentUserId;

      return entity as T;
    });

    const saved = await repo.save(entities);
    const toOut = (r: T) =>
      dtoClass ? (DtoUtil.convertToDto(dtoClass, r) as D) : (r as unknown as D);
    const out = (saved as T[]).map(toOut);

    return inputIsArray ? out : out[0];
  }

  /**
   * Creates multiple entities in a single transaction from an array of DTOs.
   * Validates each entity before saving.
   * @param TConstructor The entity constructor.
   * @param service The `BaseService` instance.
   * @param dtos An array of DTOs to create.
   * @param deleteKeys Optional array of keys to remove from each entity before saving.
   * @returns A promise that resolves to an array of the newly created entities.
   */
  public static async createMany<T extends Base, D extends BaseDto>(
    TConstructor: new () => T,
    service: BaseService<T>,
    dtos: D[],
    deleteKeys?: string[],
  ): Promise<T[]> {
    const repo = service.getRepo();
    const entities = dtos.map((dto) =>
      DtoUtil.convertToEntity(TConstructor, dto),
    );

    for (const entity of entities) {
      const errors = await validate(entity, { forbidUnknownValues: false });
      if (errors.length > 0) throw new BadRequestException(errors);
      if (deleteKeys) this.deleteKeys(entity, deleteKeys);
      if (!entity.id && !entity.created_by)
        entity.created_by =
          TConstructor instanceof Errors || TConstructor instanceof Logs
            ? service.getCurrentUserId() || service.getSystemId()
            : service.getCurrentUserId();
      if (!entity.updated_by)
        entity.updated_by =
          TConstructor instanceof Errors || TConstructor instanceof Logs
            ? service.getCurrentUserId() || service.getSystemId()
            : service.getCurrentUserId();
    }

    return repo.manager.transaction(
      async (transactionalEntityManager) =>
        await transactionalEntityManager.save(entities),
    );
  }

  /**
   * Creates multiple entities from DTOs and returns them as DTOs.
   * @param T The entity constructor.
   * @param DtoClass The DTO constructor for the output.
   * @param service The `BaseService` instance.
   * @param dtos An array of DTOs to create.
   * @returns A promise that resolves to an array of the newly created DTOs.
   */
  public static async createAll<T extends Base, D extends BaseDto>(
    T: new () => T,
    DtoClass: new () => D,
    service: BaseService<T>,
    dtos: D[],
  ): Promise<D[]> {
    const repo = service.getRepo();
    const convertedDtos = dtos.map((dto) => {
      if (!StringUtil.isValidUUID(dto.id)) delete dto.id;
      if (!dto.id && !dto.created_by)
        dto.created_by =
          T instanceof Errors || T instanceof Logs
            ? service.getCurrentUserId() || service.getSystemId()
            : service.getCurrentUserId();
      if (!dto.updated_by)
        dto.updated_by =
          T instanceof Errors || T instanceof Logs
            ? service.getCurrentUserId() || service.getSystemId()
            : service.getCurrentUserId();
      return DtoUtil.convertToEntity(T, dto);
    });

    const results = await repo.save(convertedDtos);
    return results.map((result) => DtoUtil.convertToDto(DtoClass, result));
  }

  /**
   * Updates an existing entity identified by its ID with data from a DTO.
   * Throws an exception if the entity is not found or the ID is invalid.
   * @param T The entity constructor.
   * @param service The `BaseService` instance.
   * @param id The ID of the entity to update.
   * @param dto The DTO containing the fields to update.
   * @returns A promise that resolves to the updated entity.
   */
  public static async update<T extends Base, D extends Partial<BaseDto>>(
    T: new () => T,
    service: BaseService<T>,
    id: string,
    dto: D,
  ): Promise<T> {
    try {
      if (!id || id.trim().length === 0) {
        throw new BadRequestException('INVALID_ID_PROVIDED');
      }
      const entity = await RepoHelpers.findOneBy(service, {
        id,
      } as FindOptionsWhere<T>);
      if (!entity) {
        throw new NotFoundException('Entity To Be Updated Not Found');
      }
      dto.id = id;
      dto.updated_by =
        T instanceof Errors || T instanceof Logs
          ? service.getCurrentUserId() || service.getSystemId()
          : service.getCurrentUserId();

      const updatedEntity = DtoUtil.convertToEntity(T, dto);
      if (!updatedEntity) {
        throw new BadRequestException('No valid fields provided for update');
      }
      const logId = service.getCurrentLogId();
      if (updatedEntity && logId) {
        updatedEntity.log = logId;
      }
      const errors = await validate(updatedEntity, {
        forbidUnknownValues: false,
      });
      if (errors.length > 0) throw new BadRequestException(errors);

      const mergedEntity = service.getRepo().merge(entity, updatedEntity);
      return await service.getRepo().save(mergedEntity);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Updates multiple entities in batches within a transaction.
   * @param TConstructor The entity constructor.
   * @param service The `BaseService` instance.
   * @param dtos An array of DTOs, each must have a valid `id`.
   * @param deleteKeys Optional array of keys to remove from each entity before saving.
   * @param batchSize The number of entities to update in each batch.
   * @returns A promise that resolves to an array of the updated entities.
   */
  public static async updateMany<T extends Base, D extends Partial<BaseDto>>(
    TConstructor: new () => T,
    service: BaseService<T>,
    dtos: D[],
    deleteKeys?: string[],
    batchSize: number = 100,
  ): Promise<T[]> {
    const repo = service.getRepo();
    const updatedEntities: T[] = [];

    for (let i = 0; i < dtos.length; i += batchSize) {
      const batch = dtos.slice(i, i + batchSize);
      const ids = batch.map((dto) => dto.id).filter((id) => id);

      if (ids.length !== batch.length) {
        throw new BadRequestException(
          'Each DTO must contain a valid id for update.',
        );
      }

      const existingEntities = await repo.find({
        where: { id: In(ids) } as FindOptionsWhere<T>,
      });

      const entityMap = new Map(existingEntities.map((e) => [e.id, e]));
      const entitiesToUpdate: T[] = [];

      for (const dto of batch) {
        const entity = entityMap.get(dto.id);
        if (!entity) {
          throw new NotFoundException(`Entity with id '${dto.id}' not found.`);
        }

        const updatedEntity = DtoUtil.convertToEntity(TConstructor, dto);
        const errors = await validate(updatedEntity, {
          forbidUnknownValues: false,
        });
        if (errors.length > 0) throw new BadRequestException(errors);

        const mergedEntity = repo.merge(entity, updatedEntity);
        if (deleteKeys) this.deleteKeys(mergedEntity, deleteKeys);
        entitiesToUpdate.push(mergedEntity);
      }

      const saved = await repo.manager.transaction(
        async (tem) => await tem.save(entitiesToUpdate),
      );
      updatedEntities.push(...saved);
    }
    return updatedEntities;
  }

  /**
   * Removes an entity by its ID.
   * Throws a `NotFoundException` if the entity to be removed is not found.
   * @param service The `BaseService` instance.
   * @param id The ID of the entity to remove.
   * @returns A promise that resolves to the removed entity.
   */
  public static async remove<T extends Base>(
    service: BaseService<T>,
    id: string,
  ) {
    const entity = await this.findOne(service, id, undefined);
    if (!entity) {
      throw new NotFoundException('The Entity To Be Removed Not Found');
    }
    return await service.getRepo().remove(entity);
  }

  /**
   * Deletes entities that match the given filter criteria using a QueryBuilder.
   * @param service The `BaseService` instance.
   * @param filter The `Filter` object containing `where` conditions.
   * @returns A promise that resolves to a `DeleteResult` object from TypeORM.
   */
  public static async deleteBy<T extends Base>(
    service: BaseService<T>,
    filter: Filter<T>,
  ): Promise<DeleteResult> {
    const repo = service.getRepo();
    const metadata = repo.metadata;
    const qb = repo
      .createQueryBuilder(metadata.tableName)
      .delete()
      .from(metadata.target);

    const whereConditions = this.convertToFindOptionsWhere<T>(
      filter.where || [],
    );
    qb.where(whereConditions as any);

    return await qb.execute();
  }

  // =================================================================================================
  // ## Advanced Querying & Pagination
  // =================================================================================================

  /**
   * Retrieves a paginated list of entities based on a `Filter` object.
   * Handles pagination, sorting, filtering, and relations.
   * @param service The `BaseService` instance.
   * @param filter The `Filter` object defining the query.
   * @param partner Optional partner ID for multi-tenant scenarios.
   * @returns A promise that resolves to a `PageResult` object containing data and a total count.
   */
  public static async page<T extends Base>(
    service: BaseService<T>,
    filter: Filter<T>,
  ): Promise<PageResult<T>> {
    try {
      RepoHelpers.fieldsMapping(service);
      const repo = service.getRepo();
      let where: FindOptionsWhere<T>[];

      filter = filter || ({} as Filter<T>);
      filter.page = filter.page || 1;
      filter.limit = filter.limit || 10;
      filter.where = filter.where || [];

      if (filter.where.length > 0) {
        where = RepoHelpers.convertToFindOptionsWhere(filter.where);
      }

      const withDeleted = filter.where.some((item) => item.by === 'deletedAt');

      const findOptions: any = {
        order: RepoHelpers.extractOrderBy<T>(
          filter.order_by,
          repo.metadata.tableName,
        ),
        where,
        relations: filter.relations,
        skip: (filter.page - 1) * filter.limit,
        take: filter.limit,
        withDeleted,
      };

      if (filter.ignorePaginationCount) {
        const entities = await repo.find(findOptions);
        return { data: entities, count: 0 };
      } else {
        const [data, count] = await repo.findAndCount(findOptions);
        return { data, count };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Constructs a TypeORM `SelectQueryBuilder` from a `Filter` object.
   * This is useful for more complex queries or when the raw query builder is needed.
   * @param service The `BaseService` instance.
   * @param filter The `Filter` object defining the query.
   * @param partner Optional partner ID for multi-tenant scenarios.
   * @returns A `SelectQueryBuilder` instance configured with the filter options.
   */
  public static queryBuilder<T extends Base>(
    service: BaseService<T>,
    filter: Filter<T>,
  ): SelectQueryBuilder<T> {
    RepoHelpers.fieldsMapping(service);
    const repo = service.getRepo();
    const tableName = repo.metadata.tableName;
    let query = repo.createQueryBuilder(tableName);

    if (!RepoHelpers.TABLE_SELECT[tableName]) {
      RepoHelpers.TABLE_SELECT[tableName] = repo.metadata.columns.map(
        (col) =>
          `${tableName}.${col.givenDatabaseName} as "${col.propertyName}"`,
      );
    }

    filter = filter || ({} as Filter<T>);
    filter.where = filter.where || [];

    if (filter.select && filter.select.length > 0) {
      const mapping = RepoHelpers.FIELDS_MAPPING[tableName] || {};
      const selectFields = filter.select.map((select) => {
        const mappedField = mapping[select] || select;
        return `${tableName}.${mappedField} as "${mappedField}"`;
      });
      query.select(selectFields);
    } else {
      query.select(RepoHelpers.TABLE_SELECT[tableName] as string[]);
    }

    if (filter.where.length > 0) {
      const findOptions = RepoHelpers.convertToFindOptionsWhere(filter.where);
      query.where(findOptions);
    }

    query
      .skip((filter.page - 1) * (filter.limit || 10))
      .take(filter.limit || 10);

    if (filter.order_by) {
      const { order } = filter.order_by;
      const by = filter.order_by.by as string;
      query.orderBy(`${tableName}.${by}`, order);
    }

    if (filter.relations && filter.relations.length > 0) {
      filter.relations.forEach((relation) => {
        query.leftJoinAndSelect(`${tableName}.${relation}`, relation);
      });
    }

    if (filter.group_by) {
      query.groupBy(`${tableName}.${filter.group_by}`);
    }

    return query;
  }

  /**
   * Counts the number of entities that match the given criteria.
   * @param service The `BaseService` instance.
   * @param r A boolean flag often used for simple IsNull/IsNotNull checks.
   * @param field The entity field to apply the condition on.
   * @param enumValue An optional enum value to match against the field.
   * @returns A promise that resolves to the total count of matching entities.
   */
  public static async count<T extends Base>(
    service: BaseService<T>,
    r?: boolean,
    field?: keyof T,
    enumValue?: T[keyof T],
  ): Promise<number> {
    const repo = service.getRepo();
    const where: any = {};
    if (field !== undefined) {
      if (enumValue !== undefined) {
        where[field] = enumValue;
      } else if (r !== undefined) {
        where[field] = r ? Not(IsNull()) : IsNull();
      }
    }
    return repo.count({ where });
  }

  /**
   * Counts the number of entities matching a complex filter, including relations.
   * @param service The `BaseService` instance.
   * @param filter The `Filter` object containing `where` and `relations` conditions.
   * @returns A promise that resolves to the total count of matching entities.
   */
  public static async countWithWhereAndRelations<T extends Base>(
    service: BaseService<T>,
    filter: Filter<T>,
  ): Promise<number> {
    try {
      RepoHelpers.fieldsMapping(service);
      const repo = service.getRepo();
      let where: FindOptionsWhere<T>[];

      filter = filter || ({} as Filter<T>);
      filter.where = filter.where || [];

      if (filter.where.length > 0) {
        where = RepoHelpers.convertToFindOptionsWhere(filter.where);
      }

      const withDeleted = filter.where.some((item) => item.by === 'deletedAt');
      const findOptions: any = {
        where,
        relations: filter.relations,
        withDeleted,
      };
      return await repo.count(findOptions);
    } catch (error) {
      throw error;
    }
  }

  // =================================================================================================
  // ## Filter & Query Transformation Utilities
  // =================================================================================================

  /**
   * Converts a custom `Where` condition array into a TypeORM `FindOptionsWhere` array.
   * This is the core logic that translates the filter API into something TypeORM understands, handling nested 'OR' conditions.
   * @param conditions An array of `Where` objects.
   * @returns An array of `FindOptionsWhere` objects suitable for TypeORM queries.
   */
  public static convertToFindOptionsWhere<T>(
    conditions: Where<T>[],
  ): FindOptionsWhere<T>[] {
    if (!conditions || conditions.length === 0) return [];

    const mainConditions: FindOptionsWhere<T> = {};
    const orConditionGroups: FindOptionsWhere<T>[][] = [];

    for (const condition of conditions) {
      const conditionObject = this.createConditionObject(condition);

      if (condition.or && condition.or.length > 0) {
        const orGroup = [
          conditionObject,
          ...this.convertToFindOptionsWhere<T>(condition.or),
        ];
        orConditionGroups.push(orGroup);
      } else {
        Object.assign(mainConditions, conditionObject);
      }
    }

    if (orConditionGroups.length === 0) return [mainConditions];

    let combined: FindOptionsWhere<T>[] = [{}];
    for (const group of orConditionGroups) {
      const newCombined: FindOptionsWhere<T>[] = [];
      for (const combinedItem of combined) {
        for (const groupItem of group) {
          newCombined.push({ ...combinedItem, ...groupItem });
        }
      }
      combined = newCombined;
    }

    return combined.map((orCondition) => ({
      ...mainConditions,
      ...orCondition,
    }));
  }

  /**
   * @internal
   * Creates a single condition object from a `Where` clause, handling dot notation for relations and '->' for JSON fields.
   * @param condition The `Where` object.
   * @returns A `FindOptionsWhere` object for a single condition.
   */
  private static createConditionObject<T>(
    condition: Where<T>,
  ): FindOptionsWhere<T> {
    const { operator, value } = condition;
    const by = condition.by as string;
    if (by.includes('.')) {
      const path = by.split('.');
      return this.buildNestedQueryCondition(path, operator, value);
    }

    if (by.includes('->')) {
      const parts = by.split('->');
      const fieldName = parts[0];
      const jsonProperty = parts.slice(1).join('.');
      const jsonPath = `$.${jsonProperty}`;
      const opSymbol = this.getOperatorSymbol(operator);

      let processedValue = value;
      if (opSymbol === 'LIKE' || opSymbol === 'ILIKE') {
        processedValue = `%${value}%`;
      }

      return {
        [fieldName]: Raw(
          (alias) =>
            `JSON_UNQUOTE(JSON_EXTRACT(${alias}, '${jsonPath}')) ${opSymbol} :value`,
          { value: processedValue },
        ),
      } as FindOptionsWhere<T>;
    }

    return {
      [by]: this.getBaseOnOperator(operator, value),
    } as FindOptionsWhere<T>;
  }

  /**
   * @internal
   * Recursively builds a nested query condition for relations (e.g., 'user.profile.name').
   * @param path An array of strings representing the relation path.
   * @param operator The comparison operator.
   * @param value The value to compare against.
   * @returns A nested object representing the condition.
   */
  private static buildNestedQueryCondition(
    path: string[],
    operator: string,
    value: any,
  ): any {
    const [key, ...restOfPath] = path;
    if (restOfPath.length === 0) {
      return { [key]: RepoHelpers.getBaseOnOperator(operator, value) };
    }
    return {
      [key]: this.buildNestedQueryCondition(restOfPath, operator, value),
    };
  }

  /**
   * Converts a string operator into a TypeORM `FindOperator`.
   * @param operator The string representation of the operator (e.g., 'like', '>=', 'isNull').
   * @param value The value to be used with the operator.
   * @returns A TypeORM `FindOperator` instance.
   */
  public static getBaseOnOperator(operator: string, value: any) {
    switch (operator) {
      case 'like':
        return Like(`%${value}%`);
      case 'ilike':
        return ILike(`%${value}%`);
      case 'notlike':
        return Not(Like(`%${value}%`));
      case 'notilike':
        return Not(ILike(`%${value}%`));
      case '<':
        return LessThan(value);
      case 'not':
        return Not(value);
      case 'isNull':
        return IsNull();
      case 'isNotNull':
        return Not(IsNull());
      case '<=':
        return LessThanOrEqual(value);
      case '>':
        return MoreThan(value);
      case '>=':
        return MoreThanOrEqual(value);
      case 'between':
        return Between(
          format(
            typeof value[0] === 'string' ? new Date(value[0]) : value[0],
            'yyyy-MM-dd HH:mm:SS',
          ),
          format(
            typeof value[1] === 'string' ? new Date(value[1]) : value[1],
            'yyyy-MM-dd HH:mm:SS',
          ),
        );
      case '!=':
      case '<>':
        return Not(Equal(value));
      case 'in':
        return In(value);
      case 'notIn':
        return Not(In(value));
      case '=':
      default:
        return Equal(value);
    }
  }

  /**
   * Extracts and formats the 'order by' clause for a TypeORM query.
   * Handles dot notation for sorting by a related entity's field.
   * @param order_by The `OrderBy` object from the filter.
   * @param tableName The name of the table.
   * @returns A `FindOptionsOrder` object.
   */
  public static extractOrderBy<T extends Base>(
    order_by: OrderBy<T>,
    tableName: string,
  ): FindOptionsOrder<T> {
    if (!order_by || !order_by.by) return undefined;
    const mapping = RepoHelpers.FIELDS_MAPPING[tableName] || {};
    const by = order_by.by as string;
    if (by.includes('.')) {
      const [relation, field] = by.split('.');
      return {
        [relation]: {
          [mapping[field] || field]: order_by.order,
        },
      } as FindOptionsOrder<T>;
    }
    return {
      [mapping[by] || by]: order_by.order,
    } as FindOptionsOrder<T>;
  }

  /**
   * Gets the corresponding SQL operator symbol for a given string operator.
   * @param operator The string representation of the operator.
   * @returns The SQL symbol as a string (e.g., 'LIKE', '>=', '!=').
   */
  public static getOperatorSymbol(operator: string): string {
    const symbols = {
      like: 'LIKE',
      ilike: 'ILIKE',
      notlike: 'NOT LIKE',
      notilike: 'NOT ILIKE',
      '<': '<',
      '<=': '<=',
      '>': '>',
      '>=': '>=',
      in: 'IN',
      notIn: 'NOT IN',
      '!=': '!=',
      '<>': '!=',
      '=': '=',
      isNull: 'IS NULL',
      isNotNull: 'IS NOT NULL',
      between: 'BETWEEN',
      not: '!=',
      or: 'OR',
      and: 'AND',
    };
    return symbols[operator] || '=';
  }

  // =================================================================================================
  // ## Filter Manipulation Utilities
  // =================================================================================================

  /**
   * Adds a new `Where` condition to a `Filter` object.
   * @param filter The `Filter` object to modify.
   * @param where The `Where` condition to add.
   * @returns The modified `Filter` object.
   */
  public static addFilter<T>(filter: Filter<T>, where: Where<T>): Filter<T> {
    filter = filter || ({} as Filter<T>);
    filter.where = [...(filter.where || []), where];
    return filter;
  }

  /**
   * Adds multiple `Where` conditions to a `Filter` object.
   * @param filter The `Filter` object to modify.
   * @param where An array of `Where` conditions to add.
   * @returns The modified `Filter` object.
   */
  public static addFilters<T>(filter: Filter<T>, where: Where<T>[]): Filter<T> {
    filter = filter || ({} as Filter<T>);
    filter.where = [...(filter.where || []), ...where];
    return filter;
  }

  /**
   * Removes `Where` conditions from a `Filter` object based on field names.
   * @param filter The `Filter` object to modify.
   * @param byFields An array of field names (`by` property) to remove.
   * @returns The modified `Filter` object.
   */
  public static removeFilter<T>(
    filter: Filter<T>,
    byFields: string[],
  ): Filter<T> {
    if (!filter || !filter.where) {
      return filter || ({} as Filter<T>);
    }
    filter.where = filter.where.filter(
      (w) => !byFields.includes(w.by as string),
    );
    return filter;
  }

  /**
   * Adds relation names to a `Filter` object's `relations` array.
   * @param filter The `Filter` object to modify.
   * @param relations An array of relation names to add.
   * @returns The modified `Filter` object.
   */
  public static addRelation<T>(
    filter: Filter<T>,
    relations: string[],
  ): Filter<T> {
    filter = filter || ({} as Filter<T>);
    filter.relations = [...(filter.relations || []), ...relations];
    return filter;
  }

  // =================================================================================================
  // ## Data Transformation Utilities
  // =================================================================================================

  /**
   * Transforms a flat object with prefixed keys into a nested object.
   * For example, `{ 'user_id': 1, 'user_name': 'A' }` becomes `{ 'user': { 'id': 1, 'name': 'A' } }`.
   * @param inputObject The flat `DataObject` to transform.
   * @param prefixes An array of prefixes to look for (e.g., ['user']).
   * @returns A new `DataObject` with nested structures.
   */
  public static nestKeysByPrefixes(
    inputObject: DataObject,
    prefixes: string[],
  ): DataObject {
    const result = { ...inputObject };
    for (const prefix of prefixes) {
      const nestedObject = {};
      let hasNestedKeys = false;
      for (const key in result) {
        if (key.startsWith(`${prefix}_`)) {
          const nestedKey = key.substring(prefix.length + 1);
          nestedObject[nestedKey] = result[key];
          delete result[key];
          hasNestedKeys = true;
        }
      }
      if (hasNestedKeys) {
        result[prefix] = nestedObject;
      }
    }
    return result;
  }

  /**
   * Applies `nestKeysByPrefixes` to an array of objects.
   * @param objectsArr An array of `DataObject`s to transform.
   * @param prefixes An array of prefixes to look for.
   * @returns A new array of transformed `DataObject`s.
   */
  public static nestKeysByPrefixesArray(
    objectsArr: DataObject[],
    prefixes: string[],
  ): DataObject[] {
    return objectsArr.map((obj) =>
      RepoHelpers.nestKeysByPrefixes(obj, prefixes),
    );
  }

  /**
   * Deletes specified keys from an object in place.
   * @param obj The object to modify.
   * @param keys An array of key names to delete.
   */
  public static deleteKeys(obj: any, keys: string[]) {
    for (const key of keys) {
      delete obj[key];
    }
  }

  // =================================================================================================
  // ## Permissions-Specific Methods
  // =================================================================================================

  /**
   * A specialized version of `page` for handling permissions-based queries.
   * Uses `convertToFindOptionsWhereForPermissions`.
   * @param service The `BaseService` instance.
   * @param filter The `Filter` object.
   * @returns A promise that resolves to a `PageResult`.
   */
  public static async pageForPermissions<T extends Base>(
    service: BaseService<T>,
    filter: Filter<T>,
  ): Promise<PageResult<T>> {
    try {
      RepoHelpers.fieldsMapping(service);
      const repo = service.getRepo();
      let where: FindOptionsWhere<T>[];

      filter = filter || ({} as Filter<T>);
      filter.page = filter.page || 1;
      filter.limit = filter.limit || 10;
      filter.where = filter.where || [];

      if (filter.where.length > 0) {
        const result = RepoHelpers.convertToFindOptionsWhereForPermissions(
          filter.where,
        );
        where = Array.isArray(result) ? result : [result];
      }

      const findOptions: any = {
        order: RepoHelpers.extractOrderBy<T>(
          filter.order_by,
          repo.metadata.tableName,
        ),
        where,
        relations: filter.relations,
        skip: (filter.page - 1) * filter.limit,
        take: filter.limit,
      };

      if (filter.ignorePaginationCount) {
        const entities = await repo.find(findOptions);
        return { data: entities, count: 0 };
      } else {
        const [entities, count] = await repo.findAndCount(findOptions);
        return { data: entities, count };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * A specialized version of `queryBuilder` for permissions-based queries.
   * @param service The `BaseService` instance.
   * @param filter The `Filter` object.
   * @returns A configured `SelectQueryBuilder`.
   */
  public static queryBuilderForPermissions<T extends Base>(
    service: BaseService<T>,
    filter: Filter<T>,
  ): SelectQueryBuilder<T> {
    RepoHelpers.fieldsMapping(service);
    const repo = service.getRepo();
    const tableName = repo.metadata.tableName;
    let query = repo.createQueryBuilder(tableName);

    if (!RepoHelpers.TABLE_SELECT[tableName]) {
      RepoHelpers.TABLE_SELECT[tableName] = repo.metadata.columns.map(
        (col) =>
          `${tableName}.${col.givenDatabaseName} as "${col.propertyName}"`,
      );
    }

    filter = filter || ({} as Filter<T>);
    filter.where = filter.where || [];

    if (filter.select && filter.select.length > 0) {
      const mapping = RepoHelpers.FIELDS_MAPPING[tableName] || {};
      query.select(
        filter.select.map(
          (s) => `${tableName}.${mapping[s] || s} as "${mapping[s] || s}"`,
        ),
      );
    } else {
      query.select(RepoHelpers.TABLE_SELECT[tableName] as string[]);
    }

    if (filter.where.length > 0) {
      const findOptions = RepoHelpers.convertToFindOptionsWhereForPermissions(
        filter.where,
      );
      query.where(findOptions);
    }

    query
      .skip((filter.page - 1) * (filter.limit || 10))
      .take(filter.limit || 10);

    if (filter.order_by) {
      query.orderBy(
        `${tableName}.${filter.order_by.by as string}`,
        filter.order_by.order,
      );
    }

    if (filter.relations) {
      filter.relations.forEach((relation) => {
        query.leftJoinAndSelect(`${tableName}.${relation}`, relation);
      });
    }

    if (filter.group_by) {
      query.groupBy(`${tableName}.${filter.group_by}`);
    }

    return query;
  }

  /**
   * A specialized version of `convertToFindOptionsWhere` for handling permissions-based queries,
   * with specific logic for JSON operators like `json_contains`.
   * @param conditions An array of `Where` objects.
   * @returns A `FindOptionsWhere` object or array of objects for TypeORM.
   */
  public static convertToFindOptionsWhereForPermissions<T>(
    conditions: Where<T>[],
  ): FindOptionsWhere<T> | FindOptionsWhere<T>[] {
    const andConditions: FindOptionsWhere<T>[] = [];
    const orConditions: FindOptionsWhere<T>[] = [];

    for (const condition of conditions) {
      if (condition.or && condition.or.length > 0) {
        const nestedOr = this.convertToFindOptionsWhereForPermissions(
          condition.or,
        );
        if (Array.isArray(nestedOr)) {
          orConditions.push(...nestedOr);
        } else {
          orConditions.push(nestedOr);
        }
      } else {
        const by = condition.by as string;
        if (by.includes('->')) {
          const parts = by.split('->');
          const fieldName = parts[0];
          const jsonProperty = parts.slice(1).join('.');
          const jsonPath = `$.${jsonProperty}`;
          if (condition.operator === 'json_contains') {
            andConditions.push({
              [fieldName]: Raw(
                (alias) =>
                  `JSON_CONTAINS(${alias}->'${jsonPath}', '"${condition.value}"')`,
              ),
            } as FindOptionsWhere<T>);
          } else {
            andConditions.push({
              [fieldName]: Raw(
                (alias) =>
                  `JSON_UNQUOTE(JSON_EXTRACT(${alias}, '$.${jsonProperty}')) ${this.getOperatorSymbol(
                    condition.operator,
                  )} :value`,
                { value: condition.value },
              ),
            } as FindOptionsWhere<T>);
          }
        } else if (by.includes('.')) {
          const path = by.split('.');
          andConditions.push({
            [path[0]]: {
              [path[1]]: this.getBaseOnOperator(
                condition.operator,
                condition.value,
              ),
            },
          } as FindOptionsWhere<T>);
        } else {
          andConditions.push({
            [condition.by]: this.getBaseOnOperator(
              condition.operator,
              condition.value,
            ),
          } as FindOptionsWhere<T>);
        }
      }
    }

    if (orConditions.length > 0) {
      return orConditions.map((orCondition) => {
        const baseCondition = andConditions.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {} as FindOptionsWhere<T>);
        return { ...baseCondition, ...orCondition };
      });
    }

    return andConditions.length === 1 ? andConditions[0] : andConditions;
  }
}
