import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { PessoaEntity } from './entities/pessoa.entity';
import { PessoasController } from './pessoas.controller';
import { PessoasService } from './pessoas.service';
import { Request } from 'express';

describe('PessoasController', () => {
  let pessoasController: PessoasController;
  let pessoasService: PessoasService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    uploadPicture: jest.fn(),
  } as unknown as PessoasService;

  beforeEach(() => {
    pessoasController = new PessoasController(pessoasService);
  });

  it('pessoasController deve estar definido', () => {
    expect(pessoasController).toBeDefined();
  });

  it('create - deve chamar o metodo create do pessoasService', async () => {
    // Arrange
    const dto: CreatePessoaDto = {
      email: 'teste@teste.com',
      nome: 'Teste',
      password: '123456',
    };

    const pessoa: PessoaEntity = {
      id: 1,
      email: dto.email,
      nome: dto.nome,
      passwordHash: 'hash-teste',
    } as PessoaEntity;

    jest.spyOn(pessoasService, 'create').mockResolvedValue(pessoa);

    // Act
    const result = await pessoasController.create(dto);

    // Assert
    expect(pessoasService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(pessoa);
  });

  it('findAll - deve chamar o metodo findAll do pessoasService', async () => {
    // Arrange
    const pessoas: PessoaEntity[] = [
      {
        id: 1,
        email: 'teste@teste.com',
        nome: 'Teste',
        passwordHash: 'hash-teste',
      } as PessoaEntity,
    ];

    jest.spyOn(pessoasService, 'findAll').mockResolvedValue(pessoas);

    // Act
    const result = await pessoasController.findAll();

    // Assert
    expect(pessoasService.findAll).toHaveBeenCalled();
    expect(result).toEqual(pessoas);
  });

  it('findOne - deve chamar o metodo findOne do pessoasService', async () => {
    // Arrange
    const id = 1;
    const pessoa: PessoaEntity = {
      id,
      email: 'teste@teste.com',
      nome: 'Teste',
      passwordHash: 'hash-teste',
    } as PessoaEntity;

    jest.spyOn(pessoasService, 'findOne').mockResolvedValue(pessoa);

    // Act
    const result = await pessoasController.findOne(id);

    // Assert
    expect(pessoasService.findOne).toHaveBeenCalledWith(id);
    expect(result).toEqual(pessoa);
  });

  it('update - deve chamar o metodo update do pessoasService', async () => {
    // Arrange
    const id = 1;
    const updatePessoaDto: UpdatePessoaDto = {
      nome: 'Teste',
      password: '123456',
    };
    const pessoa: PessoaEntity = {
      id,
      email: 'teste@teste.com',
      nome: 'Teste',
      passwordHash: 'hash-teste',
    } as PessoaEntity;

    const tokenPayload: TokenPayloadDto = {
      sub: id,
      email: 'teste@teste.com',
      iat: 1,
      exp: 1,
      aud: 'teste',
      iss: 'teste',
    };

    jest.spyOn(pessoasService, 'update').mockResolvedValue(pessoa);

    // Act
    const result = await pessoasController.update(
      id,
      updatePessoaDto,
      tokenPayload,
    );

    // Assert
    expect(pessoasService.update).toHaveBeenCalledWith(
      id,
      updatePessoaDto,
      tokenPayload,
    );
    expect(result).toEqual(pessoa);
  });

  it('remove - deve chamar o metodo remove do pessoasService', async () => {
    // Arrange
    const id = 1;
    const pessoa: PessoaEntity = {
      id,
      email: 'teste@teste.com',
      nome: 'Teste',
      passwordHash: 'hash-teste',
    } as PessoaEntity;

    const tokenPayload: TokenPayloadDto = {
      sub: id,
      email: 'teste@teste.com',
      iat: 1,
      exp: 1,
      aud: 'teste',
      iss: 'teste',
    };

    jest.spyOn(pessoasService, 'remove').mockResolvedValue(pessoa);

    // Act
    const result = await pessoasController.remove(id.toString(), tokenPayload);

    // Assert
    expect(pessoasService.remove).toHaveBeenCalledWith(id, tokenPayload);
    expect(result).toEqual(pessoa);
  });

  it('uploadPicture - deve chamar o metodo uploadPicture do pessoasService', async () => {
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

    const pessoa: PessoaEntity = {
      id: 1,
      email: 'teste@teste.com',
      nome: 'Teste',
      passwordHash: 'hash-teste',
    } as PessoaEntity;

    jest.spyOn(pessoasService, 'uploadPicture').mockResolvedValue(pessoa);

    // Act
    const result = await pessoasController.uploadPicture(file, tokenPayload);

    // Assert
    expect(pessoasService.uploadPicture).toHaveBeenCalledWith(
      file,
      tokenPayload,
    );
    expect(result).toEqual(pessoa);
  });
});
