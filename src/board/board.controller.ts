import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { BoardService } from "./board.service";
import { ReturnBoardMetadata } from "./dto/return-board-metadata.dto";
import { Board } from "./entity/board.entity";
import { CreateBoard } from "./dto/create-board.dto";
import { DeleteBoard } from "./dto/delete-board.dto";
import { ModifyBoard } from "./dto/modify-board.dto";
import { PostService } from "src/post/post.service";

@Controller("board")
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly postService: PostService,
  ) {}

  @Get("spec/:path")
  async getBoardInfo(@Param("path") path: string): Promise<Board> {
    const board = await this.boardService.findBoardByBoardname(path);
    return board;
  }

  @Get("metadata")
  async getBoardMetadata(): Promise<ReturnBoardMetadata> {
    const metadatas = await this.boardService.getBoardMetadata();
    const result = new ReturnBoardMetadata();
    metadatas.forEach((metadata) => {
      result.boards.push(metadata.board_name);
    });
    return result;
  }

  @Post()
  async createBoard(@Body() board_info: CreateBoard) {
    const result = await this.boardService.createBoard(board_info);
    return result;
  }

  @Delete()
  async deleteBoard(@Body() board_info: DeleteBoard) {
    const result = await this.boardService.deleteBoardByBoardname(board_info);
    return result;
  }

  @Put()
  async updateBoard(@Body() board_info: ModifyBoard) {
    const result = await this.boardService.modifyBoardByBoardname(board_info);
    return result;
  }
}
