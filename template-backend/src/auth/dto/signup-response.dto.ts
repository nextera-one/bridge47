import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseDto {
  @ApiProperty({ example: 'Successfully registered.' })
  message: string;

  @ApiProperty({
    example: {
      id: '123',
      name: 'John Doe',
      email: 'user@example.com',
      role: 'USER',
    },
  })
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;
}
