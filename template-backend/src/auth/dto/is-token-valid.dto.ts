import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IsTokenValidDto {
  @ApiProperty({ example: 'some-jwt-access-token' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
