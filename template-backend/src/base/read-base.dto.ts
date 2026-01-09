import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';

import DataObject, { JSONValue } from '../model/data_object';
import { ReadRefUserDto } from './read-ref-user.dto';

export class ReadBaseDto implements DataObject {
  [key: string]: JSONValue;

  public static ALLOWED_FOR_FILTER = [
    'id',
    'created_at',
    'updated_at',
    'created_by',
    'updated_by',
  ];

  @ApiProperty({ description: 'Id', example: 'string', required: false })
  id?: string;

  @ApiProperty({
    description: 'Created At',
    example: `${new Date().toString()}`,
  })
  created_at: Date;

  // @Expose({ groups: ['SUPER_ADMIN', 'ADMIN', 'USER'] })
  @ApiProperty({ description: 'Created By', example: 'string' })
  created_by: string;

  @ApiProperty({
    description: 'Updated At',
    example: `${new Date().toString()}`,
  })
  updated_at: Date;

  // @Expose({ groups: ['SUPER_ADMIN', 'ADMIN', 'USER'] })
  @ApiProperty({ description: 'Updated By', example: 'string' })
  updated_by: string;

  // @Expose({ groups: ['SUPER_ADMIN', 'ADMIN', 'USER'] })
  @ApiProperty({ description: 'Created By', example: 'string' })
  @Type(() => ReadRefUserDto)
  created_by_user?: ReadRefUserDto;

  // @Expose({ groups: ['SUPER_ADMIN', 'ADMIN', 'USER'] })
  @ApiProperty({ description: 'Updated By', example: 'string' })
  @Type(() => ReadRefUserDto)
  updated_by_user?: ReadRefUserDto;

  //log
  @Exclude({ toPlainOnly: true })
  @ApiProperty({ description: 'Log', example: 'string' })
  @Type(() => String)
  log?: string;

  //log_data
  @Exclude({ toPlainOnly: true })
  @ApiProperty({ description: 'Log Data', example: {} })
  log_data?: any;
}
