import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePessoaDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  nome: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
