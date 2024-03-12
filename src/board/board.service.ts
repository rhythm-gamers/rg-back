import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entity/board.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { ModifyBoardDto } from './dto/modify-board.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Board')
@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
  ) {}

  // /*
  // Board의 경우에는 많지 않아
  // 문자열 비교로 해도 크게 성능 문제가 없을 것 같아용
  // */

  async fetchBoardMetadata() {
    const board = await this.boardRepository.find({
      select: {
        boardName: true,
      },
    });
    return board;
  }

  async createBoard(boardInfo: CreateBoardDto) {
    const board = new Board();
    board.boardName = boardInfo.boardName;
    board.description = boardInfo.description;
    return await this.boardRepository.insert(board);
  }

  async fetchBoardByBoardname(boardName: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: {
        boardName: boardName,
      },
    });
    return board;
  }

  async deleteBoardByBoardname(boardName: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: {
        boardName: boardName,
      },
    });
    return await this.boardRepository.remove(board);
  }

  async modifyBoardByBoardname(
    boardInfo: ModifyBoardDto,
    originName: string,
  ): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: {
        boardName: originName,
      },
    });

    if (boardInfo.boardName) {
      board.boardName = boardInfo.boardName;
    }
    if (boardInfo.description) {
      board.description = boardInfo.description;
    }

    return await this.boardRepository.save(board);
  }
}
