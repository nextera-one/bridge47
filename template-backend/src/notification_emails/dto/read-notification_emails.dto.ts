import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";
import { ReadBaseDto } from "../../base/read-base.dto";
import DataObject from "../../model/data_object";
export class ReadNotificationEmailsDto extends ReadBaseDto {
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
  @IsOptional()
  ref: string;

  @ApiProperty({ description: "ref_type", example: "abc" })
  @IsString()
  @IsOptional()
  ref_type: string;

  @ApiProperty({ description: "from_address", example: "abc" })
  @IsString()
  @IsOptional()
  from_address: string;

  @ApiProperty({ description: "bcc", example: "abc" })
  @IsString()
  @IsOptional()
  bcc: string;

  @ApiProperty({ description: "cc", example: "abc" })
  @IsString()
  @IsOptional()
  cc: string;

  @ApiProperty({ description: "to", example: "abc" })
  @IsString()
  @IsOptional()
  to: string;

  @ApiProperty({ description: "in_process", example: "123" })
  @IsNumber()
  in_process: number;

  @ApiProperty({ description: "sent", example: "123" })
  @IsBoolean()
  sent: boolean;

  @ApiProperty({ description: "error", example: "abc" })
  @IsString()
  @IsOptional()
  error: string;

  @ApiProperty({ description: "settings", example: "example" })
  @IsString()
  @IsOptional()
  settings: DataObject;

  @ApiProperty({ description: "to_direct", example: "abc" })
  @IsString()
  @IsOptional()
  to_direct: string;

  @ApiProperty({ description: "attachment", example: "abc" })
  @IsString()
  @IsOptional()
  attachment: string;

  @ApiProperty({ description: "expiration_time", example: "123" })
  @IsNumber()
  @IsOptional()
  expiration_time: number;

  @ApiProperty({ description: "attachments", example: "example" })
  @IsString()
  @IsOptional()
  attachments: DataObject;

  @ApiProperty({ description: "token", example: "abc" })
  @IsString()
  token: string;
}
