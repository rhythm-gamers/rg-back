import { Module, forwardRef } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { Comment } from "./entity/comment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostModule } from "src/post/post.module";
import { UserModule } from "src/user/user.module";
import { CommentLike } from "./entity/comment-like.entity";
import { CommentLikeService } from "./comment-like.service";

@Module({
  controllers: [CommentController],
  providers: [CommentService, CommentLikeService],
  imports: [
    TypeOrmModule.forFeature([Comment, CommentLike]),
    UserModule,
    forwardRef(() => PostModule),
  ],
  exports: [CommentService],
})
export class CommentModule {}
