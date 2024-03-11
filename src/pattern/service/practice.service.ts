import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Practice } from '../entity/practice.entity';
import { Repository } from 'typeorm';
import { CreatePracticeDto } from '../dto/create-practice.dto';
import { UpdatePracticeDto } from '../dto/update-practice.dto';
import { PatternInfo } from '../entity/pattern-info.entity';
import { PatternInfoService } from './pattern-info.service';

@Injectable()
export class PracticeService {
  constructor(
    @InjectRepository(Practice) private practiceRepo: Repository<Practice>,
    private readonly patternInfoService: PatternInfoService,
  ) {}

  async createEntity(createData: CreatePracticeDto): Promise<Practice> {
    const { patternInfo, ...otherInfo } = createData;

    const practice: Practice = {
      ...new Practice(),
      ...otherInfo,
    };
    const patternInfoEntity: PatternInfo =
      await this.patternInfoService.createPatternInfoEntity(patternInfo);

    // practice.imgSrc = imgSrc;
    // practice.noteSrc = noteSrc;
    practice.patternInfo = patternInfoEntity;
    return await this.practiceRepo.save(practice);
  }

  async fetchById(id: number): Promise<Practice> {
    return await this.findPractice(id);
  }

  async fetchAll() {
    return await this.practiceRepo.find({
      relations: {
        patternInfo: true,
      },
    });
  }

  async updateData(
    id: number,
    updateData: UpdatePracticeDto,
  ): Promise<Practice> {
    const practice: Practice = await this.findPractice(id);

    if (updateData.patternInfo !== undefined) {
      await this.patternInfoService.updatePatternInfoData(
        practice.patternInfo.patternId,
        updateData.patternInfo,
      );
      delete updateData.patternInfo;
    }

    const updatePracticeData: Practice = {
      ...practice,
      ...updateData,
    } as Practice;
    await this.practiceRepo.update(id, updatePracticeData);
    return await this.findPractice(id);
  }

  async deleteById(id: number) {
    return await this.practiceRepo.delete(id);
  }

  async findPractice(id: number): Promise<Practice> {
    return await this.practiceRepo.findOne({
      where: {
        practiceId: id,
      },
      relations: {
        patternInfo: true,
      },
    });
  }
}
