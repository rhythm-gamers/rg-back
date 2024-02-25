import { Post } from "src/post/entity/post.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PostReport {
  @PrimaryGeneratedColumn()
  post_report_id: number;

  // 신고한 유저
  @ManyToOne(() => User, (user) => user.post_reports)
  reporter: User;

  @ManyToOne(() => Post, (post) => post.report_list)
  post: Post;

  @Column({ length: 200 })
  reason: string;

  @Column({ default: false })
  handled: boolean;
}
