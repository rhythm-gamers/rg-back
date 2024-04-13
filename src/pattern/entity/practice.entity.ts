import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PatternInfo } from "./pattern-info.entity";
import { PracticeProgress } from "src/progress/entity/practice-progress.entity";

@Entity()
export class Practice {
  @PrimaryGeneratedColumn()
  practiceId: number;

  @OneToOne(() => PatternInfo, (patterninfo) => patterninfo.practice, {
    cascade: true,
  })
  patternInfo: PatternInfo;

  @OneToMany(() => PracticeProgress, (progress) => progress.practice, {
    cascade: true,
  })
  userProgresses: PracticeProgress[];

  @Column({ length: 100 })
  title: string;

  @Column()
  level: number;

  @Column({
    type: "decimal",
    precision: 7,
    scale: 2,
    comment: "00000.00~99999.99",
    default: 0, // 임시로 만들었음
  })
  goalRate: number; // DECIMAL(7,2)

  @Column()
  keyNum: number;

  @Column({ comment: "자켓 이미지" })
  imgSrc: string;

  @Column({ comment: "노트 경로" })
  noteSrc: string;

  @Column({ comment: "음원 파일 경로" })
  musicSrc: string;
}
