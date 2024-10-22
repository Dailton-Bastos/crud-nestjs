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
  // Encontrar todos os recados
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() pagination: any): string {
    const { limit = 10, offset = 0 } = pagination;
    return `Retorna todos os recados. Limit=${limit}, Offset=${offset}`;
  }

  // Encontra um recado por id
  @Get(':id')
  findOne(@Param('id') id: string): string {
    console.log(id);
    return `Essa rota retorna o recado ID ${id}`;
  }

  @Post()
  create(@Body() body: any) {
    return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return {
      id,
      ...body,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Essa rota APAGAR um recado ID ${id}`;
  }
}
