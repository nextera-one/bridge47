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
import { UserRolesService } from "./user_roles.service";
import { CreateUserRolesDto } from "./dto/create-user_roles.dto";
import { UpdateUserRolesDto } from "./dto/update-user_roles.dto";
import { ReadUserRolesDto } from "./dto/read-user_roles.dto";
import { RolesGuard } from "../common/guards/roles.guard";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { BaseController } from "../base/base.controller";
import { PageResult } from "../common/utils/repo_helpers";
import DataObject from "src/model/data_object";
import { UserRoles } from "./entities/user_roles.entity";

@Controller({ path: "user-roles", version: "1" })
@ApiTags("UserRoles")
@ApiBearerAuth("Bearer") // if you use Authorization: Bearer <jwt
@ApiExtraModels(ReadUserRolesDto, CreateUserRolesDto, UpdateUserRolesDto)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserRolesController extends BaseController {
  /**
   * Initializes the controller and injects the required service.
   * @param {UserRolesService} currentService - The service associated with this controller.
   */
  constructor(private readonly currentService: UserRolesService) {
    super();
  }

  /**
   * Retrieves statistical data for the UserRoles records.
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
   * Creates a new UserRoles record.
   * @param {CreateUserRolesDto} createDto - The data transfer object for creating the record.
   * @returns {Promise<ReadUserRolesDto>} The newly created record.
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadUserRolesDto })
  @ApiOperation({ summary: "Create UserRoles" })
  @ApiBody({ type: CreateUserRolesDto })
  @Header("Content-Type", "application/json")
  async create(
    @Body() createDto: CreateUserRolesDto | CreateUserRolesDto[],
  ): Promise<ReadUserRolesDto | ReadUserRolesDto[]> {
    try {
      return await this.currentService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a paginated list of UserRoles records based on a filter.
   * @param {string} queryBy - A stringified JSON object for filtering, sorting, and pagination.
   * @returns {Promise<PageResult<ReadUserRolesDto>>} A paginated result object.
   */
  @Get("/page")
  @ApiOperation({ summary: "Find UserRoles with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: Object as () => PageResult<ReadUserRolesDto>,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Header("Accept", "application/json")
  async page(
    @Query("filter") queryBy: string,
  ): Promise<PageResult<ReadUserRolesDto>> {
    try {
      return await this.currentService.page(queryBy);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Searches for UserRoles records that match the given filter criteria.
   * @param {string} queryBy - A stringified JSON object for filtering.
   * @returns {Promise<ReadUserRolesDto[]>} An array of matching records.
   */
  @Get("/search")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find UserRoles with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadUserRolesDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async search(@Query("filter") queryBy: string): Promise<ReadUserRolesDto[]> {
    try {
      return await this.currentService.searchBy(queryBy);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all UserRoles records.
   * @returns {Promise<ReadUserRolesDto[]>} An array of all records.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find all UserRoless" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadUserRolesDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async findAll(): Promise<ReadUserRolesDto[]> {
    try {
      return await this.currentService.findAll();
    } catch (error) {
      throw error;
    }
  }
  /**
   * Retrieves all UserRoles records by a specific key-value pair.
   * @returns {Promise<ReadUserRolesDto[]>} An array of all records.
   */
  @Get("/all-by")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find all UserRoless by key-value pair" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadUserRolesDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async findAllBy(
    @Query("key") key: keyof UserRoles,
    @Query("value") value: string,
  ): Promise<ReadUserRolesDto[]> {
    try {
      return await this.currentService.findAllBy(key, value);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Counts the total number of UserRoles records, optionally applying a filter.
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
   * Finds a single UserRoles record by its ID.
   * @param {string} id - The unique identifier of the record.
   * @returns {Promise<ReadUserRolesDto>} The found record.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find UserRoles by id" })
  @ApiOkResponse({ description: "The found record", type: ReadUserRolesDto })
  @Header("Accept", "application/json")
  async findOne(@Param("id") id: string): Promise<ReadUserRolesDto> {
    try {
      return await this.currentService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing UserRoles record by its ID.
   * @param {string} id - The unique identifier of the record to update.
   * @param {UpdateUserRolesDto} updateDto - The data transfer object with the updated fields.
   * @returns {Promise<ReadUserRolesDto>} The updated record.
   */
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadUserRolesDto })
  @ApiOperation({ summary: "Update UserRoles by id" })
  @ApiBody({ type: UpdateUserRolesDto })
  @Header("Content-Type", "application/json")
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateUserRolesDto,
  ): Promise<ReadUserRolesDto> {
    try {
      return await this.currentService.update(id, updateDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a UserRoles record by its ID.
   * @param {string} id - The unique identifier of the record to delete.
   * @returns {Promise<ReadUserRolesDto>} The deleted record.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadUserRolesDto })
  @ApiOperation({ summary: "Delete UserRoles by id" })
  async remove(@Param("id") id: string): Promise<ReadUserRolesDto> {
    try {
      return await this.currentService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
