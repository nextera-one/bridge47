import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { CreateNotificationEmailsDto } from './dto/create-notification_emails.dto';
import { UpdateNotificationEmailsDto } from './dto/update-notification_emails.dto';
import { ReadNotificationEmailsDto } from './dto/read-notification_emails.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { NotificationEmailsService } from './notification_emails.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { PageResult } from '../common/utils/repo_helpers';
import { BaseController } from '../base/base.controller';

@ApiTags('NotificationEmails')
@ApiBearerAuth('Bearer')
@Controller({ path: 'notification-emails', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationEmailsController extends BaseController {
  constructor(private readonly currentService: NotificationEmailsService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: ReadNotificationEmailsDto })
  @ApiOperation({ summary: 'Create NotificationEmails' })
  @ApiBody({ type: CreateNotificationEmailsDto })
  @Header('Content-Type', 'application/json')
  async create(
    @Body() createDto: CreateNotificationEmailsDto,
  ): Promise<ReadNotificationEmailsDto> {
    try {
      return await this.currentService.create(createDto);
    } catch (error) {
      throw error;
    }
  }

  @Get('/page')
  @ApiOperation({ summary: 'Find NotificationEmails with filters' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: Object as () => PageResult<ReadNotificationEmailsDto>,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Header('Accept', 'application/json')
  async page(
    @Query('filter') queryBy: string,
  ): Promise<PageResult<ReadNotificationEmailsDto>> {
    try {
      return await this.currentService.page(queryBy);
    } catch (error) {
      throw error;
    }
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find NotificationEmails with filters' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: ReadNotificationEmailsDto,
    isArray: true,
  })
  @Header('Accept', 'application/json')
  async search(
    @Query('filter') queryBy: string,
  ): Promise<ReadNotificationEmailsDto[]> {
    try {
      return await this.currentService.searchBy(queryBy);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find all NotificationEmailss' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: ReadNotificationEmailsDto,
    isArray: true,
  })
  @Header('Accept', 'application/json')
  async findAll(): Promise<ReadNotificationEmailsDto[]> {
    try {
      return await this.currentService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find NotificationEmails by id' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ReadNotificationEmailsDto,
  })
  @Header('Accept', 'application/json')
  async findOne(@Param('id') id: string): Promise<ReadNotificationEmailsDto> {
    try {
      return await this.currentService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: ReadNotificationEmailsDto })
  @ApiOperation({ summary: 'Update NotificationEmails by id' })
  @ApiBody({ type: UpdateNotificationEmailsDto })
  @Header('Content-Type', 'application/json')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateNotificationEmailsDto,
  ): Promise<ReadNotificationEmailsDto> {
    try {
      return await this.currentService.update(id, updateDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: ReadNotificationEmailsDto })
  @ApiOperation({ summary: 'Delete NotificationEmails by id' })
  async remove(@Param('id') id: string): Promise<ReadNotificationEmailsDto> {
    try {
      return await this.currentService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
