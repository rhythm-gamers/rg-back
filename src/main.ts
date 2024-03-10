import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './config/logger.config';
import { setupSwagger } from './config/swagger.config';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });
  app.enableCors();
  app.use(json({ limit: '50mb' })); // post시 받아오는 body의 최대 크기

  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
