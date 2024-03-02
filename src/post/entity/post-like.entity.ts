import { User } from 'src/user/entity/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class PostLike {
  @PrimaryGeneratedColumn()
  post_like_id: number;

  @ManyToOne(() => Post, (post) => post.like_list, {
    cascade: true,
  })
  post: Post;

  @ManyToOne(() => User, (user) => user.post_like_list, {
    cascade: true,
  })
  user: User;
}
