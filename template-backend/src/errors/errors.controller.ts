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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BaseController } from '../base/base.controller';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PageResult } from '../common/utils/repo_helpers';
import { CreateErrorsDto } from './dto/create-errors.dto';
import { ReadErrorsDto } from './dto/read-errors.dto';
import { UpdateErrorsDto } from './dto/update-errors.dto';
import { ErrorsService } from './errors.service';

@Controller({ path: 'errors', version: '1' })
@ApiTags('Errors')
@ApiBearerAuth('Bearer') // if you use Authorization: Bearer <jwt
@ApiExtraModels(ReadErrorsDto, CreateErrorsDto, UpdateErrorsDto)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ErrorsController extends BaseController {
  constructor(private readonly currentService: ErrorsService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadErrorsDto })
  @ApiOperation({ summary: 'Create Errors' })
  @ApiBody({ type: CreateErrorsDto })
  @Header('Content-Type', 'application/json')
  async create(@Body() createDto: CreateErrorsDto): Promise<ReadErrorsDto> {
    try {
      return await this.currentService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  @Get('/page')
  @ApiOperation({ summary: 'Find Errors with filters' })
  @ApiOkResponse({
    description: 'The found records',
    type: Object as () => PageResult<ReadErrorsDto>,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Header('Accept', 'application/json')
  async page(
    @Query('filter') queryBy: string,
  ): Promise<PageResult<ReadErrorsDto>> {
    try {
      return await this.currentService.page(queryBy);
    } catch (error) {
      throw error;
    }
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find Errors with filters' })
  @ApiOkResponse({
    description: 'The found records',
    type: ReadErrorsDto,
    isArray: true,
  })
  @Header('Accept', 'application/json')
  async search(@Query('filter') queryBy: string): Promise<ReadErrorsDto[]> {
    try {
      return await this.currentService.searchBy(queryBy);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find all Errorss' })
  @ApiOkResponse({
    description: 'The found records',
    type: ReadErrorsDto,
    isArray: true,
  })
  @Header('Accept', 'application/json')
  async findAll(): Promise<ReadErrorsDto[]> {
    try {
      return await this.currentService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find Errors by id' })
  @ApiOkResponse({ description: 'The found record', type: ReadErrorsDto })
  @Header('Accept', 'application/json')
  async findOne(@Param('id') id: string): Promise<ReadErrorsDto> {
    try {
      return await this.currentService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadErrorsDto })
  @ApiOperation({ summary: 'Update Errors by id' })
  @ApiBody({ type: UpdateErrorsDto })
  @Header('Content-Type', 'application/json')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateErrorsDto,
  ): Promise<ReadErrorsDto> {
    try {
      return await this.currentService.update(id, updateDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadErrorsDto })
  @ApiOperation({ summary: 'Delete Errors by id' })
  async remove(@Param('id') id: string): Promise<ReadErrorsDto> {
    try {
      return await this.currentService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
