import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelTest } from '../entity/level-test.entity';
import { Repository } from 'typeorm';
import { CreateLevelTestDto } from '../dto/create-level-test.dto';
import { PatternInfoService } from './pattern-info.service';
import { UpdateLevelTestDto } from '../dto/update-level-test.dto';
import { PatternInfo } from '../entity/pattern-info.entity';

@Injectable()
export class LevelTestService {
  constructor(
    @InjectRepository(LevelTest) private levelTestRepo: Repository<LevelTest>,
    private readonly patternInfoService: PatternInfoService,
  ) {}

  async createEntity(createData: CreateLevelTestDto): Promise<LevelTest> {
    const { patternInfo, ...otherInfo } = createData;
    delete createData.patternInfo;

    const levelTest: LevelTest = {
      ...new LevelTest(),
      ...otherInfo,
    };
    const patternInfoEntity: PatternInfo =
      await this.patternInfoService.createPatternInfoEntity(patternInfo);

    // levelTest.imgSrc = imgSrc;
    // levelTest.noteSrc = noteSrc;
    levelTest.patternInfo = patternInfoEntity;
    return await this.levelTestRepo.save(levelTest);
  }

  async fetchById(id: number): Promise<LevelTest> {
    return await this.findLevelTest(id);
  }

  async fetchAll() {
    return await this.levelTestRepo.find({
      relations: {
        patternInfo: true,
      },
    });
  }

  async updateData(
    id: number,
    updateData: UpdateLevelTestDto,
  ): Promise<LevelTest> {
    const levelTest: LevelTest = await this.findLevelTest(id);

    if (updateData.patternInfo !== undefined) {
      await this.patternInfoService.updatePatternInfoData(
        levelTest.patternInfo.patternId,
        updateData.patternInfo,
      );
    }

    const updateLevelTestData: LevelTest = {
      ...levelTest,
      ...updateData,
    } as LevelTest;
    delete updateLevelTestData.patternInfo;
    console.log(updateLevelTestData);
    await this.levelTestRepo.update(id, updateLevelTestData);
    return await this.findLevelTest(id);
  }

  async deleteById(id: number) {
    /* 나중에 제거가 되지 않을 경우 대비
    const removeTarget = await this.levelTestRepo.findOne({
      select: {
        patternInfo: {
          patternId: true,
        },
      },
      where: {
        testId: id,
      },
      relations: {
        patternInfo: true,
      },
    });
    if (!removeTarget) {
      return [];
    }
    const patternInfoRemove = await this.patternInfoService.deletePatternInfo(removeTarget.patternInfo.patternId);
     */
    return await this.levelTestRepo.delete(id);
  }

  async findLevelTest(id: number): Promise<LevelTest> {
    return await this.levelTestRepo.findOne({
      where: {
        testId: id,
      },
      relations: {
        patternInfo: true,
      },
    });
  }
}
