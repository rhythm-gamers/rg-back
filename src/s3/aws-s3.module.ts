import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { AwsS3Controller } from './aws-s3.controller';

@Module({
  controllers: [AwsS3Controller],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
