import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { CommentService } from "../service/comment.service";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { UpdateCommentDto } from "../dto/update-comment.dto";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { SkipAuth } from "src/token/token.metadata";
import { Request, Response } from "express";
import { TokenPayload } from "src/auth/object/token-payload.obj";

@ApiTags("comment")
@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @SkipAuth()
  @Get("post/:postId")
  @ApiParam({
    name: "postId",
    required: true,
    description: "게시글 id",
  })
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
  @ApiBody({ type: CreateCommentDto })
  async craeteComment(@Body() body: CreateCommentDto, @Req() req) {
    const user: TokenPayload = req.user;
    const userUid = +user.uid;
    return await this.commentService.createComment(userUid, body);
  }

  @Patch(":commentId")
  @ApiOperation({ summary: "댓글 수정" })
  async updateComment(
    @Param("commentId") commentId: number,
    @Body() body: UpdateCommentDto,
    @Req() req,
  ) {
    const user: TokenPayload = req.user;
    const userUid = +user.uid;
    return await this.commentService.updateComment(userUid, +commentId, body);
  }

  @Delete(":commentId")
  @ApiOperation({ summary: "댓글 삭제" })
  async deleteComment(@Param("commentId") commentId: number, @Req() req) {
    const user: TokenPayload = req.user;
    const userUid = +user.uid;
    return await this.commentService.deleteComment(userUid, +commentId);
  }

  @Post("inc_like/:commentId")
  @ApiOperation({ summary: "댓글 좋아요 증가" })
  @ApiUnauthorizedResponse({ description: "로그인 해주세요" })
  @ApiBadRequestResponse({ description: "없는 댓글입니다" })
  async increaseCommentLike(@Param("commentId") commentId: number, @Req() req) {
    const user: TokenPayload = req.user;
    const userUid = +user.uid;
    return await this.commentService.increaseCommentLikes(userUid, +commentId);
  }
}
