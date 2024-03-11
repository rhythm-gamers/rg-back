import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { ApiTags } from '@nestjs/swagger';

class Base64Test {
  filename: string;
  file: string;
}

// 테스트용 임시 controller
@ApiTags('AWS S3')
@Controller('aws-s3')
export class AwsS3Controller {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  @Post() // 파일 이름이 같다면 덮어쓰기 동작
  async uploadFile(@Body() file: Base64Test) {
    console.log(file);
    const fileBuffer = Buffer.from(file.file, 'base64');
    return this.awsS3Service.upload(file.filename, fileBuffer, 'test');
  }

  @Get()
  async downloadFile(@Query('filename') filename: string) {
    return await this.awsS3Service.download(filename);
  }

  @Delete(':path/:filename')
  async deleteFile(
    @Param('path') path: string, // 루트 경로는 _, 파일 구조는 %2F로 인코딩해서 보내세용
    @Param('filename') filename: string,
  ) {
    console.log(path, filename);
    // return await this.awsS3Service.delete(
    //   path === '_' ? `${filename}` : `${path}/${filename}`,
    // );
  }
}
