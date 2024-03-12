import { AwsS3DeleteFileDto } from './aws-s3-delete-file.dto';

export interface AwsS3CopyFileDto extends AwsS3DeleteFileDto {
  destinationKey: string;
}
