import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({
    type: "string",
    description: "댓글 내용",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    type: Number,
    description: "게시글 id",
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  postid: number;

  @ApiPropertyOptional({
    type: Number,
    description: "부모 댓글 id",
    required: false,
  })
  @IsNumber()
  @IsOptional()
  parentId?: number;
}
