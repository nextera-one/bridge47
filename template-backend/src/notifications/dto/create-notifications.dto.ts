import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";
import { BaseDto } from "../../base/base.dto";
import DataObject from "../../model/data_object";
export class CreateNotificationsDto extends BaseDto {
  @ApiProperty({ description: "title", example: "abc" })
  @IsString()
  title: string;

  @ApiProperty({ description: "description", example: "abc" })
  @IsString()
  description: string;

  @ApiProperty({ description: "active", example: "123" })
  @IsNumber()
  active: number;

  @ApiProperty({ description: "color", example: "abc" })
  @IsString()
  color: string;

  @ApiProperty({ description: "ref", example: "abc" })
  @IsString()
  ref: string;

  @ApiProperty({ description: "ref_type", example: "abc" })
  @IsString()
  @IsOptional()
  ref_type: string;

  @ApiProperty({ description: "to", example: "abc" })
  @IsString()
  @IsOptional()
  to: string;

  @ApiProperty({ description: "seen", example: "123" })
  @IsNumber()
  seen: number;

  @ApiProperty({ description: "action", example: "abc" })
  @IsString()
  @IsOptional()
  action: string;

  @ApiProperty({ description: "message", example: "example" })
  @IsString()
  @IsOptional()
  message: DataObject;

  @ApiProperty({ description: "to_data", example: "abc" })
  @IsString()
  to_data: string;

  @ApiProperty({ description: "firebase", example: "123" })
  @IsNumber()
  firebase: number;
}
