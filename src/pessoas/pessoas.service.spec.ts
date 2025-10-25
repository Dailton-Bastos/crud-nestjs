import { HashingService } from 'src/auth/hashing/hashing.service';
import { PessoaEntity } from './entities/pessoa.entity';
import { PessoasService } from './pessoas.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';

jest.mock('node:fs/promises', () => ({
  writeFile: jest.fn(),
}));

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
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
            findOneBy: jest.fn(),
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

  describe('findOne', () => {
    it('deve retornar uma pessoa se encontrada', async () => {
      const id = 1;
      const pessoa = {
        id,
        nome: 'Teste',
        email: 'teste@teste.com',
        passwordHash: 'hash-teste',
      };

      jest
        .spyOn(pessoaRepository, 'findOne')
        .mockResolvedValue(pessoa as PessoaEntity);

      const result = await pessoasService.findOne(id);

      expect(pessoaRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(pessoa);
    });

    it('deve lançar NotFoundException se a pessoa não for encontrada', async () => {
      const id = 1;
      // Arrange
      // Como a pessoaRepository.findOne retorna null, vamos simular este valor.
      jest.spyOn(pessoaRepository, 'findOne').mockResolvedValue(null);

      // Act
      await expect(pessoasService.findOne(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as pessoas', async () => {
      const pessoas: PessoaEntity[] = [
        {
          id: 1,
          nome: 'Teste',
          email: 'teste@teste.com',
          passwordHash: 'hash-teste',
        } as PessoaEntity,
      ];

      // Arrange
      jest.spyOn(pessoaRepository, 'find').mockResolvedValue(pessoas);
      // Act
      const result = await pessoasService.findAll();
      // Assert
      // O método pessoaRepository.find foi chamado?
      expect(pessoaRepository.find).toHaveBeenCalledWith({
        order: { id: 'DESC' },
      });
      // O resultado do método pessoaService.findAll retornou todas as pessoas?
      expect(result).toEqual(pessoas);
    });
  });

  describe('update', () => {
    it('deve atualizar uma pessoa se for autorizada', async () => {
      // Arrange
      const id = 1;
      const updatePessoaDto: UpdatePessoaDto = {
        nome: 'Teste',
        password: '123456',
      };
      const passwordHash = 'hash-teste';
      const pessoaAtualizada = {
        id,
        nome: updatePessoaDto.nome,
        passwordHash,
      } as PessoaEntity;

      const tokenPayload: TokenPayloadDto = {
        sub: id,
        email: updatePessoaDto.email,
        iat: 1,
        exp: 1,
        aud: 'teste',
        iss: 'teste',
      };

      jest
        .spyOn(hashingService, 'hash')
        .mockResolvedValue(updatePessoaDto.password);

      jest
        .spyOn(pessoaRepository, 'preload')
        .mockResolvedValue(pessoaAtualizada);

      jest.spyOn(pessoaRepository, 'save').mockResolvedValue(pessoaAtualizada);

      // Act
      const result = await pessoasService.update(
        id,
        updatePessoaDto,
        tokenPayload,
      );

      // Assert
      // O método hashingService.hash foi chamado com updatePessoaDto.password?
      expect(hashingService.hash).toHaveBeenCalledWith(
        updatePessoaDto.password,
      );
      // O método pessoaRepository.preload foi chamado com os dados da pessoa?
      expect(pessoaRepository.preload).toHaveBeenCalledWith({
        id,
        nome: updatePessoaDto.nome,
        passwordHash: updatePessoaDto.password,
      });
      // O método pessoaRepository.save foi chamado com os dados da pessoa?
      expect(pessoaRepository.save).toHaveBeenCalledWith(pessoaAtualizada);
      // O resultado do método pessoaService.update retornou a pessoa atualizada?
      expect(result).toEqual(pessoaAtualizada);
    });

    it('deve lançar ForbiddenException se a pessoa não for autorizada', async () => {
      // Arrange
      const id = 1;
      const updatePessoaDto: UpdatePessoaDto = {
        nome: 'Teste',
      };
      const tokenPayload: TokenPayloadDto = {
        sub: 2,
        email: 'teste@teste.com',
        iat: 1,
        exp: 1,
        aud: 'teste',
        iss: 'teste',
      };
      const pessoa = {
        id,
        nome: updatePessoaDto.nome,
        email: 'teste@teste.com',
        passwordHash: 'hash-teste',
      } as PessoaEntity;

      jest.spyOn(pessoaRepository, 'preload').mockResolvedValue(pessoa);

      // Act
      await expect(
        pessoasService.update(id, updatePessoaDto, tokenPayload),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar NotFoundException se a pessoa não for encontrada', async () => {
      // Arrange
      const id = 1;
      const updatePessoaDto: UpdatePessoaDto = {
        nome: 'Teste',
      };
      const tokenPayload: TokenPayloadDto = {
        sub: id,
        email: 'teste@teste.com',
        iat: 1,
        exp: 1,
        aud: 'teste',
        iss: 'teste',
      };

      jest.spyOn(pessoaRepository, 'preload').mockResolvedValue(null);

      // Act
      await expect(
        pessoasService.update(id, updatePessoaDto, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover uma pessoa se for autorizada', async () => {
      // Arrange
      const id = 1;
      const tokenPayload: TokenPayloadDto = {
        sub: id,
        email: 'teste@teste.com',
        iat: 1,
        exp: 1,
        aud: 'teste',
        iss: 'teste',
      };
      const pessoa = {
        id,
        nome: 'Teste',
        email: 'teste@teste.com',
        passwordHash: 'hash-teste',
      } as PessoaEntity;

      // O método findOneBy do repositório vai retornar a pessoa existente
      jest.spyOn(pessoasService, 'findOne').mockResolvedValue(pessoa);

      // O método remove do repositório vai remover a pessoa existente
      jest.spyOn(pessoaRepository, 'remove').mockResolvedValue(pessoa);

      // Act
      const result = await pessoasService.remove(id, tokenPayload);

      // Assert
      // Espero que findOne do service seja chamado com o ID da pessoa
      expect(pessoasService.findOne).toHaveBeenCalledWith(id);

      // Espero que remove do repositório seja chamado com a pessoa existente
      expect(pessoaRepository.remove).toHaveBeenCalledWith(pessoa);

      // Espero que o resultado do método remove do pessoaService seja retornado
      expect(result).toEqual(pessoa);
    });

    it('deve lançar NotFoundException se a pessoa não for encontrada', async () => {
      // Arrange
      const id = 1;
      const tokenPayload: TokenPayloadDto = {
        sub: id,
        email: 'teste@teste.com',
        iat: 1,
        exp: 1,
        aud: 'teste',
        iss: 'teste',
      };

      // Espero que o findOne seja chamado com pessoa existente
      jest
        .spyOn(pessoasService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      // Espero que o servico rejeite porque o usuário é diferente da pessoa
      await expect(pessoasService.remove(id, tokenPayload)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar ForbiddenException se a pessoa não for autorizada', async () => {
      // Arrange
      const id = 1;
      const tokenPayload: TokenPayloadDto = {
        sub: 2,
        email: 'teste@teste.com',
        iat: 1,
        exp: 1,
        aud: 'teste',
        iss: 'teste',
      };
      const pessoa = {
        id,
        nome: 'Teste',
        email: 'teste@teste.com',
        passwordHash: 'hash-teste',
      } as PessoaEntity;

      jest.spyOn(pessoasService, 'findOne').mockResolvedValue(pessoa);

      // Act
      await expect(pessoasService.remove(id, tokenPayload)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('uploadPicture', () => {
    it('deve salvar a imagem corretamente e atualizar a pessoa', async () => {
      // Arrange
      const file = {
        originalname: 'teste.jpg',
        buffer: Buffer.from('file content'),
        size: 2000,
      } as Express.Multer.File;

      const tokenPayload: TokenPayloadDto = {
        sub: 12,
        email: 'teste@teste.com',
        iat: 1,
        exp: 1,
        aud: 'teste',
        iss: 'teste',
      };
      const pessoa = {
        id: 1,
        nome: 'Teste',
        email: 'teste@teste.com',
        passwordHash: 'hash-teste',
        picture: null,
      } as PessoaEntity;

      jest.spyOn(pessoasService, 'findOne').mockResolvedValue(pessoa);
      jest.spyOn(pessoaRepository, 'save').mockResolvedValue(pessoa);

      const fileFullPath = resolve(process.cwd(), 'pictures', '12.jpg');

      // Act
      const result = await pessoasService.uploadPicture(file, tokenPayload);

      // Assert
      expect(pessoasService.findOne).toHaveBeenCalledWith(tokenPayload.sub);
      expect(writeFile).toHaveBeenCalledWith(fileFullPath, file.buffer);
      expect(pessoaRepository.save).toHaveBeenCalledWith({
        ...pessoa,
        picture: '12.jpg',
      });
      expect(result).toEqual({
        ...pessoa,
        picture: '12.jpg',
      });
    });

    it('deve lançar BadRequestException se o arquivo for muito pequeno', async () => {
      // Arrange
      const file = {
        originalname: 'teste.jpg',
        buffer: Buffer.from('file content'),
        size: 1023,
      } as Express.Multer.File;

      const tokenPayload: TokenPayloadDto = {
        sub: 1,
        email: 'teste@teste.com',
        iat: 1,
        exp: 1,
        aud: 'teste',
        iss: 'teste',
      };

      await expect(
        pessoasService.uploadPicture(file, tokenPayload),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar NotFoundException se a pessoa não for encontrada', async () => {
      // Arrange
      const file = {
        originalname: 'teste.jpg',
        buffer: Buffer.from('file content'),
        size: 2000,
      } as Express.Multer.File;

      const tokenPayload: TokenPayloadDto = {
        sub: 1,
        email: 'teste@teste.com',
        iat: 1,
        exp: 1,
        aud: 'teste',
        iss: 'teste',
      };

      jest
        .spyOn(pessoasService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      // Act
      await expect(
        pessoasService.uploadPicture(file, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
