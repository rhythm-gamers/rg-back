import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { WinstonModule } from "nest-winston";
import { loggerConfig } from "./logger/logger.config";
import { ExampleLoggerModule } from './example-logger/example-logger.module';

@Module({
  imports: [
    AuthModule,
    WinstonModule.forRoot(
      loggerConfig
    ),
    ExampleLoggerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
