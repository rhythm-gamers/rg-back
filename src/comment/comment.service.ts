import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./entity/comment.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async getCommentAssociatePostID(
    post_id: number,
    page: number = 0,
    limit: number = +process.env.COMMENT_LIMIT,
  ) {
    const result = await this.commentRepository.findAndCount({
      select: {
        uid: true,
        content: true,
        likes: true,
        parent_id: true,
        created_at: true,
        modified_at: true,
        user: {
          uid: true,
          name: true,
        },
      },
      where: {
        post: {
          uid: post_id,
        },
      },
      skip: page * limit,
      take: limit,
      relations: ["user"],
    });

    return result;
  }
}
