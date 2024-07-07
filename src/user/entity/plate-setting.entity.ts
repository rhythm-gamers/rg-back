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

  @Column({ default: true })
  showComment: boolean;

  @Column({ default: true })
  showLevel: boolean;

  @Column({ default: true })
  showChingho: boolean;

  @Column({ default: true })
  showHavingGames: boolean;
}
