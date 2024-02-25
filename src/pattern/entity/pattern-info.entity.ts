import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Practice } from "./practice.entity";
import { LevelTest } from "./level-test.entity";

@Entity()
export class PatternInfo {
  @PrimaryGeneratedColumn()
  pattern_id: number;

  @OneToOne(() => Practice, (practice) => practice.pattern_info, {
    nullable: true,
  })
  practice: Practice;

  @OneToOne(() => LevelTest, (leveltest) => leveltest.pattern_info, {
    nullable: true,
  })
  level_test: LevelTest;

  @Column({ default: 0 })
  roll: number;

  @Column({ default: 0 })
  off_grid: number;

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
