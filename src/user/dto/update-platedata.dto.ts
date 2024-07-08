import { PartialType } from "@nestjs/swagger";
import { UpdateChinghoDto } from "./update-chingho.dto";
import { IsNumber, IsOptional } from "class-validator";

// 내부에서만 사용
export class UpdatePlatedataDto extends PartialType(UpdateChinghoDto) {
  @IsNumber()
  @IsOptional()
  currentLevel?: number;

  @IsNumber()
  @IsOptional()
  backgroundDesign?: number;
}
