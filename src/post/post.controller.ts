import { Controller, Get, Inject, Param, Query, forwardRef } from "@nestjs/common";
import { PostService } from "./post.service";
import { CommentService } from "src/comment/comment.service";

@Controller("post")
export class PostController {
  constructor(
    private readonly postService: PostService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
  ) {}

  @Get("board/:board_name")
  async fetchPostAndCommentCountInBoard(
    @Param("board_name") board_name: string,
    @Query("page") page: number = 0,
    @Query("limit") limit: number = +process.env.COMMENT_LIMIT,
  ) {
    return await this.postService.fetchPostsAndCommentCountWithBoardname(
      board_name,
      +page,
      +limit,
    );
  }

  @Get("spec/:post_id")
  async fetchPostSpecWithPostID(@Param("post_id") post_id: number) {
    const post_spec = await this.postService.fetchPostSpecInfo(+post_id);
    const comments =
      await this.commentService.fetchCommentAssociatePostID(post_id);
    return {
      post: post_spec,
      comments: comments,
    };
  }
}
