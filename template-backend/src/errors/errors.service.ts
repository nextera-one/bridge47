import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import DtoUtil from '../common/utils/dto.util';
import Filter from '../common/utils/filter';
import { PageResult, RepoHelpers } from '../common/utils/repo_helpers';
import StringUtil from '../common/utils/string.util';
import { JSONValue } from '../model/data_object';
import { CreateErrorsDto } from './dto/create-errors.dto';
import { ReadErrorsDto } from './dto/read-errors.dto';
import { UpdateErrorsDto } from './dto/update-errors.dto';
import { Errors } from './entities/errors.entity';

@Injectable()
export class ErrorsService extends BaseService<Errors> {
  constructor(
    @InjectRepository(Errors)
    private readonly currentRepository: Repository<Errors>,
  ) {
    super(currentRepository);
  }

  async create(createDto: CreateErrorsDto): Promise<ReadErrorsDto> {
    const result = await RepoHelpers.create(Errors, this, createDto);
    return DtoUtil.convertToDto(ReadErrorsDto, result);
  }

  async findAll(): Promise<ReadErrorsDto[]> {
    const results = await RepoHelpers.findAll<Errors>(this);
    return DtoUtil.convertToDto(ReadErrorsDto, results);
  }

  async findOne(id: string): Promise<ReadErrorsDto> {
    const result = await RepoHelpers.findOne(this, id);
    return DtoUtil.convertToDto(ReadErrorsDto, result);
  }

  async findOneBy(key: keyof Errors, value: JSONValue): Promise<ReadErrorsDto> {
    const result = await RepoHelpers.findOneBy(this, { [key]: value });
    return DtoUtil.convertToDto(ReadErrorsDto, result);
  }

  async update(id: string, updateDto: UpdateErrorsDto): Promise<ReadErrorsDto> {
    const result = await RepoHelpers.update(Errors, this, id, updateDto);
    return DtoUtil.convertToDto(ReadErrorsDto, result);
  }

  async remove(id: string): Promise<ReadErrorsDto> {
    const result = await RepoHelpers.remove(this, id);
    return DtoUtil.convertToDto(ReadErrorsDto, result);
  }

  async page(queryBy: string | Filter): Promise<PageResult<ReadErrorsDto>> {
    const filter: Filter =
      typeof queryBy === 'string' ? StringUtil.base64ToObj(queryBy) : queryBy;
    const result = await RepoHelpers.page<Errors>(this, filter);
    const dtos = DtoUtil.convertToDto(ReadErrorsDto, result.data);
    return { data: dtos, count: result.count } as PageResult<ReadErrorsDto>;
  }

  async searchBy(queryBy: string | Filter): Promise<ReadErrorsDto[]> {
    const filter: Filter =
      typeof queryBy === 'string' ? StringUtil.base64ToObj(queryBy) : queryBy;
    const query = RepoHelpers.queryBuilder(this, filter);
    const data = await query.getRawMany();
    return DtoUtil.convertToDto(ReadErrorsDto, data);
  }

  async count(r?: boolean, field?: keyof Errors): Promise<number> {
    return RepoHelpers.count(this, r, field);
  }
}
