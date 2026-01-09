import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "../base/base.service";
import DtoUtil from "../common/utils/dto.util";
import Filter from "../common/utils/filter";
import { PageResult, RepoHelpers } from "../common/utils/repo_helpers";
import StringUtil from "../common/utils/string.util";
import { CreateLogsDto } from "./dto/create-logs.dto";
import { UpdateLogsDto } from "./dto/update-logs.dto";
import { Logs } from "./entities/logs.entity";
import { ReadLogsDto } from "./dto/read-logs.dto";
import DataObject, { JSONValue } from "../model/data_object";

@Injectable()
export class LogsService extends BaseService<Logs> {
  /**
   * Initializes the service with the injected repository.
   * @param {Repository<Logs>} currentRepository - The TypeORM repository for the Logs entity.
   */
  constructor(
    @InjectRepository(Logs)
    private readonly currentRepository: Repository<Logs>,
  ) {
    super(currentRepository);
  }

  /**
   * Creates a new Logs entity.
   * @param {CreateLogsDto} createDto - The data for creating the new entity.
   * @returns {Promise<ReadLogsDto>} The newly created entity as a DTO.
   */
  async create(
    createDto: CreateLogsDto | CreateLogsDto[],
  ): Promise<ReadLogsDto | ReadLogsDto[]> {
    const result = await RepoHelpers.createX(Logs, this, createDto);
    return DtoUtil.convertToDto(ReadLogsDto, result);
  }

  /**
   * Retrieves all Logs entities.
   * @returns {Promise<ReadLogsDto[]>} An array of all entities as DTOs.
   */
  async findAll(): Promise<ReadLogsDto[]> {
    const results = await RepoHelpers.findAll<Logs>(this);
    return DtoUtil.convertToDto(ReadLogsDto, results);
  }

  /**
   * Retrieves all Logs entities by a specific key-value pair.
   * @param {keyof Logs} key - The entity's property key.
   * @param {JSONValue} value - The value to search for.
   * @returns {Promise<ReadLogsDto[]>} An array of all entities as DTOs.
   */
  async findAllBy(key: keyof Logs, value: JSONValue): Promise<ReadLogsDto[]> {
    const results = await RepoHelpers.findAllBy<Logs>(this, key, value);
    return DtoUtil.convertToDto(ReadLogsDto, results);
  }

  /**
   * Retrieves a single Logs entity by its ID.
   * @param {string} id - The unique identifier of the entity.
   * @returns {Promise<ReadLogsDto>} The found entity as a DTO.
   */
  async findOne(id: string): Promise<ReadLogsDto> {
    const result = await RepoHelpers.findOne(this, id);
    return DtoUtil.convertToDto(ReadLogsDto, result);
  }

  /**
   * Retrieves a single Logs entity by a specific key-value pair.
   * @param {keyof Logs} key - The entity's property key.
   * @param {JSONValue} value - The value to search for.
   * @returns {Promise<ReadLogsDto>} The found entity as a DTO.
   */
  async findOneBy(key: keyof Logs, value: JSONValue): Promise<ReadLogsDto> {
    const result = await RepoHelpers.findOneBy(this, { [key]: value });
    return DtoUtil.convertToDto(ReadLogsDto, result);
  }

  /**
   * Updates an existing Logs entity.
   * @param {string} id - The unique identifier of the entity to update.
   * @param {UpdateLogsDto} updateDto - The data for updating the entity.
   * @returns {Promise<ReadLogsDto>} The updated entity as a DTO.
   */
  async update(id: string, updateDto: UpdateLogsDto): Promise<ReadLogsDto> {
    const result = await RepoHelpers.update(Logs, this, id, updateDto);
    return DtoUtil.convertToDto(ReadLogsDto, result);
  }

  /**
   * Removes an existing Logs entity.
   * @param {string} id - The unique identifier of the entity to remove.
   * @returns {Promise<ReadLogsDto>} The removed entity as a DTO.
   */
  async remove(id: string): Promise<ReadLogsDto> {
    const result = await RepoHelpers.remove(this, id);
    return DtoUtil.convertToDto(ReadLogsDto, result);
  }

  /**
   * Retrieves a paginated list of Logs entities based on a filter.
   * @param {string | Filter<Logs>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<PageResult<ReadLogsDto>>} A paginated result object containing DTOs.
   */
  async page(queryBy: string | Filter<Logs>): Promise<PageResult<ReadLogsDto>> {
    const filter: Filter<Logs> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const result = await RepoHelpers.page<Logs>(this, filter);
    const dtos = DtoUtil.convertToDto(ReadLogsDto, result.data);
    return { data: dtos, count: result.count } as PageResult<ReadLogsDto>;
  }

  /**
   * Searches for Logs entities based on a filter.
   * @param {string | Filter<Logs>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<ReadLogsDto[]>} An array of found entities as DTOs.
   */
  async searchBy(queryBy: string | Filter<Logs>): Promise<ReadLogsDto[]> {
    const filter: Filter<Logs> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const query = RepoHelpers.queryBuilder(this, filter);
    const data = await query.getRawMany();
    return DtoUtil.convertToDto(ReadLogsDto, data);
  }

  /**
   * Counts the total number of Logs entities.
   * @param {boolean} [r] - Flag for distinct count.
   * @param {keyof Logs} [field] - The field to apply distinct count on.
   * @returns {Promise<number>} The total count.
   */
  async count(r?: boolean, field?: keyof Logs): Promise<number> {
    return await RepoHelpers.count(this, r, field);
  }

  /**
   * Counts entities based on a filter with where clauses and relations.
   * @param {string | Filter<Logs>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<number>} The total count of matching entities.
   */
  async countWithWhereAndRelations(
    queryBy: string | Filter<Logs>,
  ): Promise<number> {
    const filter: Filter<Logs> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    return await RepoHelpers.countWithWhereAndRelations(this, filter);
  }

  /**
   * Retrieves statistical data for the Logs entity.
   * @returns {Promise<DataObject | null | undefined>} An object containing statistics.
   */
  async getStatistics(): Promise<DataObject | null | undefined> {
    const total: number = await this.countWithWhereAndRelations({
      where: [{ by: "id", operator: "isNotNull", value: "" }], //TODO: Sample code, need to be customized
    });
    return Promise.resolve({ total } as DataObject);
  }
}
