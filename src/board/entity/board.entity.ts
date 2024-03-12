import { Post } from "src/post/entity/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  boardId: number;

  @OneToMany(() => Post, (post) => post.board)
  posts: Post[];

  @Column({ length: 10 })
  boardName: string;

  @Column({ length: 200, default: "" })
  description: string;
}
