import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Practice } from "src/pattern/entity/practice.entity";
import { RUser } from "src/user/entity/ruser.entity";

@Entity()
export class RPracticeProgress {
  @PrimaryGeneratedColumn()
  practiceProgressId: number;

  @ManyToOne(() => RUser, (user) => user.practiceProgresses)
  user: RUser;

  @ManyToOne(() => Practice, (practice) => practice.userProgresses)
  practice: Practice;

  @Column({ type: "decimal", precision: 5, scale: 2, comment: "000.00~999.99" })
  currentRate: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
