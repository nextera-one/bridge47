import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsString
} from "class-validator";
import { BaseDto } from "../../base/base.dto";
export class CreateErrorTranslationsDto extends BaseDto {
  @ApiProperty({ description: 'description', example: 'abc' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'error_code', example: 'abc' })
  @IsString()
  error_code: string;

  @ApiProperty({ description: 'language_code', example: 'abc' })
  @IsString()
  language_code: string;

  @ApiProperty({ description: 'message', example: 'abc' })
  @IsString()
  message: string;
}
