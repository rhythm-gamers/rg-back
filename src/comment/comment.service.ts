import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./entity/comment.entity";
import { Repository } from "typeorm";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { UserService } from "src/user/user.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { PostService } from "src/post/post.service";
import { CommentLikeService } from "./comment-like.service";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly commentLikeService: CommentLikeService,
  ) {}

  async fetchCommentAssociatePostID(
    postId: number,
    page: number = 0,
    limit: number = +process.env.COMMENT_LIMIT,
  ) {
    const result = await this.commentRepository.findAndCount({
      select: {
        commentId: true,
        content: true,
        likes: true,
        parentId: true,
        createdAt: true,
        modifiedAt: true,
        user: {
          userId: true,
          nickname: true,
        },
      },
      where: {
        post: {
          postId: postId,
        },
      },
      order: {
        commentId: "DESC",
      },
      skip: page * limit,
      take: limit,
      relations: ["user"],
    });

    return result;
  }

  async fetchCommentWithCommentID(commentId: number) {
    const comment = await this.commentRepository.findOneBy({
      commentId: commentId,
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
    const user = await this.userService.fetchUserWithUserID(userId);
    const post = await this.postService.fetchPostWithPostID(
      commentCreate.postUid,
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
    const result = await this.commentRepository.delete(comment.commentId);
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

    await this.commentRepository.update(commentId, {
      likes: () => "likes + 1",
    });

    const result = await this.commentRepository.findOne({
      select: {
        likes: true,
      },
      where: {
        commentId: commentId,
      },
    });
    return result;
  }

  private async checkCommentOwnerAndGetComment(
    userId: number,
    commentId: number,
  ): Promise<Comment> {
    const comment = await this.fetchCommentWithCommentId(commentId);
    if (comment.user.userId !== userId) {
      throw new BadRequestException();
    }
    return comment;
  }

  private async fetchCommentWithCommentId(commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: {
        commentId: commentId,
      },
      relations: ["user"],
    });
    return comment;
  }
}
