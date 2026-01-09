// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

import { RoleEnum } from '../../users/enums/role.enum';
import { ROLES_KEY } from '../constants';

export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
