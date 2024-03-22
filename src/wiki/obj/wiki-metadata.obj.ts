import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class WikiMetadata {
  @ApiProperty()
  @IsNumber()
  uid: number;
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsBoolean()
  mustRead: boolean;
}
