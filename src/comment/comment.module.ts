import { Module, forwardRef } from "@nestjs/common";
import { CommentService } from "./service/comment.service";
import { CommentController } from "./controller/comment.controller";
import { Comment } from "./entity/comment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostModule } from "src/post/post.module";
import { UserModule } from "src/user/user.module";
import { CommentLike } from "./entity/comment-like.entity";
import { CommentLikeService } from "./service/comment-like.service";
import { RCommentController } from "./controller/rcomment.controller";
import { RCommentService } from "./service/rcomment.service";
import { RCommentLikeService } from "./service/rcomment-like.service";

@Module({
  controllers: [CommentController, RCommentController],
  providers: [
    CommentService,
    CommentLikeService,
    RCommentService,
    RCommentLikeService,
  ],
  imports: [
    TypeOrmModule.forFeature([Comment, CommentLike]),
    forwardRef(() => UserModule),
    forwardRef(() => PostModule),
  ],
  exports: [CommentService, RCommentService],
})
export class CommentModule {}
