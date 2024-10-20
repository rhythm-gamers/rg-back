import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdatePlateSettingDto } from "../dto/update-plate-setting.dto";
import { RUser } from "src/user/entity/ruser.entity";
import { RPlateSetting } from "../entity/rplate-setting.entity";

@Injectable()
export class RPlateSettingService {
  constructor(
    @InjectRepository(RPlateSetting)
    private readonly plateSettingRepo: Repository<RPlateSetting>,
  ) {}

  async create(user: RUser) {
    const plateSetting = await this.plateSettingRepo.create({ user: user });
    return await this.plateSettingRepo.save(plateSetting);
  }

  async update(userid: number, dto: UpdatePlateSettingDto) {
    await this.plateSettingRepo.update({ user: { id: userid } }, dto);
  }

  async fetchByUserid(userid: number) {
    const plate = await this.plateSettingRepo.findOne({
      where: {
        user: {
          id: userid,
        },
      },
    });
    return plate;
  }
}
