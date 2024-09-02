import { Post } from "src/post/entity/post.entity";
import { CommentReport } from "src/report/entity/comment-report.entity";
import { User } from "src/user/entity/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CommentLike } from "./comment-like.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: "CASCADE",
  })
  post: Post;

  @OneToMany(() => CommentReport, (commentreport) => commentreport.comment)
  reportList: CommentReport[];

  @OneToMany(() => CommentLike, (like) => like.comment, {
    cascade: true,
  })
  likeList: CommentLike[];

  // TODO 해당 댓글에 추천한 유저를 어떻게 중복 체크 할 것인가?

  @Column({ default: "", length: 10000 })
  content: string;

  @Column() // TODO 이 부분은 추후에 자기 참조 등으로 가능하게끔...
  parentId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
