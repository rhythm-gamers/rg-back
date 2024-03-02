import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Practice } from 'src/pattern/entity/practice.entity';

@Entity()
export class PracticeProgress {
  @PrimaryGeneratedColumn()
  practice_progress_id: number;

  @ManyToOne(() => User, (user) => user.practice_progress)
  user: User;

  @ManyToOne(() => Practice, (practice) => practice.user_progresses)
  practice: Practice;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: '000.00~999.99' })
  current_rate: number;
}
