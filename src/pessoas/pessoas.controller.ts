import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { SERVER_NAME } from 'src/common/constants/server-name.constant';
// import { RecadosUtils } from 'src/recados/recados.utils';

@Controller('pessoas')
export class PessoasController {
  constructor(
    private readonly pessoasService: PessoasService,
    // private readonly recadosUtils: RecadosUtils,
    @Inject(SERVER_NAME)
    private readonly nomeDaVariavel: string,
  ) {}

  @Post()
  create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.pessoasService.create(createPessoaDto);
  }

  @Get()
  findAll() {
    // this.recadosUtils.inverteString('PessoasController');
    console.log(this.nomeDaVariavel);
    return this.pessoasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pessoasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePessoaDto: UpdatePessoaDto) {
    return this.pessoasService.update(id, updatePessoaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pessoasService.remove(+id);
  }
}
