import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from "@nestjs/common";
import { BoardService } from "../service/board.service";
import { ReturnBoardMetadataDto } from "../dto/return-board-metadata.dto";
import { CreateBoardDto } from "../dto/create-board.dto";
import { UpdateBoardDto } from "../dto/update-board.dto";
import { PostService } from "src/post/service/post.service";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Roles, SkipAuth } from "src/token/token.metadata";
import { Role } from "src/auth/object/token-payload.obj";
import { Response } from "express";
import { HttpStatusCode } from "axios";

@Controller("board")
@ApiTags("board")
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly postService: PostService,
  ) {}

  @SkipAuth()
  @Get("spec/:boardName")
  @ApiOperation({
    description: "게시판의 정보 가져오기",
  })
  async fetchBoardInfo(@Param("boardName") boardName: string) {
    const board = await this.boardService.fetchBoardByBoardname(boardName);
    const post = await this.postService.fetchPostsAndCommentCountWithBoardname(
      boardName,
      0,
      20,
    );
    const result = {
      board: board,
      posts: post,
    };
    return result;
  }

  @SkipAuth()
  @Get("metadata")
  @ApiOkResponse({ type: ReturnBoardMetadataDto })
  async fetchBoardMetadata(): Promise<ReturnBoardMetadataDto> {
    const metadatas = await this.boardService.fetchBoardMetadata();
    const result = new ReturnBoardMetadataDto();
    metadatas.forEach((metadata) => {
      result.boards.push(metadata.boardName);
    });
    return result;
  }

  @Roles(Role.Admin)
  @Post()
  @ApiBody({ type: CreateBoardDto })
  @ApiOperation({})
  async createBoard(@Body() boardInfo: CreateBoardDto) {
    const result = await this.boardService.createBoard(boardInfo);
    return result;
  }

  @Roles(Role.Admin)
  @Delete(":originName")
  @ApiParam({
    name: "originName",
    required: true,
    description: "삭제하려는 게시판 이름",
  })
  async deleteBoard(@Param("originName") originName, @Res() res: Response) {
    const result = await this.boardService.deleteBoardByBoardname(originName);
    if (result) res.status(HttpStatusCode.Ok).send();
    else res.status(HttpStatusCode.BadRequest).send();
    return;
  }

  @Roles(Role.Admin)
  @Patch(":originName")
  @ApiBody({ type: UpdateBoardDto })
  @ApiParam({
    name: "originName",
    required: true,
    description: "수정하려는 게시판의 이름",
  })
  @ApiOkResponse()
  async updateBoard(
    @Body() boardInfo: UpdateBoardDto,
    @Param("originName") originName: string,
  ) {
    const result = await this.boardService.modifyBoardByBoardname(
      boardInfo,
      originName,
    );
    return result;
  }
}
