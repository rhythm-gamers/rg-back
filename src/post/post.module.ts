import { Module, forwardRef } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { CommentModule } from 'src/comment/comment.module';
import { BoardModule } from 'src/board/board.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [
    TypeOrmModule.forFeature([Post]),
    forwardRef(() => CommentModule),
    forwardRef(() => BoardModule),
    forwardRef(() => UserModule),
  ],
  exports: [PostService],
})
export class PostModule {}
