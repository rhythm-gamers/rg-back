import { ApiProperty } from "@nestjs/swagger";
import { CreatePatternInfoDto } from "./create-pattern-info.dto";
import { PatternSourceObject } from "../obj/pattern-source.obj";

export class UpdatePracticeDto extends PatternSourceObject {
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
    description: "키 개수",
    required: false,
  })
  keyNum?: number;

  @ApiProperty({
    description: "어느 패턴이 등장하는가?",
    required: false,
  })
  patternInfo?: CreatePatternInfoDto;
}
