import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadoEntity } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';

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
  constructor(private readonly recadosService: RecadosService) {}
  // Encontrar todos os recados
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(): Promise<RecadoEntity[]> {
    return this.recadosService.findAll();
  }

  // Encontra um recado por id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<RecadoEntity | void> {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() createRecadoDto: CreateRecadoDto): Promise<RecadoEntity> {
    return this.recadosService.create(createRecadoDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecadoDto: UpdateRecadoDto,
  ): RecadoEntity | void {
    return this.recadosService.update(id, updateRecadoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<RecadoEntity | void> {
    return this.recadosService.remove(id);
  }
}
