import { RPlateData } from "src/plate/entity/rplate-data.entity";
import { RUser } from "src/user/entity/ruser.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Chingho {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "리듬게이머스 입문자" })
  title: string;

  @Column({ default: 0 })
  rareness: number;

  @OneToOne(() => RUser, (user) => user.chingho, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: RUser;

  @OneToOne(() => RPlateData, (plateData) => plateData.chingho)
  @JoinColumn()
  plateData: RPlateData;
}
