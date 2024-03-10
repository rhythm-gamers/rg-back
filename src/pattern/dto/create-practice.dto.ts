import { ApiProperty } from "@nestjs/swagger";
import { CreatePatternInfoDto } from "../dto/create-pattern-info.dto";

export class CreatePracticeDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  key_num: number;

  @ApiProperty()
  pattern_info: CreatePatternInfoDto;

  @ApiProperty({
    required: false,
  })
  img_src?: string;

  @ApiProperty({
    required: false,
  })
  note_src?: string;
}
