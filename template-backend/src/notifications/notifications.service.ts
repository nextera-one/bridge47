import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// src/notifications/notifications.service.ts
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';

import { BaseService } from '../base/base.service';
import DtoUtil from '../common/utils/dto.util';
import Filter from '../common/utils/filter';
import { PageResult, RepoHelpers } from '../common/utils/repo_helpers';
import StringUtil from '../common/utils/string.util';
import { JSONValue } from '../model/data_object';
import { CreateNotificationsDto } from './dto/create-notifications.dto';
import { ReadNotificationsDto } from './dto/read-notifications.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { Notifications } from './entities/notifications.entity';

@Injectable()
export class NotificationsService extends BaseService<Notifications> {
  private readonly connectedUsers = new Map<string, Socket>();

  constructor(
    @InjectRepository(Notifications)
    private readonly currentRepository: Repository<Notifications>,
  ) {
    super(currentRepository);
  }

  async create(
    createDto: CreateNotificationsDto,
  ): Promise<ReadNotificationsDto> {
    const result = await RepoHelpers.create(Notifications, this, createDto);
    return DtoUtil.convertToDto(ReadNotificationsDto, result);
  }

  async findAll(): Promise<ReadNotificationsDto[]> {
    const results = await RepoHelpers.findAll<Notifications>(this);
    return DtoUtil.convertToDto(ReadNotificationsDto, results);
  }

  async findOne(id: string): Promise<ReadNotificationsDto> {
    const result = await RepoHelpers.findOne(this, id);
    return DtoUtil.convertToDto(ReadNotificationsDto, result);
  }

  async findOneBy(
    key: string,
    value: JSONValue,
  ): Promise<ReadNotificationsDto> {
    const result = await RepoHelpers.findOneBy(this, { [key]: value });
    return DtoUtil.convertToDto(ReadNotificationsDto, result);
  }

  async update(
    id: string,
    updateDto: UpdateNotificationsDto,
  ): Promise<ReadNotificationsDto> {
    const result = await RepoHelpers.update(Notifications, this, id, updateDto);
    return DtoUtil.convertToDto(ReadNotificationsDto, result);
  }

  async remove(id: string): Promise<ReadNotificationsDto> {
    const result = await RepoHelpers.remove(this, id);
    return DtoUtil.convertToDto(ReadNotificationsDto, result);
  }

  async page(
    queryBy: string | Filter,
  ): Promise<PageResult<ReadNotificationsDto>> {
    const filter: Filter =
      typeof queryBy === 'string' ? StringUtil.base64ToObj(queryBy) : queryBy;
    const result = await RepoHelpers.page<Notifications>(this, filter);
    const dtos = DtoUtil.convertToDto(ReadNotificationsDto, result.data);
    return {
      data: dtos,
      count: result.count,
    } as PageResult<ReadNotificationsDto>;
  }

  async searchBy(queryBy: string | Filter): Promise<ReadNotificationsDto[]> {
    const filter: Filter =
      typeof queryBy === 'string' ? StringUtil.base64ToObj(queryBy) : queryBy;
    const query = RepoHelpers.queryBuilder(this, filter);
    const data = await query.getRawMany();
    return DtoUtil.convertToDto(ReadNotificationsDto, data);
  }

  async count(r?: boolean, field?: string): Promise<number> {
    return RepoHelpers.count(this, r);
  }

  registerClient(userId: string, client: Socket): void {
    this.connectedUsers.set(userId, client);
    console.log(`Client connected: ${userId}`);
    this.sendNotificationToUser(userId, {
      event: 'welcome',
      data: { message: 'Welcome!' },
    });
  }

  removeClient(userId: string): void {
    this.connectedUsers.delete(userId);
    console.log(`Client disconnected: ${userId}`);
  }

  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  sendNotificationToUser(
    userId: string,
    payload: { event: string; data: any },
  ): boolean {
    const client = this.connectedUsers.get(userId);
    if (client) {
      client.emit(payload.event, payload.data);
      return true;
    }
    return false;
  }
}
