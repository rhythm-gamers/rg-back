import { UserModule } from "src/user/user.module";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { CodecModule } from "src/codec/codec.modle";
import { TokenModule } from "src/token/token.module";
import { ChinghoModule } from "src/chingho/chingho.module";

@Module({
  imports: [TokenModule, CodecModule, UserModule, ChinghoModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
