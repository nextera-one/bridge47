import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

import DataObject, { JSONValue } from '../model/data_object';

export class BaseDto implements DataObject {
  [key: string]: JSONValue;

  @ApiProperty({ description: 'Id', example: 'string', required: false })
  @Type(() => String)
  id?: string;

  @Exclude({ toPlainOnly: true })
  @ApiProperty({
    description: 'Created At',
    example: `${new Date().toString()}`,
  })
  @Type(() => Date)
  created_at: Date;

  @Exclude({ toPlainOnly: true })
  @ApiProperty({ description: 'Created By', example: 'string' })
  @Type(() => String)
  created_by: string;

  @Exclude({ toPlainOnly: true })
  @ApiProperty({
    description: 'Updated At',
    example: `${new Date().toString()}`,
  })
  @Type(() => Date)
  updated_at: Date;

  @Exclude({ toPlainOnly: true })
  @ApiProperty({ description: 'Updated By', example: 'string' })
  @Type(() => String)
  updated_by: string;

  //log
  @Exclude({ toPlainOnly: true })
  @ApiProperty({ description: 'Log', example: 'string' })
  @Type(() => String)
  @IsOptional()
  log?: string;

  //log_data
  @Exclude({ toPlainOnly: true })
  @ApiProperty({ description: 'Log Data', example: {} })
  @IsOptional()
  log_data?: any;
}
