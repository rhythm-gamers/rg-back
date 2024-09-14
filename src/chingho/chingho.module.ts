import { Module, forwardRef } from "@nestjs/common";
import { ChinghoService } from "./service/chingho.service";
import { FirebaseModule } from "src/firebase/firebase.module";
import { CodecModule } from "src/codec/codec.modle";
import { ScheduleModule } from "@nestjs/schedule";
import { UserModule } from "src/user/user.module";
import { RChinghoService } from "./service/rchingho.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chingho } from "./entity/chingho.entity";
import { ChinghoController } from "./controller/chingho.controller";

@Module({
  providers: [ChinghoService, RChinghoService],
  imports: [
    TypeOrmModule.forFeature([Chingho]),
    ScheduleModule.forRoot(),
    CodecModule,
    FirebaseModule,
    forwardRef(() => UserModule),
  ],
  controllers: [ChinghoController],
  exports: [ChinghoService, RChinghoService],
})
export class ChinghoModule {}
