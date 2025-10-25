import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module'; // Módulo raiz
import appConfig from './app/config/app.config';
// import { IsAdminGuard } from './common/guards/is-admin.guard';
// import { MyExceptionFilter } from './common/filters/my-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appConfig(app);

  // app.useGlobalFilters(new MyExceptionFilter());
  // app.useGlobalGuards(new IsAdminGuard())

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
