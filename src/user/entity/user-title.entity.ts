import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserTitle {
  @PrimaryGeneratedColumn()
  userTitleId: number;

  @OneToOne(() => User, (user) => user.usertitle, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;

  @Column({ default: false })
  djmax: boolean;

  @Column({ default: false })
  ez2on: boolean;

  @Column({ default: false })
  rhythmdoctor: boolean;

  @Column({ default: false })
  adofai: boolean;

  @Column({ default: false })
  sixtargate: boolean;

  @Column({ default: false })
  muzedash: boolean;
}
