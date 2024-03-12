import { ApiProperty } from "@nestjs/swagger";
import { CreatePatternInfoDto } from "../dto/create-pattern-info.dto";
import { PatternSourceObject } from "../obj/pattern-source.obj";

export class CreatePracticeDto extends PatternSourceObject {
  @ApiProperty({
    description: "채보 이름",
  })
  title: string;

  @ApiProperty({
    description: "레벨",
  })
  level: number;

  @ApiProperty({
    description: "키 개수",
  })
  keyNum: number;

  @ApiProperty({
    description: "어느 패턴이 등장하는가?",
  })
  patternInfo: CreatePatternInfoDto;
}
