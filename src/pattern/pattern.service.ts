import { Injectable } from '@nestjs/common';
import { AwsS3Service } from 'src/s3/aws-s3.service';
import { CreateLevelTestDto } from './dto/create-level-test.dto';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdateLevelTestDto } from './dto/update-level-test.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { Practice } from './entity/practice.entity';
import { LevelTest } from './entity/level-test.entity';

type CreateDto = CreatePracticeDto | CreateLevelTestDto;
type UpdateDto = UpdatePracticeDto | UpdateLevelTestDto;

@Injectable()
export class PatternService {
  constructor(private readonly awsS3Service: AwsS3Service) {}
  // 운영자가 추가: `${rootDir}/${keyNum}/${title}/${mime}`
  // 사용자가 추가: `${rootDir}/${keyNum}/${title}-${salt}/${mime}`

  async upload(
    rootDir: string, // practice, level-test
    data: CreateDto | UpdateDto,
    mime: string | ('img' | 'note' | 'mp3'),
  ): Promise<string> {
    const file = Buffer.from(data[`${mime}Src`], 'base64');
    const filepath = this.generateDestinationPath(rootDir, data, mime);
    await this.awsS3Service.upload(filepath, file);
    return filepath;
  }

  async copyDefaultFile(destination: string): Promise<string> {
    const mime = destination.split('/').pop();
    this.awsS3Service.copy({
      originKey: `undefined.${mime}`,
      destinationKey: destination,
    });
    return destination;
  }

  async buildCreateData(data: CreateDto, directory: string) {
    data.imgSrc = await this.create(data, directory, 'img');
    data.noteSrc = await this.create(data, directory, 'note');
    data.musicSrc = await this.create(data, directory, 'music');
  }

  async buildUpdateData(data: UpdateDto, directory: string) {
    data.imgSrc = await this.update(data, directory, 'img');
    data.noteSrc = await this.update(data, directory, 'note');
    data.musicSrc = await this.update(data, directory, 'music');
  }

  async create(data: CreateDto, type: string, mime: string) {
    return data[`${mime}Src`] !== undefined
      ? await this.upload(type, data, mime)
      : await this.copyDefaultFile(
          this.generateDestinationPath(type, data, mime),
        );
  }

  async update(data: UpdateDto, rootDir: string, mime: string) {
    return data[`${mime}Src`] !== undefined
      ? await this.upload(rootDir, data, mime)
      : this.generateDestinationPath(rootDir, data, mime);
  }

  async move(entity: LevelTest | Practice, data: UpdateDto, directory: string) {
    const mimes = ['img', 'note', 'music'];
    for (const mime of mimes) {
      await this.awsS3Service.move({
        originKey: entity[`${mime}Src`],
        destinationKey: this.generateDestinationPath(directory, data, mime),
      });
    }
  }

  async delete(entity: LevelTest | Practice) {
    await this.awsS3Service.deletes([
      entity.imgSrc,
      entity.noteSrc,
      entity.musicSrc,
    ]);
  }

  private generateDestinationPath(
    rootDir: string,
    data: UpdateDto,
    mime: string,
  ) {
    return `${rootDir}/${data.keyNum}/${data.title}/${mime}`;
  }
}
