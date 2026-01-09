import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsString
} from "class-validator";
import { BaseDto } from "../../base/base.dto";
export class CreateErrorsDto extends BaseDto {
  @ApiProperty({ description: "message", example: "abc" })
  @IsString()
  message: string;

  @ApiProperty({ description: "code", example: "abc" })
  @IsString()
  code: string;

  @ApiProperty({ description: "other", example: "abc" })
  @IsString()
  @IsOptional()
  other: string;

  @ApiProperty({ description: "ref", example: "abc" })
  @IsString()
  ref: string;
}
