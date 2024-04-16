import { User } from "src/user/entity/user.entity";
import { Comment } from "src/comment/entity/comment.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class CommentReport {
  @PrimaryGeneratedColumn()
  id: number;

  // 신고한 유저
  @ManyToOne(() => User, (user) => user.commentReports)
  reporter: User;

  @ManyToOne(() => Comment, (comment) => comment.reportList)
  comment: Comment;

  @Column({ length: 200 })
  reason: string;

  @Column({ default: false })
  handled: boolean;

  @CreateDateColumn()
  reportRecieved: Date;

  @Column({ nullable: true })
  reportConfirmed: Date;
}
