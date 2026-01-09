import { Transform, TransformFnParams } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

import DtoUtil from '../../common/utils/dto.util';
import DataObject from '../../model/data_object';
import { BaseDto } from '../../base/base.dto';
export class CreateFilesDto extends BaseDto {
  @ApiProperty({ description: 'parent', example: 'abc' })
  @IsString()
  @IsOptional()
  parent: string;

  @ApiProperty({ description: 'linked', example: 'true' })
  @Transform((value: TransformFnParams) => DtoUtil.bufferToBoolean(value.value))
  @IsBoolean()
  linked: boolean;

  @ApiProperty({ description: 'other', example: 'example' })
  @IsString()
  @IsOptional()
  other: DataObject;

  @ApiProperty({ description: 'ext', example: 'abc' })
  @IsString()
  @IsOptional()
  ext: string;

  @ApiProperty({ description: 'size', example: '123' })
  @IsNumber()
  @IsOptional()
  size: number;

  @ApiProperty({ description: 'linked_to', example: 'abc' })
  @IsString()
  @IsOptional()
  linked_to?: string;

  @ApiProperty({ description: 'permissions', example: 'example' })
  @IsString()
  @IsOptional()
  permissions: DataObject;

  @ApiProperty({ description: 'is_directory', example: '123' })
  @IsNumber()
  is_directory: number;

  @ApiProperty({ description: 'linked_to_id', example: 'abc' })
  @IsString()
  @IsOptional()
  linked_to_id?: string;
}
