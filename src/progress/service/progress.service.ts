import { BadRequestException, Injectable } from "@nestjs/common";
import { LevelTestProgressService } from "./level-test-progress.service";
import { PracticeProgressService } from "./practice-progress.service";
import { UserService } from "src/user/user.service";
import { LevelTestService } from "src/pattern/service/level-test.service";
import { PracticeService } from "src/pattern/service/practice.service";

@Injectable()
export class ProgressService {
  constructor(
    private readonly levelTestProgressService: LevelTestProgressService,
    private readonly levelTestService: LevelTestService,
    private readonly practiceProgressService: PracticeProgressService,
    private readonly practiceService: PracticeService,
    private readonly userService: UserService,
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
    const user = await this.userService.fetchWithUserId(userId);

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
    const user = await this.userService.fetchWithUserId(userId);

    return await this.practiceProgressService.update(progress, user, practice);
  }

  async fetchLeveltestProgress(userId: number, testId: number) {
    return await this.levelTestProgressService.fetch(userId, testId);
  }

  async fetchPracticeProgress(userId: number, practiceId: number) {
    return await this.practiceProgressService.fetch(userId, practiceId);
  }
}
