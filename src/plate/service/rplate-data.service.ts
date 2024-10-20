import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdatePlatedataDto } from "../dto/update-platedata.dto";
import { RPlateData } from "../entity/rplate-data.entity";
import { RUser } from "src/user/entity/ruser.entity";

@Injectable()
export class RPlateDataService {
  constructor(
    @InjectRepository(RPlateData)
    private readonly plateDataRepo: Repository<RPlateData>,
  ) {}

  async create(user: RUser) {
    const plateData = await this.plateDataRepo.create({ user: user });
    return await this.plateDataRepo.save(plateData);
  }

  async update(userid: number, dto: UpdatePlatedataDto) {
    await this.plateDataRepo.update({ user: { id: userid } }, dto);
  }

  async fetchByUserid(userid: number) {
    const plateData = await this.plateDataRepo.findOne({
      where: {
        user: {
          id: userid,
        },
      },
    });
    return plateData;
  }
}
