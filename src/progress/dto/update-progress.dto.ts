import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateProgressDto {
  @ApiProperty({
    example: 30.2,
    required: true,
    description: "달성도를 적어주시면 됩니다",
  })
  @IsNumber()
  @IsNotEmpty()
  progress: number;
}
