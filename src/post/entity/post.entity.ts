import { Board } from "src/board/entity/board.entity";
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
import { PostLike } from "./post-like.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Board, (board) => board.posts)
  board: Board;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
  })
  comments: Comment[];

  @OneToMany(() => PostReport, (postreport) => postreport.post, {
    cascade: true,
  })
  reportList: PostReport[];

  @OneToMany(() => PostLike, (like) => like.post, {
    cascade: true,
  })
  likeList: PostLike[];

  @Column({ length: 100, nullable: false })
  title: string;

  @Column({ length: 10000, default: "" })
  content: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  views: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
