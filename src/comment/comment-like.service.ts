import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentLike } from "./entity/comment-like.entity";
import { CommentService } from "./comment.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class CommentLikeService {
  constructor(
    @InjectRepository(CommentLike)
    private commentLikeRepo: Repository<CommentLike>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
  ) {}

  async appendUserToLikeList(userId: number, commentId: number) {
    const user = await this.userService.fetchUserLikeListWithUserID(userId);
    if (
      user.commentLikeList.some((like) => like.comment.commentId === commentId)
    ) {
      return false;
    }

    const comment =
      await this.commentService.fetchCommentWithCommentID(commentId);

    const likeList = new CommentLike();
    likeList.user = user;
    likeList.comment = comment;

    await this.commentLikeRepo.save(likeList);
    return true;
  }
}
