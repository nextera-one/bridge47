// src/file/dto/file.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FileDto {
  @ApiProperty({ description: 'Original file name', example: 'avatar.png' })
  @IsString()
  originalname: string;

  @ApiProperty({ description: 'Encoding type', example: '7bit' })
  @IsString()
  encoding: string;

  @ApiProperty({ description: 'MIME type of the file', example: 'image/png' })
  @IsString()
  mimetype: string;

  @ApiProperty({ description: 'Destination path', example: './uploads/' })
  @IsString()
  destination: string;

  @ApiProperty({
    description: 'Generated file name',
    example: '1234567890.png',
  })
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'Full path of the file',
    example: './uploads/1234567890.png',
  })
  @IsString()
  path: string;

  @ApiProperty({ description: 'Size of the file in bytes', example: 34567 })
  @IsNumber()
  size: number;

  @ApiProperty({ description: 'Raw buffer of the file (optional)' })
  @IsOptional()
  buffer?: Buffer;
}
