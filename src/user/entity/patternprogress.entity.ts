import { LevelTest } from "src/pattern/entity/leveltest.entity";
import { Practice } from "src/pattern/entity/practice.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class PatternProgress {
  @PrimaryGeneratedColumn()
  uid: number;

  @ManyToOne(() => User, (user) => user.pattern_progresses)
  user: User;

  @ManyToOne(() => Practice, (practice) => practice.pattern_progresses, {
    nullable: true,
  })
  practice: Practice;

  @ManyToOne(() => LevelTest, (leveltest) => leveltest.pattern_progresses, {
    nullable: true,
  })
  level_test: LevelTest;
}
