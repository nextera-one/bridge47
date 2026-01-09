import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DoesExistDto {
  @ApiProperty()
  @IsArray()
  idsArray: string[];
}
