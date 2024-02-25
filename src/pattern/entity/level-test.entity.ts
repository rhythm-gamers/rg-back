import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PatternInfo } from './pattern-info.entity';
import { PatternProgress } from 'src/user/entity/pattern-progress.entity';

@Entity()
export class LevelTest {
  @PrimaryGeneratedColumn()
  test_id: number;

  @OneToOne(() => PatternInfo, (patterninfo) => patterninfo.level_test)
  @JoinColumn()
  pattern_info: PatternInfo;

  @OneToMany(
    () => PatternProgress,
    (patternprogress) => patternprogress.level_test,
  )
  pattern_progresses: PatternProgress[];

  @Column({ length: 20 })
  title: string;

  @Column()
  level: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: '000.00~999.99' })
  goal_rate: number; // DECIMAL(5,2) 000.00~999.99

  @Column({ comment: '자켓 이미지' })
  img_src: string;

  @Column({ comment: '노트 경로' })
  note_src: string;
}
