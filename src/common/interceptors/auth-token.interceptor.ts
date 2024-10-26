import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { getRequest } = context.switchToHttp();

    const req = getRequest();

    const token = req.headers.authorization?.split(' ')[1];

    if (!token || token !== '123456') {
      throw new UnauthorizedException('Usuário não logado');
    }

    return next.handle();
  }
}
