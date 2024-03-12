import { Injectable } from "@nestjs/common";
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
    let entity: PracticeProgress;
    if (
      !user.practiceProgresses.some(
        (progress) => progress.practice.practiceId === practice.practiceId,
      )
    ) {
      entity = new PracticeProgress();
      entity.user = user;
      entity.practice = practice;
      entity.currentRate = progress;
      entity = await this.progressRepo.save(entity);
    } else {
      entity = user.practiceProgresses.find(
        (progress) => progress.practice.practiceId === practice.practiceId,
      );
      this.progressRepo.update(entity.practiceProgressId, {
        currentRate: progress,
      });
    }
    return await this.progressRepo.findOne({
      where: {
        practiceProgressId: entity.practiceProgressId,
      },
    });
  }
}
