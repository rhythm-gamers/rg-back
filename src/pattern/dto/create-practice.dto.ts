import { ApiProperty } from "@nestjs/swagger";
import { CreatePatternInfoDto } from "../dto/create-pattern-info.dto";
import { PatternSourceObject } from "../obj/pattern-source.obj";
import { IsNumber, IsObject, IsString } from "class-validator";

export class CreatePracticeDto extends PatternSourceObject {
  @ApiProperty({
    description: "채보 이름",
    example: "test",
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: "레벨",
    example: 2,
  })
  @IsNumber()
  level: number;

  @ApiProperty({
    description: "키 개수",
    example: 5,
  })
  @IsNumber()
  keyNum: number;

  @ApiProperty({
    description: "어느 패턴이 등장하는가?",
    example: new CreatePatternInfoDto(),
  })
  @IsObject()
  patternInfo: CreatePatternInfoDto;
}
