import { Chingho } from "src/chingho/entity/chingho.entity";
import { RUser } from "src/user/entity/ruser.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class RPlateData {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => RUser, (user) => user.plateData)
  @JoinColumn()
  user: RUser;

  @OneToOne(() => Chingho, (chingho) => chingho.plateData, {
    onDelete: "CASCADE",
  })
  chingho: Chingho;

  @Column({ default: 0 })
  backgroundDesign: number;

  @Column({ default: 0 })
  currentLevel: number;
}
