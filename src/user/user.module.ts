import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { PlateSetting } from './entity/plate-setting.entity';
import { UserTitle } from './entity/user-title.entity';
import { PracticeProgress } from './entity/practice-progress.entity';
import { LevelTestProgress } from './entity/level-test-progress.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([
      User,
      PlateSetting,
      UserTitle,
      PracticeProgress,
      LevelTestProgress,
    ]),
  ],
  exports: [UserService],
})
export class UserModule {}
