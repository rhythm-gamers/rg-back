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
        board_name: true,
      },
    });
    return board;
  }

  async createBoard(board_info: CreateBoardDto) {
    const board = new Board();
    board.board_name = board_info.board_name;
    board.description = board_info.description;
    return await this.boardRepository.insert(board);
  }

  async fetchBoardByBoardname(board_info: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: {
        board_name: board_info,
      },
    });
    return board;
  }

  async deleteBoardByBoardname(board_name: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: {
        board_name: board_name,
      },
    });
    return await this.boardRepository.remove(board);
  }

  async modifyBoardByBoardname(
    board_info: ModifyBoardDto,
    origin_name: string,
  ): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: {
        board_name: origin_name,
      },
    });

    if (board_info.board_name) {
      board.board_name = board_info.board_name;
    }
    if (board_info.description) {
      board.description = board_info.description;
    }

    return await this.boardRepository.save(board);
  }
}
