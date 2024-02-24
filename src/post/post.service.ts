import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "./entity/post.entity";
import { Repository } from "typeorm";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async getPostsAndCommentCountWithBoardname(
    board_name: string,
    page: number,
    limit: number,
  ) {
    const posts = await this.postRepository.findAndCount({
      select: {
        uid: true,
        title: true,
        views: true,
        likes: true,
        created_at: true,
        modified_at: true,
        user: {
          uid: true,
          name: true,
        },
        comments: {
          uid: true,
        },
      },
      where: {
        board: {
          board_name: board_name,
        },
      },
      relations: ["user", "comments"],
      order: {
        uid: "DESC",
      },
      skip: limit * page,
      take: limit,
    });

    const all_articles = await this.postRepository.count({
      where: {
        board: {
          board_name: board_name,
        },
      },
    });

    posts[0].forEach((post) => {
      post["modified"] = post.created_at === post.modified_at ? false : true;
      post["time"] = post.modified_at;
      delete post.created_at;
      delete post.modified_at;
      post["comment_count"] = post.comments.length;
      delete post.comments;
    });

    const result = {
      posts: posts,
      all_count: all_articles,
    };

    return result;
  }

  async getPostSpecInfo(post_id: number) {
    const post = await this.postRepository.findOne({
      select: {
        uid: true,
        user: {
          uid: true,
          name: true,
        },
        title: true,
        content: true,
        views: true,
        likes: true,
        created_at: true,
        modified_at: true,
      },
      where: {
        uid: post_id,
      },
      relations: {
        user: true,
      },
      order: {
        created_at: "DESC",
      },
    });

    if (post) {
      post["modified"] = post.created_at === post.modified_at ? false : true;
      post["show_date"] = post.modified_at;
      delete post.created_at;
      delete post.modified_at;
    }
    return post;
  }
}
