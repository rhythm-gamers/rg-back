import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConnection } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { PatternModule } from './pattern/pattern.module';
import { WikiModule } from './wiki/wiki.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { ReportModule } from './report/report.module';
import { BoardModule } from './board/board.module';
import { AuthModule } from './auth/auth.module';
import { AwsS3Module } from './s3/aws-s3.module';
import { ProgressModule } from './progress/progress.module';
import { CommonModule } from './common/common.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilter } from './common/filters/exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConnection),
    UserModule,
    PatternModule,
    WikiModule,
    PostModule,
    CommentModule,
    ReportModule,
    BoardModule,
    AuthModule,
    AwsS3Module,
    ProgressModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: ExceptionFilter }],
})
export class AppModule {}
