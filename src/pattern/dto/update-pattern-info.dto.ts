import { ApiProperty } from "@nestjs/swagger";

export class UpdatePatternInfoDto {
  @ApiProperty({
    required: false,
  })
  roll: number;

  @ApiProperty({
    required: false,
  })
  off_grid: number;

  @ApiProperty({
    required: false,
  })
  stairs: number;

  @ApiProperty({
    required: false,
  })
  peak: number;

  @ApiProperty({
    required: false,
  })
  multiples: number;

  @ApiProperty({
    required: false,
  })
  trill: number;

  @ApiProperty({
    required: false,
  })
  hold: number;

  constructor() {
    this.roll = 0;
    this.off_grid = 0;
    this.stairs = 0;
    this.peak = 0;
    this.multiples = 0;
    this.trill = 0;
    this.hold = 0;
  }
}
