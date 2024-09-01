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
import { ApiTags } from "@nestjs/swagger";

@Injectable()
@Controller("rboard")
@ApiTags("rbody")
export class RBoardController {
  constructor(
    private readonly boardService: RBoardService,
    private readonly postService: RPostService,
  ) {}

  // Create board
  @Roles(Role.Admin)
  @Post()
  public async createBoard(
    @Req() req,
    @Res() res: Response,
    @Body() board: CreateBoardDto,
  ) {
    try {
      await this.boardService.create(board);
      res.status(HttpStatusCode.Created);
    } catch (e) {
      res.status(HttpStatusCode.BadRequest);
    }
    res.send();
  }

  // Get Board + Get Posts
  @SkipAuth()
  @Get(":boardname")
  public async getBoard(
    @Req() req,
    @Res() res: Response,
    @Param("boardname") boardname: string,
    @Query("page") page: number,
    @Query("take") take: number,
  ) {
    try {
      const board = await this.boardService.fetchOne(boardname);
      const posts = await this.postService.fetchPagenatedPostsWithBoardname(boardname, (+page) - 1, +take);

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
  public async updateBoard(
    @Req() req,
    @Res() res: Response,
    @Query("boardname") boardname: string,
    @Body() board: UpdateBoardDto,
  ) {
    try {
      await this.boardService.update(boardname, board);
      res.status(HttpStatusCode.Ok);
    } catch (e) {
      res.status(HttpStatusCode.BadRequest);
    }
    res.send();
  }

  // Delete Board
  @Roles(Role.Admin)
  @Delete(":boardname")
  public async deleteBoard(
    @Req() req,
    @Res() res: Response,
    @Query("boardname") boardname: string,
  ) {
    try {
      await this.boardService.delete(boardname);
      res.status(HttpStatusCode.Ok);
    } catch (e) {
      res.status(HttpStatusCode.BadRequest);
    }
    res.send();
  }
}
