import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class UserDto {
  [key: string]: Access[];
}

export class RoleDto {
  [key: string]: Access[];
}

export class PermissionDto {
  @ApiProperty()
  @IsArray()
  any?: Access[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => UserDto)
  user?: UserDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => RoleDto)
  role?: RoleDto;
}

export enum Access {
  READ = 'read',
  WRITE = 'write',
  ADD = 'add',
  DELETE = 'delete',
  UPDATE = 'update',
}
