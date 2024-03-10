import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty()
  content: string;

  @ApiProperty()
  post_uid: number;

  @ApiProperty({
    required: false,
  })
  parent_id?: number;
}
