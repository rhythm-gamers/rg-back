import { ApiProperty } from "@nestjs/swagger";
import { CreatePatternInfoDto } from "./create-pattern-info.dto";

export class UpdateLevelTestDto {
  @ApiProperty({
    description: "채보 이름",
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: "레벨",
    required: false,
  })
  level?: number;

  @ApiProperty({
    description: "목표치",
    required: false,
  })
  goal_rate?: number;

  @ApiProperty({
    required: false,
  })
  key_num?: number;

  @ApiProperty({
    description: "어느 패턴이 등장하는가?",
    required: false,
  })
  pattern_info?: CreatePatternInfoDto;

  @ApiProperty({
    description: "base64로 인코딩된 이미지",
    required: false,
  })
  img_src?: string;

  @ApiProperty({
    description: "base64로 인코딩된 채보 파일",
    required: false,
  })
  note_src?: string;
}
