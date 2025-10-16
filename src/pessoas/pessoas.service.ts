import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { PessoaEntity } from './entities/pessoa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { resolve, extname } from 'node:path';
import { writeFile } from 'node:fs/promises';

@Injectable({ scope: Scope.DEFAULT })
export class PessoasService {
  private count = 0;

  constructor(
    @InjectRepository(PessoaEntity)
    private readonly pessoaRepository: Repository<PessoaEntity>,
    private readonly hashingService: HashingService,
  ) {
    this.count++;
    console.log('PessoasService criado', this.count);
  }

  async create(createPessoaDto: CreatePessoaDto): Promise<PessoaEntity | void> {
    try {
      const passwordHash = await this.hashingService.hash(
        createPessoaDto.password,
      );

      const dadosPessoa = {
        nome: createPessoaDto.nome,
        passwordHash,
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

  async findOne(id: number): Promise<PessoaEntity> {
    this.count++;
    console.log('PessoasService.findOne', this.count);
    const pessoa = await this.pessoaRepository.findOne({ where: { id } });

    if (pessoa) return pessoa;

    throw new NotFoundException('Pessoa não encontrada');
  }

  async update(
    id: number,
    updatePessoaDto: UpdatePessoaDto,
    tokenPayload: TokenPayloadDto,
  ): Promise<PessoaEntity> {
    if (updatePessoaDto?.password) {
      const passwordHash = await this.hashingService.hash(
        updatePessoaDto.password,
      );

      updatePessoaDto.password = passwordHash;
    }

    const partialUpdatePessoaDto = {
      passwordHash: updatePessoaDto.password,
      nome: updatePessoaDto.nome,
    };

    const pessoa = await this.pessoaRepository.preload({
      id,
      ...partialUpdatePessoaDto,
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    if (pessoa.id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não é essa pessoa');
    }

    return this.pessoaRepository.save(pessoa);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto): Promise<void> {
    const pessoa = await this.pessoaRepository.findOneBy({ id });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    if (pessoa.id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não é essa pessoa');
    }

    await this.pessoaRepository.remove(pessoa);
  }

  async uploadPicture(
    file: Express.Multer.File,
    tokenPayload: TokenPayloadDto,
  ) {
    if (file.size < 1024) {
      throw new BadRequestException('File too small');
    }

    const pessoa = await this.findOne(tokenPayload.sub);

    const fileExtension = extname(file.originalname).toLowerCase().substring(1);
    const fileName = `${tokenPayload.sub}.${fileExtension}`;
    const fileFullPath = resolve(process.cwd(), 'pictures', fileName);

    await writeFile(fileFullPath, file.buffer);

    pessoa.picture = fileName;

    await this.pessoaRepository.save(pessoa);

    return pessoa;
  }
}
