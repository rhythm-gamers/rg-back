import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  forwardRef,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { ReturnBoardMetadataDto } from './dto/return-board-metadata.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { DeleteBoardDto } from './dto/delete-board.dto';
import { ModifyBoardDto } from './dto/modify-board.dto';
import { PostService } from 'src/post/post.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('board')
@ApiTags('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  @Get('spec/:board_name')
  @ApiOperation({})
  async fetchBoardInfo(@Param('board_name') board_name: string) {
    const board = await this.boardService.fetchBoardByBoardname(board_name);
    const post = await this.postService.fetchPostsAndCommentCountWithBoardname(
      board_name,
      0,
      20,
    );
    const result = {
      board: board,
      posts: post,
    };
    return result;
  }

  @Get('metadata')
  @ApiOperation({})
  async fetchBoardMetadata(): Promise<ReturnBoardMetadataDto> {
    const metadatas = await this.boardService.fetchBoardMetadata();
    const result = new ReturnBoardMetadataDto();
    metadatas.forEach((metadata) => {
      result.boards.push(metadata.board_name);
    });
    return result;
  }

  @Post()
  @ApiOperation({})
  async createBoard(@Body() board_info: CreateBoardDto) {
    const result = await this.boardService.createBoard(board_info);
    return result;
  }

  @Delete()
  @ApiOperation({})
  async deleteBoard(@Body() board_info: DeleteBoardDto) {
    const result = await this.boardService.deleteBoardByBoardname(board_info);
    return result;
  }

  @Put()
  @ApiOperation({})
  async updateBoard(@Body() board_info: ModifyBoardDto) {
    const result = await this.boardService.modifyBoardByBoardname(board_info);
    return result;
  }
}
