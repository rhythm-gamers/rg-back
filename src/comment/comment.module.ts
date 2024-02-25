import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { Comment } from "./entity/comment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [TypeOrmModule.forFeature([Comment])],
  exports: [CommentService],
})
export class CommentModule {}
