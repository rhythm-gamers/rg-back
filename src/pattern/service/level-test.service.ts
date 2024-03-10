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

  async createEntity(create_data: CreateLevelTestDto): Promise<LevelTest> {
    const { pattern_info, ...other_info } = create_data;
    delete create_data.pattern_info;

    const level_test: LevelTest = {
      ...new LevelTest(),
      ...other_info,
    };
    const pattern_info_entity: PatternInfo =
      await this.patternInfoService.createPatternInfoEntity(pattern_info);

    // level_test.img_src = img_src;
    // level_test.note_src = note_src;
    level_test.pattern_info = pattern_info_entity;
    return await this.levelTestRepo.save(level_test);
  }

  async fetchById(id: number): Promise<LevelTest> {
    return await this.findLevelTest(id);
  }

  async fetchAll() {
    return await this.levelTestRepo.find({
      relations: {
        pattern_info: true,
      },
    });
  }

  async updateData(
    id: number,
    update_data: UpdateLevelTestDto,
  ): Promise<LevelTest> {
    const level_test: LevelTest = await this.findLevelTest(id);

    if (update_data.pattern_info !== undefined) {
      await this.patternInfoService.updatePatternInfoData(
        level_test.pattern_info.pattern_id,
        update_data.pattern_info,
      );
    }

    const update_level_test_data: LevelTest = {
      ...level_test,
      ...update_data,
    } as LevelTest;
    delete update_level_test_data.pattern_info;
    console.log(update_level_test_data);
    await this.levelTestRepo.update(id, update_level_test_data);
    return await this.findLevelTest(id);
  }

  async deleteById(id: number) {
    /* 나중에 제거가 되지 않을 경우 대비
    const remove_target = await this.levelTestRepo.findOne({
      select: {
        pattern_info: {
          pattern_id: true,
        },
      },
      where: {
        test_id: id,
      },
      relations: {
        pattern_info: true,
      },
    });
    if (!remove_target) {
      return [];
    }
    const pattern_info_remove = await this.patternInfoService.deletePatternInfo(remove_target.pattern_info.pattern_id);
     */
    return await this.levelTestRepo.delete(id);
  }

  async findLevelTest(id: number): Promise<LevelTest> {
    return await this.levelTestRepo.findOne({
      where: {
        test_id: id,
      },
      relations: {
        pattern_info: true,
      },
    });
  }
}
