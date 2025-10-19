import { HashingService } from 'src/auth/hashing/hashing.service';
import { PessoaEntity } from './entities/pessoa.entity';
import { PessoasService } from './pessoas.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { ConflictException } from '@nestjs/common';

describe('PessoasService', () => {
  let pessoasService: PessoasService;
  let pessoaRepository: Repository<PessoaEntity>;
  let hashingService: HashingService;

  beforeEach(async () => {
    // Isso será executado antes de cada teste
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoasService,
        {
          provide: getRepositoryToken(PessoaEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn(),
          },
        },
      ],
    }).compile();

    pessoasService = module.get<PessoasService>(PessoasService);
    pessoaRepository = module.get<Repository<PessoaEntity>>(
      getRepositoryToken(PessoaEntity),
    );
    hashingService = module.get<HashingService>(HashingService);
  });

  it('PessoasService deve estar definido', () => {
    expect(pessoasService).toBeDefined();
  });

  it('pessoaRepository deve estar definido', () => {
    expect(pessoaRepository).toBeDefined();
  });

  it('hashingService deve estar definido', () => {
    expect(hashingService).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma pessoa', async () => {
      // Arrange
      // CreatePessoaDto
      const createPessoaDto: CreatePessoaDto = {
        email: 'teste@teste.com',
        nome: 'Teste',
        password: '123456',
      };

      const passwordHash = 'hash-teste';
      const novaPessoa = {
        id: 1,
        nome: createPessoaDto.nome,
        passwordHash,
        email: createPessoaDto.email,
      };

      // Como a pessoa retornada por pessoaRepository.create é necessária em
      // pessoaRepository.save. Vamos simular este valor.
      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
      jest
        .spyOn(pessoaRepository, 'create')
        .mockReturnValue(novaPessoa as PessoaEntity);

      // Act
      const result = await pessoasService.create(createPessoaDto);

      // Assert
      // O método hashingService.hash foi chamado com createPessoaDto.password?
      expect(hashingService.hash).toHaveBeenCalledWith(
        createPessoaDto.password,
      );

      // O método pessoaRepository.create foi chamado com os dados da nova
      // pessoa com o hash de senha gerado por hashingService.hash?
      expect(pessoaRepository.create).toHaveBeenCalledWith({
        nome: createPessoaDto.nome,
        passwordHash,
        email: createPessoaDto.email,
      });
      // O método pessoaRepository.save foi chamado com os dados da nova
      // pessoa gerada por pessoaRepository.create?
      expect(pessoaRepository.save).toHaveBeenCalledWith(novaPessoa);

      // O resultado do método pessoaService.create retornou a nova
      // pessoa criada?
      expect(result).toEqual(novaPessoa);
    });

    it('deve lançar ConflictException se o e-mail já estiver cadastrado', async () => {
      jest.spyOn(pessoaRepository, 'save').mockRejectedValue({ code: '23505' });

      const createPessoaDto: CreatePessoaDto = {
        email: 'teste@teste.com',
        nome: 'Teste',
        password: '123456',
      };

      await expect(pessoasService.create(createPessoaDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve lançar Error se ocorrer um erro desconhecido', async () => {
      jest
        .spyOn(pessoaRepository, 'save')
        .mockRejectedValue(new Error('Erro desconhecido'));

      await expect(
        pessoasService.create({} as CreatePessoaDto),
      ).rejects.toThrow(new Error('Erro desconhecido'));
    });
  });
});
