import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LogupDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @MinLength(6)
  password: string;

  //token
  @ApiProperty({ example: 'some-random-token' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @IsOptional()
  @MinLength(6)
  passwordPlain: string;
}
