import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateWikiDto {
  @ApiProperty({
    example: "test",
  })
  @IsString()
  title: string;
  @ApiProperty({
    example: "테스트용 데이터입니다.",
  })
  @IsString()
  content: string;
  @ApiPropertyOptional({
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  mustRead?: boolean;
}
