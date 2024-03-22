import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  boardName: string;
  @IsString()
  @IsOptional()
  description?: string;
}
