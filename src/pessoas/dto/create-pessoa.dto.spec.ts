import { validate } from 'class-validator';
import { CreatePessoaDto } from './create-pessoa.dto';

describe('CreatePessoaDto', () => {
  it('deve validar um DTO válido', async () => {
    // Arrange
    const dto = new CreatePessoaDto();
    dto.email = 'teste@teste.com';
    dto.nome = 'Teste';
    dto.password = '123456';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0); // Nenhum erro significa que o DTO é válido
  });

  it('deve falhar se o email não for um e-mail válido', async () => {
    // Arrange
    const dto = new CreatePessoaDto();
    dto.email = 'teste';
    dto.nome = 'Teste';
    dto.password = '123456';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints.isEmail).toBe('email must be an email');
  });

  it('deve falhar se o email for vazio', async () => {
    // Arrange
    const dto = new CreatePessoaDto();
    dto.email = '';
    dto.nome = 'Teste';
    dto.password = '123456';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints.isNotEmpty).toBe('email should not be empty');
  });

  it('deve falhar se a senha for muito curta', async () => {
    // Arrange
    const dto = new CreatePessoaDto();
    dto.email = 'teste@teste.com';
    dto.nome = 'Teste';
    dto.password = '123';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints.minLength).toBe(
      'password must be longer than or equal to 5 characters',
    );
  });

  it('deve falhar se o nome for vazio', async () => {
    // Arrange
    const dto = new CreatePessoaDto();
    dto.email = 'teste@teste.com';
    dto.nome = '';
    dto.password = '123456';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('nome');
    expect(errors[0].constraints.isNotEmpty).toBe('nome should not be empty');
  });

  it('deve falhar se o nome for muito longo', async () => {
    // Arrange
    const dto = new CreatePessoaDto();
    dto.email = 'teste@teste.com';
    dto.nome = 'a'.repeat(101);
    dto.password = '123456';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('nome');
    expect(errors[0].constraints.maxLength).toBe(
      'nome must be shorter than or equal to 100 characters',
    );
  });

  it('deve falhar se a senha for vazia', async () => {
    // Arrange
    const dto = new CreatePessoaDto();
    dto.email = 'teste@teste.com';
    dto.nome = 'Teste';
    dto.password = '';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints.isNotEmpty).toBe(
      'password should not be empty',
    );
  });
});
