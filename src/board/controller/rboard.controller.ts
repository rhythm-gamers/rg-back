/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { Roles, SkipAuth } from "src/token/token.metadata";
import { Role, TokenPayload } from "src/auth/object/token-payload.obj";
import { HttpStatusCode } from "axios";
import { CreateBoardDto } from "../dto/create-board.dto";
import { UpdateBoardDto } from "../dto/update-board.dto";
import { RBoardService } from "../service/rboard.service";
import { RPostService } from "src/post/service/rpost.service";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { FetchBoardQuery } from "../dto/fetch-board.query";
import { getAllBoards, getSpecificBoard } from "../dto/schema";

@Injectable()
@Controller("rboard")
@ApiTags("rboard")
export class RBoardController {
  constructor(
    private readonly boardService: RBoardService,
    private readonly postService: RPostService,
  ) {}

  // Create board
  @Roles(Role.Admin)
  @Post()
  @ApiCreatedResponse({description: "생성 성공"})
  @ApiBadRequestResponse()
  public async createBoard(
    @Req() req,
    @Res() res: Response,
    @Body() board: CreateBoardDto,
  ) {
    try {
      await this.boardService.create(board);
      res.status(HttpStatusCode.Created).send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  // Get Board + Get Posts
  @SkipAuth()
  @Get(":boardname")
  @ApiOkResponse({
    schema: { example: getSpecificBoard }
  })
  @ApiBadRequestResponse()
  public async getBoard(
    @Req() req,
    @Res() res: Response,
    @Param("boardname") boardname: string,
    @Query() queries: FetchBoardQuery,
  ) {
    try {
      const board = await this.boardService.fetchOne(boardname);
      const posts = await this.postService.fetchPagenatedPostsWithBoardname(boardname, (+queries.page) - 1, +queries.take);

      res.status(HttpStatusCode.Ok).send({
        board: board,
        posts: posts
      });
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  // Get Boards
  @SkipAuth()
  @Get()
  @ApiOkResponse({
    schema: { example: getAllBoards }
  })
  public async getAllBoards(
    @Req() req,
    @Res() res: Response,
  ) {
    const boards = await this.boardService.fetchAll();
    res.status(HttpStatusCode.Ok).send(boards);
  }
  
  // Update Board
  @Roles(Role.Admin)
  @Patch()
  @ApiOkResponse({description: "수정 성공"})
  @ApiBadRequestResponse()
  public async updateBoard(
    @Req() req,
    @Res() res: Response,
    @Query("boardname") boardname: string,
    @Body() board: UpdateBoardDto,
  ) {
    try {
      await this.boardService.update(boardname, board);
      res.status(HttpStatusCode.Ok).send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }

  // Delete Board
  @Roles(Role.Admin)
  @Delete(":boardname")
  @ApiOkResponse({description: "삭제 성공"})
  @ApiBadRequestResponse()
  public async deleteBoard(
    @Req() req,
    @Res() res: Response,
    @Query("boardname") boardname: string,
  ) {
    try {
      await this.boardService.delete(boardname);
      res.status(HttpStatusCode.Ok).send();
    } catch (e) {
      res.status(HttpStatusCode.BadRequest).send();
    }
  }
}
