import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { BoardService } from "./board.service";
import { ReturnBoardMetadataDto } from "./dto/return-board-metadata.dto";
import { CreateBoardDto } from "./dto/create-board.dto";
import { ModifyBoardDto } from "./dto/modify-board.dto";
import { PostService } from "src/post/post.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller("board")
@ApiTags("board")
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly postService: PostService,
  ) {}

  @Get("spec/:boardName")
  @ApiOperation({})
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

  @Get("metadata")
  @ApiOperation({})
  async fetchBoardMetadata(): Promise<ReturnBoardMetadataDto> {
    const metadatas = await this.boardService.fetchBoardMetadata();
    const result = new ReturnBoardMetadataDto();
    metadatas.forEach((metadata) => {
      result.boards.push(metadata.boardName);
    });
    return result;
  }

  @Post()
  @ApiOperation({})
  async createBoard(@Body() boardInfo: CreateBoardDto) {
    const result = await this.boardService.createBoard(boardInfo);
    return result;
  }

  @Delete(":originName")
  @ApiOperation({})
  async deleteBoard(@Param("originName") originName) {
    const result = await this.boardService.deleteBoardByBoardname(originName);
    return result;
  }

  @Patch(":originName")
  @ApiOperation({})
  async updateBoard(
    @Body() boardInfo: ModifyBoardDto,
    @Param("originName") originName: string,
  ) {
    const result = await this.boardService.modifyBoardByBoardname(
      boardInfo,
      originName,
    );
    return result;
  }
}
