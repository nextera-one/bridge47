import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "../base/base.service";
import DtoUtil from "../common/utils/dto.util";
import Filter from "../common/utils/filter";
import { PageResult, RepoHelpers } from "../common/utils/repo_helpers";
import StringUtil from "../common/utils/string.util";
import { CreateUserRolesDto } from "./dto/create-user_roles.dto";
import { UpdateUserRolesDto } from "./dto/update-user_roles.dto";
import { UserRoles } from "./entities/user_roles.entity";
import { ReadUserRolesDto } from "./dto/read-user_roles.dto";
import DataObject, { JSONValue } from "../model/data_object";

@Injectable()
export class UserRolesService extends BaseService<UserRoles> {
  /**
   * Initializes the service with the injected repository.
   * @param {Repository<UserRoles>} currentRepository - The TypeORM repository for the UserRoles entity.
   */
  constructor(
    @InjectRepository(UserRoles)
    private readonly currentRepository: Repository<UserRoles>,
  ) {
    super(currentRepository);
  }

  /**
   * Creates a new UserRoles entity.
   * @param {CreateUserRolesDto} createDto - The data for creating the new entity.
   * @returns {Promise<ReadUserRolesDto>} The newly created entity as a DTO.
   */
  async create(
    createDto: CreateUserRolesDto | CreateUserRolesDto[],
  ): Promise<ReadUserRolesDto | ReadUserRolesDto[]> {
    const result = await RepoHelpers.createX(UserRoles, this, createDto);
    return DtoUtil.convertToDto(ReadUserRolesDto, result);
  }

  /**
   * Retrieves all UserRoles entities.
   * @returns {Promise<ReadUserRolesDto[]>} An array of all entities as DTOs.
   */
  async findAll(): Promise<ReadUserRolesDto[]> {
    const results = await RepoHelpers.findAll<UserRoles>(this);
    return DtoUtil.convertToDto(ReadUserRolesDto, results);
  }

  /**
   * Retrieves all UserRoles entities by a specific key-value pair.
   * @param {keyof UserRoles} key - The entity's property key.
   * @param {JSONValue} value - The value to search for.
   * @returns {Promise<ReadUserRolesDto[]>} An array of all entities as DTOs.
   */
  async findAllBy(
    key: keyof UserRoles,
    value: JSONValue,
  ): Promise<ReadUserRolesDto[]> {
    const results = await RepoHelpers.findAllBy<UserRoles>(this, key, value);
    return DtoUtil.convertToDto(ReadUserRolesDto, results);
  }

  /**
   * Retrieves a single UserRoles entity by its ID.
   * @param {string} id - The unique identifier of the entity.
   * @returns {Promise<ReadUserRolesDto>} The found entity as a DTO.
   */
  async findOne(id: string): Promise<ReadUserRolesDto> {
    const result = await RepoHelpers.findOne(this, id);
    return DtoUtil.convertToDto(ReadUserRolesDto, result);
  }

  /**
   * Retrieves a single UserRoles entity by a specific key-value pair.
   * @param {keyof UserRoles} key - The entity's property key.
   * @param {JSONValue} value - The value to search for.
   * @returns {Promise<ReadUserRolesDto>} The found entity as a DTO.
   */
  async findOneBy(
    key: keyof UserRoles,
    value: JSONValue,
  ): Promise<ReadUserRolesDto> {
    const result = await RepoHelpers.findOneBy(this, { [key]: value });
    return DtoUtil.convertToDto(ReadUserRolesDto, result);
  }

  /**
   * Updates an existing UserRoles entity.
   * @param {string} id - The unique identifier of the entity to update.
   * @param {UpdateUserRolesDto} updateDto - The data for updating the entity.
   * @returns {Promise<ReadUserRolesDto>} The updated entity as a DTO.
   */
  async update(
    id: string,
    updateDto: UpdateUserRolesDto,
  ): Promise<ReadUserRolesDto> {
    const result = await RepoHelpers.update(UserRoles, this, id, updateDto);
    return DtoUtil.convertToDto(ReadUserRolesDto, result);
  }

  /**
   * Removes an existing UserRoles entity.
   * @param {string} id - The unique identifier of the entity to remove.
   * @returns {Promise<ReadUserRolesDto>} The removed entity as a DTO.
   */
  async remove(id: string): Promise<ReadUserRolesDto> {
    const result = await RepoHelpers.remove(this, id);
    return DtoUtil.convertToDto(ReadUserRolesDto, result);
  }

  /**
   * Retrieves a paginated list of UserRoles entities based on a filter.
   * @param {string | Filter<UserRoles>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<PageResult<ReadUserRolesDto>>} A paginated result object containing DTOs.
   */
  async page(
    queryBy: string | Filter<UserRoles>,
  ): Promise<PageResult<ReadUserRolesDto>> {
    const filter: Filter<UserRoles> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const result = await RepoHelpers.page<UserRoles>(this, filter);
    const dtos = DtoUtil.convertToDto(ReadUserRolesDto, result.data);
    return { data: dtos, count: result.count } as PageResult<ReadUserRolesDto>;
  }

  /**
   * Searches for UserRoles entities based on a filter.
   * @param {string | Filter<UserRoles>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<ReadUserRolesDto[]>} An array of found entities as DTOs.
   */
  async searchBy(
    queryBy: string | Filter<UserRoles>,
  ): Promise<ReadUserRolesDto[]> {
    const filter: Filter<UserRoles> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const query = RepoHelpers.queryBuilder(this, filter);
    const data = await query.getRawMany();
    return DtoUtil.convertToDto(ReadUserRolesDto, data);
  }

  /**
   * Counts the total number of UserRoles entities.
   * @param {boolean} [r] - Flag for distinct count.
   * @param {keyof UserRoles} [field] - The field to apply distinct count on.
   * @returns {Promise<number>} The total count.
   */
  async count(r?: boolean, field?: keyof UserRoles): Promise<number> {
    return await RepoHelpers.count(this, r, field);
  }

  /**
   * Counts entities based on a filter with where clauses and relations.
   * @param {string | Filter<UserRoles>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<number>} The total count of matching entities.
   */
  async countWithWhereAndRelations(
    queryBy: string | Filter<UserRoles>,
  ): Promise<number> {
    const filter: Filter<UserRoles> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    return await RepoHelpers.countWithWhereAndRelations(this, filter);
  }

  /**
   * Retrieves statistical data for the UserRoles entity.
   * @returns {Promise<DataObject | null | undefined>} An object containing statistics.
   */
  async getStatistics(): Promise<DataObject | null | undefined> {
    const total: number = await this.countWithWhereAndRelations({
      where: [{ by: "id", operator: "isNotNull", value: "" }], //TODO: Sample code, need to be customized
    });
    return Promise.resolve({ total } as DataObject);
  }
}
