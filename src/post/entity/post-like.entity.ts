import { User } from "src/user/entity/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class PostLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.likeList)
  post: Post;

  @ManyToOne(() => User, (user) => user.postLikeList)
  user: User;
}
