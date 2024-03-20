import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class PatternInfoObj {
  @ApiProperty({
    required: false,
    example: 1,
    description: "연타",
  })
  @IsOptional()
  @IsNumber()
  roll?: number;

  @ApiProperty({
    required: false,
    example: 1,
    description: "즈레",
  })
  @IsOptional()
  @IsNumber()
  offGrid?: number;

  @ApiProperty({
    required: false,
    example: 1,
    description: "계단",
  })
  @IsOptional()
  @IsNumber()
  stairs?: number;

  @ApiProperty({
    required: false,
    example: 1,
    description: "폭타",
  })
  @IsOptional()
  @IsNumber()
  peak?: number;

  @ApiProperty({
    required: false,
    example: 1,
    description: "동치/동타",
  })
  @IsOptional()
  @IsNumber()
  multiples?: number;

  @ApiProperty({
    required: false,
    example: 1,
    description: "트릴",
  })
  @IsOptional()
  @IsNumber()
  trill?: number;

  @ApiProperty({
    required: false,
    example: 1,
    description: "롱잡",
  })
  @IsOptional()
  @IsNumber()
  hold?: number;

  constructor() {
    this.roll = 0;
    this.offGrid = 0;
    this.stairs = 0;
    this.peak = 0;
    this.multiples = 0;
    this.trill = 0;
    this.hold = 0;
  }
}
