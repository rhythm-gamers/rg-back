import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateIntroductionDto {
  @ApiProperty({
    description: "자기 소개를 입력하세요",
    example: "저는 rgback 관리자입니다.",
    required: true,
  })
  @IsString()
  introduction: string;
}
