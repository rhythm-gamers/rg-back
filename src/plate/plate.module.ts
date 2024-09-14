import { forwardRef, Module } from "@nestjs/common";
import { PlateController } from "./controller/plate.controller";
import { RPlateDataService } from "./service/rplate-data.service";
import { PlateSettingService } from "./service/plate-setting.service";
import { PlateDataService } from "./service/plate-data.service";
import { RPlateSettingService } from "./service/rplate-setting.service";
import { PlateSetting } from "./entity/plate-setting.entity";
import { PlateData } from "./entity/plate-data.entity";
import { RPlateData } from "./entity/rplate-data.entity";
import { RPlateSetting } from "./entity/rplate-setting.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";

@Module({
  controllers: [PlateController],
  providers: [
    PlateSettingService,
    PlateDataService,
    RPlateDataService,
    RPlateSettingService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      PlateSetting,
      PlateData,
      RPlateData,
      RPlateSetting,
    ]),
    forwardRef(() => UserModule),
  ],
  exports: [
    PlateSettingService,
    PlateDataService,
    RPlateDataService,
    RPlateSettingService,
  ],
})
export class PlateModule {}
