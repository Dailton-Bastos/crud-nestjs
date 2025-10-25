import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import globalConfig from 'src/global-config/global.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'node:path';
import { RecadosModule } from 'src/recados/recados.module';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { GlobalConfigModule } from 'src/global-config/global-config.module';
import { AuthModule } from 'src/auth/auth.module';
import appConfig from 'src/app/config/app.config';
import * as request from 'supertest';

describe('PessoasController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(globalConfig),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'testing',
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
        ServeStaticModule.forRoot({
          rootPath: resolve(__dirname, '..', '..', 'pictures'),
          serveRoot: '/pictures',
        }),
        RecadosModule,
        PessoasModule,
        GlobalConfigModule,
        AuthModule,
      ],
    }).compile();

    app = module.createNestApplication();

    appConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /pessoas', () => {
    it('deve criar uma pessoa com sucesso', async () => {
      // Arrange
      const dto = {
        email: 'teste@teste.com',
        nome: 'Teste',
        password: '123456',
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/pessoas')
        .send(dto);

      // Assert
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
        email: dto.email,
        nome: dto.nome,
        passwordHash: expect.any(String),
        createdAt: expect.any(String),
        updateAt: expect.any(String),
        active: true,
        picture: '',
      });
    });
  });
});
