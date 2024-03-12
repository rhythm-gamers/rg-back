import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './config/logger.config';
import { setupSwagger } from './config/swagger.config';
import { json } from 'express';

async function bootstrap() {
  const isDevelope = process.env.IS_DEVELOPE === 'dev' ? true : false;
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: winstonLogger,
  });
  app.enableCors();
  app.use(json({ limit: '50mb' })); // post시 받아오는 body의 최대 크기

  if (isDevelope) {
    setupSwagger(app);
  }
  await app.listen(3000);
}
bootstrap();
