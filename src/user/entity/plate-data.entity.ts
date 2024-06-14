import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

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
  chingho: number;

  @Column({ default: 0 })
  chinghoRank: number;
}
