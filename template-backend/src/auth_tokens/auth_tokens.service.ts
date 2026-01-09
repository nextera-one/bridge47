import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "../base/base.service";
import DtoUtil from "../common/utils/dto.util";
import Filter from "../common/utils/filter";
import { PageResult, RepoHelpers } from "../common/utils/repo_helpers";
import StringUtil from "../common/utils/string.util";
import { CreateAuthTokensDto } from "./dto/create-auth_tokens.dto";
import { UpdateAuthTokensDto } from "./dto/update-auth_tokens.dto";
import { AuthTokens } from "./entities/auth_tokens.entity";
import { ReadAuthTokensDto } from "./dto/read-auth_tokens.dto";
import DataObject, { JSONValue } from "../model/data_object";

@Injectable()
export class AuthTokensService extends BaseService<AuthTokens> {
  /**
   * Initializes the service with the injected repository.
   * @param {Repository<AuthTokens>} currentRepository - The TypeORM repository for the AuthTokens entity.
   */
  constructor(
    @InjectRepository(AuthTokens)
    private readonly currentRepository: Repository<AuthTokens>,
  ) {
    super(currentRepository);
  }

  /**
   * Creates a new AuthTokens entity.
   * @param {CreateAuthTokensDto} createDto - The data for creating the new entity.
   * @returns {Promise<ReadAuthTokensDto>} The newly created entity as a DTO.
   */
  async create(
    createDto: CreateAuthTokensDto | CreateAuthTokensDto[],
  ): Promise<ReadAuthTokensDto | ReadAuthTokensDto[]> {
    const result = await RepoHelpers.createX(AuthTokens, this, createDto);
    return DtoUtil.convertToDto(ReadAuthTokensDto, result);
  }

  /**
   * Retrieves all AuthTokens entities.
   * @returns {Promise<ReadAuthTokensDto[]>} An array of all entities as DTOs.
   */
  async findAll(): Promise<ReadAuthTokensDto[]> {
    const results = await RepoHelpers.findAll<AuthTokens>(this);
    return DtoUtil.convertToDto(ReadAuthTokensDto, results);
  }

  /**
   * Retrieves all AuthTokens entities by a specific key-value pair.
   * @param {keyof AuthTokens} key - The entity's property key.
   * @param {JSONValue} value - The value to search for.
   * @returns {Promise<ReadAuthTokensDto[]>} An array of all entities as DTOs.
   */
  async findAllBy(
    key: keyof AuthTokens,
    value: JSONValue,
  ): Promise<ReadAuthTokensDto[]> {
    const results = await RepoHelpers.findAllBy<AuthTokens>(this, key, value);
    return DtoUtil.convertToDto(ReadAuthTokensDto, results);
  }

  /**
   * Retrieves a single AuthTokens entity by its ID.
   * @param {string} id - The unique identifier of the entity.
   * @returns {Promise<ReadAuthTokensDto>} The found entity as a DTO.
   */
  async findOne(id: string): Promise<ReadAuthTokensDto> {
    const result = await RepoHelpers.findOne(this, id);
    return DtoUtil.convertToDto(ReadAuthTokensDto, result);
  }

  /**
   * Retrieves a single AuthTokens entity by a specific key-value pair.
   * @param {keyof AuthTokens} key - The entity's property key.
   * @param {JSONValue} value - The value to search for.
   * @returns {Promise<ReadAuthTokensDto>} The found entity as a DTO.
   */
  async findOneBy(
    key: keyof AuthTokens,
    value: JSONValue,
  ): Promise<ReadAuthTokensDto> {
    const result = await RepoHelpers.findOneBy(this, { [key]: value });
    return DtoUtil.convertToDto(ReadAuthTokensDto, result);
  }

  /**
   * Updates an existing AuthTokens entity.
   * @param {string} id - The unique identifier of the entity to update.
   * @param {UpdateAuthTokensDto} updateDto - The data for updating the entity.
   * @returns {Promise<ReadAuthTokensDto>} The updated entity as a DTO.
   */
  async update(
    id: string,
    updateDto: UpdateAuthTokensDto,
  ): Promise<ReadAuthTokensDto> {
    const result = await RepoHelpers.update(AuthTokens, this, id, updateDto);
    return DtoUtil.convertToDto(ReadAuthTokensDto, result);
  }

  /**
   * Removes an existing AuthTokens entity.
   * @param {string} id - The unique identifier of the entity to remove.
   * @returns {Promise<ReadAuthTokensDto>} The removed entity as a DTO.
   */
  async remove(id: string): Promise<ReadAuthTokensDto> {
    const result = await RepoHelpers.remove(this, id);
    return DtoUtil.convertToDto(ReadAuthTokensDto, result);
  }

  /**
   * Retrieves a paginated list of AuthTokens entities based on a filter.
   * @param {string | Filter<AuthTokens>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<PageResult<ReadAuthTokensDto>>} A paginated result object containing DTOs.
   */
  async page(
    queryBy: string | Filter<AuthTokens>,
  ): Promise<PageResult<ReadAuthTokensDto>> {
    const filter: Filter<AuthTokens> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const result = await RepoHelpers.page<AuthTokens>(this, filter);
    const dtos = DtoUtil.convertToDto(ReadAuthTokensDto, result.data);
    return { data: dtos, count: result.count } as PageResult<ReadAuthTokensDto>;
  }

  /**
   * Searches for AuthTokens entities based on a filter.
   * @param {string | Filter<AuthTokens>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<ReadAuthTokensDto[]>} An array of found entities as DTOs.
   */
  async searchBy(
    queryBy: string | Filter<AuthTokens>,
  ): Promise<ReadAuthTokensDto[]> {
    const filter: Filter<AuthTokens> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const query = RepoHelpers.queryBuilder(this, filter);
    const data = await query.getRawMany();
    return DtoUtil.convertToDto(ReadAuthTokensDto, data);
  }

  /**
   * Counts the total number of AuthTokens entities.
   * @param {boolean} [r] - Flag for distinct count.
   * @param {keyof AuthTokens} [field] - The field to apply distinct count on.
   * @returns {Promise<number>} The total count.
   */
  async count(r?: boolean, field?: keyof AuthTokens): Promise<number> {
    return await RepoHelpers.count(this, r, field);
  }

  /**
   * Counts entities based on a filter with where clauses and relations.
   * @param {string | Filter<AuthTokens>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<number>} The total count of matching entities.
   */
  async countWithWhereAndRelations(
    queryBy: string | Filter<AuthTokens>,
  ): Promise<number> {
    const filter: Filter<AuthTokens> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    return await RepoHelpers.countWithWhereAndRelations(this, filter);
  }

  /**
   * Retrieves statistical data for the AuthTokens entity.
   * @returns {Promise<DataObject | null | undefined>} An object containing statistics.
   */
  async getStatistics(): Promise<DataObject | null | undefined> {
    const total: number = await this.countWithWhereAndRelations({
      where: [{ by: "id", operator: "isNotNull", value: "" }], //TODO: Sample code, need to be customized
    });
    return Promise.resolve({ total } as DataObject);
  }
}
