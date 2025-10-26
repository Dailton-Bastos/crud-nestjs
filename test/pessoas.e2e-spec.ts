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

const login = async (
  app: INestApplication,
  dto: { email: string; password: string },
) => {
  const response = await request(app.getHttpServer()).post('/auth').send(dto);

  return response.body.acessToken;
};

// const createPessoaAndLogin = async (
//   app: INestApplication,
//   dto: { email: string; nome: string; password: string },
// ) => {
//   await request(app.getHttpServer())
//     .post('/pessoas')
//     .send(dto)
//     .expect(HttpStatus.CREATED);
//   return login(app, { email: dto.email, password: dto.password });
// };

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

    it('deve falhar se o email já estiver cadastrado', async () => {
      const dto = {
        email: 'teste@teste.com',
        nome: 'Teste',
        password: '123456',
      };

      await request(app.getHttpServer())
        .post('/pessoas')
        .send(dto)
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post('/pessoas')
        .send(dto);

      expect(response.status).toBe(HttpStatus.CONFLICT);

      expect(response.body).toEqual({
        error: 'Conflict',
        statusCode: HttpStatus.CONFLICT,
        message: 'E-mail já está cadastrado',
      });
    });

    it('deve gerar um erro de senha curta', async () => {
      const dto = {
        email: 'teste@teste.com',
        nome: 'Teste',
        password: '123',
      };

      const response = await request(app.getHttpServer())
        .post('/pessoas')
        .send(dto);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['password must be longer than or equal to 5 characters'],
      });
      // Ou
      expect(response.body.message).toContain(
        'password must be longer than or equal to 5 characters',
      );
    });

    it('deve gerar um erro de nome vazio', async () => {
      const dto = {
        email: 'teste@teste.com',
        nome: '',
        password: '123456',
      };

      const response = await request(app.getHttpServer())
        .post('/pessoas')
        .send(dto);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toContain('nome should not be empty');
    });
  });

  describe('GET /pessoas', () => {
    it('deve retornar todas as pessoas', async () => {
      const dto = {
        email: 'teste@teste.com',
        nome: 'Teste',
        password: '123456',
      };

      await request(app.getHttpServer())
        .post('/pessoas')
        .send(dto)
        .expect(HttpStatus.CREATED);

      const acessToken = await login(app, {
        email: dto.email,
        password: dto.password,
      });

      const response = await request(app.getHttpServer())
        .get('/pessoas')
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            email: dto.email,
            nome: dto.nome,
          }),
        ]),
      );
    });
  });

  describe('GET /pessoas/:id', () => {
    it('deve retornar UNAUTHORIZED se não estiver autenticado', async () => {
      const pessoaResponse = await request(app.getHttpServer())
        .post('/pessoas')
        .send({
          email: 'teste@teste.com',
          nome: 'Teste',
          password: '123456',
        });

      expect(pessoaResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer()).get(
        `/pessoas/${pessoaResponse.body.id}`,
      );

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual({
        error: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Token não encontrado',
      });
    });

    it('deve retornar pessoa com sucesso se estiver autenticado', async () => {
      // Arrange
      const dto = {
        email: 'teste@teste.com',
        nome: 'Teste',
        password: '123456',
      };

      const pessoaResponse = await request(app.getHttpServer())
        .post('/pessoas')
        .send({ ...dto })
        .expect(HttpStatus.CREATED);

      const acessToken = await login(app, {
        email: dto.email,
        password: dto.password,
      });

      const response = await request(app.getHttpServer())
        .get(`/pessoas/${pessoaResponse.body.id}`)
        .set('Authorization', `Bearer ${acessToken}`);

      expect(response.status).toBe(HttpStatus.OK);

      // expect(response.body).toEqual({
      //   id: pessoaResponse.body.id,
      //   email: pessoaResponse.body.email,
      //   nome: pessoaResponse.body.nome,
      //   passwordHash: expect.any(String),
      //   createdAt: expect.any(String),
      //   updateAt: expect.any(String),
      //   active: true,
      //   picture: '',
      // });

      expect(response.body).toEqual(pessoaResponse.body);
    });

    it('deve retornar NOT_FOUND se a pessoa não for encontrada', async () => {
      await request(app.getHttpServer())
        .post('/pessoas')
        .send({
          email: 'teste@teste.com',
          nome: 'Teste',
          password: '123456',
        })
        .expect(HttpStatus.CREATED);

      const acessToken = await login(app, {
        email: 'teste@teste.com',
        password: '123456',
      });

      const response = await request(app.getHttpServer())
        .get(`/pessoas/999`)
        .set('Authorization', `Bearer ${acessToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Pessoa não encontrada',
      });
    });
  });

  describe('PATCH /pessoas/:id', () => {
    it('deve atualizar uma pessoa com sucesso', async () => {
      const dto = {
        email: 'teste@teste.com',
        nome: 'Teste',
        password: '123456',
      };

      const pessoaResponse = await request(app.getHttpServer())
        .post('/pessoas')
        .send(dto)
        .expect(HttpStatus.CREATED);

      const acessToken = await login(app, {
        email: dto.email,
        password: dto.password,
      });

      const response = await request(app.getHttpServer())
        .patch(`/pessoas/${pessoaResponse.body.id}`)
        .set('Authorization', `Bearer ${acessToken}`)
        .send({ nome: 'Teste Atualizado' })
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: pessoaResponse.body.id,
          nome: 'Teste Atualizado',
        }),
      );
    });

    it('deve retornar NOT_FOUND se a pessoa não for encontrada', async () => {
      await request(app.getHttpServer())
        .post('/pessoas')
        .send({
          email: 'teste@teste.com',
          nome: 'Teste',
          password: '123456',
        })
        .expect(HttpStatus.CREATED);

      const acessToken = await login(app, {
        email: 'teste@teste.com',
        password: '123456',
      });

      const response = await request(app.getHttpServer())
        .patch(`/pessoas/999`)
        .set('Authorization', `Bearer ${acessToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Pessoa não encontrada',
      });
    });
  });

  describe('DELETE /pessoas/:id', () => {
    it('deve deletar uma pessoa com sucesso', async () => {
      const dto = {
        email: 'teste@teste.com',
        nome: 'Teste',
        password: '123456',
      };

      const pessoaResponse = await request(app.getHttpServer())
        .post('/pessoas')
        .send(dto)
        .expect(HttpStatus.CREATED);

      const acessToken = await login(app, {
        email: dto.email,
        password: dto.password,
      });

      const response = await request(app.getHttpServer())
        .delete(`/pessoas/${pessoaResponse.body.id}`)
        .set('Authorization', `Bearer ${acessToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.email).toEqual(pessoaResponse.body.email);
    });

    it('deve retornar NOT_FOUND se a pessoa não for encontrada', async () => {
      await request(app.getHttpServer())
        .post('/pessoas')
        .send({
          email: 'teste@teste.com',
          nome: 'Teste',
          password: '123456',
        })
        .expect(HttpStatus.CREATED);

      const acessToken = await login(app, {
        email: 'teste@teste.com',
        password: '123456',
      });

      const response = await request(app.getHttpServer())
        .delete(`/pessoas/999`)
        .set('Authorization', `Bearer ${acessToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Pessoa não encontrada',
      });
    });
  });
});
