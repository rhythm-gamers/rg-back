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
    description: "현재 레벨을을 보일 것인가?",
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

  @ApiProperty({
    description: "칭호 아이콘을 보일 것인가?",
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  showChinghoIco?: boolean;

  @ApiProperty({
    description: "운영자가 지정한 뱃지 디자인 선택",
    example: 3,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  showBgdesign?: number;
}
