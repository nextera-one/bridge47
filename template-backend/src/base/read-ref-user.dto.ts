import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReadRefUserDto {
  @Expose({ groups: ['SUPER_ADMIN', 'ADMIN', 'USER'] })
  @ApiProperty({ description: 'First Name', example: 'string' })
  first_name: string;

  @Expose({ groups: ['SUPER_ADMIN', 'ADMIN', 'USER'] })
  @ApiProperty({ description: 'Last Name', example: 'string' })
  last_name: string;

  @Expose({ groups: ['SUPER_ADMIN', 'ADMIN', 'USER'] })
  @ApiProperty({ description: 'Email', example: 'string' })
  email: string;

  @ApiProperty({ description: 'unique_id', example: 'string' })
  unique_id?: string;
}
