import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "../../base/base.dto";
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
  IsOptional,
  IsEnum,
} from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import DtoUtil from "../../common/utils/dto.util";
import DataObject from "../../model/data_object";
import { LevelEnum } from "../enums/level.enum";
export class CreateLogsDto extends BaseDto {
  @ApiProperty({ description: "level", example: Object.values(LevelEnum) })
  @IsEnum(LevelEnum)
  level: LevelEnum;

  @ApiProperty({ description: "source", example: "abc" })
  @IsString()
  source: string;

  @ApiProperty({ description: "context", example: "abc" })
  @IsString()
  @IsOptional()
  context: string;

  @ApiProperty({ description: "message", example: "abc" })
  @IsString()
  message: string;

  @ApiProperty({ description: "meta", example: "example" })
  @IsString()
  @IsOptional()
  meta: DataObject;
}
