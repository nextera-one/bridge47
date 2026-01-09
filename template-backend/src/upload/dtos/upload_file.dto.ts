import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from '../../base/base.dto';
import { PermissionDto } from './permission.dto';

export class UploadFileDto extends BaseDto {
  @ApiProperty({
    description: 'Path to the directory where the file will be uploaded',
    example: '/uploads/images',
    type: String,
  })
  directory: string;

  @ApiProperty({
    description: 'Permissions object defining access control',
    type: () => PermissionDto,
    example: {
      any: [
        {
          type: 'read',
          granted: true,
        },
        {
          type: 'write',
          granted: false,
        },
      ],
      user: {
        id: 'user-uuid-123',
        email: 'user@example.com',
        first_name: 'John',
        last_name: 'Doe',
      },
      role: {
        id: 'role-uuid-456',
        name: 'write',
        description: 'Can edit documents in this collection',
      },
    },
  })
  permissions: PermissionDto;

  base64?: string; // Optional property for base64 data
}
