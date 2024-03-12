import { ApiProperty } from "@nestjs/swagger";

export class UpdateProgressDto {
  @ApiProperty()
  progress: number;
}
