import { IsIn, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateChinghoDto {
  @IsNumber()
  @IsIn([1, 2, 3, 4])
  @ApiProperty({
    description: "칭호 랭크",
    example: "one of [1, 2, 3, 4]",
    required: true,
  })
  rareness: number;

  @IsString()
  @IsIn(["뮤즈대시", "리듬닥터", "디맥", "얼불춤", "투온", "식스타"])
  @ApiProperty({
    description: "칭호 이름",
    example: `one of [뮤즈대시, 리듬닥터, 디맥, 얼불춤, 투온, 식스타"]`,
    required: true,
  })
  title: string;
}
