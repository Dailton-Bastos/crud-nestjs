import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadoEntity } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/auth.token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
// import { RoutePolicyGuard } from 'src/auth/route-policy.guard';
// import { ROUTE_POLICY_KEY } from 'src/auth/auth.constants';

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
  @Get()
  // @SetRoutePolicy(RoutePolicies.findAllRecados)
  findAll(
    @Query() paginationDto: PaginationDto,
    // @UrlParam() url: string,
  ): Promise<RecadoEntity[]> {
    return this.recadosService.findAll(paginationDto);
  }

  // Encontra um recado por id
  @Get(':id')
  findOne(@Param('id') id: number): Promise<RecadoEntity | void> {
    return this.recadosService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  // @SetRoutePolicy(RoutePolicies.createRecado)
  @Post()
  create(
    @Body() createRecadoDto: CreateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.create(createRecadoDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  // @SetRoutePolicy(RoutePolicies.updatePessoa)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRecadoDto: UpdateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ): Promise<RecadoEntity | void> {
    return this.recadosService.update(id, updateRecadoDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  // @SetRoutePolicy(RoutePolicies.deleteRecado)
  @Delete(':id')
  remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ): Promise<RecadoEntity | void> {
    return this.recadosService.remove(id, tokenPayload);
  }
}
