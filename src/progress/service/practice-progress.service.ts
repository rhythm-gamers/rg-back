import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PracticeProgress } from "../entity/practice-progress.entity";
import { Repository } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { Practice } from "src/pattern/entity/practice.entity";

@Injectable()
export class PracticeProgressService {
  constructor(
    @InjectRepository(PracticeProgress)
    private progressRepo: Repository<PracticeProgress>,
  ) {}

  async update(progress: number, user: User, practice: Practice) {
    const res = await this.progressRepo.findOne({
      where: {
        user: {
          id: user.id,
        },
        practice: {
          practiceId: practice.practiceId,
        },
      },
    });
    if (res) {
      this.__update(progress, res);
    } else {
      this.__create(progress, user, practice);
    }
  }

  async fetch(userId: number, practiceId: number) {
    const res = await this.progressRepo.findOne({
      where: {
        user: {
          id: userId,
        },
        practice: {
          practiceId: practiceId,
        },
      },
    });
    if (res == null) {
      throw new BadRequestException(
        "해당 유저는 해당 패턴 연습 결과를 가지고 있지 않습니다.",
      );
    }
    delete res.practiceProgressId;
    return res;
  }

  private async __create(progress: number, user: User, practice: Practice) {
    const entity: PracticeProgress = new PracticeProgress();
    entity.user = user;
    entity.practice = practice;
    entity.currentRate = progress;
    return await this.progressRepo.save(entity);
  }

  private async __update(progress: number, entity: PracticeProgress) {
    if (entity.currentRate < progress) {
      entity.currentRate = progress;
      this.progressRepo.update(
        {
          practiceProgressId: entity.practiceProgressId,
        },
        entity,
      );
    }
  }
}
