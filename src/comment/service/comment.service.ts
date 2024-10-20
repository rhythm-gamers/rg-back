import { BadRequestException, Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "../entity/comment.entity";
import { Repository } from "typeorm";
import { UpdateCommentDto } from "../dto/update-comment.dto";
import { UserService } from "src/user/user.service";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { PostService } from "src/post/service/post.service";
import { CommentLikeService } from "./comment-like.service";

@Injectable()
export class CommentService {
  //   {
  //     content:
  //       commentUpdate.content == undefined
  //         ? content
  //         : commentUpdate.content,
  //     modifiedAt: new Date(),
  //   },
  // );
  //
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    private readonly commentLikeService: CommentLikeService,
  ) {}

  async getCommentCountsRelatedWithPost(postId: number): Promise<number> {
    return this.commentRepository.count({
      where: {
        post: {
          id: postId,
        },
      },
    });
  }

  async fetchCommentsWithPostid(postId: number) {
    return await this.commentRepository.find({
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
      },
      where: {
        post: {
          id: postId,
        },
      },
      order: {
        id: "ASC",
      },
      relations: ["user"],
    });
  }

  async fetchCommentAssociatePostID(
    postId: number,
    page: number = 0,
    limit: number = +process.env.COMMENT_LIMIT,
  ) {
    const result = await this.commentRepository.findAndCount({
      select: {
        id: true,
        content: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          nickname: true,
          userLevel: true,
        },
      },
      where: {
        post: {
          id: postId,
        },
      },
      order: {
        id: "ASC",
      },
      skip: page * limit,
      take: limit,
      relations: ["user"],
    });

    let [comments, commentCount] = result

    comments.forEach((comment, idx) => {
      comment["reComments"] = []; // 모든 comment에 reComment 배열 초기화
      if(comment.parentId === 0) return;
      
      for (const parentComment of comments) {
        if(parentComment === null) continue;
        if (parentComment.id === comment.parentId) {
          parentComment["reComments"]
            ? parentComment["reComments"].push(comment) // 자식 댓글을 부모 댓글의 reComment 배열에 추가
            : parentComment["reComments"] = [comment]; // 배열이 없으면 새로 초기화하고 자식 댓글 추가
          
          comments[idx] = null // 자식 댓글 삭제
        }
      }
    });

    comments = comments.filter((comment)=>comment);
    return {comments, commentCount};
  }

  async fetchCommentWithCommentID(commentId: number) {
    const comment = await this.commentRepository.findOneBy({
      id: commentId,
    });

    return comment;
  }

  async updateComment(
    userId: number,
    commentId: number,
    commentUpdate: UpdateCommentDto,
  ) {
    const comment = await this.checkCommentOwnerAndGetComment(
      userId,
      commentId,
    );

    const updateComment = { ...comment, ...commentUpdate };

    // const result = await this.commentRepository.update(
    //   commentUpdate.commentId,
    //   {
    //     content:
    //       commentUpdate.content == undefined
    //         ? content
    //         : commentUpdate.content,
    //     modifiedAt: new Date(),
    //   },
    // );
    return await this.commentRepository.save(updateComment);
  }

  async createComment(
    userId: number,
    commentCreate: CreateCommentDto,
  ): Promise<Comment> {
    const user = await this.userService.fetchWithUserId(userId);
    const post = await this.postService.fetchPostWithPostID(
      commentCreate.postid,
    );

    const comment = new Comment();
    comment.user = user;
    comment.post = post;
    comment.content = commentCreate.content;
    comment.parentId =
      commentCreate.parentId == null ? 0 : commentCreate.parentId;

    const result = await this.commentRepository.save(comment);
    return result;
  }

  async deleteComment(userId: number, commentId: number) {
    const comment = await this.checkCommentOwnerAndGetComment(
      userId,
      commentId,
    );
    const result = await this.commentRepository.delete(comment.id);
    return result;
  }

  // TODO 두 사람이 동시에 like를 누를 경우, 2가 오르는 것이 아닌 1이 오르는 경우 방지 필요
  // TODO 중복 좋아요 체크 로직 필요
  // TODO 이 경우 save를 하면 updatedAt이 수정됨 -> 쿼리로 실행
  async increaseCommentLikes(userId: number, commentId: number) {
    if (
      (await this.commentLikeService.appendUserToLikeList(
        userId,
        commentId,
      )) !== true
    ) {
      throw new BadRequestException();
    }

    const result = await this.commentRepository.findOne({
      where: {
        id: commentId,
      },
    });
    return result;
  }

  private async checkCommentOwnerAndGetComment(
    userId: number,
    commentId: number,
  ): Promise<Comment> {
    const comment = await this.fetchCommentWithCommentId(commentId);
    if (comment.user.id !== userId) {
      throw new BadRequestException();
    }
    return comment;
  }

  private async fetchCommentWithCommentId(commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
      },
      relations: ["user"],
    });
    return comment;
  }
}
