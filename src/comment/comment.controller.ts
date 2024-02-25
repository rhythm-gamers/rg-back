import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { IncreaseCommentLikes } from "./dto/increase-comment-likes.dto";

@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get("post/:post_id")
  async getCommentAtAssociatePost(
    @Param("post_id") post_id: number,
    @Query("page") page: number = 0,
    @Query("limit") limit: number = +process.env.COMMENT_LIMIT,
  ) {
    return await this.commentService.fetchCommentAssociatePostID(
      +post_id,
      +page,
      +limit,
    );
  }

  @Post("inc_like")
  async increaseCommentLike(@Body() body: IncreaseCommentLikes) {
    return await this.commentService.increaseCommentLikes(0, body);
  }
}
