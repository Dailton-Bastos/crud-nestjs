import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { RecadoEntity } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

// Scope.DEFAULT = O provider em questão é um singleton, ou seja, uma única instância é criada e compartilhada por todos os módulos que a importam
// Scope.REQUEST = Uma nova instância é criada para cada requisição HTTP
// Scope.TRANSIENT = Uma nova instância é criada a cada injeção

@Injectable({ scope: Scope.DEFAULT })
export class RecadosService {
  private count = 0;
  constructor(
    @InjectRepository(RecadoEntity)
    private readonly recadoRepository: Repository<RecadoEntity>,
    private readonly pessoasService: PessoasService,
  ) {
    this.count++;
    console.log('RecadosService criado', this.count);
  }

  throwNotFoundError() {
    throw new NotFoundException('Recado não encontrado');
  }

  findAll(paginationDto?: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    // console.log(this.recadosUtils.inverteString('Bastos'));

    return this.recadoRepository.find({
      take: limit, // quantos registros serão exibidos (por página)
      skip: offset, // quantos registros devem ser pulados
      relations: ['de', 'para'],
      order: { id: 'DESC' },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: { id },
      relations: ['de', 'para'],
      order: { id: 'DESC' },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
    // const recado = this.recados.find((item) => item.id === +id);

    if (recado) return recado;

    // throw new HttpException('Recado não encontrado', HttpStatus.NOT_FOUND);

    return this.throwNotFoundError();
  }

  async create(createRecadoDto: CreateRecadoDto) {
    const { deId, paraId } = createRecadoDto;

    // Encontrar a pessoa que está criando o recado
    const de = await this.pessoasService.findOne(deId);

    // Encontrar a pessoa para quem o recado está sendo enviado
    const para = await this.pessoasService.findOne(paraId);

    const novoRecado = {
      texto: createRecadoDto.texto,
      de,
      para,
      lido: false,
      data: new Date(),
    };

    // this.recados.push(novoRecado);

    const recado = this.recadoRepository.create(novoRecado);

    await this.recadoRepository.save(recado);

    return {
      ...recado,
      de: {
        id: recado.de.id,
      },
      para: {
        id: recado.para.id,
      },
    };
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto) {
    const recado = await this.findOne(id);

    if (!recado) return;

    recado.texto = updateRecadoDto?.texto ?? recado.texto;
    recado.lido = updateRecadoDto?.lido ?? recado.lido;

    await this.recadoRepository.save(recado);

    return recado;
  }

  async remove(id: number) {
    const recado = await this.recadoRepository.findOneBy({ id });

    if (!recado) return this.throwNotFoundError();

    return this.recadoRepository.remove(recado);
  }
}
