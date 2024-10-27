import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UrlParam = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();

    const req = context.getRequest() as Request;

    return req.url;
  },
);
