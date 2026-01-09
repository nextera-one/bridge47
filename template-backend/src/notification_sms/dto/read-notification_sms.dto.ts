import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";
import { ReadBaseDto } from "../../base/read-base.dto";
import DataObject from "../../model/data_object";
export class ReadNotificationSmsDto extends ReadBaseDto {
  @ApiProperty({ description: "subject", example: "abc" })
  @IsString()
  subject: string;

  @ApiProperty({ description: "message", example: "abc" })
  @IsString()
  message: string;

  @ApiProperty({ description: "color", example: "abc" })
  @IsString()
  color: string;

  @ApiProperty({ description: "ref", example: "abc" })
  @IsString()
  ref: string;

  @ApiProperty({ description: "to", example: "abc" })
  @IsString()
  @IsOptional()
  to: string;

  @ApiProperty({ description: "sent", example: "123" })
  @IsBoolean()
  sent: boolean;

  @ApiProperty({ description: "error", example: "abc" })
  @IsString()
  @IsOptional()
  error: string;

  @ApiProperty({ description: "to_direct", example: "abc" })
  @IsString()
  @IsOptional()
  to_direct: string;

  @ApiProperty({ description: "response", example: "example" })
  @IsString()
  @IsOptional()
  response: DataObject;

  @ApiProperty({ description: "settings", example: "example" })
  @IsString()
  @IsOptional()
  settings: DataObject;

  @ApiProperty({ description: "expiration_time", example: "123" })
  @IsNumber()
  @IsOptional()
  expiration_time: number;

  @ApiProperty({ description: "token", example: "abc" })
  @IsString()
  token: string;
}
