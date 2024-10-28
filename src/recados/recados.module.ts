import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecadoEntity } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils, RecadosUtilsMock } from './recados.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecadoEntity]),
    forwardRef(() => PessoasModule),
  ],
  exports: [
    {
      provide: RecadosUtils,
      useClass: RecadosUtils,
    },
  ],
  controllers: [RecadosController],
  providers: [
    RecadosService,
    {
      provide: RecadosUtils, // Token
      // useClass: RecadosUtils, // Classe usada
      useValue: new RecadosUtilsMock(), // Valor usado
    },
  ],
})
export class RecadosModule {}
