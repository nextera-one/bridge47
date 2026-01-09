import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ReadBaseDto } from '../../base/read-base.dto';
import DataObject from '../../model/data_object';
export class ReadAuthDto extends ReadBaseDto {
  @ApiProperty({ description: 'jwt', example: 'abc' })
  @IsString()
  jwt: string;

  @ApiProperty({ description: 'data', example: 'example' })
  @IsString()
  data: DataObject;

  @ApiProperty({ description: 'expiry_timestamp', example: '123' })
  @IsNumber()
  expiry_timestamp: number;

  @ApiProperty({ description: 'user', example: 'abc' })
  @IsString()
  user: string;

  @ApiProperty({ description: 'fingerprint', example: 'abc' })
  @IsString()
  @IsOptional()
  fingerprint: string;
}
