import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: async (appConfigurations: ConfigType<typeof appConfig>) => ({
        type: appConfigurations.database.type as 'postgres',
        host: appConfigurations.database.host,
        port: appConfigurations.database.port,
        username: appConfigurations.database.username,
        password: appConfigurations.database.password,
        // database: configService.get('database.database'),
        autoLoadEntities: appConfigurations.database.autoLoadEntities,
        synchronize: appConfigurations.database.synchronize,
      }),
    }),
    RecadosModule,
    PessoasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
