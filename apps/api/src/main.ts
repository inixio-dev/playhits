/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

import {readFileSync, existsSync} from 'fs';

async function bootstrap() {
  let app = null;
  if (existsSync('/etc/letsencrypt/live/playhits.inixio.dev/fullchain.pem') && existsSync('/etc/letsencrypt/live/playhits.inixio.dev/privkey.pem')) {
    const httpsOptions = {
      key: readFileSync('/etc/letsencrypt/live/playhits.inixio.dev/privkey.pem'),
      cert: readFileSync('/etc/letsencrypt/live/playhits.inixio.dev/fullchain.pem'),
    };
    app = await NestFactory.create(AppModule, {
      httpsOptions
    });
  } else {
    app = await NestFactory.create(AppModule);
  }
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  const config = new DocumentBuilder()
    .setTitle('Play Hits! API')
    .setDescription('Play Hits! API description')
    .setVersion('0.1.0 - Proof of Concept')
    .setContact('Inixio Amillano Casteig', 'https://inixio.dev', 'inixio.amillano@inixio.dev')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
