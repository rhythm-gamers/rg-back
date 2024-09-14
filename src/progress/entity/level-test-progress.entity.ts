import { LevelTest } from "src/pattern/entity/level-test.entity";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../user/entity/user.entity";

@Entity()
export class LevelTestProgress {
  @PrimaryGeneratedColumn()
  levelTestProgressId: number;

  @ManyToOne(() => User, (user) => user.levelTestProgresses)
  user: User;

  @ManyToOne(() => LevelTest, (test) => test.userProgresses)
  levelTest: LevelTest;

  @Column({ type: "decimal", precision: 5, scale: 2, comment: "000.00~999.99" })
  currentRate: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
