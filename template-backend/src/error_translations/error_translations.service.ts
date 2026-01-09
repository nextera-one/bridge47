import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "../base/base.service";
import DtoUtil from "../common/utils/dto.util";
import Filter from "../common/utils/filter";
import { PageResult, RepoHelpers } from "../common/utils/repo_helpers";
import StringUtil from "../common/utils/string.util";
import { JSONValue } from "../model/data_object";
import { CreateErrorTranslationsDto } from "./dto/create-error_translations.dto";
import { ReadErrorTranslationsDto } from "./dto/read-error_translations.dto";
import { UpdateErrorTranslationsDto } from "./dto/update-error_translations.dto";
import { ErrorTranslations } from "./entities/error_translations.entity";

@Injectable()
export class ErrorTranslationsService extends BaseService<ErrorTranslations> {
  constructor(
    @InjectRepository(ErrorTranslations)
    private readonly currentRepository: Repository<ErrorTranslations>,
  ) {
    super(currentRepository);
  }

  async create(
    createDto: CreateErrorTranslationsDto,
  ): Promise<ReadErrorTranslationsDto> {
    const result = await RepoHelpers.create(ErrorTranslations, this, createDto);
    return DtoUtil.convertToDto(ReadErrorTranslationsDto, result);
  }

  async findAll(): Promise<ReadErrorTranslationsDto[]> {
    const results = await RepoHelpers.findAll<ErrorTranslations>(this);
    return DtoUtil.convertToDto(ReadErrorTranslationsDto, results);
  }

  async findOne(id: string): Promise<ReadErrorTranslationsDto> {
    const result = await RepoHelpers.findOne(this, id);
    return DtoUtil.convertToDto(ReadErrorTranslationsDto, result);
  }

  async findOneBy(
    key: keyof ErrorTranslations,
    value: JSONValue,
  ): Promise<ReadErrorTranslationsDto> {
    const result = await RepoHelpers.findOneBy(this, { [key]: value });
    return DtoUtil.convertToDto(ReadErrorTranslationsDto, result);
  }

  async update(
    id: string,
    updateDto: UpdateErrorTranslationsDto,
  ): Promise<ReadErrorTranslationsDto> {
    const result = await RepoHelpers.update(
      ErrorTranslations,
      this,
      id,
      updateDto,
    );
    return DtoUtil.convertToDto(ReadErrorTranslationsDto, result);
  }

  async remove(id: string): Promise<ReadErrorTranslationsDto> {
    const result = await RepoHelpers.remove(this, id);
    return DtoUtil.convertToDto(ReadErrorTranslationsDto, result);
  }

  async page(
    queryBy: string | Filter,
  ): Promise<PageResult<ReadErrorTranslationsDto>> {
    const filter: Filter =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const result = await RepoHelpers.page<ErrorTranslations>(this, filter);
    const dtos = DtoUtil.convertToDto(ReadErrorTranslationsDto, result.data);
    return {
      data: dtos,
      count: result.count,
    } as PageResult<ReadErrorTranslationsDto>;
  }

  async searchBy(
    queryBy: string | Filter,
  ): Promise<ReadErrorTranslationsDto[]> {
    const filter: Filter =
      typeof queryBy === "string" ? StringUtil.base64ToObj(queryBy) : queryBy;
    const query = RepoHelpers.queryBuilder(this, filter);
    const data = await query.getRawMany();
    return DtoUtil.convertToDto(ReadErrorTranslationsDto, data);
  }

  async count(r?: boolean, field?: keyof ErrorTranslations): Promise<number> {
    return RepoHelpers.count(this, r, field);
  }
}
