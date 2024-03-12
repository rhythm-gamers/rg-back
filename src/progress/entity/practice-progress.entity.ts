import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entity/user.entity";
import { Practice } from "src/pattern/entity/practice.entity";

@Entity()
export class PracticeProgress {
  @PrimaryGeneratedColumn()
  practiceProgressId: number;

  @Column({ type: "decimal", precision: 5, scale: 2, comment: "000.00~999.99" })
  currentRate: number;

  @ManyToOne(() => User, (user) => user.practiceProgresses, {
    onDelete: "CASCADE",
  })
  user: User;

  @ManyToOne(() => Practice, (practice) => practice.userProgresses, {
    onDelete: "CASCADE",
  })
  practice: Practice;
}
