import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentLike } from './entity/comment-like.entity';
import { CommentService } from './comment.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CommentLikeService {
  constructor(
    @InjectRepository(CommentLike)
    private commentLikeRepo: Repository<CommentLike>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
  ) {}

  async appendUserToLikeList(user_id: number, comment_id: number) {
    const user = await this.userService.fetchUserLikeListWithUserID(user_id);
    if (
      user.comment_like_list.some(
        (like) => like.comment.comment_id === comment_id,
      )
    ) {
      return false;
    }

    const comment =
      await this.commentService.fetchCommentWithCommentID(comment_id);

    const like_list = new CommentLike();
    like_list.user = user;
    like_list.comment = comment;

    await this.commentLikeRepo.save(like_list);
    return true;
  }
}
