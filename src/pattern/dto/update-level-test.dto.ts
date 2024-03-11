import { ApiProperty } from '@nestjs/swagger';
import { CreatePatternInfoDto } from './create-pattern-info.dto';

export class UpdateLevelTestDto {
  @ApiProperty({
    description: '채보 이름',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: '레벨',
    required: false,
  })
  level?: number;

  @ApiProperty({
    description: '목표치',
    required: false,
  })
  goalRate?: number;

  @ApiProperty({
    required: false,
  })
  keyNum?: number;

  @ApiProperty({
    description: '어느 패턴이 등장하는가?',
    required: false,
  })
  patternInfo?: CreatePatternInfoDto;

  @ApiProperty({
    description: 'base64로 인코딩된 이미지',
    required: false,
  })
  imgSrc?: string;

  @ApiProperty({
    description: 'base64로 인코딩된 채보 파일',
    required: false,
  })
  noteSrc?: string;
}
