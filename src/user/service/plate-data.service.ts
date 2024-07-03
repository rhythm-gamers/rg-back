import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PlateData } from "../entity/plate-data.entity";
import { Repository } from "typeorm";
import { UpdateChinghoDto } from "../dto/update-chingho.dto";

@Injectable()
export class PlateDataService {
  constructor(
    @InjectRepository(PlateData)
    private plateDataRepository: Repository<PlateData>,
  ) {}

  async create() {
    const data = await this.plateDataRepository.create();
    return await this.plateDataRepository.save(data);
  }

  async update(userid: number, dto: UpdateChinghoDto) {
    await this.plateDataRepository.update(
      {
        user: {
          id: userid,
        },
      },
      {
        ...dto,
      },
    );
  }

  async fetchCurrentChingho(userid: number) {
    const plateData = await this.fetch(userid);
    delete plateData.backgroundDesign;
    delete plateData.user;
    delete plateData.id;
    return plateData;
  }

  async fetch(userId: number) {
    const data = await this.plateDataRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
    return data;
  }
}
