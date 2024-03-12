import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Practice } from "./practice.entity";
import { LevelTest } from "./level-test.entity";

@Entity()
export class PatternInfo {
  @PrimaryGeneratedColumn()
  patternId: number;

  @OneToOne(() => Practice, (practice) => practice.patternInfo, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  practice: Practice;

  @OneToOne(() => LevelTest, (leveltest) => leveltest.patternInfo, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  levelTest: LevelTest;

  @Column({ default: 0 })
  roll: number;

  @Column({ default: 0 })
  offGrid: number;

  @Column({ default: 0 })
  stairs: number;

  @Column({ default: 0, comment: "폭타" })
  peak: number;

  @Column({ default: 0, comment: "동타/동치" })
  multiples: number;

  @Column({ default: 0 })
  trill: number;

  @Column({ default: 0, comment: "롱잡" })
  hold: number;
}
