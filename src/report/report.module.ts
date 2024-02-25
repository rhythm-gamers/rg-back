import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { CommentReport } from './entity/comment-report.entity';
import { PostReport } from './entity/post-report.entity';
import { UserReport } from './entity/user-report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  imports: [TypeOrmModule.forFeature([CommentReport, PostReport, UserReport])],
  exports: [ReportService],
})
export class ReportModule {}
