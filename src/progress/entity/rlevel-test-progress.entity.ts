import { LevelTest } from "src/pattern/entity/level-test.entity";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { RUser } from "src/user/entity/ruser.entity";

@Entity()
export class RLevelTestProgress {
  @PrimaryGeneratedColumn()
  levelTestProgressId: number;

  @ManyToOne(() => RUser, (user) => user.levelTestProgresses)
  user: RUser;

  @ManyToOne(() => LevelTest, (test) => test.userProgresses)
  levelTest: LevelTest;

  @Column({ type: "decimal", precision: 5, scale: 2, comment: "000.00~999.99" })
  currentRate: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
