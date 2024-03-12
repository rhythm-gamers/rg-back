import { User } from "src/user/entity/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class UserReport {
  @PrimaryGeneratedColumn()
  userReportId: number;

  // 신고한 유저
  @ManyToOne(() => User, (user) => user.reporting)
  reporter: User;

  // 신고된 유저
  @ManyToOne(() => User, (user) => user.reported)
  reported: User;

  @Column({ length: 200 })
  reason: string;

  @Column({ default: false })
  handled: boolean;

  @CreateDateColumn()
  reportRecieved: Date;

  @Column({ nullable: true })
  reportConfirmed: Date;
}
