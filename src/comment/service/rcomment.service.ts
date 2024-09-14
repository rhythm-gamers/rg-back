import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "../entity/comment.entity";
import { Repository } from "typeorm";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { UserService } from "src/user/service/user.service";
import { RPostService } from "src/post/service/rpost.service";
import { UpdateCommentDto } from "../dto/update-comment.dto";
import { RCommentLikeService } from "./rcomment-like.service";

@Injectable()
export class RCommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly userService: UserService,
    private readonly postService: RPostService,
    private readonly commentLikeService: RCommentLikeService,
  ) {}

  async fetchCommentWithId(commentid: number): Promise<Comment> {
    const comment = await this.commentRepo.findOne({
      select: {
        id: true,
        content: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          nickname: true,
        },
        likeList: true,
      },
      where: {
        id: commentid,
      },
      relations: ["user", "likeList"],
    });
    if (!comment) throw new Error("존재하지 않는 댓글");
    return comment;
  }

  async create(userid: number, dto: CreateCommentDto): Promise<void> {
    try {
      const comment = new Comment();
      comment.content = dto.content;
      comment.user = await this.userService.fetchWithUserId(userid);
      comment.parentId = dto.parentId ? dto.parentId : 0;
      comment.post = await this.postService.fetchPostWithId(+dto.postid);

      await this.commentRepo.save(comment);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async update(
    userid: number,
    commentid: number,
    dto: UpdateCommentDto,
  ): Promise<void> {
    try {
      const comment = await this.commentRepo.findOne({
        where: {
          id: commentid,
        },
        relations: {
          user: true,
        },
      });
      if (!comment) throw new Error("존재하지 않는 댓글입니다.");
      if (comment.user.id !== userid) throw new UnauthorizedException();
      await this.commentRepo.update(
        {
          id: commentid,
        },
        dto,
      );
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async delete(userid: number, commentid: number): Promise<void> {
    try {
      const comment = await this.commentRepo.findOne({
        where: {
          id: commentid,
        },
        relations: {
          user: true,
        },
      });
      if (!comment) throw new Error("존재하지 않는 댓글입니다.");
      if (comment.user.id !== userid) throw new UnauthorizedException();
      await this.commentRepo.delete({
        id: commentid,
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async togglePostLike(userid: number, commentid: number): Promise<number> {
    try {
      return await this.commentLikeService.toggle(userid, commentid);
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
