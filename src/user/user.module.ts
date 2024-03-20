import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { PlateSetting } from "./entity/plate-setting.entity";
import { UserTitle } from "./entity/user-title.entity";
import { UserTitleService } from "./service/user-title.service";
import { PlateSettingService } from "./service/plate-setting.service";

@Module({
  controllers: [UserController],
  providers: [UserService, UserTitleService, PlateSettingService],
  imports: [TypeOrmModule.forFeature([User, PlateSetting, UserTitle])],
  exports: [UserService, UserTitleService, PlateSettingService],
})
export class UserModule {}
