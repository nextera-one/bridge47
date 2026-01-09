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
export class ReadAuthTokensDto extends ReadBaseDto {
  @ApiProperty({ description: "user", example: "abc" })
  @IsString()
  user: string;

  @ApiProperty({ description: "jwt", example: "abc" })
  @IsString()
  jwt: string;

  @ApiProperty({ description: "expires_at", example: "2025-01-01T00:00:00Z" })
  @IsDate()
  @IsOptional()
  expires_at: Date;

  @ApiProperty({ description: "revoked_at", example: "2025-01-01T00:00:00Z" })
  @IsDate()
  @IsOptional()
  revoked_at: Date;

  @ApiProperty({ description: "fingerprint", example: "abc" })
  @IsString()
  fingerprint: string;
}
