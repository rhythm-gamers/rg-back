import { AwsS3DeleteFileDto } from "./aws-s3-delete-files.dto";

export interface AwsS3CopyFileDto extends AwsS3DeleteFileDto {
  destination_key: string;
}
