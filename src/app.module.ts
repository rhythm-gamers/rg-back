import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { WinstonModule } from "nest-winston";
import { loggerConfig } from "./config/logger.config";
import { ExampleLoggerModule } from "./example-logger/example-logger.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConnection } from "./config/typeorm.config";
import { UserModule } from "./user/user.module";
import { PatternModule } from "./pattern/pattern.module";
import { WikiModule } from "./wiki/wiki.module";
import { PostModule } from "./post/post.module";
import { CommentModule } from "./comment/comment.module";
import { ReportModule } from "./report/report.module";
import { BoardModule } from "./board/board.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    WinstonModule.forRoot(loggerConfig),
    TypeOrmModule.forRoot(databaseConnection),
    ExampleLoggerModule,
    UserModule,
    PatternModule,
    WikiModule,
    PostModule,
    CommentModule,
    ReportModule,
    BoardModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
