import { ApiProperty } from "@nestjs/swagger";
import { CreatePatternInfoDto } from "./create-pattern-info.dto";
import { PatternSourceObject } from "../obj/pattern-source.obj";
import { IsNumber, IsObject, IsString } from "class-validator";

export class CreateLevelTestDto extends PatternSourceObject {
  @ApiProperty({
    description: "채보 이름",
    example: "test",
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: "레벨",
    example: 3,
  })
  @IsNumber()
  level: number;

  @ApiProperty({
    description: "목표치",
    example: 87.42,
  })
  @IsNumber()
  goalRate: number;

  @ApiProperty({
    description: "키 개수",
    example: 4,
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
