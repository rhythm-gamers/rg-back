import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LevelTestProgress } from "./entity/level-test-progress.entity";
import { PracticeProgress } from "./entity/practice-progress.entity";
import { LevelTestProgressService } from "./service/level-test-progress.service";
import { PracticeProgressService } from "./service/practice-progress.service";
import { ProgressService } from "./service/progress.service";
import { UserModule } from "src/user/user.module";
import { PatternModule } from "src/pattern/pattern.module";
import { ProgressController } from "./controller/progress.controller";
import { FirebaseModule } from "src/firebase/firebase.module";
import { PlateModule } from "src/plate/plate.module";
import { RLevelTestProgress } from "./entity/rlevel-test-progress.entity";
import { RPracticeProgress } from "./entity/rpractice-progress.entity";
import { RProgressController } from "./controller/rprogress.controller";
import { RLevelTestProgressService } from "./service/rlevel-test-progress.service";
import { RProgressService } from "./service/rprogress.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LevelTestProgress,
      PracticeProgress,
      RLevelTestProgress,
      RPracticeProgress,
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => PatternModule),
    PlateModule,
    FirebaseModule,
  ],
  controllers: [ProgressController, RProgressController],
  providers: [
    LevelTestProgressService,
    PracticeProgressService,
    ProgressService,
    RLevelTestProgressService,
    RPracticeProgress,
    RProgressService,
  ],
  exports: [ProgressService, RProgressService],
})
export class ProgressModule {}
