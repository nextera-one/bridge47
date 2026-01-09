import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import CurrentUserModel from '../../model/current_user.model';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserModel => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (user)
      user.lang =
        request.headers['language'] ||
        request.headers['accept-language'] ||
        'en';
    return user;
  },
);
