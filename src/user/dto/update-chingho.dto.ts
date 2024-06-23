import { IsIn, IsNumber, IsString } from "class-validator";
import {
  rareness as chinghoRareness,
  title as chinghoTitle,
} from "../../chingho/obj/chingho.obj";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateChinghoDto {
  @IsNumber()
  @IsIn(Object.keys(chinghoRareness).map((data) => +data))
  @ApiProperty({
    description: "칭호 랭크",
    example: "one of [1, 2, 3, 4]",
    required: true,
  })
  rareness: number;

  @IsString()
  @IsIn(Object.values(chinghoTitle))
  @ApiProperty({
    description: "칭호 이름",
    example: `one of [${Object.values(chinghoTitle)}]`,
    required: true,
  })
  title: string;
}
