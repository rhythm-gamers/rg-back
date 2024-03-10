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
    pattern_info_data: CreatePatternInfoDto,
  ): Promise<PatternInfo> {
    const pattern_info: PatternInfo = {
      ...new PatternInfo(),
      ...pattern_info_data,
    };
    return await this.patternInfoRepo.save(pattern_info);
  }

  async updatePatternInfoData(
    id: number,
    update_data: UpdatePatternInfoDto,
  ): Promise<PatternInfo> {
    const update_pattern_info_data: UpdatePatternInfoDto = {
      ...new UpdatePatternInfoDto(),
      ...update_data,
    };
    await this.patternInfoRepo.update(id, update_pattern_info_data);
    return await this.patternInfoRepo.findOne({
      where: {
        pattern_id: id,
      },
    });
  }

  // 실제로 사용되진 않음
  async deletePatternInfo(id: number) {
    return await this.patternInfoRepo.delete(id);
  }
}
