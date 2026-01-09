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
import { ReportedErrorsService } from "./reported_errors.service";
import { CreateReportedErrorsDto } from "./dto/create-reported_errors.dto";
import { UpdateReportedErrorsDto } from "./dto/update-reported_errors.dto";
import { ReadReportedErrorsDto } from "./dto/read-reported_errors.dto";
import { RolesGuard } from "../common/guards/roles.guard";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { BaseController } from "../base/base.controller";
import { PageResult } from "../common/utils/repo_helpers";
import DataObject from "src/model/data_object";
import { ReportedErrors } from "./entities/reported_errors.entity";

@Controller({ path: "reported-errors", version: "1" })
@ApiTags("ReportedErrors")
@ApiBearerAuth("Bearer") // if you use Authorization: Bearer <jwt
@ApiExtraModels(
  ReadReportedErrorsDto,
  CreateReportedErrorsDto,
  UpdateReportedErrorsDto,
)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportedErrorsController extends BaseController {
  /**
   * Initializes the controller and injects the required service.
   * @param {ReportedErrorsService} currentService - The service associated with this controller.
   */
  constructor(private readonly currentService: ReportedErrorsService) {
    super();
  }

  /**
   * Retrieves statistical data for the ReportedErrors records.
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
   * Creates a new ReportedErrors record.
   * @param {CreateReportedErrorsDto} createDto - The data transfer object for creating the record.
   * @returns {Promise<ReadReportedErrorsDto>} The newly created record.
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadReportedErrorsDto })
  @ApiOperation({ summary: "Create ReportedErrors" })
  @ApiBody({ type: CreateReportedErrorsDto })
  @Header("Content-Type", "application/json")
  async create(
    @Body() createDto: CreateReportedErrorsDto | CreateReportedErrorsDto[],
  ): Promise<ReadReportedErrorsDto | ReadReportedErrorsDto[]> {
    try {
      return await this.currentService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a paginated list of ReportedErrors records based on a filter.
   * @param {string} queryBy - A stringified JSON object for filtering, sorting, and pagination.
   * @returns {Promise<PageResult<ReadReportedErrorsDto>>} A paginated result object.
   */
  @Get("/page")
  @ApiOperation({ summary: "Find ReportedErrors with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: Object as () => PageResult<ReadReportedErrorsDto>,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Header("Accept", "application/json")
  async page(
    @Query("filter") queryBy: string,
  ): Promise<PageResult<ReadReportedErrorsDto>> {
    try {
      return await this.currentService.page(queryBy);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Searches for ReportedErrors records that match the given filter criteria.
   * @param {string} queryBy - A stringified JSON object for filtering.
   * @returns {Promise<ReadReportedErrorsDto[]>} An array of matching records.
   */
  @Get("/search")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find ReportedErrors with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadReportedErrorsDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async search(
    @Query("filter") queryBy: string,
  ): Promise<ReadReportedErrorsDto[]> {
    try {
      return await this.currentService.searchBy(queryBy);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all ReportedErrors records.
   * @returns {Promise<ReadReportedErrorsDto[]>} An array of all records.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find all ReportedErrorss" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadReportedErrorsDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async findAll(): Promise<ReadReportedErrorsDto[]> {
    try {
      return await this.currentService.findAll();
    } catch (error) {
      throw error;
    }
  }
  /**
   * Retrieves all ReportedErrors records by a specific key-value pair.
   * @returns {Promise<ReadReportedErrorsDto[]>} An array of all records.
   */
  @Get("/all-by")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find all ReportedErrorss by key-value pair" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadReportedErrorsDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async findAllBy(
    @Query("key") key: keyof ReportedErrors,
    @Query("value") value: string,
  ): Promise<ReadReportedErrorsDto[]> {
    try {
      return await this.currentService.findAllBy(key, value);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Counts the total number of ReportedErrors records, optionally applying a filter.
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
   * Finds a single ReportedErrors record by its ID.
   * @param {string} id - The unique identifier of the record.
   * @returns {Promise<ReadReportedErrorsDto>} The found record.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find ReportedErrors by id" })
  @ApiOkResponse({
    description: "The found record",
    type: ReadReportedErrorsDto,
  })
  @Header("Accept", "application/json")
  async findOne(@Param("id") id: string): Promise<ReadReportedErrorsDto> {
    try {
      return await this.currentService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing ReportedErrors record by its ID.
   * @param {string} id - The unique identifier of the record to update.
   * @param {UpdateReportedErrorsDto} updateDto - The data transfer object with the updated fields.
   * @returns {Promise<ReadReportedErrorsDto>} The updated record.
   */
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadReportedErrorsDto })
  @ApiOperation({ summary: "Update ReportedErrors by id" })
  @ApiBody({ type: UpdateReportedErrorsDto })
  @Header("Content-Type", "application/json")
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateReportedErrorsDto,
  ): Promise<ReadReportedErrorsDto> {
    try {
      return await this.currentService.update(id, updateDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a ReportedErrors record by its ID.
   * @param {string} id - The unique identifier of the record to delete.
   * @returns {Promise<ReadReportedErrorsDto>} The deleted record.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadReportedErrorsDto })
  @ApiOperation({ summary: "Delete ReportedErrors by id" })
  async remove(@Param("id") id: string): Promise<ReadReportedErrorsDto> {
    try {
      return await this.currentService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
