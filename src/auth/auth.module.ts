import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { CodecModule } from "src/codec/codec.modle";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    TypeOrmModule.forFeature([User]),
    CodecModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
