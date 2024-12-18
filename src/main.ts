import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // agregamos el prefijo 'api' en el endpoint http://localhost:3000/api/users
  app.setGlobalPrefix('api');

  //habilitamos las validaciones
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // transformar datos a sus tipos correspondientes
    whitelist: true, // elimina propiedades no especificadas en dto
    forbidNonWhitelisted: true // lanza un error si hay propiedades no permitidas
  }))

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
