import { Catch, BadRequestException } from '@nestjs/common';

import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const response = context.getResponse();
    const request = context.getRequest();

    const statusCode = exception?.getStatus ? exception.getStatus() : 400;
    const exceptionResponse = exception?.exceptionResponse
      ? exception.getResponse()
      : { message: 'ErrorExceptionFilter', statusCode };

    const error =
      typeof response === 'string'
        ? {
            message: exceptionResponse,
          }
        : (exceptionResponse as object);

    response.status(statusCode).json({
      ...error,
      data: new Date().toISOString(),
      path: request.url,
    });
  }
}
