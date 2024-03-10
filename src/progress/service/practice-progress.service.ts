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
      !user.practice_progresses.some(
        (progress) => progress.practice.practice_id === practice.practice_id,
      )
    ) {
      entity = new PracticeProgress();
      entity.user = user;
      entity.practice = practice;
      entity.current_rate = progress;
      entity = await this.progressRepo.save(entity);
    } else {
      entity = user.practice_progresses.find(
        (progress) => progress.practice.practice_id === practice.practice_id,
      );
      this.progressRepo.update(entity.practice_progress_id, {
        current_rate: progress,
      });
    }
    return await this.progressRepo.findOne({
      where: {
        practice_progress_id: entity.practice_progress_id,
      },
    });
  }
}
