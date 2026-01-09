import { ApiProperty } from "@nestjs/swagger";
import { ReadBaseDto } from "../../base/read-base.dto";
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
import { StatusEnum } from "../enums/status.enum";
export class ReadReportedErrorsDto extends ReadBaseDto {
  @ApiProperty({ description: "error_code", example: "abc" })
  @IsString()
  error_code: string;

  @ApiProperty({ description: "user", example: "abc" })
  @IsString()
  @IsOptional()
  user: string;

  @ApiProperty({ description: "path", example: "abc" })
  @IsString()
  @IsOptional()
  path: string;

  @ApiProperty({ description: "user_comment", example: "abc" })
  @IsString()
  @IsOptional()
  user_comment: string;

  @ApiProperty({ description: "status", example: Object.values(StatusEnum) })
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
