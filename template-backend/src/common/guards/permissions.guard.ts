// permissions.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '../services/permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true; // No permissions specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.id; // Assuming you have a user object with ID after authentication

    // Get the user's permissions from the database
    const userPermissions =
      await this.permissionsService.getPermissionsByUserId(userId);

    // Check if the user has the required permission(s)
    return userPermissions.some((permission) =>
      requiredPermissions.includes(permission),
    );
  }
}
