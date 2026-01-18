import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });

  const config = new DocumentBuilder()
    .setTitle('Serverless Questions API')
    .setDescription('API para processamento e consulta de questões')
    .setVersion('1.0')
    .addTag('questions', 'Operações relacionadas a questões')
    .addTag('health', 'Verificação de saúde da API')
    .addTag('auth', 'Operações de autenticação e autorização')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Scalar API Reference (interface moderna)
  app.use(
    '/api',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'default',
    }),
  );

  // Swagger UI (alternativa tradicional)
  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(3000);
}

bootstrap();
