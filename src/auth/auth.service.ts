import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { type Repository } from 'typeorm';
import { PessoaEntity } from 'src/pessoas/entities/pessoa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(PessoaEntity)
    private readonly pessoaRepository: Repository<PessoaEntity>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    let passwordIsValid = false;
    let throwError = true;

    const pessoa = await this.pessoaRepository.findOneBy({
      email: loginDto.email,
      active: true,
    });

    if (!pessoa) {
      throw new UnauthorizedException('Pessoa não autorizada');
    }

    if (pessoa) {
      passwordIsValid = await this.hashingService.compare(
        loginDto.password,
        pessoa.passwordHash,
      );
    }

    if (passwordIsValid) {
      throwError = false;
    }

    if (throwError) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.createTokens(pessoa);
  }

  private async createTokens(pessoa: PessoaEntity) {
    const acessTokenPromise = this.signJwtAsync<Partial<PessoaEntity>>(
      pessoa.id,
      this.jwtConfiguration.jwtTtl,
      { email: pessoa.email },
    );

    const refreshTokenPromise = this.signJwtAsync(
      pessoa.id,
      this.jwtConfiguration.jwtRefreshTtl,
    );

    const [acessToken, refreshToken] = await Promise.all([
      acessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      acessToken,
      refreshToken,
    };
  }

  private async signJwtAsync<T>(sub: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn,
      },
    );
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        this.jwtConfiguration,
      );

      const pessoa = await this.pessoaRepository.findOneBy({
        id: sub,
        active: true,
      });

      if (!pessoa) {
        throw new Error('Pessoa não autorizada');
      }

      return this.createTokens(pessoa);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
