import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: "string",
    description: "게시판 이름",
    example: "자유게시판",
    required: true,
  })
  boardName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: "string",
    description: "게시판 설명",
    example: "자유롭게 의견을 남기는 게시판입니다",
    required: false,
  })
  description?: string;
}
