import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PatternInfo } from './pattern-info.entity';
import { PracticeProgress } from 'src/user/entity/practice-progress.entity';

@Entity()
export class Practice {
  @PrimaryGeneratedColumn()
  practice_id: number;

  @OneToOne(() => PatternInfo, (patterninfo) => patterninfo.practice, {
    cascade: true,
  })
  pattern_info: PatternInfo;

  @OneToMany(() => PracticeProgress, (progress) => progress.practice)
  user_progresses: PracticeProgress[];

  @Column({ length: 100 })
  title: string;

  @Column()
  level: number;

  @Column()
  key_num: number;

  @Column({ comment: '자켓 이미지' })
  img_src: string;

  @Column({ comment: '노트 경로' })
  note_src: string;
}
