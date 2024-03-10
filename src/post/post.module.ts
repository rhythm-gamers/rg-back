import { Module, forwardRef } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { CommentModule } from 'src/comment/comment.module';
import { BoardModule } from 'src/board/board.module';
import { UserModule } from 'src/user/user.module';
import { PostLike } from './entity/post-like.entity';
import { PostLikeService } from './post-like.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PostLikeService],
  imports: [
    TypeOrmModule.forFeature([Post, PostLike]),
    forwardRef(() => CommentModule),
    forwardRef(() => BoardModule),
    forwardRef(() => UserModule),
  ],
  exports: [PostService],
})
export class PostModule {}
