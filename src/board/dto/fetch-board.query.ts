import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class FetchBoardQuery {
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
