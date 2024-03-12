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

  @Get("post/:postId")
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
    @Param("postId") postId: number,
    @Query("page") page: number = 0,
    @Query("limit") limit: number = +process.env.COMMENT_LIMIT,
  ) {
    return await this.commentService.fetchCommentAssociatePostID(
      +postId,
      +page,
      +limit,
    );
  }

  @Post()
  @ApiOperation({ summary: "댓글 생성" })
  async craeteComment(@Body() body: CreateCommentDto) {
    const userUid = 1;
    return await this.commentService.createComment(userUid, body);
  }

  @Patch(":commentId")
  @ApiOperation({ summary: "댓글 수정" })
  async updateComment(
    @Param("commentId") commentId: number,
    @Body() body: UpdateCommentDto,
  ) {
    const userUid = 1;
    return await this.commentService.updateComment(userUid, +commentId, body);
  }

  @Delete(":commentId")
  @ApiOperation({ summary: "댓글 삭제" })
  async deleteComment(@Param("commentId") commentId: number) {
    const userUid = 1;
    return await this.commentService.deleteComment(userUid, +commentId);
  }

  @Post("inc_like/:commentId")
  @ApiOperation({ summary: "댓글 좋아요 증가" })
  async increaseCommentLike(@Param("commentId") commentId: number) {
    const userUid = 1;
    return await this.commentService.increaseCommentLikes(userUid, +commentId);
  }
}
