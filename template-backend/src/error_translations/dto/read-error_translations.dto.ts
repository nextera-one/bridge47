import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsString
} from "class-validator";
import { ReadBaseDto } from "../../base/read-base.dto";
export class ReadErrorTranslationsDto extends ReadBaseDto {
  @ApiProperty({ description: "description", example: "abc" })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: "error_code", example: "abc" })
  @IsString()
  error_code: string;

  @ApiProperty({ description: "language_code", example: "abc" })
  @IsString()
  language_code: string;

  @ApiProperty({ description: "message", example: "abc" })
  @IsString()
  message: string;
}
