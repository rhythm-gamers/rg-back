import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class UpdatePlateSettingDto {
  @ApiProperty({
    description: "한줄 인사말을 보일 것인가?",
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  showComment?: boolean;

  @ApiProperty({
    description: "현재 레벨을 보일 것인가?",
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  showLevel?: boolean;

  @ApiProperty({
    description: "칭호를 보일 것인가?",
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  showChingho?: boolean;

  // 칭호 아이콘과 칭호는 같이 보여야 한다?
  // @ApiProperty({
  //   description: "칭호 아이콘을 보일 것인가?",
  //   example: false,
  //   required: false,
  // })
  // @IsBoolean()
  // @IsOptional()
  // showChinghoIco?: boolean;

  @ApiProperty({
    description: "배경 디자인을 보일 것인가?",
    example: false,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  showBgdesign?: boolean;
}
