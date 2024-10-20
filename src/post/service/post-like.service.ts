import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostLike } from "../entity/post-like.entity";
import { UserService } from "src/user/service/user.service";
import { PostService } from "../service/post.service";
import { Repository } from "typeorm";

@Injectable()
export class PostLikeService {
  constructor(
    @InjectRepository(PostLike) private postLikeRepo: Repository<PostLike>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  async appendUserToLikeList(userId: number, postId: number) {
    const user = await this.userService.fetchWithUserId(userId);
    const list = await this.postLikeRepo.find({
      select: {
        id: true,
        user: {
          id: true,
        },
      },
      where: {
        post: {
          id: postId,
        },
      },
      relations: ["user"],
    });
    try {
      console.log(list);
      if (
        list.some((like) => {
          if (!like.user) return false;
          return like.user.id === userId;
        })
      )
        return false;
    } catch (e) {
      console.log(e);
    }
    const post = await this.postService.fetchPostWithPostID(postId);

    const likeList = new PostLike();
    likeList.post = post;
    likeList.user = user;

    await this.postLikeRepo.save(likeList);
    return true;
  }
}
