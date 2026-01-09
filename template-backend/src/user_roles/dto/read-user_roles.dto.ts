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
export class ReadUserRolesDto extends ReadBaseDto {
  @ApiProperty({ description: "user_id", example: "abc" })
  @IsString()
  user_id: string;

  @ApiProperty({ description: "role_id", example: "abc" })
  @IsString()
  role_id: string;
}
