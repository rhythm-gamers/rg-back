import { IsArray, IsString } from "class-validator";

export class ReturnBoardMetadataDto {
  @IsArray()
  @IsString({ each: true })
  boards: string[];

  constructor() {
    this.boards = [];
  }
}
