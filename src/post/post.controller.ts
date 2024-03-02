import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  forwardRef,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CommentService } from 'src/comment/comment.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
  ) {}

  @Get('board/:board_name')
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지. 기본은 0',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '한 페이지에서 보일 글 수. 기본은 0',
  })
  @ApiOperation({})
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
  @ApiOperation({})
  @ApiParam({
    name: 'post_id',
    required: true,
    description: '조회하는 글의 id',
  })
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
  @ApiOperation({})
  async createPost(@Body() body: CreatePostDto) {
    const user_uid = 1;
    return await this.postService.createPost(user_uid, body);
  }

  @Patch(':/post_id')
  @ApiOperation({})
  @ApiParam({
    name: 'post_id',
    required: true,
    description: '수정하는 글의 id',
  })
  async updatePost(
    @Param('post_id') post_id: number,
    @Body() body: UpdatePostDto,
  ) {
    const user_uid = 1;
    return await this.postService.updatePost(user_uid, +post_id, body);
  }

  @Delete(':post_id')
  @ApiOperation({})
  @ApiParam({
    name: 'post_id',
    required: true,
    description: '삭제하는 글의 id',
  })
  async deletePost(@Param('post_id') post_id: number) {
    const user_uid = 1;
    return await this.postService.deletePost(user_uid, +post_id);
  }

  @Post('inc_like/:post_id')
  @ApiOperation({})
  @ApiParam({
    name: 'post_id',
    required: true,
    description: '좋아요를 증가시키려는 글의 id',
  })
  async increasePostLikes(@Param('post_id') post_id: number) {
    const user_uid = 1;
    return await this.postService.increasePostLikes(user_uid, +post_id);
  }
}
