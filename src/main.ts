import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";

import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { JwtService } from "@nestjs/jwt";
import { TokenGuard } from "./token/token.guard";

import { winstonLogger } from "./config/logger.config";
import { setupSwagger } from "./config/swagger.config";
import { json } from "express";

async function bootstrap() {
  const isDevelope = process.env.IS_DEVELOPE === "dev" ? true : false;
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: winstonLogger,
  });
  app.use(cookieParser());
  app.enableCors({
    origin: "*",
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
  app.use(json({ limit: "50mb" })); // post시 받아오는 body의 최대 크기

  if (isDevelope) {
    setupSwagger(app);
  }
  await app.listen(3000);
}
bootstrap();
