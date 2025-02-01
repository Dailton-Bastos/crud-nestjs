import {
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRecadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  readonly texto: string;

  @IsPositive()
  paraId: number;

  // @IsString()
  // @IsNotEmpty()
  // @MinLength(2)
  // @MaxLength(50)
  // readonly de: string;

  // @IsString()
  // @IsNotEmpty()
  // @MinLength(2)
  // @MaxLength(50)
  // readonly para: string;
}
