import { ApiProperty } from '@nestjs/swagger';
import { CreatePatternInfoDto } from '../dto/create-pattern-info.dto';

export class CreatePracticeDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  keyNum: number;

  @ApiProperty()
  patternInfo: CreatePatternInfoDto;

  @ApiProperty({
    required: false,
  })
  imgSrc?: string;

  @ApiProperty({
    required: false,
  })
  noteSrc?: string;
}
