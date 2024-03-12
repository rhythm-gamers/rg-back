import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { AwsS3MoveFileDto } from './dto/aws-s3-move-file.dto';
import { AwsS3DeleteFileDto } from './dto/aws-s3-delete-file.dto';
import { AwsS3CopyFileDto } from './dto/aws-s3-copy-file.dto';

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
  async upload(filepath: string, filebody: Buffer) {
    // type : practice | level-test
    const command: PutObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filepath,
      Body: filebody, // fileContent
    });
    const uploadFile = await this.s3.send(command);
    return uploadFile;
  }

  async download(filename: string, type?: string) {
    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key:
        type !== undefined
          ? encodeURI(`${type}/${filename}`)
          : encodeURI(`${filename}`),
    });
    const downloadFile = await this.s3.send(command);
    const result = await downloadFile.Body.transformToString('base64');
    return result;
  }

  async deletes(files: AwsS3DeleteFileDto[] | string[]) {
    const command: DeleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Delete: {
        Objects: this.makeDeleteObjects(files),
      },
    });
    return await this.s3.send(command);
  }

  async delete(file: AwsS3DeleteFileDto | string) {
    const command: DeleteObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: this.makeDeleteObject(file),
    });
    try {
      await this.s3.send(command);
    } catch (err) {
      console.error('Error deleting object:', err);
      throw err;
    }
  }

  async copy(file: AwsS3CopyFileDto) {
    const command: CopyObjectCommand = new CopyObjectCommand({
      CopySource: encodeURI(
        `${process.env.AWS_S3_BUCKET_NAME}/${file.originKey}`,
      ),
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file.destinationKey,
    });

    try {
      await this.s3.send(command);
    } catch (err) {
      console.error('Error deleting object:', err);
      throw err;
    }
  }

  async moves(files: AwsS3MoveFileDto[]) {
    for (const file of files) {
      await this.move(file);
    }
  }

  async move(file: AwsS3MoveFileDto) {
    await this.copy(file);
    await this.delete(file.originKey);
  }

  private makeDeleteObjects(files: AwsS3DeleteFileDto[] | string[]) {
    return files.map((file) => {
      return { Key: this.makeDeleteObject(file) };
    });
  }

  private makeDeleteObject(file: AwsS3DeleteFileDto | string) {
    return typeof file === 'string' ? file : file.originKey;
  }
}
