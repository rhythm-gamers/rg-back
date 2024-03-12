import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PatternInfo } from "../entity/pattern-info.entity";
import { Repository } from "typeorm";
import { CreatePatternInfoDto } from "../dto/create-pattern-info.dto";
import { UpdatePatternInfoDto } from "../dto/update-pattern-info.dto";

@Injectable()
export class PatternInfoService {
  constructor(
    @InjectRepository(PatternInfo)
    private patternInfoRepo: Repository<PatternInfo>,
  ) {}

  async createPatternInfoEntity(
    patternInfoData: CreatePatternInfoDto,
  ): Promise<PatternInfo> {
    const patternInfo: PatternInfo = {
      ...new PatternInfo(),
      ...patternInfoData,
    };
    return await this.patternInfoRepo.save(patternInfo);
  }

  async updatePatternInfoData(
    id: number,
    updateData: UpdatePatternInfoDto,
  ): Promise<PatternInfo> {
    const updatePatternInfoData: UpdatePatternInfoDto = {
      ...new UpdatePatternInfoDto(),
      ...updateData,
    };
    await this.patternInfoRepo.update(id, updatePatternInfoData);
    return await this.patternInfoRepo.findOne({
      where: {
        patternId: id,
      },
    });
  }

  // 실제로 사용되진 않음
  async deletePatternInfo(id: number) {
    return await this.patternInfoRepo.delete(id);
  }
}
