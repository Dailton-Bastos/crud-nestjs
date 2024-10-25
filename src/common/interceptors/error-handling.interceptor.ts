import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

export class ErrorHandlingInterceptor implements NestInterceptor {
  async intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        return throwError(() => {
          if (error?.name === 'NotFoundException') {
            return new BadRequestException(error?.message);
          }

          return new BadRequestException('Ocorreu um erro desconhecido.');
        });
      }),
    );
  }
}
