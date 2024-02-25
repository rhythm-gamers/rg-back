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

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  uid: number;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @OneToMany(() => CommentReport, (commentreport) => commentreport.comment)
  report_list: CommentReport[];

  @Column()
  content: string;

  @Column()
  likes: number;

  @Column() // 이 부분은 추후에 자기 참조 등으로 가능하게끔...
  paternt_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  modified_at: Date;
}
