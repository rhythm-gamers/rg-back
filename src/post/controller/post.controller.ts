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
  Req,
  forwardRef,
} from "@nestjs/common";
import { PostService } from "../service/post.service";
import { CommentService } from "src/comment/service/comment.service";
import { CreatePostDto } from "../dto/create-post.dto";
import { UpdatePostDto } from "../dto/update-post.dto";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { SkipAuth } from "src/token/token.metadata";
import { TokenPayload } from "src/auth/object/token-payload.obj";
import { RPostService } from "../service/rpost.service";

@ApiTags("post")
@Controller("post")
export class PostController {
  constructor(
    private readonly postService: PostService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
    private readonly postRefactoringService: RPostService,
  ) {}

  @SkipAuth()
  @Get("board/:boardName")
  @ApiQuery({
    name: "page",
    required: false,
    description: "페이지. 기본은 0",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "한 페이지에서 보일 글 수. 기본은 0",
  })
  @ApiOperation({})
  async fetchPostAndCommentCountInBoard(
    @Param("boardName") boardName: string,
    @Query("page") page: number = 0,
    @Query("limit") limit: number = +process.env.COMMENT_LIMIT,
  ) {
    return await this.postRefactoringService.fetchPagenatedPostsWithBoardname(boardName, 0, 10);
    // return await this.postService.fetchPostsAndCommentCountWithBoardname(
    //   boardName,
    //   +page,
    //   +limit,
    // );
  }

  @SkipAuth()
  @Get("spec/:postId")
  @ApiOperation({})
  @ApiParam({
    name: "postId",
    required: true,
    description: "조회하는 글의 id",
  })
  async fetchPostSpecWithPostID(@Param("postId") postId: number) {
    const postSpec = await this.postService.fetchPostSpecInfo(+postId);
    const comments =
      await this.commentService.fetchCommentAssociatePostID(postId);
    return {
      post: postSpec,
      comments: comments,
    };
  }

  @Post("")
  @ApiOperation({})
  async createPost(@Req() req, @Body() body: CreatePostDto) {
    const user: TokenPayload = req.user;
    await this.postService.createPost(+user.uid, body);
    return body;
  }

  @Patch(":postId")
  @ApiOperation({})
  @ApiParam({
    name: "postId",
    required: true,
    description: "수정하는 글의 id",
  })
  async updatePost(
    @Req() req,
    @Param("postId") postId: number,
    @Body() body: UpdatePostDto,
  ) {
    const user: TokenPayload = req.user;
    return await this.postService.updatePost(+user.uid, +postId, body);
  }

  @Delete(":postId")
  @ApiOperation({})
  @ApiParam({
    name: "postId",
    required: true,
    description: "삭제하는 글의 id",
  })
  async deletePost(@Req() req, @Param("postId") postId: number) {
    const user: TokenPayload = req.user;
    return await this.postService.deletePost(+user.uid, +postId);
  }

  @Post("inc-like/:postId")
  @ApiOperation({})
  @ApiParam({
    name: "postId",
    required: true,
    description: "좋아요를 증가시키려는 글의 id",
  })
  async increasePostLikes(@Req() req, @Param("postId") postId: number) {
    const user: TokenPayload = req.user;
    return await this.postService.increasePostLikes(+user.uid, +postId);
  }
}
