import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelTestProgress } from '../entity/level-test-progress.entity';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { LevelTest } from 'src/pattern/entity/level-test.entity';

@Injectable()
export class LevelTestProgressService {
  constructor(
    @InjectRepository(LevelTestProgress)
    private progressRepo: Repository<LevelTestProgress>,
  ) {}

  async update(progress: number, user: User, levelTest: LevelTest) {
    let entity: LevelTestProgress;
    if (
      !user.levelTestProgresses.some(
        (progress) => progress.levelTest.testId === levelTest.testId,
      )
    ) {
      entity = new LevelTestProgress();
      entity.user = user;
      entity.levelTest = levelTest;
      entity.currentRate = progress;
      entity = await this.progressRepo.save(entity);
    } else {
      entity = user.levelTestProgresses.find(
        (progress) => progress.levelTest.testId === levelTest.testId,
      );
      this.progressRepo.update(entity.levelTestProgressId, {
        currentRate: progress,
      });
    }
    return await this.progressRepo.findOne({
      where: {
        levelTestProgressId: entity.levelTestProgressId,
      },
    });
  }
}
