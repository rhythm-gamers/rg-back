import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserTitle {
  @PrimaryGeneratedColumn()
  userTitleId: number;

  @OneToOne(() => User, (user) => user.usertitle)
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
