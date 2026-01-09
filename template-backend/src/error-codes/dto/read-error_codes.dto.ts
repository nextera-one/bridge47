import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReadBaseDto } from '../../base/read-base.dto';
import DtoUtil from '../../common/utils/dto.util';
export class ReadErrorCodesDto extends ReadBaseDto {
  @ApiProperty({ description: 'code', example: 'abc' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'http_status_code', example: '123' })
  @IsNumber()
  http_status_code: number;

  @ApiProperty({ description: 'default_message', example: 'abc' })
  @IsString()
  default_message: string;

  @ApiProperty({ description: 'default_description', example: 'abc' })
  @IsString()
  @IsOptional()
  default_description: string;

  @ApiProperty({ description: 'is_reportable', example: 'true' })
  @Transform((value: TransformFnParams) => DtoUtil.bufferToBoolean(value.value))
  @IsBoolean()
  is_reportable: boolean;
}
