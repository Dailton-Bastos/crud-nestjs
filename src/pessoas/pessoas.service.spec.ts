import { HashingService } from 'src/auth/hashing/hashing.service';
import { PessoaEntity } from './entities/pessoa.entity';
import { PessoasService } from './pessoas.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePessoaDto } from './dto/create-pessoa.dto';

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

      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);

      // Act
      await pessoasService.create(createPessoaDto);

      // Assert
      expect(hashingService.hash).toHaveBeenCalledWith(
        createPessoaDto.password,
      );

      expect(pessoaRepository.create).toHaveBeenCalledWith({
        nome: createPessoaDto.nome,
        passwordHash: passwordHash,
        email: createPessoaDto.email,
      });
    });
  });
});
``;
