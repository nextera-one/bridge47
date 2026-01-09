import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "../base/base.service";
import DtoUtil from "../common/utils/dto.util";
import Filter from "../common/utils/filter";
import { PageResult, RepoHelpers } from "../common/utils/repo_helpers";
import StringUtil from "../common/utils/string.util";
import { CreateReportedErrorsDto } from "./dto/create-reported_errors.dto";
import { UpdateReportedErrorsDto } from "./dto/update-reported_errors.dto";
import { ReportedErrors } from "./entities/reported_errors.entity";
import { ReadReportedErrorsDto } from "./dto/read-reported_errors.dto";
import DataObject, { JSONValue } from "../model/data_object";

@Injectable()
export class ReportedErrorsService extends BaseService<ReportedErrors> {
  /**
   * Initializes the service with the injected repository.
   * @param {Repository<ReportedErrors>} currentRepository - The TypeORM repository for the ReportedErrors entity.
   */
  constructor(
    @InjectRepository(ReportedErrors)
    private readonly currentRepository: Repository<ReportedErrors>,
  ) {
    super(currentRepository);
  }

  /**
   * Creates a new ReportedErrors entity.
   * @param {CreateReportedErrorsDto} createDto - The data for creating the new entity.
   * @returns {Promise<ReadReportedErrorsDto>} The newly created entity as a DTO.
   */
  async create(
    createDto: CreateReportedErrorsDto | CreateReportedErrorsDto[],
  ): Promise<ReadReportedErrorsDto | ReadReportedErrorsDto[]> {
    const result = await RepoHelpers.createX(ReportedErrors, this, createDto);
    return DtoUtil.convertToDto(ReadReportedErrorsDto, result);
  }

  /**
   * Retrieves all ReportedErrors entities.
   * @returns {Promise<ReadReportedErrorsDto[]>} An array of all entities as DTOs.
   */
  async findAll(): Promise<ReadReportedErrorsDto[]> {
    const results = await RepoHelpers.findAll<ReportedErrors>(this);
    return DtoUtil.convertToDto(ReadReportedErrorsDto, results);
  }

  /**
   * Retrieves all ReportedErrors entities by a specific key-value pair.
   * @param {keyof ReportedErrors} key - The entity's property key.
   * @param {JSONValue} value - The value to search for.
   * @returns {Promise<ReadReportedErrorsDto[]>} An array of all entities as DTOs.
   */
  async findAllBy(
    key: keyof ReportedErrors,
    value: JSONValue,
  ): Promise<ReadReportedErrorsDto[]> {
    const results = await RepoHelpers.findAllBy<ReportedErrors>(
      this,
      key,
      value,
    );
    return DtoUtil.convertToDto(ReadReportedErrorsDto, results);
  }

  /**
   * Retrieves a single ReportedErrors entity by its ID.
   * @param {string} id - The unique identifier of the entity.
   * @returns {Promise<ReadReportedErrorsDto>} The found entity as a DTO.
   */
  async findOne(id: string): Promise<ReadReportedErrorsDto> {
    const result = await RepoHelpers.findOne(this, id);
    return DtoUtil.convertToDto(ReadReportedErrorsDto, result);
  }

  /**
   * Retrieves a single ReportedErrors entity by a specific key-value pair.
   * @param {keyof ReportedErrors} key - The entity's property key.
   * @param {JSONValue} value - The value to search for.
   * @returns {Promise<ReadReportedErrorsDto>} The found entity as a DTO.
   */
  async findOneBy(
    key: keyof ReportedErrors,
    value: JSONValue,
  ): Promise<ReadReportedErrorsDto> {
    const result = await RepoHelpers.findOneBy(this, { [key]: value });
    return DtoUtil.convertToDto(ReadReportedErrorsDto, result);
  }

  /**
   * Updates an existing ReportedErrors entity.
   * @param {string} id - The unique identifier of the entity to update.
   * @param {UpdateReportedErrorsDto} updateDto - The data for updating the entity.
   * @returns {Promise<ReadReportedErrorsDto>} The updated entity as a DTO.
   */
  async update(
    id: string,
    updateDto: UpdateReportedErrorsDto,
  ): Promise<ReadReportedErrorsDto> {
    const result = await RepoHelpers.update(
      ReportedErrors,
      this,
      id,
      updateDto,
    );
    return DtoUtil.convertToDto(ReadReportedErrorsDto, result);
  }

  /**
   * Removes an existing ReportedErrors entity.
   * @param {string} id - The unique identifier of the entity to remove.
   * @returns {Promise<ReadReportedErrorsDto>} The removed entity as a DTO.
   */
  async remove(id: string): Promise<ReadReportedErrorsDto> {
    const result = await RepoHelpers.remove(this, id);
    return DtoUtil.convertToDto(ReadReportedErrorsDto, result);
  }

  /**
   * Retrieves a paginated list of ReportedErrors entities based on a filter.
   * @param {string | Filter<ReportedErrors>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<PageResult<ReadReportedErrorsDto>>} A paginated result object containing DTOs.
   */
  async page(
    queryBy: string | Filter<ReportedErrors>,
  ): Promise<PageResult<ReadReportedErrorsDto>> {
    const filter: Filter<ReportedErrors> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const result = await RepoHelpers.page<ReportedErrors>(this, filter);
    const dtos = DtoUtil.convertToDto(ReadReportedErrorsDto, result.data);
    return {
      data: dtos,
      count: result.count,
    } as PageResult<ReadReportedErrorsDto>;
  }

  /**
   * Searches for ReportedErrors entities based on a filter.
   * @param {string | Filter<ReportedErrors>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<ReadReportedErrorsDto[]>} An array of found entities as DTOs.
   */
  async searchBy(
    queryBy: string | Filter<ReportedErrors>,
  ): Promise<ReadReportedErrorsDto[]> {
    const filter: Filter<ReportedErrors> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const query = RepoHelpers.queryBuilder(this, filter);
    const data = await query.getRawMany();
    return DtoUtil.convertToDto(ReadReportedErrorsDto, data);
  }

  /**
   * Counts the total number of ReportedErrors entities.
   * @param {boolean} [r] - Flag for distinct count.
   * @param {keyof ReportedErrors} [field] - The field to apply distinct count on.
   * @returns {Promise<number>} The total count.
   */
  async count(r?: boolean, field?: keyof ReportedErrors): Promise<number> {
    return await RepoHelpers.count(this, r, field);
  }

  /**
   * Counts entities based on a filter with where clauses and relations.
   * @param {string | Filter<ReportedErrors>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<number>} The total count of matching entities.
   */
  async countWithWhereAndRelations(
    queryBy: string | Filter<ReportedErrors>,
  ): Promise<number> {
    const filter: Filter<ReportedErrors> =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    return await RepoHelpers.countWithWhereAndRelations(this, filter);
  }

  /**
   * Retrieves statistical data for the ReportedErrors entity.
   * @returns {Promise<DataObject | null | undefined>} An object containing statistics.
   */
  async getStatistics(): Promise<DataObject | null | undefined> {
    const total: number = await this.countWithWhereAndRelations({
      where: [{ by: "id", operator: "isNotNull", value: "" }], //TODO: Sample code, need to be customized
    });
    return Promise.resolve({ total } as DataObject);
  }
}
