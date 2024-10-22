import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

@Controller('recados')
export class RecadosController {
  // Encontrar todos os recados
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(): string {
    return 'Essa rota retorna todos os recados';
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
}
