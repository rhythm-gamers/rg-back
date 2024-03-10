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
  test_id: number;

  @OneToOne(() => PatternInfo, (patterninfo) => patterninfo.level_test, {
    cascade: true,
  })
  pattern_info: PatternInfo;

  @OneToMany(() => LevelTestProgress, (progress) => progress.current_rate, {
    cascade: true,
  })
  user_progresses: LevelTestProgress[];

  @Column({ length: 100 })
  title: string;

  @Column()
  level: number;

  @Column({ type: "decimal", precision: 5, scale: 2, comment: "000.00~999.99" })
  goal_rate: number; // DECIMAL(5,2) 000.00~999.99

  @Column({ comment: "키 개수" })
  key_num: number;

  @Column({ comment: "자켓 이미지" })
  img_src: string;

  @Column({ comment: "노트 경로" })
  note_src: string;
}
