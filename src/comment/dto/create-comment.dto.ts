import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty()
  content: string;

  @ApiProperty()
  postUid: number;

  @ApiProperty({
    required: false,
  })
  parentId?: number;
}
