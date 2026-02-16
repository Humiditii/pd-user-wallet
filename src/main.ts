import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllGlobalExceptionsFilter } from '@common/filters/globalFilter.filters';

async function bootstrap() {
  const logger = new Logger('MAIN');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));

  app.useGlobalFilters(new AllGlobalExceptionsFilter());

  app.setGlobalPrefix('api');

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port, () =>
    logger.log(`App running on Port: ${port}`),
  );
}
bootstrap();
