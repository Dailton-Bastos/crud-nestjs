import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadoEntity } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RegexProtocol } from 'src/common/regex/regex.protocol';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
  SERVER_NAME,
} from './recados.constant';
// import { UrlParam } from 'src/common/params/url-param.decorator';

/* 
  CRUD
  Create -> POST -> Criar um recado
  Read -> GET -> Ler todos os recados
  Read -> GET -> Ler apenas um recado
  Update -> PATCH / PUT -> Atualizar um recado
  Delete -> DELETE -> Apagar um recado

  PATCH é utilizado para atualizar dados de um recurso
  PUT é utilizado para atualizar um recurso inteiro
*/

// DTO - Data Transfer Object -> Objeto de transferência de dados

@Controller('recados')
export class RecadosController {
  constructor(
    private readonly recadosService: RecadosService,
    @Inject(SERVER_NAME) // Token em provider
    private readonly serverName: string,
    @Inject(REMOVE_SPACES_REGEX)
    private readonly removeSpacesRegex: RegexProtocol,
    @Inject(ONLY_LOWERCASE_LETTERS_REGEX)
    private readonly onlyLowecaseLettersRegex: RegexProtocol,
  ) {}
  // Encontrar todos os recados
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    // @UrlParam() url: string,
  ): Promise<RecadoEntity[]> {
    console.log(this.removeSpacesRegex.execute(this.serverName));
    console.log(this.onlyLowecaseLettersRegex.execute(this.serverName));
    return this.recadosService.findAll(paginationDto);
  }

  // Encontra um recado por id
  @Get(':id')
  findOne(@Param('id') id: number): Promise<RecadoEntity | void> {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() createRecadoDto: CreateRecadoDto) {
    return this.recadosService.create(createRecadoDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRecadoDto: UpdateRecadoDto,
  ): Promise<RecadoEntity | void> {
    return this.recadosService.update(id, updateRecadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<RecadoEntity | void> {
    return this.recadosService.remove(id);
  }
}
