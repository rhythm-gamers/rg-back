import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateWikiDataDto {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  content: string;
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  mustRead?: boolean;
}
