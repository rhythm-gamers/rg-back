import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../user/entity/user.entity";
import { Practice } from "src/pattern/entity/practice.entity";

@Entity()
export class PracticeProgress {
  @PrimaryGeneratedColumn()
  practiceProgressId: number;

  @ManyToOne(() => User, (user) => user.practiceProgresses)
  user: User;

  @ManyToOne(() => Practice, (practice) => practice.userProgresses)
  practice: Practice;

  @Column({ type: "decimal", precision: 5, scale: 2, comment: "000.00~999.99" })
  currentRate: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
