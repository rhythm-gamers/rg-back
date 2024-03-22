import { ApiProperty } from "@nestjs/swagger";
import { HandleReportedDao } from "../dao/handle-reported.dao";
import { IsNumber, IsString } from "class-validator";

export class HandleReportedUserDto extends HandleReportedDao {
  @ApiProperty()
  @IsNumber()
  duration: number;
  @ApiProperty()
  @IsString()
  reason: string;
}
