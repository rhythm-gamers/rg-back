import { LevelTest } from 'src/pattern/entity/level-test.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
export class LevelTestProgress {
  @PrimaryGeneratedColumn()
  levelTestProgressId: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: '000.00~999.99' })
  currentRate: number;

  @ManyToOne(() => User, (user) => user.levelTestProgresses, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => LevelTest, (test) => test.userProgresses, {
    onDelete: 'CASCADE',
  })
  levelTest: LevelTest;
}
