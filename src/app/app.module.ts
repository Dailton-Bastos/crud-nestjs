import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: Joi.object({
        DATABASE_TYPE: Joi.string().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        // DATABASE_DATABASE: Joi.string().optional().default(''),
        DATABASE_SYNCHRONIZE: Joi.number().min(0).max(1).default(0),
        DATABASE_AUTOLOADENTITIES: Joi.number().min(0).max(1).default(0),
      }),
    }),

    // TypeOrmModule.forRoot({
    //   type: process.env.DATABASE_TYPE as 'postgres',
    //   host: process.env.DATABASE_HOST,
    //   port: Number(process.env.DATABASE_PORT),
    //   username: process.env.DATABASE_USERNAME,
    //   password: process.env.DATABASE_PASSWORD,
    //   database: process.env.DATABASE_DATABASE,
    //   autoLoadEntities: Boolean(process.env.DATABASE_TYPE), // Carrega entidades sem precisar especifica-las
    //   synchronize: Boolean(process.env.DATABASE_TYPE), // Sincroniza com o BD. Não usar em prod
    // }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get('database.type') as 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        // database: configService.get('database.database'),
        autoLoadEntities: Boolean(
          configService.get('database.autoLoadEntities'),
        ),
        synchronize: Boolean(configService.get('database.synchronize')),
      }),
    }),
    RecadosModule,
    PessoasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
