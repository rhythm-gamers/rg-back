import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentModule } from "src/comment/comment.module";
import { BoardModule } from "src/board/board.module";
import { UserModule } from "src/user/user.module";

import { Post } from "./entity/post.entity";
import { PostLike } from "./entity/post-like.entity";

import { PostController } from "./controller/post.controller";
import { PostService } from "./service/post.service";
import { PostLikeService } from "./service/post-like.service";

import { RPostController } from "./controller/rpost.controller";
import { RPostService } from "./service/rpost.service";
import { RPostLikeService } from "./service/rpost-like.service";

@Module({
  controllers: [PostController, RPostController],
  providers: [PostService, PostLikeService, RPostService, RPostLikeService],
  imports: [
    TypeOrmModule.forFeature([Post, PostLike]),
    forwardRef(() => CommentModule),
    forwardRef(() => BoardModule),
    forwardRef(() => UserModule),
  ],
  exports: [PostService, RPostService],
})
export class PostModule {}
