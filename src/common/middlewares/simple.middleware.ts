import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    req['user'] = {
      nome: 'Dailton',
      sobrenome: 'Bastos',
      role: 'admin',
    };

    // return res.status(404).send({
    //   message: 'Não encontrado',
    // });
    next();

    // res.on('finish', () => console.log('SimpleMiddleware Terminou'));
  }
}
