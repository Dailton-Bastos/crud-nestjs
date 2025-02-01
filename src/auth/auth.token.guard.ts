import { CanActivate, Inject, UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { REQUEST_TOKEN_PAYLOAD_KEY } from './auth.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { PessoaEntity } from 'src/pessoas/entities/pessoa.entity';
import { Repository } from 'typeorm';

export class AuthTokenGuard implements CanActivate {
  constructor(
    @InjectRepository(PessoaEntity)
    private readonly pessoaRepository: Repository<PessoaEntity>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );

      const pessoa = await this.pessoaRepository.findOneBy({
        id: payload.sub,
        active: true,
      });

      if (!pessoa) {
        throw new UnauthorizedException('Pessoa não autorizada');
      }

      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }

  extractTokenFromRequest(request: Request): string | undefined {
    const authorizationHeader = request.headers?.authorization;

    if (!authorizationHeader || typeof authorizationHeader !== 'string') {
      return;
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer') return;

    return token;
  }
}
