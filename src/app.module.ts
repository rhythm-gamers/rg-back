import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { WinstonModule } from "nest-winston";
import { loggerConfig } from "./config/logger.config";
import { ExampleLoggerModule } from './example-logger/example-logger.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConnection } from "./config/typeorm.config";

@Module({
  imports: [
    AuthModule,
    WinstonModule.forRoot( loggerConfig ),
    TypeOrmModule.forRoot( databaseConnection ),
    ExampleLoggerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
