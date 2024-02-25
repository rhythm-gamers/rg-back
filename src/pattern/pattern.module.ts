import { Module } from '@nestjs/common';
import { PatternService } from './pattern.service';
import { PatternController } from './pattern.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelTest } from './entity/level-test.entity';
import { PatternInfo } from './entity/pattern-info.entity';
import { Practice } from './entity/practice.entity';

@Module({
  controllers: [PatternController],
  providers: [PatternService],
  imports: [TypeOrmModule.forFeature([LevelTest, PatternInfo, Practice])],
  exports: [PatternService],
})
export class PatternModule {}
