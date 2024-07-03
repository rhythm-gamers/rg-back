import { Module, forwardRef } from "@nestjs/common";
import { ChinghoService } from "./chingho.service";
import { FirebaseModule } from "src/firebase/firebase.module";
import { CodecModule } from "src/codec/codec.modle";
import { ScheduleModule } from "@nestjs/schedule";
import { UserModule } from "src/user/user.module";

@Module({
  providers: [ChinghoService],
  imports: [
    ScheduleModule.forRoot(),
    CodecModule,
    FirebaseModule,
    forwardRef(() => UserModule),
  ],
  exports: [ChinghoService],
})
export class ChinghoModule {}
