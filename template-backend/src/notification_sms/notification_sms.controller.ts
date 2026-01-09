import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { CreateNotificationSmsDto } from './dto/create-notification_sms.dto';
import { UpdateNotificationSmsDto } from './dto/update-notification_sms.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ReadNotificationSmsDto } from './dto/read-notification_sms.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { PageResult } from '../common/utils/repo_helpers';
import { NotificationSmsService } from './notification_sms.service';
import { BaseController } from '../base/base.controller';

@ApiTags('NotificationSms')
@ApiBearerAuth('Bearer')
@Controller({ path: 'notification-sms', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationSmsController extends BaseController {
  constructor(private readonly currentService: NotificationSmsService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: ReadNotificationSmsDto })
  @ApiOperation({ summary: 'Create NotificationSms' })
  @ApiBody({ type: CreateNotificationSmsDto })
  @Header('Content-Type', 'application/json')
  async create(
    @Body() createDto: CreateNotificationSmsDto,
  ): Promise<ReadNotificationSmsDto> {
    try {
      return await this.currentService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  @Get('/page')
  @ApiOperation({ summary: 'Find NotificationSms with filters' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: Object as () => PageResult<ReadNotificationSmsDto>,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Header('Accept', 'application/json')
  async page(
    @Query('filter') queryBy: string,
  ): Promise<PageResult<ReadNotificationSmsDto>> {
    try {
      return await this.currentService.page(queryBy);
    } catch (error) {
      throw error;
    }
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find NotificationSms with filters' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: ReadNotificationSmsDto,
    isArray: true,
  })
  @Header('Accept', 'application/json')
  async search(
    @Query('filter') queryBy: string,
  ): Promise<ReadNotificationSmsDto[]> {
    try {
      return await this.currentService.searchBy(queryBy);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find all NotificationSmss' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: ReadNotificationSmsDto,
    isArray: true,
  })
  @Header('Accept', 'application/json')
  async findAll(): Promise<ReadNotificationSmsDto[]> {
    try {
      return await this.currentService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find NotificationSms by id' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ReadNotificationSmsDto,
  })
  @Header('Accept', 'application/json')
  async findOne(@Param('id') id: string): Promise<ReadNotificationSmsDto> {
    try {
      return await this.currentService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: ReadNotificationSmsDto })
  @ApiOperation({ summary: 'Update NotificationSms by id' })
  @ApiBody({ type: UpdateNotificationSmsDto })
  @Header('Content-Type', 'application/json')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateNotificationSmsDto,
  ): Promise<ReadNotificationSmsDto> {
    try {
      return await this.currentService.update(id, updateDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: ReadNotificationSmsDto })
  @ApiOperation({ summary: 'Delete NotificationSms by id' })
  async remove(@Param('id') id: string): Promise<ReadNotificationSmsDto> {
    try {
      return await this.currentService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
