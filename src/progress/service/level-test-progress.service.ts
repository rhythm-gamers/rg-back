import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LevelTestProgress } from "../entity/level-test-progress.entity";
import { User } from "src/user/entity/user.entity";
import { Repository } from "typeorm";
import { LevelTest } from "src/pattern/entity/level-test.entity";

@Injectable()
export class LevelTestProgressService {
  constructor(
    @InjectRepository(LevelTestProgress)
    private progressRepo: Repository<LevelTestProgress>,
  ) {}

  async update(progress: number, user: User, level_test: LevelTest) {
    let entity: LevelTestProgress;
    if (
      !user.level_test_progresses.some(
        (progress) => progress.level_test.test_id === level_test.test_id,
      )
    ) {
      entity = new LevelTestProgress();
      entity.user = user;
      entity.level_test = level_test;
      entity.current_rate = progress;
      entity = await this.progressRepo.save(entity);
    } else {
      entity = user.level_test_progresses.find(
        (progress) => progress.level_test.test_id === level_test.test_id,
      );
      this.progressRepo.update(entity.level_test_progress_id, {
        current_rate: progress,
      });
    }
    return await this.progressRepo.findOne({
      where: {
        level_test_progress_id: entity.level_test_progress_id,
      },
    });
  }
}
