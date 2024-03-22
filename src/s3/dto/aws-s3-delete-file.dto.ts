import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AwsS3DeleteFileDto {
  @ApiProperty()
  @IsString()
  originKey: string;
}
