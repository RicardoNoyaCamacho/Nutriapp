import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      // Ignora propiedades que no estan en el DTO
      whitelist: true,
      // Lanza errores si ay propiedades no permitidas 
      forbidNonWhitelisted: true,
      // Transforma los datos de entrada al tipo DTO
      transform: true
    })
  )

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
