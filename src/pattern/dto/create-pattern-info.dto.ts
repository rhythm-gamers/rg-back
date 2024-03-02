import { ApiProperty } from '@nestjs/swagger';

export class CreatePatternInfoDto {
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
}
