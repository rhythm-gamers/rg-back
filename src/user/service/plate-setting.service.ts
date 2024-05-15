import { BadRequestException, Injectable } from "@nestjs/common";
import { PlateSetting } from "../entity/plate-setting.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdatePlateSettingDto } from "../dto/update-plate-setting.dto";

@Injectable()
export class PlateSettingService {
  constructor(
    @InjectRepository(PlateSetting)
    private plateSettingRepository: Repository<PlateSetting>,
  ) {}

  async create() {
    const plateSetting = new PlateSetting();
    const res = await this.plateSettingRepository.save(plateSetting);
    return res;
  }

  async update(updateDto: UpdatePlateSettingDto, userId: number) {
    const plate = await this.plateSettingRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });
    try {
      await this.plateSettingRepository.update(plate, updateDto);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchByNickname(nickname: string) {
    const plate = await this.plateSettingRepository.findOne({
      where: {
        user: {
          nickname: nickname,
        },
      },
      relations: {
        user: true,
      },
    });
    if (plate == null) {
      throw new BadRequestException("User Not Found");
    }
    delete plate.user;
    delete plate.plateSettingId;
    return plate;
  }

  async delete(userId: number) {
    await this.plateSettingRepository.delete({
      user: {
        id: userId,
      },
    });
  }
}
