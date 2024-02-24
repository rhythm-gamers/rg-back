import { Controller, Get, Param, Query } from "@nestjs/common";
import { CommentService } from "./comment.service";

@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get("post/:post_id")
  async getCommentAtAssociatePost(
    @Param("post_id") post_id: number,
    @Query("page") page: number = 0,
    @Query("limit") limit: number = +process.env.COMMENT_LIMIT,
  ) {
    return await this.commentService.getCommentAssociatePostID(
      +post_id,
      +page,
      +limit,
    );
  }
}
