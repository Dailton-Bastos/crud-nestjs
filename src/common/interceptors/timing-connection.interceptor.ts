import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimingConnectionInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    console.log('TimingConnectionInterceptor ANTES');

    await new Promise((resolve) => setTimeout(resolve, 3000));

    return next.handle().pipe(
      tap((data) => {
        console.log(`TimingConnectionInterceptor DEPOIS`);
        console.log(data);
      }),
    );
  }
}
