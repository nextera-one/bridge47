// src/common/guards/roles.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { DefaultErrorCodes } from '../../error_codes/default_error_codes';
import { UserRolesService } from '../../user_roles/user_roles.service';
import { RoleEnum } from '../../users/enums/role.enum';
import { IS_PUBLIC_KEY, ROLES_KEY } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userRolesService: UserRolesService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest<Request>();
    const user = (req as any).user as { role: RoleEnum; id: string };

    if (!user) {
      throw new ForbiddenException('NO_USER_ON_REQUEST');
    }

    const roles = await this.userRolesService
      .getRepo()
      .find({ where: { user_id: user.id }, relations: ['role'] });
    if (!roles || roles.length === 0) {
      throw new ForbiddenException(DefaultErrorCodes.NO_ROLES_FOUND_FOR_USER);
    }

    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return roles.map((r) => r.role.name).includes(RoleEnum.ADMIN); // no role requirement
    }

    (req as any).user.roles = roles.map((r) => r.role.name);
    // if not authBox, only admins allowed
    if (!roles.map((r) => r.role.name).includes(RoleEnum.ADMIN)) {
      throw new ForbiddenException(
        DefaultErrorCodes.NOT_AUTHORIZED_FOR_ENDPOINT,
      );
    }
    const hasPermission_1 = roles
      .map((r) => r.role.name)
      .some((role) => requiredRoles.includes(role as RoleEnum));
    // finally check that user.role is one of requiredRoles
    if (!hasPermission_1) {
      throw new ForbiddenException(DefaultErrorCodes.INSUFFICIENT_ROLE);
    }

    return true;
  }
}
