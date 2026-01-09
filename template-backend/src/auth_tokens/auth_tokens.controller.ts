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
import { AuthTokensService } from "./auth_tokens.service";
import { CreateAuthTokensDto } from "./dto/create-auth_tokens.dto";
import { UpdateAuthTokensDto } from "./dto/update-auth_tokens.dto";
import { ReadAuthTokensDto } from "./dto/read-auth_tokens.dto";
import { RolesGuard } from "../common/guards/roles.guard";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { BaseController } from "../base/base.controller";
import { PageResult } from "../common/utils/repo_helpers";
import DataObject from "src/model/data_object";
import { AuthTokens } from "./entities/auth_tokens.entity";

@Controller({ path: "auth-tokens", version: "1" })
@ApiTags("AuthTokens")
@ApiBearerAuth("Bearer") // if you use Authorization: Bearer <jwt
@ApiExtraModels(ReadAuthTokensDto, CreateAuthTokensDto, UpdateAuthTokensDto)
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthTokensController extends BaseController {
  /**
   * Initializes the controller and injects the required service.
   * @param {AuthTokensService} currentService - The service associated with this controller.
   */
  constructor(private readonly currentService: AuthTokensService) {
    super();
  }

  /**
   * Retrieves statistical data for the AuthTokens records.
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
   * Creates a new AuthTokens record.
   * @param {CreateAuthTokensDto} createDto - The data transfer object for creating the record.
   * @returns {Promise<ReadAuthTokensDto>} The newly created record.
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadAuthTokensDto })
  @ApiOperation({ summary: "Create AuthTokens" })
  @ApiBody({ type: CreateAuthTokensDto })
  @Header("Content-Type", "application/json")
  async create(
    @Body() createDto: CreateAuthTokensDto | CreateAuthTokensDto[],
  ): Promise<ReadAuthTokensDto | ReadAuthTokensDto[]> {
    try {
      return await this.currentService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a paginated list of AuthTokens records based on a filter.
   * @param {string} queryBy - A stringified JSON object for filtering, sorting, and pagination.
   * @returns {Promise<PageResult<ReadAuthTokensDto>>} A paginated result object.
   */
  @Get("/page")
  @ApiOperation({ summary: "Find AuthTokens with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: Object as () => PageResult<ReadAuthTokensDto>,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Header("Accept", "application/json")
  async page(
    @Query("filter") queryBy: string,
  ): Promise<PageResult<ReadAuthTokensDto>> {
    try {
      return await this.currentService.page(queryBy);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Searches for AuthTokens records that match the given filter criteria.
   * @param {string} queryBy - A stringified JSON object for filtering.
   * @returns {Promise<ReadAuthTokensDto[]>} An array of matching records.
   */
  @Get("/search")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find AuthTokens with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadAuthTokensDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async search(@Query("filter") queryBy: string): Promise<ReadAuthTokensDto[]> {
    try {
      return await this.currentService.searchBy(queryBy);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all AuthTokens records.
   * @returns {Promise<ReadAuthTokensDto[]>} An array of all records.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find all AuthTokenss" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadAuthTokensDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async findAll(): Promise<ReadAuthTokensDto[]> {
    try {
      return await this.currentService.findAll();
    } catch (error) {
      throw error;
    }
  }
  /**
   * Retrieves all AuthTokens records by a specific key-value pair.
   * @returns {Promise<ReadAuthTokensDto[]>} An array of all records.
   */
  @Get("/all-by")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find all AuthTokenss by key-value pair" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadAuthTokensDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async findAllBy(
    @Query("key") key: keyof AuthTokens,
    @Query("value") value: string,
  ): Promise<ReadAuthTokensDto[]> {
    try {
      return await this.currentService.findAllBy(key, value);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Counts the total number of AuthTokens records, optionally applying a filter.
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
   * Finds a single AuthTokens record by its ID.
   * @param {string} id - The unique identifier of the record.
   * @returns {Promise<ReadAuthTokensDto>} The found record.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find AuthTokens by id" })
  @ApiOkResponse({ description: "The found record", type: ReadAuthTokensDto })
  @Header("Accept", "application/json")
  async findOne(@Param("id") id: string): Promise<ReadAuthTokensDto> {
    try {
      return await this.currentService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing AuthTokens record by its ID.
   * @param {string} id - The unique identifier of the record to update.
   * @param {UpdateAuthTokensDto} updateDto - The data transfer object with the updated fields.
   * @returns {Promise<ReadAuthTokensDto>} The updated record.
   */
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadAuthTokensDto })
  @ApiOperation({ summary: "Update AuthTokens by id" })
  @ApiBody({ type: UpdateAuthTokensDto })
  @Header("Content-Type", "application/json")
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateAuthTokensDto,
  ): Promise<ReadAuthTokensDto> {
    try {
      return await this.currentService.update(id, updateDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a AuthTokens record by its ID.
   * @param {string} id - The unique identifier of the record to delete.
   * @returns {Promise<ReadAuthTokensDto>} The deleted record.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadAuthTokensDto })
  @ApiOperation({ summary: "Delete AuthTokens by id" })
  async remove(@Param("id") id: string): Promise<ReadAuthTokensDto> {
    try {
      return await this.currentService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
