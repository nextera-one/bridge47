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
import { CreateErrorTranslationsDto } from "./dto/create-error_translations.dto";
import { ReadErrorTranslationsDto } from "./dto/read-error_translations.dto";
import { UpdateErrorTranslationsDto } from "./dto/update-error_translations.dto";
import { ErrorTranslationsService } from "./error_translations.service";

@Controller({ path: "error-translations", version: "1" })
@ApiTags("ErrorTranslations")
@ApiBearerAuth("Bearer") // if you use Authorization: Bearer <jwt
@ApiExtraModels(
  ReadErrorTranslationsDto,
  CreateErrorTranslationsDto,
  UpdateErrorTranslationsDto,
)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ErrorTranslationsController extends BaseController {
  constructor(private readonly currentService: ErrorTranslationsService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadErrorTranslationsDto })
  @ApiOperation({ summary: "Create ErrorTranslations" })
  @ApiBody({ type: CreateErrorTranslationsDto })
  @Header("Content-Type", "application/json")
  async create(
    @Body() createDto: CreateErrorTranslationsDto,
  ): Promise<ReadErrorTranslationsDto> {
    try {
      return await this.currentService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  @Get("/page")
  @ApiOperation({ summary: "Find ErrorTranslations with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: Object as () => PageResult<ReadErrorTranslationsDto>,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Header("Accept", "application/json")
  async page(
    @Query("filter") queryBy: string,
  ): Promise<PageResult<ReadErrorTranslationsDto>> {
    try {
      return await this.currentService.page(queryBy);
    } catch (error) {
      throw error;
    }
  }

  @Get("/search")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find ErrorTranslations with filters" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadErrorTranslationsDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async search(
    @Query("filter") queryBy: string,
  ): Promise<ReadErrorTranslationsDto[]> {
    try {
      return await this.currentService.searchBy(queryBy);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find all ErrorTranslationss" })
  @ApiOkResponse({
    description: "The found records",
    type: ReadErrorTranslationsDto,
    isArray: true,
  })
  @Header("Accept", "application/json")
  async findAll(): Promise<ReadErrorTranslationsDto[]> {
    try {
      return await this.currentService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Find ErrorTranslations by id" })
  @ApiOkResponse({
    description: "The found record",
    type: ReadErrorTranslationsDto,
  })
  @Header("Accept", "application/json")
  async findOne(@Param("id") id: string): Promise<ReadErrorTranslationsDto> {
    try {
      return await this.currentService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadErrorTranslationsDto })
  @ApiOperation({ summary: "Update ErrorTranslations by id" })
  @ApiBody({ type: UpdateErrorTranslationsDto })
  @Header("Content-Type", "application/json")
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateErrorTranslationsDto,
  ): Promise<ReadErrorTranslationsDto> {
    try {
      return await this.currentService.update(id, updateDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadErrorTranslationsDto })
  @ApiOperation({ summary: "Delete ErrorTranslations by id" })
  async remove(@Param("id") id: string): Promise<ReadErrorTranslationsDto> {
    try {
      return await this.currentService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
