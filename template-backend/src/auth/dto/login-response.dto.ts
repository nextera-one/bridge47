import { ApiProperty } from '@nestjs/swagger';

import { ReadUsersDto } from '../../users/dto/read-users.dto';

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;

  @ApiProperty({
    example: {
      id: '123',
      name: 'John Doe',
      email: 'user@example.com',
      role: 'USER',
    },
  })
  user?: ReadUsersDto;
}
