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

  @ManyToOne(() => Board, (board) => board.posts)
  board: Board;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => PostReport, (postreport) => postreport.post)
  report_list: PostReport[];

  @OneToMany(() => PostLike, (like) => like.post)
  like_list: PostLike[];

  // TODO 해당 글에 추천한 유저를 어떻게 중복 체크 할 것인가?

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
