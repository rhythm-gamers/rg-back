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

  async appendUserToLikeList(userId: number, postId: number) {
    const user = await this.userService.fetchUserLikeListWithUserID(userId);
    if (
      user.postLikeList.some((like) => like.post.postId === postId) === true
    ) {
      return false;
    }
    const post = await this.postService.fetchPostWithPostID(postId);

    const likeList = new PostLike();
    likeList.post = post;
    likeList.user = user;

    await this.postLikeRepo.save(likeList);
    return true;
  }
}
