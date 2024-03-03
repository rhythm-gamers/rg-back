import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { BoardService } from 'src/board/board.service';
import { UserService } from 'src/user/user.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostLikeService } from './post-like.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @Inject(forwardRef(() => BoardService))
    private readonly boardService: BoardService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly postLikeService: PostLikeService,
  ) {}

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

  async createPost(user_id: number, create_post: CreatePostDto) {
    const board = await this.boardService.fetchBoardByBoardname(
      create_post.board_name,
    );
    const user = await this.userService.fetchUserWithUserID(user_id);
    const post = new Post();
    post.board = board;
    post.user = user;
    post.title = create_post.title;
    post.content = create_post.content;

    const result = await this.postRepository.save(post);
    return result;
  }

  async updatePost(
    user_id: number,
    post_id: number,
    update_post: UpdatePostDto,
  ) {
    const post = await this.checkPostOwnerAndGetPost(user_id, post_id);

    const update_value: Post = { ...post, ...update_post };
    const result = await this.postRepository.save(update_value);
    return result;
  }

  async deletePost(user_id: number, post_id: number) {
    const post = await this.checkPostOwnerAndGetPost(user_id, post_id);

    const result = await this.postRepository.delete(post.post_id);
    return result;
  }

  async fetchPostWithPostID(post_id: number): Promise<Post> {
    const post = await this.postRepository.findOneBy({
      post_id: post_id,
    });
    return post;
  }

  async increasePostLikes(user_id: number, post_id: number) {
    if (
      (await this.postLikeService.appendUserToLikeList(user_id, post_id)) !==
      true
    ) {
      throw new BadRequestException();
    }

    await this.postRepository.update(post_id, {
      likes: () => 'likes + 1',
    });

    const result = await this.postRepository.findOneBy({
      post_id: post_id,
    });
    return result;
  }

  private async checkPostOwnerAndGetPost(
    user_id: number,
    post_id: number,
  ): Promise<Post> {
    const post = await this.fetchPostWithPostId(post_id);
    if (post.user.user_id !== user_id) {
      throw new BadRequestException();
    }
    return post;
  }

  private async fetchPostWithPostId(post_id: number) {
    const post = await this.postRepository.findOne({
      where: {
        post_id: post_id,
      },
      relations: ['user'],
    });
    return post;
  }
}
