import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecadoEntity } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils } from './recados.utils';
import { RegexFactory } from 'src/common/regex/regex.factory';
import { MyDynamicModule } from 'src/my-dynamic/my-dynamic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecadoEntity]),
    forwardRef(() => PessoasModule),
    MyDynamicModule.register({
      apiKey: 'MY API KEY',
      apiUrl: 'MY API URL',
    }),
  ],
  exports: [RecadosUtils],
  controllers: [RecadosController],
  providers: [RecadosService, RecadosUtils, RegexFactory],
})
export class RecadosModule {}
