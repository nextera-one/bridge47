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
import { FilesService } from "./files.service";
import { CreateFilesDto } from "./dto/create-files.dto";
import { UpdateFilesDto } from "./dto/update-files.dto";
import { ReadFilesDto } from "./dto/read-files.dto";
import { RolesGuard } from "../common/guards/roles.guard";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { BaseController } from "../base/base.controller";
import { PageResult } from "../common/utils/repo_helpers";
import DataObject from "src/model/data_object";
import { Files } from "./entities/files.entity";

@Controller({ path: "files", version: "1" })
@ApiTags("Files")
@ApiBearerAuth("Bearer") // if you use Authorization: Bearer <jwt
@ApiExtraModels(ReadFilesDto, CreateFilesDto, UpdateFilesDto)
@UseGuards(JwtAuthGuard, RolesGuard)
export class FilesController extends BaseController {
  /**
   * Initializes the controller and injects the required service.
   * @param {FilesService} currentService - The service associated with this controller.
   */
  constructor(private readonly currentService: FilesService) {
    super();
  }

  /**
   * Retrieves statistical data for the Files records.
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
   * Creates a new Files record.
   * @param {CreateFilesDto} createDto - The data transfer object for creating the record.
   * @returns {Promise<ReadFilesDto>} The newly created record.
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadFilesDto })
  @ApiOperation({ summary: "Create Files" })
  @ApiBody({ type: CreateFilesDto })
  @Header("Content-Type", "application/json")
  async create(
    @Body() createDto: CreateFilesDto | CreateFilesDto[],
  ): Promise<ReadFilesDto | ReadFilesDto[]> {
    try {
      return await this.currentService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a paginated list of Files records based on a filter.
   * @param {string} queryBy - A stringified JSON object for filtering, sorting, and pagination.
   * @returns {Promise<PageResult<ReadFilesDto>>} A paginated result object.
   */
  @Get("/page")
  @ApiOperation({ summary: "Find Files with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: Object as () => PageResult<ReadFilesDto>,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Header("Accept", "application/json")
  async page(
    @Query("filter") queryBy: string,
  ): Promise<PageResult<ReadFilesDto>> {
    try {
      return await this.currentService.page(queryBy);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Searches for Files records that match the given filter criteria.
   * @param {string} queryBy - A stringified JSON object for filtering.
   * @returns {Promise<ReadFilesDto[]>} An array of matching records.
   */
  @Get("/search")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find Files with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadFilesDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async search(@Query("filter") queryBy: string): Promise<ReadFilesDto[]> {
    try {
      return await this.currentService.searchBy(queryBy);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all Files records.
   * @returns {Promise<ReadFilesDto[]>} An array of all records.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find all Filess" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadFilesDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async findAll(): Promise<ReadFilesDto[]> {
    try {
      return await this.currentService.findAll();
    } catch (error) {
      throw error;
    }
  }
  /**
   * Retrieves all Files records by a specific key-value pair.
   * @returns {Promise<ReadFilesDto[]>} An array of all records.
   */
  @Get("/all-by")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find all Filess by key-value pair" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadFilesDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async findAllBy(
    @Query("key") key: keyof Files,
    @Query("value") value: string,
  ): Promise<ReadFilesDto[]> {
    try {
      return await this.currentService.findAllBy(key, value);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Counts the total number of Files records, optionally applying a filter.
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
   * Finds a single Files record by its ID.
   * @param {string} id - The unique identifier of the record.
   * @returns {Promise<ReadFilesDto>} The found record.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find Files by id" })
  @ApiOkResponse({ description: "The found record", type: ReadFilesDto })
  @Header("Accept", "application/json")
  async findOne(@Param("id") id: string): Promise<ReadFilesDto> {
    try {
      return await this.currentService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing Files record by its ID.
   * @param {string} id - The unique identifier of the record to update.
   * @param {UpdateFilesDto} updateDto - The data transfer object with the updated fields.
   * @returns {Promise<ReadFilesDto>} The updated record.
   */
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadFilesDto })
  @ApiOperation({ summary: "Update Files by id" })
  @ApiBody({ type: UpdateFilesDto })
  @Header("Content-Type", "application/json")
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateFilesDto,
  ): Promise<ReadFilesDto> {
    try {
      return await this.currentService.update(id, updateDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a Files record by its ID.
   * @param {string} id - The unique identifier of the record to delete.
   * @returns {Promise<ReadFilesDto>} The deleted record.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadFilesDto })
  @ApiOperation({ summary: "Delete Files by id" })
  async remove(@Param("id") id: string): Promise<ReadFilesDto> {
    try {
      return await this.currentService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
