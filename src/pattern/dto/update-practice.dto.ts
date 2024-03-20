import { ApiProperty } from "@nestjs/swagger";
import { PatternSourceObject } from "../obj/pattern-source.obj";
import { IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { UpdatePatternInfoDto } from "./update-pattern-info.dto";

export class UpdatePracticeDto extends PatternSourceObject {
  @ApiProperty({
    description: "채보 이름",
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: "레벨",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  level?: number;

  @ApiProperty({
    description: "목표치",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  goalRate?: number;

  @ApiProperty({
    description: "키 개수",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  keyNum?: number;

  @ApiProperty({
    description: "어느 패턴이 등장하는가?",
    required: false,
    example: new UpdatePatternInfoDto(),
  })
  @IsOptional()
  @IsObject()
  patternInfo?: UpdatePatternInfoDto;
}
