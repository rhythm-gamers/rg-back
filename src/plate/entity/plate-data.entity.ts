import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/entity/user.entity";

@Entity()
export class PlateData {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.plateData, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;

  @Column({ default: 0 })
  backgroundDesign: number;

  @Column({ default: 0 })
  title: string;

  @Column({ default: 0 })
  rareness: number;

  @Column({ default: 0 })
  currentLevel: number;
}
