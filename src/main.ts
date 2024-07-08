import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";

import { INestApplication, ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { TokenGuard } from "./token/token.guard";

import { winstonLogger } from "./config/logger.config";
import { setupSwagger } from "./config/swagger.config";
import { json } from "express";
import { RolesGuard } from "./token/roles.guard";
import { TokenService } from "./token/token.service";
import expressBasicAuth from "express-basic-auth";

function setSwaggerAuth(app: INestApplication) {
  app.use(
    ["/api"],
    expressBasicAuth({
      challenge: true,
      users: { [process.env.SWAGGER_ID]: process.env.SWAGGER_PASSWORD },
    }),
  );
}

async function bootstrap() {
  const isDevelope = process.env.IS_DEVELOPE === "dev" ? true : false;
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: winstonLogger,
  });
  if (isDevelope) {
  }
  app.use(cookieParser());
  app.enableCors({
    origin: "*",
    credentials: true,
  });
  const reflector = app.get(Reflector);
  const tokenService = app.get(TokenService);
  app.useGlobalGuards(
    new TokenGuard(reflector, tokenService),
    new RolesGuard(reflector),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(json({ limit: "50mb" })); // post시 받아오는 body의 최대 크기

  if (isDevelope) {
    setSwaggerAuth(app);
    setupSwagger(app);
  }
  await app.listen(3000);
}
bootstrap();
