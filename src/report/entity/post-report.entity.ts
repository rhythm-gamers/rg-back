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
  id: number;

  // 신고한 유저
  @ManyToOne(() => User, (user) => user.postReports, {
    onDelete: "CASCADE",
  })
  reporter: User;

  @ManyToOne(() => Post, (post) => post.reportList, {
    onDelete: "CASCADE",
  })
  post: Post;

  @Column({ length: 200 })
  reason: string;

  @Column({ default: false })
  handled: boolean;

  @CreateDateColumn()
  reportRecieved: Date;

  @Column({ nullable: true })
  reportConfirmed: Date;
}
