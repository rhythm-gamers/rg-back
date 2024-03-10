import { User } from "src/user/entity/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn()
  comment_like_id: number;

  @ManyToOne(() => Comment, (comment) => comment.like_list, {
    onDelete: "CASCADE",
  })
  comment: Comment;

  @ManyToOne(() => User, (user) => user.comment_like_list, {
    onDelete: "CASCADE",
  })
  user: User;
}
