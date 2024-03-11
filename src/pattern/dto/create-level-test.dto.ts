import { ApiProperty } from '@nestjs/swagger';
import { CreatePatternInfoDto } from './create-pattern-info.dto';

export class CreateLevelTestDto {
  @ApiProperty({
    description: '채보 이름',
  })
  title: string;

  @ApiProperty({
    description: '레벨',
  })
  level: number;

  @ApiProperty({
    description: '목표치',
  })
  goalRate: number;

  @ApiProperty()
  keyNum: number;

  @ApiProperty({
    type: CreatePatternInfoDto,
    description: '어느 패턴이 등장하는가?',
  })
  patternInfo: CreatePatternInfoDto;

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
