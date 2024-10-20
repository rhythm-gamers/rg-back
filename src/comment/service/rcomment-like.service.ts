import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentLike } from "../entity/comment-like.entity";
import { RCommentService } from "./rcomment.service";
import { ToggleLike } from "src/common/enum/toggle-like.enum";
import { UserService } from "src/user/service/user.service";

@Injectable()
export class RCommentLikeService {
  constructor(
    @InjectRepository(CommentLike)
    private readonly commentLikeRepo: Repository<CommentLike>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => RCommentService))
    private readonly commentService: RCommentService,
  ) {}

  async toggle(userid: number, commentid: number) {
    const likeList = await this.commentLikeRepo.findOne({
      select: {
        id: true,
      },
      where: {
        user: { id: userid },
        comment: { id: commentid },
      },
    });

    try {
      if (likeList) {
        await this.delete(likeList);
        return ToggleLike.Delete;
      } else {
        await this.append(userid, commentid);
        return ToggleLike.Create;
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }

  private async append(userid: number, commentid: number) {
    try {
      const like = new CommentLike();
      like.comment = await this.commentService.fetchCommentWithId(commentid);
      like.user = await this.userService.fetchWithUserId(userid);
      await this.commentLikeRepo.save(like);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  private async delete(likeList: CommentLike) {
    try {
      await this.commentLikeRepo.delete({
        id: likeList.id,
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
