import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PatternInfo } from "./pattern-info.entity";
import { LevelTestProgress } from "src/progress/entity/level-test-progress.entity";

@Entity()
export class LevelTest {
  @PrimaryGeneratedColumn()
  testId: number;

  @OneToOne(() => PatternInfo, (patterninfo) => patterninfo.levelTest, {
    cascade: true,
  })
  patternInfo: PatternInfo;

  @OneToMany(() => LevelTestProgress, (progress) => progress.currentRate, {
    cascade: true,
  })
  userProgresses: LevelTestProgress[];

  @Column({ length: 100 })
  title: string;

  @Column()
  level: number;

  @Column({ type: "decimal", precision: 5, scale: 2, comment: "000.00~999.99" })
  goalRate: number; // DECIMAL(5,2) 000.00~999.99

  @Column({ comment: "키 개수" })
  keyNum: number;

  @Column({ comment: "자켓 이미지 경로" })
  imgSrc: string;

  @Column({ comment: "노트 경로" })
  noteSrc: string;

  @Column({ comment: "음원 파일 경로" })
  musicSrc: string;
}
