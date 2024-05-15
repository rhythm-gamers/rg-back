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

  async fetchPlateData(userId: number, dataFlag: any) {
    const whereClue = {};
    const data = await this.plateDataRepository.findOne({
      select: {
        dataId: true,
        backgroundDesign: true,
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
