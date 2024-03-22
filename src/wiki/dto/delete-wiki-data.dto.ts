import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class DeleteWikiDataDto {
  @ApiPropertyOptional()
  @IsString()
  title?: string;
  @ApiPropertyOptional()
  @IsNumber()
  wikiId?: number;
}
