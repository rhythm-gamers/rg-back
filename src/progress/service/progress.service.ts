import { Injectable } from "@nestjs/common";
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

  async updatePractice(progress: number, user_id: number, practice_id: number) {
    const practice = await this.practiceService.fetchById(practice_id);
    const user =
      await this.userService.fetchUserPracticeProgressWithUserId(user_id);

    return await this.practiceProgressService.update(progress, user, practice);
  }

  async updateLeveltest(progress: number, user_id: number, test_id: number) {
    const level_test = await this.levelTestService.fetchById(test_id);
    const user =
      await this.userService.fetchUserLevelTestProgressWithUserId(user_id);

    return await this.levelTestProgressService.update(
      progress,
      user,
      level_test,
    );
  }
}
