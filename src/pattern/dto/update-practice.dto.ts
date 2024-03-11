import { ApiProperty } from '@nestjs/swagger';
import { CreatePatternInfoDto } from './create-pattern-info.dto';

export class UpdatePracticeDto {
  @ApiProperty({
    required: false,
  })
  title?: string;

  @ApiProperty({
    required: false,
  })
  level?: number;

  @ApiProperty({
    required: false,
  })
  keyNum?: number;

  @ApiProperty({
    required: false,
  })
  patternInfo?: CreatePatternInfoDto;

  @ApiProperty({
    required: false,
  })
  imgSrc?: string;

  @ApiProperty({
    required: false,
  })
  noteSrc?: string;
}
