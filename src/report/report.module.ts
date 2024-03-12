import { Module, forwardRef } from "@nestjs/common";
import { ReportService } from "./report.service";
import { ReportController } from "./report.controller";
import { CommentReport } from "./entity/comment-report.entity";
import { PostReport } from "./entity/post-report.entity";
import { UserReport } from "./entity/user-report.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";
import { PostModule } from "src/post/post.module";
import { CommentModule } from "src/comment/comment.module";

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  imports: [
    TypeOrmModule.forFeature([CommentReport, PostReport, UserReport]),
    forwardRef(() => UserModule),
    forwardRef(() => PostModule),
    forwardRef(() => CommentModule),
  ],
  exports: [ReportService],
})
export class ReportModule {}
