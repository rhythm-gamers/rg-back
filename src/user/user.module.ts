import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { PlateSetting } from "./entity/plate-setting.entity";
import { UserTitle } from "./entity/user-title.entity";

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User, PlateSetting, UserTitle])],
  exports: [UserService],
})
export class UserModule {}
