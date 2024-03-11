import { Injectable } from '@nestjs/common';
import { AwsS3Service } from 'src/s3/aws-s3.service';
import { AwsS3MoveFileDto } from 'src/s3/dao/aws-s3-move-files.dto';

@Injectable()
export class PatternService {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  async upload(
    type: string,
    title: string,
    filetype: 'img' | 'note',
    data: string,
  ): Promise<string> {
    const file = Buffer.from(data, 'base64');
    await this.awsS3Service.upload(`${filetype}`, file, `${type}/${title}`);
    return `${type}/${title}/${filetype}`;
  }

  async copy(type: string, destination: string): Promise<string> {
    //destination : <type>/<title>/<ico/note>
    const filetype = destination.split('/').pop();
    this.awsS3Service.copy([
      {
        originKey: `undefined.${filetype}`,
        destinationKey: `${type}/${destination}`,
      } as AwsS3MoveFileDto,
    ]);
    return `${type}/${destination}`;
  }
}
