import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadoEntity } from './entities/recado.entity';

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

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}
  // Encontrar todos os recados
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() pagination: any): RecadoEntity[] {
    return this.recadosService.findAll();
  }

  // Encontra um recado por id
  @Get(':id')
  findOne(@Param('id') id: string): RecadoEntity | void {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() body: any): RecadoEntity {
    return this.recadosService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any): RecadoEntity | void {
    return this.recadosService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): RecadoEntity | void {
    return this.recadosService.remove(id);
  }
}
