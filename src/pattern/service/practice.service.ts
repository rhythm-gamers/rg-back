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

  async createEntity(create_data: CreatePracticeDto): Promise<Practice> {
    const { pattern_info, ...other_info } = create_data;

    const practice: Practice = {
      ...new Practice(),
      ...other_info,
    };
    const pattern_info_entity: PatternInfo =
      await this.patternInfoService.createPatternInfoEntity(pattern_info);

    // practice.img_src = img_src;
    // practice.note_src = note_src;
    practice.pattern_info = pattern_info_entity;
    return await this.practiceRepo.save(practice);
  }

  async fetchById(id: number): Promise<Practice> {
    return await this.findPractice(id);
  }

  async fetchAll() {
    return await this.practiceRepo.find({
      relations: {
        pattern_info: true,
      },
    });
  }

  async updateData(
    id: number,
    update_data: UpdatePracticeDto,
  ): Promise<Practice> {
    const practice: Practice = await this.findPractice(id);

    if (update_data.pattern_info !== undefined) {
      await this.patternInfoService.updatePatternInfoData(
        practice.pattern_info.pattern_id,
        update_data.pattern_info,
      );
      delete update_data.pattern_info;
    }

    const update_practice_data: Practice = {
      ...practice,
      ...update_data,
    } as Practice;
    await this.practiceRepo.update(id, update_practice_data);
    return await this.findPractice(id);
  }

  async deleteById(id: number) {
    return await this.practiceRepo.delete(id);
  }

  async findPractice(id: number): Promise<Practice> {
    return await this.practiceRepo.findOne({
      where: {
        practice_id: id,
      },
      relations: {
        pattern_info: true,
      },
    });
  }
}
