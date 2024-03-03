import { LevelTest } from 'src/pattern/entity/level-test.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
export class LevelTestProgress {
  @PrimaryGeneratedColumn()
  level_test_progress_id: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: '000.00~999.99' })
  current_rate: number;

  @ManyToOne(() => User, (user) => user.level_test_progresses, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => LevelTest, (test) => test.user_progresses, {
    onDelete: 'CASCADE',
  })
  level_test: LevelTest;
}
