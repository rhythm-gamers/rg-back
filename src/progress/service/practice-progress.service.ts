import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PracticeProgress } from "../entity/practice-progress.entity";
import { Repository } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { Practice } from "src/pattern/entity/practice.entity";
import { PracticeService } from "src/pattern/service/practice.service";

@Injectable()
export class PracticeProgressService {
  constructor(
    @InjectRepository(PracticeProgress)
    private progressRepo: Repository<PracticeProgress>,
    private readonly practiceService: PracticeService,
  ) {}

  async update(
    progress: number,
    user: User,
    practice: Practice,
  ): Promise<{ type: string; data: object }> {
    const res = await this.progressRepo.findOne({
      where: {
        user: {
          id: user.id,
        },
        practice: {
          id: practice.id,
        },
      },
    });
    let data: PracticeProgress;
    let type: string;
    if (res) {
      data = await this.__update(progress, res);
      type = "update";
    } else {
      data = await this.__create(progress, user, practice);
      type = "create";
    }
    return { type: type, data: data };
  }

  async fetch(userId: number, practiceId: number) {
    const res = await this.progressRepo.findOne({
      where: {
        user: {
          id: userId,
        },
        practice: {
          id: practiceId,
        },
      },
    });
    if (res == null) {
      throw new BadRequestException(
        "해당 유저는 해당 패턴 연습 결과를 가지고 있지 않습니다.",
      );
    }
    return res;
  }

  async fetchAllByUserId(userId: number, keyNum: number) {
    const whereClue = {
      user: { id: userId },
    };
    if (Number.isNaN(keyNum) === false) {
      whereClue["practice"] = { keyNum: keyNum };
    }
    const practices = await this.practiceService.fetchAll(keyNum);

    const res = await this.progressRepo.find({
      select: {
        currentRate: true,
        updatedAt: true,
        practice: {
          id: true,
        },
      },
      where: {
        ...whereClue,
      },
      relations: {
        practice: true,
      },
    });
    const mappedRes = {};
    practices.forEach((practice: Practice) => {
      if (mappedRes[practice.keyNum] == null) {
        mappedRes[practice.keyNum] = [];
      }
      let currentRate = 0;
      for (const [idx, progress] of res.entries()) {
        if (progress.practice.id === practice.id) {
          currentRate = progress.currentRate;
          res.splice(idx, 1);
          break;
        }
      }

      delete practice.patternInfo.id;
      for (const key in practice.patternInfo) {
        if (practice.patternInfo[key] === 0) {
          delete practice.patternInfo[key];
        }
      }
      mappedRes[practice.keyNum].push({
        goalRate: practice.goalRate,
        currentRate: currentRate,
        level: practice.level,
        title: practice.title,
        imgSrc: practice.imgSrc,
        noteSrc: practice.noteSrc,
        musicSrc: practice.musicSrc,
        patternInfo: practice.patternInfo,
      });
    });
    return mappedRes;
  }

  async fetchRanking(id: number) {
    const practice = await this.practiceService.fetchById(id);
    if (practice == null) {
      throw new BadRequestException("해당 패턴 연습은 없습니다.");
    }
    const res = await this.progressRepo.find({
      select: {
        currentRate: true,
        updatedAt: true,
        user: {
          nickname: true,
        },
      },
      where: {
        practice: {
          id: practice.id,
        },
      },
      relations: {
        user: true,
      },
      order: {
        currentRate: "DESC",
        updatedAt: "ASC",
      },
    });
    return res;
  }

  private async __create(progress: number, user: User, practice: Practice) {
    const entity: PracticeProgress = new PracticeProgress();
    entity.user = user;
    entity.practice = practice;
    entity.currentRate = progress;
    const res = await this.progressRepo.save(entity);
    delete res.user;
    delete res.practice;
    return res;
  }

  private async __update(progress: number, entity: PracticeProgress) {
    if (entity.currentRate < progress) {
      entity.currentRate = progress;
      return await this.progressRepo.save(entity);
    }
    return null;
  }
}
