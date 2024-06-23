import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
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
import { AwsS3Module } from "./s3/aws-s3.module";
import { ProgressModule } from "./progress/progress.module";
import { CommonModule } from "./common/common.module";
import { APP_FILTER } from "@nestjs/core";
import { MyDefaultExceptionLoggingFilter } from "./common/filters/exception.filter";
import { TokenModule } from "./token/token.module";
import { FirebaseModule } from "./firebase/firebase.module";
import { ChinghoModule } from "./chingho/chingho.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConnection),

    FirebaseModule,
    TokenModule,
    CommonModule,
    AwsS3Module,

    UserModule,
    PatternModule,
    WikiModule,
    PostModule,
    CommentModule,
    ReportModule,
    BoardModule,
    AuthModule,
    ProgressModule,
    ChinghoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: MyDefaultExceptionLoggingFilter },
  ],
})
export class AppModule {}
