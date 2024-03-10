import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './config/logger.config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { JwtService } from '@nestjs/jwt';
import { TokenGuard } from './token/token.guard';
import { setupSwagger } from './config/swagger.config';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });
  app.use(cookieParser());
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new TokenGuard(jwtService, reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(json({ limit: '50mb' })); // post시 받아오는 body의 최대 크기

  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
