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
import { CreateNotificationsDto } from './dto/create-notifications.dto';
import { ReadNotificationsDto } from './dto/read-notifications.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { NotificationsService } from './notifications.service';

@Controller({ path: 'notifications', version: '1' })
@ApiTags('Notifications')
@ApiBearerAuth('Bearer') // if you use Authorization: Bearer <jwt
@ApiExtraModels(
  ReadNotificationsDto,
  CreateNotificationsDto,
  UpdateNotificationsDto,
)
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController extends BaseController {
  constructor(private readonly currentService: NotificationsService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadNotificationsDto })
  @ApiOperation({ summary: 'Create Notifications' })
  @ApiBody({ type: CreateNotificationsDto })
  @Header('Content-Type', 'application/json')
  async create(
    @Body() createDto: CreateNotificationsDto,
  ): Promise<ReadNotificationsDto> {
    try {
      return await this.currentService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  @Get('/page')
  @ApiOperation({ summary: 'Find Notifications with filters' })
  @ApiOkResponse({
    description: 'The found records',
    type: Object as () => PageResult<ReadNotificationsDto>,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Header('Accept', 'application/json')
  async page(
    @Query('filter') queryBy: string,
  ): Promise<PageResult<ReadNotificationsDto>> {
    try {
      return await this.currentService.page(queryBy);
    } catch (error) {
      throw error;
    }
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find Notifications with filters' })
  @ApiOkResponse({
    description: 'The found records',
    type: ReadNotificationsDto,
    isArray: true,
  })
  @Header('Accept', 'application/json')
  async search(
    @Query('filter') queryBy: string,
  ): Promise<ReadNotificationsDto[]> {
    try {
      return await this.currentService.searchBy(queryBy);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find all Notificationss' })
  @ApiOkResponse({
    description: 'The found records',
    type: ReadNotificationsDto,
    isArray: true,
  })
  @Header('Accept', 'application/json')
  async findAll(): Promise<ReadNotificationsDto[]> {
    try {
      return await this.currentService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find Notifications by id' })
  @ApiOkResponse({
    description: 'The found record',
    type: ReadNotificationsDto,
  })
  @Header('Accept', 'application/json')
  async findOne(@Param('id') id: string): Promise<ReadNotificationsDto> {
    try {
      return await this.currentService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadNotificationsDto })
  @ApiOperation({ summary: 'Update Notifications by id' })
  @ApiBody({ type: UpdateNotificationsDto })
  @Header('Content-Type', 'application/json')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateNotificationsDto,
  ): Promise<ReadNotificationsDto> {
    try {
      return await this.currentService.update(id, updateDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadNotificationsDto })
  @ApiOperation({ summary: 'Delete Notifications by id' })
  async remove(@Param('id') id: string): Promise<ReadNotificationsDto> {
    try {
      return await this.currentService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
