import { User } from "src/user/entity/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comment, (comment) => comment.likeList, {
    onDelete: "CASCADE",
  })
  comment: Comment;

  @ManyToOne(() => User, (user) => user.commentLikeList, {
    onDelete: "CASCADE",
  })
  user: User;
}
