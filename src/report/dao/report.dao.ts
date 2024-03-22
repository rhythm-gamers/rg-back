import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class ReportDao {
  @ApiProperty()
  @IsNumber()
  targetId: number;
  @ApiProperty()
  @IsString()
  reason: string;
}
