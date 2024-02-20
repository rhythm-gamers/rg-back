import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WinstonModule } from "nest-winston";
import { loggerConfig } from "./logger/logger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(
      loggerConfig
    )
  });
  await app.listen(3000);
}
bootstrap();
