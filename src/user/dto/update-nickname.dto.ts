import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateNicknameDto {
  @ApiProperty({
    description: "변경할 닉네임을 입력해주세요",
    example: "TEstingnICknAME",
    required: true,
  })
  @IsString()
  nickname: string;
}
