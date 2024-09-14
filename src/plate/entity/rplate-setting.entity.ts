import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RUser } from "src/user/entity/ruser.entity";

@Entity()
export class RPlateSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => RUser, (user) => user.plateSetting)
  @JoinColumn()
  user: RUser;

  @Column({ default: true })
  showComment: boolean;

  @Column({ default: true })
  showLevel: boolean;

  @Column({ default: true })
  showChingho: boolean;

  @Column({ default: true })
  showHavingGames: boolean;

  @Column({ default: true })
  showBgdesign: boolean;
}
