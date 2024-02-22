import { User } from "src/user/entity/user.entity";
import { Comment } from "src/comment/entity/comment.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CommentReport {
  @PrimaryGeneratedColumn()
  uid: number;

  // 신고한 유저
  @ManyToOne(() => User, (user) => user.comment_reports)
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.report_list)
  comment: Comment;

  @Column({ length: 200 })
  reason: string;

  @Column({ default: false })
  handled: boolean;
}
