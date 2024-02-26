import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  forwardRef,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CommentService } from 'src/comment/comment.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DeletePostDto } from './dto/delete-post.dto';
import { IncreasePostLikesDto } from './dto/increase-post-likes.dto';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
  ) {}

  @Get('board/:board_name')
  async fetchPostAndCommentCountInBoard(
    @Param('board_name') board_name: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = +process.env.COMMENT_LIMIT,
  ) {
    return await this.postService.fetchPostsAndCommentCountWithBoardname(
      board_name,
      +page,
      +limit,
    );
  }

  @Get('spec/:post_id')
  async fetchPostSpecWithPostID(@Param('post_id') post_id: number) {
    const post_spec = await this.postService.fetchPostSpecInfo(+post_id);
    const comments =
      await this.commentService.fetchCommentAssociatePostID(post_id);
    return {
      post: post_spec,
      comments: comments,
    };
  }

  @Post()
  async createPost(@Body() body: CreatePostDto) {
    const user_uid = 1;
    return await this.postService.createPost(user_uid, body);
  }

  @Put()
  async updatePost(@Body() body: UpdatePostDto) {
    const user_uid = 1;
    return await this.postService.updatePost(user_uid, body);
  }

  @Delete()
  async deletePost(@Body() body: DeletePostDto) {
    const user_uid = 1;
    return await this.postService.deletePost(user_uid, body);
  }

  @Post('inc_like')
  async increasePostLikes(@Body() body: IncreasePostLikesDto) {
    const user_uid = 1;
    return await this.postService.increasePostLikes(user_uid, body);
  }
}
