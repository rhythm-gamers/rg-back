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
  comment_id: number;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: "CASCADE",
  })
  post: Post;

  @OneToMany(() => CommentReport, (commentreport) => commentreport.comment)
  report_list: CommentReport[];

  @OneToMany(() => CommentLike, (like) => like.comment, {
    cascade: true,
  })
  like_list: CommentLike[];

  // TODO 해당 댓글에 추천한 유저를 어떻게 중복 체크 할 것인가?

  @Column({ default: "" })
  content: string;

  @Column({ default: 0 })
  likes: number;

  @Column() // TODO 이 부분은 추후에 자기 참조 등으로 가능하게끔...
  parent_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  modified_at: Date;
}
