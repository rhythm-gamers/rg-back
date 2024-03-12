import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PatternInfo } from './pattern-info.entity';
import { PracticeProgress } from 'src/progress/entity/practice-progress.entity';

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

  @Column()
  keyNum: number;

  @Column({ comment: '자켓 이미지' })
  imgSrc: string;

  @Column({ comment: '노트 경로' })
  noteSrc: string;

  @Column({ comment: '음원 파일 경로' })
  musicSrc: string;
}
