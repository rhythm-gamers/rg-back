import { BadRequestException, Injectable } from "@nestjs/common";
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

  async update(progress: number, user: User, levelTest: LevelTest) {
    const res = await this.progressRepo.findOne({
      where: {
        user: {
          userId: user.userId,
        },
        levelTest: {
          testId: levelTest.testId,
        },
      },
    });
    if (res) {
      this.__update(progress, res);
    } else {
      this.__create(progress, user, levelTest);
    }
  }

  async fetch(userId: number, levelTestId: number) {
    const res = await this.progressRepo.findOne({
      where: {
        user: {
          userId: userId,
        },
        levelTest: {
          testId: levelTestId,
        },
      },
    });
    if (res == null) {
      throw new BadRequestException(
        "해당 유저는 해당 레벨 테스트 결과를 가지고 있지 않습니다.",
      );
    }
    delete res.levelTestProgressId;
    return res;
  }

  private async __create(progress: number, user: User, levelTest: LevelTest) {
    const entity: LevelTestProgress = new LevelTestProgress();
    entity.user = user;
    entity.levelTest = levelTest;
    entity.currentRate = progress;
    return await this.progressRepo.save(entity);
  }

  private async __update(progress: number, entity: LevelTestProgress) {
    if (entity.currentRate < progress) {
      entity.currentRate = progress;
      this.progressRepo.update(
        {
          levelTestProgressId: entity.levelTestProgressId,
        },
        entity,
      );
    }
  }
}
