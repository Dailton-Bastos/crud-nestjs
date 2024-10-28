import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecadoEntity } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils, RecadosUtilsMock } from './recados.utils';
import { SERVER_NAME } from 'src/common/constants/server-name.constant';

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
    SERVER_NAME,
  ],
  controllers: [RecadosController],
  providers: [
    RecadosService,
    {
      provide: RecadosUtils, // Token
      // useClass: RecadosUtils, // Classe usada
      useValue: new RecadosUtilsMock(), // Valor usado
    },
    {
      provide: SERVER_NAME,
      useValue: 'My name is NestJS',
    },
  ],
})
export class RecadosModule {}
