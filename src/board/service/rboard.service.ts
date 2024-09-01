import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundError, QueryFailedError, Repository } from "typeorm";
import { Board } from "../entity/board.entity";
import { CreateBoardDto } from "../dto/create-board.dto";
import { UpdateBoardDto } from "../dto/update-board.dto";
import { ApiTags } from "@nestjs/swagger";

@Injectable()
@ApiTags("rboard")
export class RBoardService {
  constructor(
    @InjectRepository(Board) private readonly boardRepo: Repository<Board>,
  ) {}

  async create(dto: CreateBoardDto) {
    const board = new Board();
    board.boardName = dto.boardName;
    board.description = dto.description;
    try {
      return await this.boardRepo.save(board);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async fetchOne(boardname: string) {
    const board = await this.boardRepo.findOneBy({
      boardName: boardname,
    });
    if (!board) throw new Error("게시판 존재 X");
    return board;
  }

  async fetchAll() {
    return await this.boardRepo.find();
  }

  async update(boardname: string, dto: UpdateBoardDto) {
    try {
      const board = await this.boardRepo.findOneByOrFail({
        boardName: boardname,
      });
      board.boardName = dto.boardName;
      board.description = dto.description;
      await this.boardRepo.update(
        {
          boardName: boardname,
        },
        dto,
      );
    } catch (e) {
      if (e instanceof EntityNotFoundError) throw new Error(e.message);
      if (e instanceof QueryFailedError) throw new Error(e.message);
    }
  }

  async delete(boardname: string) {
    try {
      this.boardRepo.delete({
        boardName: boardname,
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
