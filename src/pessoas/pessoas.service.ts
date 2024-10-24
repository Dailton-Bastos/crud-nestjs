import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { PessoaEntity } from './entities/pessoa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(PessoaEntity)
    private readonly pessoaRepository: Repository<PessoaEntity>,
  ) {}

  async create(createPessoaDto: CreatePessoaDto): Promise<PessoaEntity | void> {
    try {
      const dadosPessoa = {
        nome: createPessoaDto.nome,
        passwordHash: createPessoaDto.password,
        email: createPessoaDto.email,
      };

      const novaPessoa = this.pessoaRepository.create(dadosPessoa);

      await this.pessoaRepository.save(novaPessoa);

      return novaPessoa;
    } catch (error) {
      if (error?.code === '23505') {
        throw new ConflictException('E-mail já está cadastrado');
      }

      throw error;
    }
  }

  findAll(): Promise<PessoaEntity[] | void> {
    return this.pessoaRepository.find({
      order: { id: 'DESC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} pessoa`;
  }

  update(id: number, updatePessoaDto: UpdatePessoaDto) {
    return `This action updates a #${id} pessoa`;
  }

  async remove(id: number): Promise<void> {
    const pessoa = await this.pessoaRepository.findOneBy({ id });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    await this.pessoaRepository.remove(pessoa);
  }
}
