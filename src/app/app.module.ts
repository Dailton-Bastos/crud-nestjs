import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import globalConfig from 'src/global-config/global.config';
import { GlobalConfigModule } from 'src/global-config/global-config.module';

@Module({
  imports: [
    ConfigModule.forFeature(globalConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(globalConfig)],
      inject: [globalConfig.KEY],
      useFactory: async (
        globalConfigurations: ConfigType<typeof globalConfig>,
      ) => ({
        type: globalConfigurations.database.type as 'postgres',
        host: globalConfigurations.database.host,
        port: globalConfigurations.database.port,
        username: globalConfigurations.database.username,
        password: globalConfigurations.database.password,
        // database: configService.get('database.database'),
        autoLoadEntities: globalConfigurations.database.autoLoadEntities,
        synchronize: globalConfigurations.database.synchronize,
      }),
    }),
    RecadosModule,
    PessoasModule,
    GlobalConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
