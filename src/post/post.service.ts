import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "./entity/post.entity";
import { Repository } from "typeorm";
import { CreatePostDto } from "./dto/create-post.dto";
import { BoardService } from "src/board/board.service";
import { UserService } from "src/user/user.service";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostLikeService } from "./post-like.service";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private readonly boardService: BoardService,
    private readonly userService: UserService,
    private readonly postLikeService: PostLikeService,
  ) {}

  async fetchPostsAndCommentCountWithBoardname(
    boardName: string,
    page: number,
    limit: number,
  ) {
    const posts = await this.postRepository.findAndCount({
      select: {
        id: true,
        title: true,
        views: true,
        likes: true,
        createdAt: true,
        modifiedAt: true,
        user: {
          id: true,
          nickname: true,
        },
        comments: {
          id: true,
        },
      },
      where: {
        board: {
          boardName: boardName,
        },
      },
      relations: ["user", "comments"],
      order: {
        id: "DESC",
      },
      skip: limit * page,
      take: limit,
    });

    const allArticles = await this.postRepository.count({
      where: {
        board: {
          boardName: boardName,
        },
      },
    });

    posts[0].forEach((post) => {
      post["modified"] = post.createdAt === post.modifiedAt ? false : true;
      post["time"] = post.modifiedAt;
      delete post.createdAt;
      delete post.modifiedAt;
      post["commentCount"] = post.comments.length;
      delete post.comments;
    });

    const result = {
      posts: posts,
      allCount: allArticles,
    };

    return result;
  }

  async fetchPostSpecInfo(postId: number) {
    const post = await this.postRepository.findOne({
      select: {
        id: true,
        user: {
          id: true,
          nickname: true,
        },
        title: true,
        content: true,
        views: true,
        likes: true,
        createdAt: true,
        modifiedAt: true,
      },
      where: {
        id: postId,
      },
      relations: {
        user: true,
      },
      order: {
        createdAt: "DESC",
      },
    });

    if (post) {
      post["modified"] = post.createdAt === post.modifiedAt ? false : true;
      post["showDate"] = post.modifiedAt;
      delete post.createdAt;
      delete post.modifiedAt;
    }
    return post;
  }

  async createPost(userId: number, createPost: CreatePostDto) {
    const board = await this.boardService.fetchBoardByBoardname(
      createPost.boardName,
    );
    const user = await this.userService.fetchWithUserId(userId);
    const post = new Post();
    post.board = board;
    post.user = user;
    post.title = createPost.title;
    post.content = createPost.content;

    const result = await this.postRepository.save(post);
    return result;
  }

  async updatePost(userId: number, postId: number, updatePost: UpdatePostDto) {
    const post = await this.checkPostOwnerAndGetPost(userId, postId);

    const updateValue: Post = { ...post, ...updatePost };
    const result = await this.postRepository.save(updateValue);
    return result;
  }

  async deletePost(userId: number, postId: number) {
    const post = await this.checkPostOwnerAndGetPost(userId, postId);

    const result = await this.postRepository.delete(post.id);
    return result;
  }

  async fetchPostWithPostID(postId: number): Promise<Post> {
    const post = await this.postRepository.findOneBy({
      id: postId,
    });
    return post;
  }

  async increasePostLikes(userId: number, postId: number) {
    if (
      (await this.postLikeService.appendUserToLikeList(userId, postId)) !== true
    ) {
      throw new BadRequestException();
    }

    await this.postRepository.update(postId, {
      likes: () => "likes + 1",
    });

    const result = await this.postRepository.findOneBy({
      id: postId,
    });
    return result;
  }

  private async checkPostOwnerAndGetPost(
    userId: number,
    postId: number,
  ): Promise<Post> {
    const post = await this.fetchPostWithPostId(postId);
    if (post.user.id !== userId) {
      throw new BadRequestException();
    }
    return post;
  }

  private async fetchPostWithPostId(postId: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
      relations: ["user"],
    });
    return post;
  }
}
