import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PessoaEntity } from 'src/pessoas/entities/pessoa.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
// import { AuthTokenGuard } from './auth.token.guard';
// import { RoutePolicyGuard } from './route-policy.guard';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([PessoaEntity]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],

  controllers: [AuthController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthService,
    // AuthTokenGuard,
    // RoutePolicyGuard,
  ],
  exports: [
    HashingService,
    JwtModule,
    ConfigModule,
    TypeOrmModule,
    // AuthTokenGuard,
    // RoutePolicyGuard,
  ],
})
export class AuthModule {}
