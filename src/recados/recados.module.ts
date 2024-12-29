import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecadoEntity } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils } from './recados.utils';
import { RegexFactory } from 'src/common/regex/regex.factory';
import { ConfigModule } from '@nestjs/config';
import recadosConfig from './recados.config';

@Module({
  imports: [
    ConfigModule.forFeature(recadosConfig),
    TypeOrmModule.forFeature([RecadoEntity]),
    forwardRef(() => PessoasModule),
  ],
  exports: [RecadosUtils],
  controllers: [RecadosController],
  providers: [RecadosService, RecadosUtils, RegexFactory],
})
export class RecadosModule {}
