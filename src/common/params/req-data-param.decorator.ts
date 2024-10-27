import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ReqDataParam = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();

    const req = context.getRequest() as Request;

    return req[data];
  },
);
