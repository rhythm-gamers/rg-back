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
export class Practice {
  @PrimaryGeneratedColumn()
  practice_id: number;

  @OneToOne(() => PatternInfo, (patterninfo) => patterninfo.practice)
  @JoinColumn()
  pattern_info: PatternInfo;

  @OneToMany(
    () => PatternProgress,
    (patternprogress) => patternprogress.practice,
  )
  pattern_progresses: PatternProgress[];

  @Column()
  level: number;

  @Column()
  key_num: number;

  @Column({ comment: '자켓 이미지' })
  img_src: string;

  @Column({ comment: '노트 경로' })
  note_src: string;
}
