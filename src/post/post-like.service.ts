import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from './entity/post-like.entity';
import { UserService } from 'src/user/user.service';
import { PostService } from './post.service';
import { Repository } from 'typeorm';

@Injectable()
export class PostLikeService {
  constructor(
    @InjectRepository(PostLike) private postLikeRepo: Repository<PostLike>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  async appendUserToLikeList(user_id: number, post_id: number) {
    const user = await this.userService.fetchUserLikeListWithUserID(user_id);
    if (
      user.post_like_list.some((like) => like.post.post_id === post_id) === true
    ) {
      return false;
    }
    const post = await this.postService.fetchPostWithPostID(post_id);

    const like_list = new PostLike();
    like_list.post = post;
    like_list.user = user;

    await this.postLikeRepo.save(like_list);
    return true;
  }
}
