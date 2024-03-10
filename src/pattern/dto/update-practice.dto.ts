import { ApiProperty } from "@nestjs/swagger";
import { CreatePatternInfoDto } from "./create-pattern-info.dto";

export class UpdatePracticeDto {
  @ApiProperty({
    required: false,
  })
  title?: string;

  @ApiProperty({
    required: false,
  })
  level?: number;

  @ApiProperty({
    required: false,
  })
  key_num?: number;

  @ApiProperty({
    required: false,
  })
  pattern_info?: CreatePatternInfoDto;

  @ApiProperty({
    required: false,
  })
  img_src?: string;

  @ApiProperty({
    required: false,
  })
  note_src?: string;
}
