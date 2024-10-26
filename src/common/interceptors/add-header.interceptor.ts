import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AddHeaderInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const { getResponse } = context.switchToHttp();

    const res = getResponse();

    res.setHeader('X-Custom-Header', 'O valor do cabeçalho');

    return next.handle();
  }
}
