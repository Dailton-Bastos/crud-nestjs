import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module'; // Módulo raiz
import { ValidationPipe } from '@nestjs/common';
import { ParseIntIdPipe } from './common/pipes/parse-int-id.pipe';
// import { MyExceptionFilter } from './common/filters/my-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove chaves que não estão no DTO
      forbidNonWhitelisted: true, // levantar erro quando a chave não existir
      transform: false, // tenta transformar os tipos de dados de params e dtos
    }),
    new ParseIntIdPipe(),
  );

  // app.useGlobalFilters(new MyExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
