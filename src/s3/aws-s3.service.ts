import {
  CopyObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { AwsS3MoveFileDto } from './dao/aws-s3-move-files.dto';
import { AwsS3DeleteFileDto } from './dao/aws-s3-delete-files.dto';
import { AwsS3CopyFileDto } from './dao/aws-s3-copy-files.dto';

@Injectable()
export class AwsS3Service {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_S3_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      },
    });
  }

  /*
    S3 command는 이정도만 알고 있어도 될듯?
    S3 - ***ObjectCommand {
      Bucket : 버킷 이름
      Key : 파일 이름. 디렉터리 경로 포함
      Body : 파일 그 자체. 업로드에만 필요
      ContentType : 파일의 타입. 이미지인가? 압축 파일인가?
    }
  */

  // upload == update
  // 파일 이름이 같으면 update 실행
  async upload(filename: string, filebody: Buffer, type?: string) {
    // type : practice | level-test
    const command: PutObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: type !== undefined ? `${type}/${filename}` : `${filename}`, // fileName. 여기서 폴더 생성 가능
      Body: filebody, // fileContent
    });
    const uploadFile = await this.s3.send(command);
    return uploadFile;
  }

  async download(filename: string, type?: string) {
    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: type !== undefined ? `${type}/${filename}` : `${filename}`,
    });
    const downloadFile = await this.s3.send(command);
    const result = await downloadFile.Body.transformToString('base64');
    return result;
  }

  async delete(files: AwsS3DeleteFileDto[] | string[]) {
    const command: DeleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Delete: {
        Objects: this.makeDeleteObjects(files),
      },
    });
    return await this.s3.send(command);
  }

  async move(files: AwsS3MoveFileDto[]) {
    this.copy(files);
    await this.delete(files);
    await this.delete([files[0].originKey]);
  }

  async copy(files: AwsS3CopyFileDto[]) {
    files.forEach((file) => {
      // 비동기 처리 시 delete 먼저 실행됨 ㅋㅋㄹ
      const command: CopyObjectCommand = new CopyObjectCommand({
        CopySource: `${process.env.AWS_S3_BUCKET_NAME}/${file.originKey}`,
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: file.destinationKey,
      });
      this.s3.send(command);
    });
  }

  private makeDeleteObjects(files: AwsS3DeleteFileDto[] | string[]) {
    return files.map((file) => {
      if (typeof file === 'string') return { Key: file }; // 단순히 파일만 삭제
      return { Key: file.originKey }; // 파일을 이동한 경우 원본 파일 삭제 필요
    });
  }
}
