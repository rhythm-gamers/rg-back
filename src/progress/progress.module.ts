import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelTestProgress } from './entity/level-test-progress.entity';
import { PracticeProgress } from './entity/practice-progress.entity';
import { LevelTestProgressService } from './service/level-test-progress.service';
import { PracticeProgressService } from './service/practice-progress.service';
import { ProgressService } from './service/progress.service';
import { UserModule } from 'src/user/user.module';
import { PatternModule } from 'src/pattern/pattern.module';
import { ProgressController } from './progress.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([LevelTestProgress, PracticeProgress]),
    forwardRef(() => UserModule),
    forwardRef(() => PatternModule),
  ],
  controllers: [ProgressController],
  providers: [
    LevelTestProgressService,
    PracticeProgressService,
    ProgressService,
  ],
  exports: [ProgressService],
})
export class ProgressModule {}
