import { registerAs } from '@nestjs/config';

export default registerAs('recados', () => ({
  teste: 'teste',
  teste2: 'teste 2',
}));
