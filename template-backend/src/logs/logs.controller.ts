import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { LogsService } from "./logs.service";
import { CreateLogsDto } from "./dto/create-logs.dto";
import { UpdateLogsDto } from "./dto/update-logs.dto";
import { ReadLogsDto } from "./dto/read-logs.dto";
import { RolesGuard } from "../common/guards/roles.guard";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { BaseController } from "../base/base.controller";
import { PageResult } from "../common/utils/repo_helpers";
import DataObject from "src/model/data_object";
import { Logs } from "./entities/logs.entity";

@Controller({ path: "logs", version: "1" })
@ApiTags("Logs")
@ApiBearerAuth("Bearer") // if you use Authorization: Bearer <jwt
@ApiExtraModels(ReadLogsDto, CreateLogsDto, UpdateLogsDto)
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogsController extends BaseController {
  /**
   * Initializes the controller and injects the required service.
   * @param {LogsService} currentService - The service associated with this controller.
   */
  constructor(private readonly currentService: LogsService) {
    super();
  }

  /**
   * Retrieves statistical data for the Logs records.
   * @returns {Promise<DataObject>} An object containing statistics.
   */
  @Get("/statistics")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get Users statistics" })
  @ApiOkResponse({
    description: "The Users statistics",
    type: Object,
  })
  @Header("Accept", "application/json")
  async getStatistics(): Promise<DataObject> {
    try {
      return await this.currentService.getStatistics();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new Logs record.
   * @param {CreateLogsDto} createDto - The data transfer object for creating the record.
   * @returns {Promise<ReadLogsDto>} The newly created record.
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadLogsDto })
  @ApiOperation({ summary: "Create Logs" })
  @ApiBody({ type: CreateLogsDto })
  @Header("Content-Type", "application/json")
  async create(
    @Body() createDto: CreateLogsDto | CreateLogsDto[],
  ): Promise<ReadLogsDto | ReadLogsDto[]> {
    try {
      return await this.currentService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a paginated list of Logs records based on a filter.
   * @param {string} queryBy - A stringified JSON object for filtering, sorting, and pagination.
   * @returns {Promise<PageResult<ReadLogsDto>>} A paginated result object.
   */
  @Get("/page")
  @ApiOperation({ summary: "Find Logs with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: Object as () => PageResult<ReadLogsDto>,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Header("Accept", "application/json")
  async page(
    @Query("filter") queryBy: string,
  ): Promise<PageResult<ReadLogsDto>> {
    try {
      return await this.currentService.page(queryBy);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Searches for Logs records that match the given filter criteria.
   * @param {string} queryBy - A stringified JSON object for filtering.
   * @returns {Promise<ReadLogsDto[]>} An array of matching records.
   */
  @Get("/search")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find Logs with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadLogsDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async search(@Query("filter") queryBy: string): Promise<ReadLogsDto[]> {
    try {
      return await this.currentService.searchBy(queryBy);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all Logs records.
   * @returns {Promise<ReadLogsDto[]>} An array of all records.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find all Logss" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadLogsDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async findAll(): Promise<ReadLogsDto[]> {
    try {
      return await this.currentService.findAll();
    } catch (error) {
      throw error;
    }
  }
  /**
   * Retrieves all Logs records by a specific key-value pair.
   * @returns {Promise<ReadLogsDto[]>} An array of all records.
   */
  @Get("/all-by")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find all Logss by key-value pair" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadLogsDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async findAllBy(
    @Query("key") key: keyof Logs,
    @Query("value") value: string,
  ): Promise<ReadLogsDto[]> {
    try {
      return await this.currentService.findAllBy(key, value);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Counts the total number of Logs records, optionally applying a filter.
   * @param {string} queryBy - An optional stringified JSON object for filtering.
   * @returns {Promise<number>} The total count of records.
   */
  @Get("/count")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Count Users" })
  @ApiOkResponse({
    description: "The count of records",
    type: Number,
  })
  @Header("Accept", "application/json")
  async count(@Query("filter") queryBy: string): Promise<number> {
    try {
      if (queryBy) {
        return await this.currentService.countWithWhereAndRelations(queryBy);
      } else {
        return await this.currentService.count();
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Finds a single Logs record by its ID.
   * @param {string} id - The unique identifier of the record.
   * @returns {Promise<ReadLogsDto>} The found record.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find Logs by id" })
  @ApiOkResponse({ description: "The found record", type: ReadLogsDto })
  @Header("Accept", "application/json")
  async findOne(@Param("id") id: string): Promise<ReadLogsDto> {
    try {
      return await this.currentService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing Logs record by its ID.
   * @param {string} id - The unique identifier of the record to update.
   * @param {UpdateLogsDto} updateDto - The data transfer object with the updated fields.
   * @returns {Promise<ReadLogsDto>} The updated record.
   */
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadLogsDto })
  @ApiOperation({ summary: "Update Logs by id" })
  @ApiBody({ type: UpdateLogsDto })
  @Header("Content-Type", "application/json")
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateLogsDto,
  ): Promise<ReadLogsDto> {
    try {
      return await this.currentService.update(id, updateDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a Logs record by its ID.
   * @param {string} id - The unique identifier of the record to delete.
   * @returns {Promise<ReadLogsDto>} The deleted record.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadLogsDto })
  @ApiOperation({ summary: "Delete Logs by id" })
  async remove(@Param("id") id: string): Promise<ReadLogsDto> {
    try {
      return await this.currentService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
