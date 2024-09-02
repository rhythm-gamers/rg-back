import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SearchPostQuery {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  searchTerm: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  boardname: string;

  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  take: number;
}
