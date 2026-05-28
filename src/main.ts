import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('Food Recipe API')
  .setDescription(
    'API documentation for Food Recipe App',
  )
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(
  app,
  config,
);

SwaggerModule.setup(
  'api/docs',
  app,
  document,
);

await app.listen(process.env.PORT ?? 3000);

}

bootstrap();
