import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateUserTitleDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: "djmax 보유 여부",
    example: false,
    required: false,
  })
  djmax?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: "djmax 보유 여부",
    example: false,
    required: false,
  })
  ez2on?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: "리듬닥터 보유 여부",
    example: false,
    required: false,
  })
  rhythmdoctor?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: "얼불춤 보유 여부",
    example: false,
    required: false,
  })
  adofai?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: "식스타게이트 보유 여부",
    example: false,
    required: false,
  })
  sixtargate?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: "뮤즈대쉬 보유 여부",
    example: false,
    required: false,
  })
  muzedash?: boolean;
}
