import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "../entity/post.entity";
import { Like, Repository } from "typeorm";
import { UserService } from "src/user/user.service";
import { CreatePostDto } from "../dto/create-post.dto";
import { RBoardService } from "src/board/service/rboard.service";
import { UpdatePostDto } from "../dto/update-post.dto";
import { Comment } from "src/comment/entity/comment.entity";
import { RPostLikeService } from "./rpost-like.service";

@Injectable()
export class RPostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    private readonly userService: UserService,
    private readonly boardService: RBoardService,
    private readonly postLikeService: RPostLikeService,
  ) {}

  async create(userid: number, dto: CreatePostDto) {
    try {
      const post = new Post();
      post.title = dto.title;
      post.content = dto.content;
      post.board = await this.boardService.fetchOne(dto.boardName);
      post.user = await this.userService.fetchWithUserId(userid);
      await this.postRepo.save(post);
    } catch (e) {
      throw new Error("저장 실패");
    }
  }

  async fetchPostWithId(postId: number) {
    const post = await this.postRepo.findOne({
      select: {
        id: true,
        title: true,
        content: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          nickname: true,
        },
        comments: {
          id: true,
          content: true,
          parentId: true,
          user: {
            id: true,
            nickname: true,
          },
          createdAt: true,
          updatedAt: true,
          likeList: true,
        },
      },
      where: {
        id: postId,
      },
      relations: ["user", "comments", "comments.user", "comments.likeList"],
    });
    if (!post) throw new Error("존재하지 않는 게시글");

    post["commentsCount"] = post.comments.length;
    post.comments = await this.makeCommentTree(post.comments);
    return post;
  }

  private async makeCommentTree(comments: Comment[]) {
    const map = new Map();
    const tree = [];

    comments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    comments.forEach((comment) => {
      if (comment.parentId === 0) {
        tree.push(map.get(comment.id));
      } else {
        let parent: any = comment;
        while (parent.parentId !== 0) {
          parent = map.get(parent.parentId);
        }
        if (parent) {
          parent.children.push(map.get(comment.id));
        }
      }
    });
    return tree;
  }

  async fetchPagenatedPostsWithBoardname(
    boardname: string,
    page: number = 0,
    take: number = 50,
  ) {
    const board = await this.boardService.fetchOne(boardname);
    if (!board) throw new Error("존재하지 않는 게시판");
    const posts = await this.postRepo.findAndCount({
      select: {
        id: true,
        title: true,
        views: true,
        createdAt: true,
        updatedAt: true,
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
          id: board.id,
        },
      },
      relations: ["user", "comments"],
      skip: page * take,
      take: take,
      order: {
        createdAt: "DESC",
      },
    });
    this.updatePost(posts, take);
    return posts;
  }

  async update(userid: number, postid: number, dto: UpdatePostDto) {
    try {
      const post = await this.postRepo.findOne({
        where: {
          id: postid,
        },
        relations: ["user"],
      });
      if (!post) throw new Error("NotExists");
      if (post.user.id !== userid) throw new UnauthorizedException();
      await this.postRepo.update(postid, dto);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async delete(userid: number, postid: number) {
    try {
      const post = await this.postRepo.findOne({
        select: {
          id: true,
          user: {
            id: true,
          },
        },
        where: {
          id: postid,
        },
        relations: ["user"],
      });
      if (!post) throw new Error("존재하지 않는 게시글");
      if (post.user.id !== userid) throw new ForbiddenException();
      await this.postRepo.delete({
        id: post.id,
      });
    } catch (e) {
      console.log(e.message);
      throw new Error(e.message);
    }
  }

  async search(
    boardname: string,
    searchTerm: string,
    page: number,
    take: number,
  ) {
    try {
      const board = await this.boardService.fetchOne(boardname);
      const posts = await this.postRepo.findAndCount({
        select: {
          id: true,
          title: true,
          views: true,
          createdAt: true,
          updatedAt: true,
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
            id: board.id,
          },
          title: Like(`%${searchTerm}%`),
        },
        relations: ["user", "comments"],
        skip: page * take,
        take: take,
        order: {
          createdAt: "DESC",
        },
      });
      this.updatePost(posts, take);
      return posts;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  // TODO: 이름 변경
  private updatePost(posts, take) {
    posts[0].forEach((post) => {
      post["commentsCount"] = post.comments.length ? post.comments.length : 0;
      delete post.comments;
    });
    posts[1] = Math.ceil(posts[1] / take);
  }

  async togglePostLike(userid: number, postid: number): Promise<number> {
    try {
      return await this.postLikeService.toggle(userid, postid);
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
