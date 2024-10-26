import {
  BadRequestException,
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
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadoEntity } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenInterceptor } from 'src/common/interceptors/auth-token.interceptor';
import { Request } from 'express';
// import { ChangeDataInterceptor } from 'src/common/interceptors/change-data.interceptor';
// import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';

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
// @UsePipes(ParseIntIdPipe)
@UseInterceptors(AuthTokenInterceptor)
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}
  // Encontrar todos os recados
  @HttpCode(HttpStatus.OK)
  @Get()
  // @UseInterceptors(AddHeaderInterceptor)
  // @UseInterceptors(TimingConnectionInterceptor, ErrorHandlingInterceptor)
  findAll(
    @Query() paginationDto: PaginationDto,
    @Req() req: Request,
  ): Promise<RecadoEntity[]> {
    // throw new Error('ErrorExceptionFilter');
    throw new BadRequestException('Erro');
    // return this.recadosService.findAll(paginationDto);
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
