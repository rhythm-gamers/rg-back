import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LevelTestProgress } from "../entity/level-test-progress.entity";
import { User } from "src/user/entity/user.entity";
import { Repository } from "typeorm";
import { LevelTest } from "src/pattern/entity/level-test.entity";
import { LevelTestService } from "src/pattern/service/level-test.service";

@Injectable()
export class LevelTestProgressService {
  constructor(
    @InjectRepository(LevelTestProgress)
    private progressRepo: Repository<LevelTestProgress>,
    private readonly levelTestService: LevelTestService,
  ) {}

  async update(
    progress: number,
    user: User,
    levelTest: LevelTest,
  ): Promise<{ type: string; data: object }> {
    const res = await this.progressRepo.findOne({
      where: {
        user: {
          id: user.id,
        },
        levelTest: {
          id: levelTest.id,
        },
      },
    });
    let data: LevelTestProgress;
    let type: string;
    if (res) {
      data = await this.__update(progress, res);
      type = "update";
    } else {
      data = await this.__create(progress, user, levelTest);
      type = "create";
    }
    return { type: type, data: data };
  }

  async fetch(userId: number, levelTestId: number) {
    const res = await this.progressRepo.findOne({
      where: {
        user: {
          id: userId,
        },
        levelTest: {
          id: levelTestId,
        },
      },
    });
    if (res == null) {
      throw new BadRequestException(
        "해당 유저는 해당 레벨 테스트 결과를 가지고 있지 않습니다.",
      );
    }
    return res;
  }

  async fetchAllByUserId(userId: number, keyNum: number) {
    const whereClue = {
      user: { id: userId },
    };
    if (Number.isNaN(keyNum) === false) {
      whereClue["levelTest"] = { keyNum: keyNum };
    }
    const levelTests = await this.levelTestService.fetchAll(keyNum);

    const res = await this.progressRepo.find({
      select: {
        currentRate: true,
        updatedAt: true,
        levelTest: {
          id: true,
        },
      },
      where: {
        ...whereClue,
      },
      relations: {
        levelTest: true,
      },
    });
    const mappedRes = {};
    levelTests.forEach((lTest: LevelTest) => {
      if (mappedRes[lTest.keyNum] == null) {
        mappedRes[lTest.keyNum] = [];
      }
      let currentRate = 0;
      for (const [idx, progress] of res.entries()) {
        if (progress.levelTest.id === lTest.id) {
          currentRate = progress.currentRate;
          res.splice(idx, 1);
          break;
        }
      }

      delete lTest.patternInfo.id;
      for (const key in lTest.patternInfo) {
        if (lTest.patternInfo[key] === 0) {
          delete lTest.patternInfo[key];
        }
      }

      mappedRes[lTest.keyNum].push({
        goalRate: lTest.goalRate,
        currentRate: currentRate,
        level: lTest.level,
        title: lTest.title,
        imgSrc: lTest.imgSrc,
        noteSrc: lTest.noteSrc,
        musicSrc: lTest.musicSrc,
        patternInfo: lTest.patternInfo,
      });
    });
    return mappedRes;
  }

  async fetchRanking(id: number) {
    const levelTest = await this.levelTestService.fetchById(id);
    if (levelTest == null) {
      throw new BadRequestException("해당 레벨 테스트는 없습니다.");
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
        levelTest: {
          id: levelTest.id,
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

  private async __create(progress: number, user: User, levelTest: LevelTest) {
    const entity: LevelTestProgress = new LevelTestProgress();
    entity.user = user;
    entity.levelTest = levelTest;
    entity.currentRate = progress;
    const res = await this.progressRepo.save(entity);
    delete res.user;
    delete res.levelTest;
    return res;
  }

  private async __update(progress: number, entity: LevelTestProgress) {
    if (entity.currentRate < progress) {
      entity.currentRate = progress;
      return await this.progressRepo.save(entity);
    }
    return null;
  }
}
