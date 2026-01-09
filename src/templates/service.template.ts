import GeneratorHelper from '../utils/generator.helper';

/**
 * Generates a NestJS service class string for a given database table.
 * @param {string} tableName - The name of the database table (e.g., 'user_profiles').
 * @returns {string} A string containing the full TypeScript code for the service.
 */
export function generateService(tableName: string): string {
  const className = GeneratorHelper.snakeToPascal(tableName);
  return `
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { BaseService } from '../base/base.service';
import DtoUtil from '../common/utils/dto.util';
import Filter from '../common/utils/filter';
import { PageResult, RepoHelpers } from '../common/utils/repo_helpers';
import StringUtil from '../common/utils/string.util';
import { Create${className}Dto } from './dto/create-${tableName}.dto';
import { Update${className}Dto } from './dto/update-${tableName}.dto';
import { ${className} } from './entities/${tableName}.entity';
import { Read${className}Dto } from './dto/read-${tableName}.dto';
import DataObject, { JSONValue } from '../model/data_object';

@Injectable()
export class ${className}Service extends BaseService<${className}> {
  /**
   * Initializes the service with the injected repository.
   * @param {Repository<${className}>} currentRepository - The TypeORM repository for the ${className} entity.
   */
  constructor(
    @InjectRepository(${className})
    private readonly currentRepository: Repository<${className}>,
  ) {
    super(currentRepository);
  }

  /**
   * Creates a new ${className} entity.
   * @param {Create${className}Dto} createDto - The data for creating the new entity.
   * @returns {Promise<Read${className}Dto>} The newly created entity as a DTO.
   */
  async create(createDto: Create${className}Dto | Create${className}Dto[]): Promise<Read${className}Dto | Read${className}Dto[]> {
    const result = await RepoHelpers.createX(${className}, this, createDto);
    return DtoUtil.convertToDto(Read${className}Dto, result);
  }

  /**
   * Retrieves all ${className} entities.
   * @returns {Promise<Read${className}Dto[]>} An array of all entities as DTOs.
   */
  async findAll(): Promise<Read${className}Dto[]> {    
    const results = await RepoHelpers.findAll<${className}>(this);
    return DtoUtil.convertToDto(Read${className}Dto, results);
  }

      /**
   * Retrieves all ${className} entities by a specific key-value pair.
   * @param {keyof ${className}} key - The entity's property key.
   * @param {JSONValue} value - The value to search for.
   * @returns {Promise<Read${className}Dto[]>} An array of all entities as DTOs.
   */
  async findAllBy(key: keyof ${className}, value: JSONValue): Promise<Read${className}Dto[]> {
    const results = await RepoHelpers.findAllBy<${className}>(this, key, value);
    return DtoUtil.convertToDto(Read${className}Dto, results);
  }
    
  /**
   * Retrieves a single ${className} entity by its ID.
   * @param {string} id - The unique identifier of the entity.
   * @returns {Promise<Read${className}Dto>} The found entity as a DTO.
   */
  async findOne(id: string): Promise<Read${className}Dto> {
    const result = await RepoHelpers.findOne(this, id);
    return DtoUtil.convertToDto(Read${className}Dto, result);
  }

  /**
   * Retrieves a single ${className} entity by a specific key-value pair.
   * @param {keyof ${className}} key - The entity's property key.
   * @param {JSONValue} value - The value to search for.
   * @returns {Promise<Read${className}Dto>} The found entity as a DTO.
   */
  async findOneBy(key: keyof ${className}, value: JSONValue): Promise<Read${className}Dto> {
    const result = await RepoHelpers.findOneBy(this, { [key]: value });
    return DtoUtil.convertToDto(Read${className}Dto, result);
  }

  /**
   * Updates an existing ${className} entity.
   * @param {string} id - The unique identifier of the entity to update.
   * @param {Update${className}Dto} updateDto - The data for updating the entity.
   * @returns {Promise<Read${className}Dto>} The updated entity as a DTO.
   */
  async update(id: string, updateDto: Update${className}Dto): Promise<Read${className}Dto> {
    const result = await RepoHelpers.update(${className}, this, id, updateDto);
    return DtoUtil.convertToDto(Read${className}Dto, result);
  }

  /**
   * Removes an existing ${className} entity.
   * @param {string} id - The unique identifier of the entity to remove.
   * @returns {Promise<Read${className}Dto>} The removed entity as a DTO.
   */
  async remove(id: string): Promise<Read${className}Dto> {
    const result = await RepoHelpers.remove(this, id);
    return DtoUtil.convertToDto(Read${className}Dto, result);
  }

  /**
   * Retrieves a paginated list of ${className} entities based on a filter.
   * @param {string | Filter<${className}>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<PageResult<Read${className}Dto>>} A paginated result object containing DTOs.
   */
  async page(queryBy: string | Filter<${className}>): Promise<PageResult<Read${className}Dto>> {
    const filter: Filter<${className}> = typeof queryBy === 'string' ? StringUtil.base64ToObj(queryBy) : queryBy;
    const result = await RepoHelpers.page<${className}>(this, filter);
    const dtos = DtoUtil.convertToDto(Read${className}Dto, result.data);
    return { data: dtos, count: result.count } as PageResult<Read${className}Dto>;
  }

  /**
   * Searches for ${className} entities based on a filter.
   * @param {string | Filter<${className}>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<Read${className}Dto[]>} An array of found entities as DTOs.
   */
  async searchBy(queryBy: string | Filter<${className}>): Promise<Read${className}Dto[]> {
    const filter: Filter<${className}> = typeof queryBy === 'string' ? StringUtil.base64ToObj(queryBy) : queryBy;
    const query = RepoHelpers.queryBuilder(this, filter);
    const data = await query.getRawMany();
    return DtoUtil.convertToDto(Read${className}Dto, data);
  }

  /**
   * Counts the total number of ${className} entities.
   * @param {boolean} [r] - Flag for distinct count.
   * @param {keyof ${className}} [field] - The field to apply distinct count on.
   * @returns {Promise<number>} The total count.
   */
  async count(r?: boolean, field?: keyof ${className}): Promise<number> {
    return await RepoHelpers.count(this, r, field);
  }

  /**
   * Counts entities based on a filter with where clauses and relations.
   * @param {string | Filter<${className}>} queryBy - A filter object or a base64 encoded filter string.
   * @returns {Promise<number>} The total count of matching entities.
   */
  async countWithWhereAndRelations(queryBy: string | Filter<${className}>): Promise<number> {
    const filter: Filter<${className}> =
      typeof queryBy === 'string' ? StringUtil.base64ToObj(queryBy) : queryBy;
    return await RepoHelpers.countWithWhereAndRelations(this, filter);
  }

  /**
   * Retrieves statistical data for the ${className} entity.
   * @returns {Promise<DataObject | null | undefined>} An object containing statistics.
   */
  async getStatistics(): Promise<DataObject | null | undefined> {
    const total: number = await this.countWithWhereAndRelations({
      where: [{ by: 'id', operator: 'isNotNull', value: '' }],//TODO: Sample code, need to be customized
    });
    return Promise.resolve({ total } as DataObject);
  }
}
`;
}