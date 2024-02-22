import { Board } from "src/global-entity/board.entity";
import { User } from "src/user/entity/user.entity";
import { Comment } from "src/comment/entity/comment.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PostReport } from "src/report/entity/post-report.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  uid: number;

  @ManyToOne(() => Board, (board) => board.posts)
  board: Board;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => PostReport, (postreport) => postreport.post)
  report_list: PostReport[];

  @Column({ length: 100 })
  title: string;

  @Column({ length: 10000, default: "" })
  content: string;

  @Column()
  views: number;

  @Column()
  likes: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  modified_at: Date;
}
