import { ApiProperty } from "@nestjs/swagger";
import { IsBase64, IsOptional } from "class-validator";

export class PatternSourceObject {
  @ApiProperty({
    description: "base64로 인코딩된 자켓 이미지",
    required: false,
  })
  @IsBase64()
  @IsOptional()
  imgSrc?: string;

  @ApiProperty({
    description: "base64로 인코딩된 채보 파일",
    required: false,
  })
  @IsBase64()
  @IsOptional()
  noteSrc?: string;

  @ApiProperty({
    description: "base64로 인코딩된 음원 파일",
    required: false,
  })
  @IsBase64()
  @IsOptional()
  musicSrc?: string;
}

export enum SourceInfoType {
  Note = "noteSrc",
  Music = "musicSrc",
  Image = "imgSrc",
}
