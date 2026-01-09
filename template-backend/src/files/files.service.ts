import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "../base/base.service";
import DtoUtil from "../common/utils/dto.util";
import Filter from "../common/utils/filter";
import { PageResult, RepoHelpers } from "../common/utils/repo_helpers";
import StringUtil from "../common/utils/string.util";
import { CreateFilesDto } from "./dto/create-files.dto";
import { UpdateFilesDto } from "./dto/update-files.dto";
import { Files } from "./entities/files.entity";
import { ReadFilesDto } from "./dto/read-files.dto";
import DataObject, { JSONValue } from "../model/data_object";

@Injectable()
export class FilesService extends BaseService<Files> {
  /**
   * Initializes the service with the injected repository.
   * @param {Repository<Files>} currentRepository - The TypeORM repository for the Files entity.
   */
  constructor(
    @InjectRepository(Files)
    private readonly currentRepository: Repository<Files>,
  ) {
    super(currentRepository);
  }

  /**
   * Creates a new Files entity.
   * @param {CreateFilesDto} createDto - The data for creating the new entity.
   * @returns {Promise<ReadFilesDto>} The newly created entity as a DTO.
   */
  async create(
    createDto: CreateFilesDto | CreateFilesDto[],
  ): Promise<ReadFilesDto | ReadFilesDto[]> {
    const result = await RepoHelpers.createX(Files, this, createDto);
    return DtoUtil.convertToDto(ReadFilesDto, result);
  }

  /**
   * Retrieves all Files entities.
   * @returns {Promise<ReadFilesDto[]>} An array of all entities as DTOs.
   */
  async findAll(): Promise<ReadFilesDto[]> {
    const results = await RepoHelpers.findAll<Files>(this);
    return DtoUtil.convertToDto(ReadFilesDto, results);
  }

  /**
   * Retrieves all Files entities by a specific key-value pair.
   * @param {keyof Files} key - The entity's property key.
   * @param {JSONValue} value - The value to search for.
   * @returns {Promise<ReadFilesDto[]>} An array of all entities as DTOs.
   */
  async findAllBy(key: keyof Files, value: JSONValue): Promise<ReadFilesDto[]> {
    const results = await RepoHelpers.findAllBy<Files>(this, key, value);
    return DtoUtil.convertToDto(ReadFilesDto, results);
  }

  /**
   * Retrieves a single Files entity by its ID.
   * @param {string} id - The unique identifier of the entity.
   * @returns {Promise<ReadFilesDto>} The found entity as a DTO.
   */
  async findOne(id: string): Promise<ReadFilesDto> {
    const result = await RepoHelpers.findOne(this, id);
    return DtoUtil.convertToDto(ReadFilesDto, result);
  }

  /**
   * Retrieves a single Files entity by a specific key-value pair.
   * @param {keyof Files} key - The entity's property key.
   * @param {JSONValue} value - The value to search for.
   * @returns {Promise<ReadFilesDto>} The found entity as a DTO.
   */
  async findOneBy(key: keyof Files, value: JSONValue): Promise<ReadFilesDto> {
    const result = await RepoHelpers.findOneBy(this, { [key]: value });
    return DtoUtil.convertToDto(ReadFilesDto, result);
  }

  /**
   * Updates an existing Files entity.
   * @param {string} id - The unique identifier of the entity to update.
   * @param {UpdateFilesDto} updateDto - The data for updating the entity.
   * @returns {Promise<ReadFilesDto>} The updated entity as a DTO.
   */
  async update(id: string, updateDto: UpdateFilesDto): Promise<ReadFilesDto> {
    const result = await RepoHelpers.update(Files, this, id, updateDto);
    return DtoUtil.convertToDto(ReadFilesDto, result);
  }

  /**
   * Removes an existing Files entity.
   * @param {string} id - The unique identifier of the entity to remove.
   * @returns {Promise<ReadFilesDto>} The removed entity as a DTO.
   */
  async remove(id: string): Promise<ReadFilesDto> {
    const result = await RepoHelpers.remove(this, id);
    return DtoUtil.convertToDto(ReadFilesDto, result);
  }

  /**
   * Retrieves a paginated list of Files entities based on a filter.
   * @param {string | Filter<Files>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<PageResult<ReadFilesDto>>} A paginated result object containing DTOs.
   */
  async page(
    queryBy: string | Filter<Files>,
  ): Promise<PageResult<ReadFilesDto>> {
    const filter: Filter<Files> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const result = await RepoHelpers.page<Files>(this, filter);
    const dtos = DtoUtil.convertToDto(ReadFilesDto, result.data);
    return { data: dtos, count: result.count } as PageResult<ReadFilesDto>;
  }

  /**
   * Searches for Files entities based on a filter.
   * @param {string | Filter<Files>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<ReadFilesDto[]>} An array of found entities as DTOs.
   */
  async searchBy(queryBy: string | Filter<Files>): Promise<ReadFilesDto[]> {
    const filter: Filter<Files> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const query = RepoHelpers.queryBuilder(this, filter);
    const data = await query.getRawMany();
    return DtoUtil.convertToDto(ReadFilesDto, data);
  }

  /**
   * Counts the total number of Files entities.
   * @param {boolean} [r] - Flag for distinct count.
   * @param {keyof Files} [field] - The field to apply distinct count on.
   * @returns {Promise<number>} The total count.
   */
  async count(r?: boolean, field?: keyof Files): Promise<number> {
    return await RepoHelpers.count(this, r, field);
  }

  /**
   * Counts entities based on a filter with where clauses and relations.
   * @param {string | Filter<Files>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<number>} The total count of matching entities.
   */
  async countWithWhereAndRelations(
    queryBy: string | Filter<Files>,
  ): Promise<number> {
    const filter: Filter<Files> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    return await RepoHelpers.countWithWhereAndRelations(this, filter);
  }

  /**
   * Retrieves statistical data for the Files entity.
   * @returns {Promise<DataObject | null | undefined>} An object containing statistics.
   */
  async getStatistics(): Promise<DataObject | null | undefined> {
    const total: number = await this.countWithWhereAndRelations({
      where: [{ by: "id", operator: "isNotNull", value: "" }], //TODO: Sample code, need to be customized
    });
    return Promise.resolve({ total } as DataObject);
  }
}
