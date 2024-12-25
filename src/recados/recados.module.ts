import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecadoEntity } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils } from './recados.utils';
import { RegexFactory } from 'src/common/regex/regex.factory';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
} from './recados.constant';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecadoEntity]),
    forwardRef(() => PessoasModule),
  ],
  exports: [RecadosUtils],
  controllers: [RecadosController],
  providers: [
    RecadosService,
    RecadosUtils,
    RegexFactory,
    {
      provide: REMOVE_SPACES_REGEX,
      useFactory: (regexFactory: RegexFactory) => {
        // Meu código/lógica
        return regexFactory.create('RemoveSpacesRegex');
        // return new RemoveSpacesRegex();
      }, // Factory
      inject: [RegexFactory], // Injetando na factory na ordem
    },
    {
      provide: ONLY_LOWERCASE_LETTERS_REGEX,
      useFactory: async (regexFactory: RegexFactory) => {
        console.log('Aguardando 3 segundos...');
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log('Passaram-se 3 segundos!');
        // Meu código/lógica
        return regexFactory.create('OnlyLowercaseLettersRegex');
      }, // Factory
      inject: [RegexFactory], // Injetando na factory na ordem
    },
  ],
})
export class RecadosModule {}
