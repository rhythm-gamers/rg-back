import { BadRequestException, Injectable } from "@nestjs/common";
import { LevelTestService } from "src/pattern/service/level-test.service";
import { PracticeService } from "src/pattern/service/practice.service";
import { RLevelTestProgressService } from "./rlevel-test-progress.service";
import { RPracticeProgressService } from "./rpractice-progress.service";
import { RUserService } from "src/user/service/ruser.service";
import { RPlateDataService } from "src/plate/service/rplate-data.service";
import { RPlateData } from "src/plate/entity/rplate-data.entity";

@Injectable()
export class RProgressService {
  constructor(
    private readonly levelTestService: LevelTestService,
    private readonly practiceService: PracticeService,
    private readonly userService: RUserService,
    private readonly levelTestProgressService: RLevelTestProgressService,
    private readonly practiceProgressService: RPracticeProgressService,
    private readonly plateDataService: RPlateDataService,
  ) {}

  async updateLeveltestProgress(
    progress: number,
    userId: number,
    testId: number,
  ) {
    const levelTest = await this.levelTestService.fetchById(testId);
    if (levelTest == null) {
      throw new BadRequestException("해당 레벨 테스트는 없습니다.");
    }
    const user = await this.userService.fetchByUserid(userId);

    const plateData: RPlateData =
      await this.plateDataService.fetchByUserid(userId);
    const currentLevel: number = plateData.currentLevel;
    if (currentLevel < levelTest.level) {
      await this.plateDataService.update(userId, {
        currentLevel: levelTest.level,
      });
    }

    return await this.levelTestProgressService.update(
      progress,
      user,
      levelTest,
    );
  }

  async updatePracticeProgress(
    progress: number,
    userId: number,
    practiceId: number,
  ) {
    const practice = await this.practiceService.fetchById(practiceId);
    if (practice == null) {
      throw new BadRequestException("해당 패턴 연습은 없습니다.");
    }
    const user = await this.userService.fetchByUserid(userId);

    return await this.practiceProgressService.update(progress, user, practice);
  }

  async fetchLeveltestProgress(userId: number, testId: number) {
    return await this.levelTestProgressService.fetch(userId, testId);
  }

  async fetchPracticeProgress(userId: number, practiceId: number) {
    return await this.practiceProgressService.fetch(userId, practiceId);
  }

  async fetchAllLevelTestProgress(userId: number, keyNum: number) {
    return await this.levelTestProgressService.fetchAllByUserId(userId, keyNum);
  }

  async fetchAllPracticeProgress(userId: number, keyNum: number) {
    return await this.practiceProgressService.fetchAllByUserId(userId, keyNum);
  }

  async fetchLevelTestRanking(id: number) {
    return await this.levelTestProgressService.fetchRanking(id);
  }

  async fetchPracticeRanking(id: number) {
    return await this.practiceProgressService.fetchRanking(id);
  }
}
