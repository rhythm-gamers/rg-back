import { UserModule } from "src/user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { CodecModule } from "src/codec/codec.modle";
import { TokenModule } from "src/token/token.module";
import { ChinghoModule } from "src/chingho/chingho.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TokenModule,
    CodecModule,
    UserModule,
    ChinghoModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
