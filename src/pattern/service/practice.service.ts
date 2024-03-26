import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Practice } from "../entity/practice.entity";
import { Repository } from "typeorm";
import { CreatePracticeDto } from "../dto/create-practice.dto";
import { UpdatePracticeDto } from "../dto/update-practice.dto";
import { PatternInfo } from "../entity/pattern-info.entity";
import { PatternInfoService } from "./pattern-info.service";

@Injectable()
export class PracticeService {
  constructor(
    @InjectRepository(Practice) private practiceRepo: Repository<Practice>,
    private readonly patternInfoService: PatternInfoService,
  ) {}

  private INCLUDE_PATTERN_INFO = true;
  private EXCLUDE_PATTERN_INFO = false;

  async createEntity(createData: CreatePracticeDto): Promise<Practice> {
    const { patternInfo, ...otherInfo } = createData;

    const practice: Practice = {
      ...new Practice(),
      ...otherInfo,
    };
    const patternInfoEntity: PatternInfo =
      await this.patternInfoService.createPatternInfoEntity(patternInfo);

    practice.patternInfo = patternInfoEntity;
    return await this.practiceRepo.save(practice);
  }

  async fetchById(
    id: number,
    includePatternInfo: boolean = false,
  ): Promise<Practice> {
    return await this.findPractice(id, includePatternInfo);
  }

  async fetchByTitle(title: string): Promise<Practice> {
    const res = await this.practiceRepo.findOne({
      where: {
        title: title,
      },
    });
    return res;
  }

  async fetchAll(keyNum?: number) {
    const whereClues = {};
    if (Number.isNaN(keyNum) === false && keyNum != null) {
      whereClues["keyNum"] = keyNum;
    }
    return await this.practiceRepo.find({
      relations: {
        patternInfo: true,
      },
      where: {
        ...whereClues,
      },
    });
  }

  async updateData(
    practiceId: number,
    updateData: UpdatePracticeDto,
  ): Promise<Practice> {
    const practice: Practice = await this.findPractice(
      practiceId,
      this.INCLUDE_PATTERN_INFO,
    );

    if (updateData.patternInfo !== undefined) {
      updateData.patternInfo =
        await this.patternInfoService.updatePatternInfoData(
          practice.patternInfo.patternId,
          updateData.patternInfo,
        );
    }

    const updatePracticeData = {
      ...practice,
      ...updateData,
    };
    await this.practiceRepo.save(updatePracticeData);
    return await this.findPractice(practiceId, this.INCLUDE_PATTERN_INFO);
  }

  async deleteById(id: number) {
    return await this.practiceRepo.delete(id);
  }

  async findPractice(
    practiceId: number,
    includePatternInfo: boolean,
  ): Promise<Practice> {
    const realtionsClue = includePatternInfo ? { patternInfo: true } : {};
    return await this.practiceRepo.findOne({
      where: {
        practiceId: practiceId,
      },
      relations: {
        ...realtionsClue,
      },
    });
  }
}
