import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LevelTest } from "../entity/level-test.entity";
import { Repository } from "typeorm";
import { CreateLevelTestDto } from "../dto/create-level-test.dto";
import { PatternInfoService } from "./pattern-info.service";
import { UpdateLevelTestDto } from "../dto/update-level-test.dto";
import { PatternInfo } from "../entity/pattern-info.entity";

@Injectable()
export class LevelTestService {
  constructor(
    @InjectRepository(LevelTest) private levelTestRepo: Repository<LevelTest>,
    private readonly patternInfoService: PatternInfoService,
  ) {}

  async createEntity(createData: CreateLevelTestDto): Promise<LevelTest> {
    const { patternInfo, ...otherInfo } = createData;

    const levelTest: LevelTest = {
      ...new LevelTest(),
      ...otherInfo,
    };
    const patternInfoEntity: PatternInfo =
      await this.patternInfoService.createPatternInfoEntity(patternInfo);

    levelTest.patternInfo = patternInfoEntity;
    return await this.levelTestRepo.save(levelTest);
  }

  async fetchById(
    id: number,
    includePatternInfo: boolean = false,
  ): Promise<LevelTest> {
    return await this.findLevelTest(id, includePatternInfo);
  }

  async fetchByTitle(title: string): Promise<LevelTest> {
    const res = await this.levelTestRepo.findOne({
      where: {
        title: title,
      },
    });
    return res;
  }

  async fetchAll(keyNum?: number) {
    const whereClues = {};
    if (Number.isNaN(keyNum) === false && keyNum != null) {
      whereClues["keyNum"] = keyNum;
    }
    return await this.levelTestRepo.find({
      relations: {
        patternInfo: true,
      },
      where: {
        ...whereClues,
      },
    });
  }

  async updateData(
    id: number,
    updateData: UpdateLevelTestDto,
  ): Promise<LevelTest> {
    const levelTest: LevelTest = await this.findLevelTest(id, true);

    if (updateData.patternInfo !== undefined) {
      updateData.patternInfo =
        await this.patternInfoService.updatePatternInfoData(
          levelTest.patternInfo.id,
          updateData.patternInfo,
        );
    }

    const updateLevelTestData = {
      ...levelTest,
      ...updateData,
    };
    await this.levelTestRepo.save(updateLevelTestData);
    return await this.findLevelTest(id, true);
  }

  async deleteById(id: number) {
    return await this.levelTestRepo.delete(id);
  }

  async findLevelTest(
    id: number,
    includePatternInfo: boolean,
  ): Promise<LevelTest> {
    const relationsClue = includePatternInfo ? { patternInfo: true } : {};
    return await this.levelTestRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        ...relationsClue,
      },
    });
  }
}
