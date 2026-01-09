import GeneratorHelper from '../utils/generator.helper';

/**
 * Generates a NestJS controller class string for a given database table.
 * @param {string} tableName - The name of the database table (e.g., 'user_profiles').
 * @param {string} version - The API version for the controller (e.g., '1').
 * @returns {string} A string containing the full TypeScript code for the controller.
 */
export function generateController(tableName: string, version: string): string {
  const className = GeneratorHelper.snakeToPascal(tableName);
  const kebabName = GeneratorHelper.snakeToKebabCase(tableName);
  
  return `
import { 
  Body, Controller, Delete, Get, Param, ParseUUIDPipe, 
  Patch, Post, UseGuards, Query, HttpCode, HttpStatus 
} from '@nestjs/common';
import { 
  ApiBearerAuth, ApiExtraModels, ApiBody, ApiOperation, 
  ApiOkResponse, ApiTags, ApiNotFoundResponse, ApiBadRequestResponse,
  ApiUnauthorizedResponse, ApiParam, ApiQuery
} from '@nestjs/swagger';
import { ${className}Service } from './${tableName}.service';
import { Create${className}Dto } from './dto/create-${tableName}.dto';
import { Update${className}Dto } from './dto/update-${tableName}.dto';
import { Read${className}Dto } from './dto/read-${tableName}.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BaseController } from '../base/base.controller';
import { PageResult } from '../common/utils/repo_helpers';
import DataObject from 'src/model/data_object';
import { ${className} } from './entities/${tableName}.entity';

@Controller({ path: '${kebabName}', version: '${version}' })
@ApiTags('${className}')
@ApiBearerAuth('Bearer')
@ApiExtraModels(Read${className}Dto, Create${className}Dto, Update${className}Dto)
@ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing JWT token' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class ${className}Controller extends BaseController {
  constructor(private readonly currentService: ${className}Service) {
    super();
  }

  /**
   * Retrieves statistical data for ${className} records.
   */
  @Get('/statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get ${className} statistics' })
  @ApiOkResponse({ description: 'Statistics retrieved successfully', type: Object })
  async getStatistics(): Promise<DataObject> {
    return this.currentService.getStatistics();
  }

  /**
   * Creates a new ${className} record.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new ${className}' })
  @ApiBody({ type: Create${className}Dto })
  @ApiOkResponse({ description: '${className} created successfully', type: Read${className}Dto })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(
    @Body() createDto: Create${className}Dto | Create${className}Dto[]
  ): Promise<Read${className}Dto | Read${className}Dto[]> {
    return this.currentService.create(createDto);
  }

  /**
   * Retrieves a paginated list of ${className} records.
   */
  @Get('/page')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get paginated ${className} list' })
  @ApiQuery({ name: 'filter', description: 'Base64 encoded filter object', required: false })
  @ApiOkResponse({ description: 'Paginated results', type: Object })
  async page(@Query('filter') queryBy: string): Promise<PageResult<Read${className}Dto>> {
    return this.currentService.page(queryBy);
  }

  /**
   * Searches for ${className} records matching criteria.
   */
  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search ${className} with filters' })
  @ApiQuery({ name: 'filter', description: 'Base64 encoded filter object', required: false })
  @ApiOkResponse({ description: 'Search results', type: Read${className}Dto, isArray: true })
  async search(@Query('filter') queryBy: string): Promise<Read${className}Dto[]> {
    return this.currentService.searchBy(queryBy);
  }

  /**
   * Retrieves all ${className} records.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all ${className}s' })
  @ApiOkResponse({ description: 'List of all ${className}s', type: Read${className}Dto, isArray: true })
  async findAll(): Promise<Read${className}Dto[]> {
    return this.currentService.findAll();
  }

  /**
   * Retrieves all ${className} records by a key-value pair.
   */
  @Get('/all-by')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all ${className}s by key-value pair' })
  @ApiQuery({ name: 'key', description: 'Property name to filter by', required: true })
  @ApiQuery({ name: 'value', description: 'Value to match', required: true })
  @ApiOkResponse({ description: 'Filtered ${className}s', type: Read${className}Dto, isArray: true })
  async findAllBy(
    @Query('key') key: keyof ${className}, 
    @Query('value') value: string
  ): Promise<Read${className}Dto[]> {
    return this.currentService.findAllBy(key, value);
  }

  /**
   * Counts total ${className} records.
   */
  @Get('/count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Count ${className} records' })
  @ApiQuery({ name: 'filter', description: 'Base64 encoded filter object', required: false })
  @ApiOkResponse({ description: 'Total count', type: Number })
  async count(@Query('filter') queryBy?: string): Promise<number> {
    if (queryBy) {
      return this.currentService.countWithWhereAndRelations(queryBy);
    }
    return this.currentService.count();
  }

  /**
   * Retrieves a single ${className} by ID.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get ${className} by ID' })
  @ApiParam({ name: 'id', description: '${className} unique identifier', type: String })
  @ApiOkResponse({ description: '${className} found', type: Read${className}Dto })
  @ApiNotFoundResponse({ description: '${className} not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Read${className}Dto> {
    return this.currentService.findOne(id);
  }

  /**
   * Updates an existing ${className}.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update ${className} by ID' })
  @ApiParam({ name: 'id', description: '${className} unique identifier', type: String })
  @ApiBody({ type: Update${className}Dto })
  @ApiOkResponse({ description: '${className} updated', type: Read${className}Dto })
  @ApiNotFoundResponse({ description: '${className} not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateDto: Update${className}Dto
  ): Promise<Read${className}Dto> {
    return this.currentService.update(id, updateDto);
  }

  /**
   * Deletes a ${className} by ID.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete ${className} by ID' })
  @ApiParam({ name: 'id', description: '${className} unique identifier', type: String })
  @ApiOkResponse({ description: '${className} deleted', type: Read${className}Dto })
  @ApiNotFoundResponse({ description: '${className} not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<Read${className}Dto> {
    return this.currentService.remove(id);
  }
}
`;
}