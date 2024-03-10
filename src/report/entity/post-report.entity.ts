import { Post } from "src/post/entity/post.entity";
import { User } from "src/user/entity/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class PostReport {
  @PrimaryGeneratedColumn()
  post_report_id: number;

  // 신고한 유저
  @ManyToOne(() => User, (user) => user.post_reports, {
    onDelete: "CASCADE",
  })
  reporter: User;

  @ManyToOne(() => Post, (post) => post.report_list, {
    onDelete: "CASCADE",
  })
  post: Post;

  @Column({ length: 200 })
  reason: string;

  @Column({ default: false })
  handled: boolean;

  @CreateDateColumn()
  report_recieved: Date;

  @Column({ nullable: true })
  report_confirmed: Date;
}
