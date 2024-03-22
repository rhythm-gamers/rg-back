import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { CreatePracticeDto } from "./create-practice.dto";

export class UpdatePracticeDto extends PartialType(CreatePracticeDto) {
  @ApiProperty({
    description: "목표치",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  goalRate?: number;
}
