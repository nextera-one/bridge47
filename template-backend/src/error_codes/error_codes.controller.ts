import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { BaseController } from "../base/base.controller";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { PageResult } from "../common/utils/repo_helpers";
import { CreateErrorCodesDto } from "./dto/create-error_codes.dto";
import { ReadErrorCodesDto } from "./dto/read-error_codes.dto";
import { UpdateErrorCodesDto } from "./dto/update-error_codes.dto";
import { ErrorCodesService } from "./error_codes.service";

@Controller({ path: "error-codes", version: "1" })
@ApiTags("ErrorCodes")
@ApiBearerAuth("Bearer") // if you use Authorization: Bearer <jwt
@ApiExtraModels(ReadErrorCodesDto, CreateErrorCodesDto, UpdateErrorCodesDto)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ErrorCodesController extends BaseController {
  constructor(private readonly currentService: ErrorCodesService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadErrorCodesDto })
  @ApiOperation({ summary: "Create ErrorCodes" })
  @ApiBody({ type: CreateErrorCodesDto })
  @Header("Content-Type", "application/json")
  async create(
    @Body() createDto: CreateErrorCodesDto,
  ): Promise<ReadErrorCodesDto> {
    try {
      return await this.currentService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  @Get("/page")
  @ApiOperation({ summary: "Find ErrorCodes with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: Object as () => PageResult<ReadErrorCodesDto>,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Header("Accept", "application/json")
  async page(
    @Query("filter") queryBy: string,
  ): Promise<PageResult<ReadErrorCodesDto>> {
    try {
      return await this.currentService.page(queryBy);
    } catch (error) {
      throw error;
    }
  }

  @Get("/search")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find ErrorCodes with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadErrorCodesDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async search(@Query("filter") queryBy: string): Promise<ReadErrorCodesDto[]> {
    try {
      return await this.currentService.searchBy(queryBy);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find all ErrorCodess" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadErrorCodesDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async findAll(): Promise<ReadErrorCodesDto[]> {
    try {
      return await this.currentService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find ErrorCodes by id" })
  @ApiOkResponse({ description: "The found record", type: ReadErrorCodesDto })
  @Header("Accept", "application/json")
  async findOne(@Param("id") id: string): Promise<ReadErrorCodesDto> {
    try {
      return await this.currentService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadErrorCodesDto })
  @ApiOperation({ summary: "Update ErrorCodes by id" })
  @ApiBody({ type: UpdateErrorCodesDto })
  @Header("Content-Type", "application/json")
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateErrorCodesDto,
  ): Promise<ReadErrorCodesDto> {
    try {
      return await this.currentService.update(id, updateDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadErrorCodesDto })
  @ApiOperation({ summary: "Delete ErrorCodes by id" })
  async remove(@Param("id") id: string): Promise<ReadErrorCodesDto> {
    try {
      return await this.currentService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
