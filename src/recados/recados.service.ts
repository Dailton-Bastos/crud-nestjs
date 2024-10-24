import { Injectable, NotFoundException } from '@nestjs/common';
import { RecadoEntity } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(RecadoEntity)
    private readonly recadoRepository: Repository<RecadoEntity>,
  ) {}

  private lastId = 1;
  private recados: RecadoEntity[] = [
    {
      id: 1,
      texto: 'Este é um recado de teste',
      de: 'João',
      para: 'Maria',
      lido: false,
      data: new Date(),
    },
  ];

  throwNotFoundError() {
    throw new NotFoundException('Recado não encontrado');
  }

  findAll() {
    return this.recadoRepository.find();
  }

  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: { id },
    });
    // const recado = this.recados.find((item) => item.id === +id);

    if (recado) return recado;

    // throw new HttpException('Recado não encontrado', HttpStatus.NOT_FOUND);

    return this.throwNotFoundError();
  }

  async create(createRecadoDto: CreateRecadoDto) {
    // this.lastId++;
    // const id = this.lastId;

    const novoRecado = {
      // id,
      lido: false,
      data: new Date(),
      ...createRecadoDto,
    };

    // this.recados.push(novoRecado);

    const recado = this.recadoRepository.create(novoRecado);

    return this.recadoRepository.save(recado);
  }

  update(id: string, updateRecadoDto: UpdateRecadoDto) {
    const recadoExistenteIndex = this.recados.findIndex(
      (item) => item.id === +id,
    );

    if (recadoExistenteIndex < 0) {
      return this.throwNotFoundError();
    }

    const recadoExistente = this.recados[recadoExistenteIndex];

    this.recados[recadoExistenteIndex] = {
      ...recadoExistente,
      ...updateRecadoDto,
    };

    return this.recados[recadoExistenteIndex];
  }

  async remove(id: number) {
    const recado = await this.recadoRepository.findOneBy({ id });

    if (!recado) return this.throwNotFoundError();

    return this.recadoRepository.remove(recado);
  }
}
