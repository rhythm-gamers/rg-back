import { Board } from 'src/board/entity/board.entity';
import { User } from 'src/user/entity/user.entity';
import { Comment } from 'src/comment/entity/comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostReport } from 'src/report/entity/post-report.entity';
import { PostLike } from './post-like.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  post_id: number;

  @ManyToOne(() => Board, (board) => board.posts, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'NO ACTION',
  })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
  })
  comments: Comment[];

  @OneToMany(() => PostReport, (postreport) => postreport.post, {
    cascade: true,
  })
  report_list: PostReport[];

  @OneToMany(() => PostLike, (like) => like.post, {
    cascade: true,
  })
  like_list: PostLike[];

  @Column({ length: 100 })
  title: string;

  @Column({ length: 10000, default: '' })
  content: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  modified_at: Date;
}
