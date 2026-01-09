import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

import { BaseDto } from '../../base/base.dto';
import DtoUtil from '../../common/utils/dto.util';
import DataObject from '../../model/data_object';

export class CreateNotificationEmailsDto extends BaseDto {
  @ApiProperty({ description: 'subject', example: 'abc' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'message', example: 'abc' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'color', example: 'abc' })
  @IsString()
  color: string;

  @ApiProperty({ description: 'ref', example: 'abc' })
  @IsString()
  ref: string;

  @ApiProperty({ description: 'ref_type', example: 'abc' })
  @IsString()
  ref_type: string;

  @ApiProperty({ description: 'from_address', example: 'abc' })
  @IsString()
  @IsOptional()
  from_address: string;

  @ApiProperty({ description: 'bcc', example: 'abc' })
  @IsString()
  @IsOptional()
  bcc: string;

  @ApiProperty({ description: 'cc', example: 'abc' })
  @IsString()
  @IsOptional()
  cc: string;

  @ApiProperty({ description: 'to', example: 'abc' })
  @IsString()
  @IsOptional()
  to: string;

  @ApiProperty({ description: 'in_process', example: '123' })
  @IsNumber()
  in_process: number;

  @ApiProperty({ description: 'sent', example: '123' })
  @IsBoolean()
  @Transform((value: TransformFnParams) => DtoUtil.bufferToBoolean(value.value))
  sent: boolean;

  @ApiProperty({ description: 'error', example: 'abc' })
  @IsString()
  @IsOptional()
  error: string;

  @ApiProperty({ description: 'settings', example: 'example' })
  @IsString()
  @IsOptional()
  settings: DataObject;

  @ApiProperty({ description: 'to_direct', example: 'abc' })
  @IsString()
  @IsOptional()
  to_direct: string;

  @ApiProperty({ description: 'attachment', example: 'abc' })
  @IsString()
  @IsOptional()
  attachment: string;

  @ApiProperty({
    description: 'expiration_time',
    example: '2025-01-01T00:00:00Z',
  })
  @IsDate()
  @IsOptional()
  expiration_time: Date;

  @ApiProperty({ description: 'attachments', example: 'example' })
  @IsString()
  @IsOptional()
  attachments: DataObject;

  @ApiProperty({ description: 'token', example: 'abc' })
  @IsString()
  token: string;
}
