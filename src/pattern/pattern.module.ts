import { Module } from '@nestjs/common';
import { PatternService } from './pattern.service';
import { PatternController } from './pattern.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelTest } from './entity/level-test.entity';
import { PatternInfo } from './entity/pattern-info.entity';
import { Practice } from './entity/practice.entity';
import { LevelTestService } from './service/level-test.service';
import { PatternInfoService } from './service/pattern-info.service';
import { PracticeService } from './service/practice.service';
import { AwsS3Module } from 'src/s3/aws-s3.module';

@Module({
  controllers: [PatternController],
  providers: [
    PatternService,
    LevelTestService,
    PatternInfoService,
    PracticeService,
  ],
  imports: [
    TypeOrmModule.forFeature([LevelTest, PatternInfo, Practice]),
    AwsS3Module,
  ],
  exports: [PatternService, LevelTestService, PracticeService],
})
export class PatternModule {}
