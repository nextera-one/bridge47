import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";
import { ReadBaseDto } from "../../base/read-base.dto";
import DataObject from "../../model/data_object";
import { TypeEnum } from "../enums/type.enum";
export class ReadNotificationSettingsDto extends ReadBaseDto {
  @ApiProperty({ description: "active", example: "123" })
  @IsNumber()
  active: number;

  @ApiProperty({ description: "color", example: "abc" })
  @IsString()
  color: string;

  @ApiProperty({ description: "type", example: Object.values(TypeEnum) })
  @IsEnum(TypeEnum)
  type: TypeEnum;

  @ApiProperty({ description: "settings", example: "example" })
  @IsString()
  @IsOptional()
  settings: DataObject;
}
