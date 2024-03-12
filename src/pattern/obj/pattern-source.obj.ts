import { ApiProperty } from '@nestjs/swagger';

export class PatternSourceObject {
  @ApiProperty({
    description: 'base64로 인코딩된 자켓 이미지',
    required: false,
  })
  imgSrc?: string;

  @ApiProperty({
    description: 'base64로 인코딩된 채보 파일',
    required: false,
  })
  noteSrc?: string;

  @ApiProperty({
    description: 'base64로 인코딩된 음원 파일',
    required: false,
  })
  musicSrc?: string;
}

export enum SourceInfoType {
  Note = 'noteSrc',
  Music = 'musicSrc',
  Image = 'imgSrc',
}
