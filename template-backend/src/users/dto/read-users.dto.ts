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
import { CitizenshipRankEnum } from "../enums/citizenship_rank.enum";
export class ReadUsersDto extends ReadBaseDto {
  @ApiProperty({ description: "email", example: "abc" })
  @IsString()
  email: string;

  @ApiProperty({ description: "username", example: "abc" })
  @IsString()
  username: string;

  @ApiProperty({ description: "password_hash", example: "abc" })
  @IsString()
  password_hash: string;

  @ApiProperty({ description: "display_name", example: "abc" })
  @IsString()
  @IsOptional()
  display_name: string;

  @ApiProperty({ description: "avatar_file_id", example: "abc" })
  @IsString()
  @IsOptional()
  avatar_file_id: string;

  @ApiProperty({ description: "status", example: Object.values(StatusEnum) })
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty({
    description: "citizenship_rank",
    example: Object.values(CitizenshipRankEnum),
  })
  @IsEnum(CitizenshipRankEnum)
  @IsOptional()
  citizenship_rank: CitizenshipRankEnum;

  @ApiProperty({ description: "home_vap_id", example: "abc" })
  @IsString()
  @IsOptional()
  home_vap_id: string;

  @ApiProperty({ description: "home_country_id", example: "abc" })
  @IsString()
  @IsOptional()
  home_country_id: string;

  @ApiProperty({ description: "devscore", example: "123" })
  @IsNumber()
  devscore: number;

  @ApiProperty({ description: "dpv", example: "123" })
  @IsNumber()
  dpv: number;
}
