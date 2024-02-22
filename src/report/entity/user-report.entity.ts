import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserReport {
  @PrimaryGeneratedColumn()
  uid: number;

  // 신고한 유저
  @ManyToOne(() => User, (user) => user.reporting)
  reporting_user: User;

  // 신고된 유저
  @ManyToOne(() => User, (user) => user.reported)
  reported_user: User;

  @Column({ length: 200 })
  reason: string;

  @Column({ default: false })
  handled: boolean;
}
