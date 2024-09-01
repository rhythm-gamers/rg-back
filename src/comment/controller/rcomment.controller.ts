/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Param, Patch, Post, Req, Res } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { RCommentService } from "../service/rcomment.service";
import { TokenPayload } from "src/auth/object/token-payload.obj";
import { HttpStatusCode } from "axios";
import { UpdateCommentDto } from "../dto/update-comment.dto";
import { Response } from "express";
import { ToggleLike } from "src/common/enum/toggle-like.enum";

@ApiTags("rcomment")
@Controller("rcomment")
export class RCommentController {
  constructor(private readonly commentService: RCommentService) {}

  // Create Comment
  @Post()
  @ApiCreatedResponse({description: "생성 성공"})
  @ApiBadRequestResponse()
  async createComment(
    @Req() req,
    @Res() res: Response,
    @Body() dto: CreateCommentDto,
  ) {
    const user: TokenPayload = req.user;
    try {
      await this.commentService.create(+user.uid, dto);
      res.status(HttpStatusCode.Created).send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  // Get Pagenated Comments - Post에서 처리

  // Update Comments
  @Patch(":commentid")
  @ApiOkResponse({description: "수정 성공"})
  @ApiBadRequestResponse()
  async updateComment(
    @Req() req,
    @Res() res: Response,
    @Param("commentid") commentid: number,
    @Body() dto: UpdateCommentDto,
  ) {
    const user: TokenPayload = req.user;
    try {
      await this.commentService.update(+user.uid, +commentid, dto);
      res.status(HttpStatusCode.Ok).send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  // Delete Comments
  @Delete(":commentid")
  @ApiOkResponse({description: "삭제 성공"})
  @ApiBadRequestResponse()
  async deleteComment(
    @Req() req,
    @Res() res: Response,
    @Param("commentid") commentid: number,
  ) {
    const user: TokenPayload = req.user;
    try {
      await this.commentService.delete(+user.uid, +commentid);
      res.sendStatus(HttpStatusCode.Ok).send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  // Toggle Comments Like
  @Post("like/:commentid")
  @ApiCreatedResponse({description: "좋아요 증가"})
  @ApiNoContentResponse({description: "좋아요 취소"})
  @ApiBadRequestResponse()
  async toggleCommentLike(
    @Req() req,
    @Res() res: Response,
    @Param("commentid") commentid: number,
  ) {
    const user: TokenPayload = req.user;
    try {
      const result = await this.commentService.togglePostLike(+user.uid, +commentid);
      if (result === ToggleLike.Create) {
        res.status(HttpStatusCode.Created).send();
      } else {
        res.status(HttpStatusCode.NoContent).send();
      }
    } catch (e) {
      console.log(e.message);
      res.status(HttpStatusCode.BadRequest).send();
    }
  }
}
