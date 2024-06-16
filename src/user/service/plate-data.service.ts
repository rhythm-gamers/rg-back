import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PlateData } from "../entity/plate-data.entity";
import { Repository } from "typeorm";

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

  async fetchPlateData(userId: number, dataFlag: Record<string, boolean>) {
    const data = await this.plateDataRepository.findOne({
      select: {
        id: true,
        backgroundDesign: true,
        chingho: true,
        chinghoRank: true,
        // ...dataFlag,
      },
      where: {
        user: {
          id: userId,
        },
      },
    });
    return data;
  }
}
