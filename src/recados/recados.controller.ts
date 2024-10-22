import { Controller, Get, Param } from '@nestjs/common';

@Controller('recados')
export class RecadosController {
  // Encontrar todos os recados
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
}
