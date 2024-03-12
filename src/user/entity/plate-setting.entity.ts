import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class PlateSetting {
  @PrimaryGeneratedColumn()
  plateSettingId: number;

  @OneToOne(() => User, (user) => user.platesetting)
  user: User;

  @Column({ default: false })
  showComment: boolean;

  @Column({ default: false })
  showLevel: boolean;

  @Column({ default: false })
  showChingho: boolean;

  @Column({ default: false })
  showChinghoIco: boolean;

  @Column({ default: 0 })
  showBgdesign: number;
}
