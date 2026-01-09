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
import { UsersService } from "./users.service";
import { CreateUsersDto } from "./dto/create-users.dto";
import { UpdateUsersDto } from "./dto/update-users.dto";
import { ReadUsersDto } from "./dto/read-users.dto";
import { RolesGuard } from "../common/guards/roles.guard";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { BaseController } from "../base/base.controller";
import { PageResult } from "../common/utils/repo_helpers";
import DataObject from "src/model/data_object";
import { Users } from "./entities/users.entity";

@Controller({ path: "users", version: "1" })
@ApiTags("Users")
@ApiBearerAuth("Bearer") // if you use Authorization: Bearer <jwt
@ApiExtraModels(ReadUsersDto, CreateUsersDto, UpdateUsersDto)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController extends BaseController {
  /**
   * Initializes the controller and injects the required service.
   * @param {UsersService} currentService - The service associated with this controller.
   */
  constructor(private readonly currentService: UsersService) {
    super();
  }

  /**
   * Retrieves statistical data for the Users records.
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
   * Creates a new Users record.
   * @param {CreateUsersDto} createDto - The data transfer object for creating the record.
   * @returns {Promise<ReadUsersDto>} The newly created record.
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadUsersDto })
  @ApiOperation({ summary: "Create Users" })
  @ApiBody({ type: CreateUsersDto })
  @Header("Content-Type", "application/json")
  async create(
    @Body() createDto: CreateUsersDto | CreateUsersDto[],
  ): Promise<ReadUsersDto | ReadUsersDto[]> {
    try {
      return await this.currentService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a paginated list of Users records based on a filter.
   * @param {string} queryBy - A stringified JSON object for filtering, sorting, and pagination.
   * @returns {Promise<PageResult<ReadUsersDto>>} A paginated result object.
   */
  @Get("/page")
  @ApiOperation({ summary: "Find Users with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: Object as () => PageResult<ReadUsersDto>,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Header("Accept", "application/json")
  async page(
    @Query("filter") queryBy: string,
  ): Promise<PageResult<ReadUsersDto>> {
    try {
      return await this.currentService.page(queryBy);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Searches for Users records that match the given filter criteria.
   * @param {string} queryBy - A stringified JSON object for filtering.
   * @returns {Promise<ReadUsersDto[]>} An array of matching records.
   */
  @Get("/search")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find Users with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadUsersDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async search(@Query("filter") queryBy: string): Promise<ReadUsersDto[]> {
    try {
      return await this.currentService.searchBy(queryBy);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all Users records.
   * @returns {Promise<ReadUsersDto[]>} An array of all records.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find all Userss" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadUsersDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async findAll(): Promise<ReadUsersDto[]> {
    try {
      return await this.currentService.findAll();
    } catch (error) {
      throw error;
    }
  }
  /**
   * Retrieves all Users records by a specific key-value pair.
   * @returns {Promise<ReadUsersDto[]>} An array of all records.
   */
  @Get("/all-by")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find all Userss by key-value pair" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadUsersDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async findAllBy(
    @Query("key") key: keyof Users,
    @Query("value") value: string,
  ): Promise<ReadUsersDto[]> {
    try {
      return await this.currentService.findAllBy(key, value);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Counts the total number of Users records, optionally applying a filter.
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
   * Finds a single Users record by its ID.
   * @param {string} id - The unique identifier of the record.
   * @returns {Promise<ReadUsersDto>} The found record.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find Users by id" })
  @ApiOkResponse({ description: "The found record", type: ReadUsersDto })
  @Header("Accept", "application/json")
  async findOne(@Param("id") id: string): Promise<ReadUsersDto> {
    try {
      return await this.currentService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing Users record by its ID.
   * @param {string} id - The unique identifier of the record to update.
   * @param {UpdateUsersDto} updateDto - The data transfer object with the updated fields.
   * @returns {Promise<ReadUsersDto>} The updated record.
   */
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadUsersDto })
  @ApiOperation({ summary: "Update Users by id" })
  @ApiBody({ type: UpdateUsersDto })
  @Header("Content-Type", "application/json")
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateUsersDto,
  ): Promise<ReadUsersDto> {
    try {
      return await this.currentService.update(id, updateDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a Users record by its ID.
   * @param {string} id - The unique identifier of the record to delete.
   * @returns {Promise<ReadUsersDto>} The deleted record.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadUsersDto })
  @ApiOperation({ summary: "Delete Users by id" })
  async remove(@Param("id") id: string): Promise<ReadUsersDto> {
    try {
      return await this.currentService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
