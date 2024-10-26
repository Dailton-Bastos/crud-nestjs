import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class OutroMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log('OutroMiddleware');

    // return res.status(404).send({
    //   message: 'Não encontrado',
    // });
    return next(); // Próximo middleware
  }
}
