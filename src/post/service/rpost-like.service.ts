import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostLike } from "../entity/post-like.entity";
import { UserService } from "src/user/service/user.service";
import { Repository } from "typeorm";
import { RPostService } from "../service/rpost.service";
import { ToggleLike } from "src/common/enum/toggle-like.enum";

@Injectable()
export class RPostLikeService {
  constructor(
    @InjectRepository(PostLike) private postLikeRepo: Repository<PostLike>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => RPostService))
    private readonly postService: RPostService,
  ) {}

  async toggle(userid: number, postid: number): Promise<number> {
    const likeList = await this.postLikeRepo.findOne({
      select: {
        id: true,
      },
      where: {
        user: { id: userid },
        post: { id: postid },
      },
    });

    try {
      if (likeList) {
        await this.delete(likeList);
        return ToggleLike.Delete;
      } else {
        await this.append(userid, postid);
        return ToggleLike.Create;
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }

  private async append(userid: number, postid: number) {
    try {
      const like = new PostLike();
      like.post = await this.postService.fetchPostWithId(postid);
      like.user = await this.userService.fetchWithUserId(userid);
      await this.postLikeRepo.save(like);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  private async delete(likeList: PostLike) {
    try {
      await this.postLikeRepo.delete({
        id: likeList.id,
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
