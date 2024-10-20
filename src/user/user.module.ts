import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { PlateSetting } from "./entity/plate-setting.entity";
import { PlateSettingService } from "./service/plate-setting.service";
import { AwsS3Module } from "src/s3/aws-s3.module";
import { PlateDataService } from "./service/plate-data.service";
import { PlateData } from "./entity/plate-data.entity";
import { CodecModule } from "src/codec/codec.modle";
import { FirebaseModule } from "src/firebase/firebase.module";
import { ChinghoModule } from "src/chingho/chingho.module";

@Module({
  controllers: [UserController],
  providers: [UserService, PlateSettingService, PlateDataService],
  imports: [
    TypeOrmModule.forFeature([User, PlateSetting, PlateData]),
    AwsS3Module,
    CodecModule,
    FirebaseModule,
    ChinghoModule,
  ],
  exports: [UserService, PlateSettingService, PlateDataService],
})
export class UserModule {}
