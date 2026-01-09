import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import DtoUtil from '../common/utils/dto.util';
import Filter from '../common/utils/filter';
import { PageResult, RepoHelpers } from '../common/utils/repo_helpers';
import StringUtil from '../common/utils/string.util';
import { JSONValue } from '../model/data_object';
import { CreateErrorCodesDto } from './dto/create-error_codes.dto';
import { ReadErrorCodesDto } from './dto/read-error_codes.dto';
import { UpdateErrorCodesDto } from './dto/update-error_codes.dto';
import { ErrorCodes } from './entities/error_codes.entity';

@Injectable()
export class ErrorCodesService extends BaseService<ErrorCodes> {
  constructor(
    @InjectRepository(ErrorCodes)
    private readonly currentRepository: Repository<ErrorCodes>,
  ) {
    super(currentRepository);
  }

  async create(createDto: CreateErrorCodesDto): Promise<ReadErrorCodesDto> {
    const result = await RepoHelpers.create(ErrorCodes, this, createDto);
    return DtoUtil.convertToDto(ReadErrorCodesDto, result);
  }

  async findAll(): Promise<ReadErrorCodesDto[]> {
    const results = await RepoHelpers.findAll<ErrorCodes>(this);
    return DtoUtil.convertToDto(ReadErrorCodesDto, results);
  }

  async findOne(id: string): Promise<ReadErrorCodesDto> {
    const result = await RepoHelpers.findOne(this, id);
    return DtoUtil.convertToDto(ReadErrorCodesDto, result);
  }

  async findOneBy(key: string, value: JSONValue): Promise<ReadErrorCodesDto> {
    const result = await RepoHelpers.findOneBy(this, { [key]: value });
    return DtoUtil.convertToDto(ReadErrorCodesDto, result);
  }

  async update(
    id: string,
    updateDto: UpdateErrorCodesDto,
  ): Promise<ReadErrorCodesDto> {
    const result = await RepoHelpers.update(ErrorCodes, this, id, updateDto);
    return DtoUtil.convertToDto(ReadErrorCodesDto, result);
  }

  async remove(id: string): Promise<ReadErrorCodesDto> {
    const result = await RepoHelpers.remove(this, id);
    return DtoUtil.convertToDto(ReadErrorCodesDto, result);
  }

  async page(queryBy: string | Filter): Promise<PageResult<ReadErrorCodesDto>> {
    const filter: Filter =
      typeof queryBy === 'string' ? StringUtil.base64ToObj(queryBy) : queryBy;
    const result = await RepoHelpers.page<ErrorCodes>(this, filter);
    const dtos = DtoUtil.convertToDto(ReadErrorCodesDto, result.data);
    return { data: dtos, count: result.count } as PageResult<ReadErrorCodesDto>;
  }

  async searchBy(queryBy: string | Filter): Promise<ReadErrorCodesDto[]> {
    const filter: Filter =
      typeof queryBy === 'string' ? StringUtil.base64ToObj(queryBy) : queryBy;
    const query = RepoHelpers.queryBuilder(this, filter);
    const data = await query.getRawMany();
    return DtoUtil.convertToDto(ReadErrorCodesDto, data);
  }

  async count(r?: boolean, field?: string): Promise<number> {
    return RepoHelpers.count(this, r);
  }
}
