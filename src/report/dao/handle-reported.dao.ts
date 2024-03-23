import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class HandleReportedDao {
  @ApiProperty()
  @IsNumber()
  reportId: number;
}
