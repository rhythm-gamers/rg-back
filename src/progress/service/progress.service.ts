import { Injectable } from '@nestjs/common';
import { LevelTestProgressService } from './level-test-progress.service';
import { PracticeProgressService } from './practice-progress.service';
import { UserService } from 'src/user/user.service';
import { LevelTestService } from 'src/pattern/service/level-test.service';
import { PracticeService } from 'src/pattern/service/practice.service';

@Injectable()
export class ProgressService {
  constructor(
    private readonly levelTestProgressService: LevelTestProgressService,
    private readonly levelTestService: LevelTestService,
    private readonly practiceProgressService: PracticeProgressService,
    private readonly practiceService: PracticeService,
    private readonly userService: UserService,
  ) {}

  async updatePractice(progress: number, userId: number, practiceId: number) {
    const practice = await this.practiceService.fetchById(practiceId);
    const user =
      await this.userService.fetchUserPracticeProgressWithUserId(userId);

    return await this.practiceProgressService.update(progress, user, practice);
  }

  async updateLeveltest(progress: number, userId: number, testId: number) {
    const levelTest = await this.levelTestService.fetchById(testId);
    const user =
      await this.userService.fetchUserLevelTestProgressWithUserId(userId);

    return await this.levelTestProgressService.update(
      progress,
      user,
      levelTest,
    );
  }
}
