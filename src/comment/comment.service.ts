import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { UpdateComment } from './dto/update-comment.dto';
import { UserService } from 'src/user/user.service';
import { CreateComment } from './dto/create-comment.dto';
import { PostService } from 'src/post/post.service';
import { DeleteComment } from './dto/delete-comment.dto';
import { IncreaseCommentLikes } from './dto/increase-comment-likes.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  async fetchCommentAssociatePostID(
    post_id: number,
    page: number = 0,
    limit: number = +process.env.COMMENT_LIMIT,
  ) {
    const result = await this.commentRepository.findAndCount({
      select: {
        comment_id: true,
        content: true,
        likes: true,
        parent_id: true,
        created_at: true,
        modified_at: true,
        user: {
          user_id: true,
          name: true,
        },
      },
      where: {
        post: {
          post_id: post_id,
        },
      },
      skip: page * limit,
      take: limit,
      relations: ['user'],
    });

    return result;
  }

  async updateComment(user_id: number, comment_update: UpdateComment) {
    const comment = await this.checkCommentOwnerAndGetComment(
      user_id,
      comment_update.comment_id,
    );

    const updateComment = { ...comment, ...comment_update };
    return await this.commentRepository.save(updateComment);
  }

  async pushComment(
    user_id: number,
    comment_create: CreateComment,
  ): Promise<Comment> {
    const user = await this.userService.fetchUserWithUserID(user_id);
    const post = await this.postService.fetchPostWithPostID(
      comment_create.post_uid,
    );

    const comment = new Comment();
    comment.user = user;
    comment.post = post;
    comment.content = comment_create.content;
    comment.parent_id =
      comment_create.parent_id == null ? 0 : comment_create.parent_id;

    const result = await this.commentRepository.save(comment);
    return result;
  }

  async deleteComment(user_id: number, comment_delete: DeleteComment) {
    const comment = await this.checkCommentOwnerAndGetComment(
      user_id,
      comment_delete.comment_id,
    );
    const result = await this.commentRepository.delete(comment);
    return result;
  }

  // TODO 두 사람이 동시에 like를 누를 경우, 2가 오르는 것이 아닌 1이 오르는 경우 방지 필요
  // TODO 중복 좋아요 체크 로직 필요
  // TODO 이 경우 save를 하면 updated_at이 수정됨 -> 쿼리로 실행
  async increaseCommentLikes(
    user_id: number,
    comment_like: IncreaseCommentLikes,
  ) {
    await this.commentRepository.update(comment_like.comment_id, {
      likes: () => 'likes + 1',
    });

    const result = await this.commentRepository.findOne({
      select: {
        likes: true,
      },
      where: {
        comment_id: comment_like.comment_id,
      },
    });
    return result;
  }

  private async checkCommentOwnerAndGetComment(
    user_id: number,
    comment_id: number,
  ): Promise<Comment> {
    const comment = await this.fetchCommentWithCommentId(comment_id);
    if (comment.user.user_id !== user_id) {
      throw new BadRequestException();
    }
    return comment;
  }

  private async fetchCommentWithCommentId(comment_id: number) {
    const comment = await this.commentRepository.findOneBy({
      comment_id: comment_id,
    });
    return comment;
  }
}
