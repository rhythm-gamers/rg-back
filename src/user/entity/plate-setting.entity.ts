import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class PlateSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.plateSetting, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;

  @Column({ default: false })
  showComment: boolean;

  @Column({ default: false })
  showLevel: boolean;

  @Column({ default: false })
  showChingho: boolean;

  @Column({ default: false })
  showChinghoIco: boolean;
}
