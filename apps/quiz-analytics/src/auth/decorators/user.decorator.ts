import { createParamDecorator } from '@nestjs/common';

export const UserReq = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
