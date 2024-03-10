import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags("comment")
@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get("post/:post_id")
  @ApiQuery({
    name: "page",
    required: false,
    description: "페이지",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "한 페이지에서 보일 댓글 수",
  })
  @ApiOperation({ summary: "특정 게시글의 댓글 가져오기" })
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

  @Post()
  @ApiOperation({ summary: "댓글 생성" })
  async craeteComment(@Body() body: CreateCommentDto) {
    const user_uid = 1;
    return await this.commentService.createComment(user_uid, body);
  }

  @Patch(":comment_id")
  @ApiOperation({ summary: "댓글 수정" })
  async updateComment(
    @Param("comment_id") comment_id: number,
    @Body() body: UpdateCommentDto,
  ) {
    const user_uid = 1;
    return await this.commentService.updateComment(user_uid, +comment_id, body);
  }

  @Delete(":comment_id")
  @ApiOperation({ summary: "댓글 삭제" })
  async deleteComment(@Param("comment_id") comment_id: number) {
    const user_uid = 1;
    return await this.commentService.deleteComment(user_uid, +comment_id);
  }

  @Post("inc_like/:comment_id")
  @ApiOperation({ summary: "댓글 좋아요 증가" })
  async increaseCommentLike(@Param("comment_id") comment_id: number) {
    const user_uid = 1;
    return await this.commentService.increaseCommentLikes(
      user_uid,
      +comment_id,
    );
  }
}
