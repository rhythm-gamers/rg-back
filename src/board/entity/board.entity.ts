import { Post } from "src/post/entity/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Post, (post) => post.board, { onDelete: "CASCADE" })
  posts: Post[];

  @Column({ length: 20, unique: true, nullable: false })
  boardName: string;

  @Column({ length: 200, default: "" })
  description: string;
}
