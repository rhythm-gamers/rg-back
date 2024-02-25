import { IsArray, IsString } from 'class-validator';

export class ReturnBoardMetadata {
  @IsArray()
  @IsString({ each: true })
  boards: string[];

  constructor() {
    this.boards = [];
  }
}
