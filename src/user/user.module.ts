import { Module } from "@nestjs/common";
import { UserService } from "./service/user.service";
import { UserController } from "./controller/user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { AwsS3Module } from "src/s3/aws-s3.module";
import { CodecModule } from "src/codec/codec.modle";
import { FirebaseModule } from "src/firebase/firebase.module";
import { ChinghoModule } from "src/chingho/chingho.module";
import { RUserController } from "./controller/ruser.controller";
import { MulterModule } from "@nestjs/platform-express";
import { RUserService } from "./service/ruser.service";
import { RUser } from "./entity/ruser.entity";
import { PlateModule } from "src/plate/plate.module";

@Module({
  controllers: [UserController, RUserController],
  providers: [UserService, RUserService],
  imports: [
    TypeOrmModule.forFeature([User, RUser]),
    AwsS3Module,
    CodecModule,
    FirebaseModule,
    ChinghoModule,
    MulterModule.register(),
    PlateModule,
  ],
  exports: [UserService, RUserService],
})
export class UserModule {}
