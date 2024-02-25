import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async fetchPostWithPostID(post_id: number): Promise<Post> {
    const post = await this.postRepository.findOneBy({
      post_id: post_id,
    });
    return post;
  }

  async fetchPostsAndCommentCountWithBoardname(
    board_name: string,
    page: number,
    limit: number,
  ) {
    const posts = await this.postRepository.findAndCount({
      select: {
        post_id: true,
        title: true,
        views: true,
        likes: true,
        created_at: true,
        modified_at: true,
        user: {
          user_id: true,
          name: true,
        },
        comments: {
          comment_id: true,
        },
      },
      where: {
        board: {
          board_name: board_name,
        },
      },
      relations: ['user', 'comments'],
      order: {
        post_id: 'DESC',
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
      post['modified'] = post.created_at === post.modified_at ? false : true;
      post['time'] = post.modified_at;
      delete post.created_at;
      delete post.modified_at;
      post['comment_count'] = post.comments.length;
      delete post.comments;
    });

    const result = {
      posts: posts,
      all_count: all_articles,
    };

    return result;
  }

  async fetchPostSpecInfo(post_id: number) {
    const post = await this.postRepository.findOne({
      select: {
        post_id: true,
        user: {
          user_id: true,
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
        post_id: post_id,
      },
      relations: {
        user: true,
      },
      order: {
        created_at: 'DESC',
      },
    });

    if (post) {
      post['modified'] = post.created_at === post.modified_at ? false : true;
      post['show_date'] = post.modified_at;
      delete post.created_at;
      delete post.modified_at;
    }
    return post;
  }
}
