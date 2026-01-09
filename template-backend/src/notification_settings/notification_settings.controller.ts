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
import { CreateNotificationSettingsDto } from './dto/create-notification_settings.dto';
import { ReadNotificationSettingsDto } from './dto/read-notification_settings.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification_settings.dto';
import { NotificationSettingsService } from './notification_settings.service';

@Controller({ path: 'notification-settings', version: '1' })
@ApiTags('NotificationSettings')
@ApiBearerAuth('Bearer') // if you use Authorization: Bearer <jwt
@ApiExtraModels(
  ReadNotificationSettingsDto,
  CreateNotificationSettingsDto,
  UpdateNotificationSettingsDto,
)
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationSettingsController extends BaseController {
  constructor(private readonly currentService: NotificationSettingsService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadNotificationSettingsDto })
  @ApiOperation({ summary: 'Create NotificationSettings' })
  @ApiBody({ type: CreateNotificationSettingsDto })
  @Header('Content-Type', 'application/json')
  async create(
    @Body() createDto: CreateNotificationSettingsDto,
  ): Promise<ReadNotificationSettingsDto> {
    try {
      return await this.currentService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  @Get('/page')
  @ApiOperation({ summary: 'Find NotificationSettings with filters' })
  @ApiOkResponse({
    description: 'The found records',
    type: Object as () => PageResult<ReadNotificationSettingsDto>,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Header('Accept', 'application/json')
  async page(
    @Query('filter') queryBy: string,
  ): Promise<PageResult<ReadNotificationSettingsDto>> {
    try {
      return await this.currentService.page(queryBy);
    } catch (error) {
      throw error;
    }
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find NotificationSettings with filters' })
  @ApiOkResponse({
    description: 'The found records',
    type: ReadNotificationSettingsDto,
    isArray: true,
  })
  @Header('Accept', 'application/json')
  async search(
    @Query('filter') queryBy: string,
  ): Promise<ReadNotificationSettingsDto[]> {
    try {
      return await this.currentService.searchBy(queryBy);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find all NotificationSettingss' })
  @ApiOkResponse({
    description: 'The found records',
    type: ReadNotificationSettingsDto,
    isArray: true,
  })
  @Header('Accept', 'application/json')
  async findAll(): Promise<ReadNotificationSettingsDto[]> {
    try {
      return await this.currentService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find NotificationSettings by id' })
  @ApiOkResponse({
    description: 'The found record',
    type: ReadNotificationSettingsDto,
  })
  @Header('Accept', 'application/json')
  async findOne(@Param('id') id: string): Promise<ReadNotificationSettingsDto> {
    try {
      return await this.currentService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadNotificationSettingsDto })
  @ApiOperation({ summary: 'Update NotificationSettings by id' })
  @ApiBody({ type: UpdateNotificationSettingsDto })
  @Header('Content-Type', 'application/json')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateNotificationSettingsDto,
  ): Promise<ReadNotificationSettingsDto> {
    try {
      return await this.currentService.update(id, updateDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReadNotificationSettingsDto })
  @ApiOperation({ summary: 'Delete NotificationSettings by id' })
  async remove(@Param('id') id: string): Promise<ReadNotificationSettingsDto> {
    try {
      return await this.currentService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
