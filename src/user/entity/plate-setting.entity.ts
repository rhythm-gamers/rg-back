import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PlateSetting {
  @PrimaryGeneratedColumn()
  plate_setting_id: number;

  @OneToOne(() => User, (user) => user.platesetting)
  user: User;

  @Column({ default: false })
  show_comment: boolean;

  @Column({ default: false })
  show_level: boolean;

  @Column({ default: false })
  show_chingho: boolean;

  @Column({ default: false })
  show_chingho_ico: boolean;

  @Column({ default: 0 })
  show_bgdesign: number;
}
