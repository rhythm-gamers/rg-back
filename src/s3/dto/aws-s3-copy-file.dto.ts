import { ApiProperty } from "@nestjs/swagger";
import { AwsS3DeleteFileDto } from "./aws-s3-delete-file.dto";
import { IsString } from "class-validator";

export class AwsS3CopyFileDto extends AwsS3DeleteFileDto {
  @ApiProperty()
  @IsString()
  destinationKey: string;
}
