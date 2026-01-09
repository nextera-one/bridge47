import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "../base/base.service";
import DtoUtil from "../common/utils/dto.util";
import Filter from "../common/utils/filter";
import { PageResult, RepoHelpers } from "../common/utils/repo_helpers";
import StringUtil from "../common/utils/string.util";
import { CreateUsersDto } from "./dto/create-users.dto";
import { UpdateUsersDto } from "./dto/update-users.dto";
import { Users } from "./entities/users.entity";
import { ReadUsersDto } from "./dto/read-users.dto";
import DataObject, { JSONValue } from "../model/data_object";

@Injectable()
export class UsersService extends BaseService<Users> {
  /**
   * Initializes the service with the injected repository.
   * @param {Repository<Users>} currentRepository - The TypeORM repository for the Users entity.
   */
  constructor(
    @InjectRepository(Users)
    private readonly currentRepository: Repository<Users>,
  ) {
    super(currentRepository);
  }

  /**
   * Creates a new Users entity.
   * @param {CreateUsersDto} createDto - The data for creating the new entity.
   * @returns {Promise<ReadUsersDto>} The newly created entity as a DTO.
   */
  async create(
    createDto: CreateUsersDto | CreateUsersDto[],
  ): Promise<ReadUsersDto | ReadUsersDto[]> {
    const result = await RepoHelpers.createX(Users, this, createDto);
    return DtoUtil.convertToDto(ReadUsersDto, result);
  }

  /**
   * Retrieves all Users entities.
   * @returns {Promise<ReadUsersDto[]>} An array of all entities as DTOs.
   */
  async findAll(): Promise<ReadUsersDto[]> {
    const results = await RepoHelpers.findAll<Users>(this);
    return DtoUtil.convertToDto(ReadUsersDto, results);
  }

  /**
   * Retrieves all Users entities by a specific key-value pair.
   * @param {keyof Users} key - The entity's property key.
   * @param {JSONValue} value - The value to search for.
   * @returns {Promise<ReadUsersDto[]>} An array of all entities as DTOs.
   */
  async findAllBy(key: keyof Users, value: JSONValue): Promise<ReadUsersDto[]> {
    const results = await RepoHelpers.findAllBy<Users>(this, key, value);
    return DtoUtil.convertToDto(ReadUsersDto, results);
  }

  /**
   * Retrieves a single Users entity by its ID.
   * @param {string} id - The unique identifier of the entity.
   * @returns {Promise<ReadUsersDto>} The found entity as a DTO.
   */
  async findOne(id: string): Promise<ReadUsersDto> {
    const result = await RepoHelpers.findOne(this, id);
    return DtoUtil.convertToDto(ReadUsersDto, result);
  }

  /**
   * Retrieves a single Users entity by a specific key-value pair.
   * @param {keyof Users} key - The entity's property key.
   * @param {JSONValue} value - The value to search for.
   * @returns {Promise<ReadUsersDto>} The found entity as a DTO.
   */
  async findOneBy(key: keyof Users, value: JSONValue): Promise<ReadUsersDto> {
    const result = await RepoHelpers.findOneBy(this, { [key]: value });
    return DtoUtil.convertToDto(ReadUsersDto, result);
  }

  /**
   * Updates an existing Users entity.
   * @param {string} id - The unique identifier of the entity to update.
   * @param {UpdateUsersDto} updateDto - The data for updating the entity.
   * @returns {Promise<ReadUsersDto>} The updated entity as a DTO.
   */
  async update(id: string, updateDto: UpdateUsersDto): Promise<ReadUsersDto> {
    const result = await RepoHelpers.update(Users, this, id, updateDto);
    return DtoUtil.convertToDto(ReadUsersDto, result);
  }

  /**
   * Removes an existing Users entity.
   * @param {string} id - The unique identifier of the entity to remove.
   * @returns {Promise<ReadUsersDto>} The removed entity as a DTO.
   */
  async remove(id: string): Promise<ReadUsersDto> {
    const result = await RepoHelpers.remove(this, id);
    return DtoUtil.convertToDto(ReadUsersDto, result);
  }

  /**
   * Retrieves a paginated list of Users entities based on a filter.
   * @param {string | Filter<Users>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<PageResult<ReadUsersDto>>} A paginated result object containing DTOs.
   */
  async page(
    queryBy: string | Filter<Users>,
  ): Promise<PageResult<ReadUsersDto>> {
    const filter: Filter<Users> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const result = await RepoHelpers.page<Users>(this, filter);
    const dtos = DtoUtil.convertToDto(ReadUsersDto, result.data);
    return { data: dtos, count: result.count } as PageResult<ReadUsersDto>;
  }

  /**
   * Searches for Users entities based on a filter.
   * @param {string | Filter<Users>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<ReadUsersDto[]>} An array of found entities as DTOs.
   */
  async searchBy(queryBy: string | Filter<Users>): Promise<ReadUsersDto[]> {
    const filter: Filter<Users> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const query = RepoHelpers.queryBuilder(this, filter);
    const data = await query.getRawMany();
    return DtoUtil.convertToDto(ReadUsersDto, data);
  }

  /**
   * Counts the total number of Users entities.
   * @param {boolean} [r] - Flag for distinct count.
   * @param {keyof Users} [field] - The field to apply distinct count on.
   * @returns {Promise<number>} The total count.
   */
  async count(r?: boolean, field?: keyof Users): Promise<number> {
    return await RepoHelpers.count(this, r, field);
  }

  /**
   * Counts entities based on a filter with where clauses and relations.
   * @param {string | Filter<Users>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<number>} The total count of matching entities.
   */
  async countWithWhereAndRelations(
    queryBy: string | Filter<Users>,
  ): Promise<number> {
    const filter: Filter<Users> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    return await RepoHelpers.countWithWhereAndRelations(this, filter);
  }

  /**
   * Retrieves statistical data for the Users entity.
   * @returns {Promise<DataObject | null | undefined>} An object containing statistics.
   */
  async getStatistics(): Promise<DataObject | null | undefined> {
    const total: number = await this.countWithWhereAndRelations({
      where: [{ by: "id", operator: "isNotNull", value: "" }], //TODO: Sample code, need to be customized
    });
    return Promise.resolve({ total } as DataObject);
  }
}
