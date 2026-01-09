import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import DtoUtil from '../common/utils/dto.util';
import Filter from '../common/utils/filter';
import { PageResult, RepoHelpers } from '../common/utils/repo_helpers';
import StringUtil from '../common/utils/string.util';
import { JSONValue } from '../model/data_object';
import { CreateNotificationSettingsDto } from './dto/create-notification_settings.dto';
import { ReadNotificationSettingsDto } from './dto/read-notification_settings.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification_settings.dto';
import { NotificationSettings } from './entities/notification_settings.entity';

@Injectable()
export class NotificationSettingsService extends BaseService<NotificationSettings> {
  constructor(
    @InjectRepository(NotificationSettings)
    private readonly currentRepository: Repository<NotificationSettings>,
  ) {
    super(currentRepository);
  }

  async create(
    createDto: CreateNotificationSettingsDto,
  ): Promise<ReadNotificationSettingsDto> {
    const result = await RepoHelpers.create(
      NotificationSettings,
      this,
      createDto,
    );
    return DtoUtil.convertToDto(ReadNotificationSettingsDto, result);
  }

  async findAll(): Promise<ReadNotificationSettingsDto[]> {
    const results = await RepoHelpers.findAll<NotificationSettings>(this);
    return DtoUtil.convertToDto(ReadNotificationSettingsDto, results);
  }

  async findOne(id: string): Promise<ReadNotificationSettingsDto> {
    const result = await RepoHelpers.findOne(this, id);
    return DtoUtil.convertToDto(ReadNotificationSettingsDto, result);
  }

  async findOneBy(
    key: keyof NotificationSettings,
    value: JSONValue,
  ): Promise<ReadNotificationSettingsDto> {
    const result = await RepoHelpers.findOneBy(this, { [key]: value });
    return DtoUtil.convertToDto(ReadNotificationSettingsDto, result);
  }

  async update(
    id: string,
    updateDto: UpdateNotificationSettingsDto,
  ): Promise<ReadNotificationSettingsDto> {
    const result = await RepoHelpers.update(
      NotificationSettings,
      this,
      id,
      updateDto,
    );
    return DtoUtil.convertToDto(ReadNotificationSettingsDto, result);
  }

  async remove(id: string): Promise<ReadNotificationSettingsDto> {
    const result = await RepoHelpers.remove(this, id);
    return DtoUtil.convertToDto(ReadNotificationSettingsDto, result);
  }

  async page(
    queryBy: string | Filter,
  ): Promise<PageResult<ReadNotificationSettingsDto>> {
    const filter: Filter =
      typeof queryBy === 'string' ? StringUtil.base64ToObj(queryBy) : queryBy;
    const result = await RepoHelpers.page<NotificationSettings>(this, filter);
    const dtos = DtoUtil.convertToDto(ReadNotificationSettingsDto, result.data);
    return {
      data: dtos,
      count: result.count,
    } as PageResult<ReadNotificationSettingsDto>;
  }

  async searchBy(
    queryBy: string | Filter,
  ): Promise<ReadNotificationSettingsDto[]> {
    const filter: Filter =
      typeof queryBy === 'string' ? StringUtil.base64ToObj(queryBy) : queryBy;
    const query = RepoHelpers.queryBuilder(this, filter);
    const data = await query.getRawMany();
    return DtoUtil.convertToDto(ReadNotificationSettingsDto, data);
  }

  async count(
    r?: boolean,
    field?: keyof NotificationSettings,
  ): Promise<number> {
    return RepoHelpers.count(this, r, field);
  }
}
