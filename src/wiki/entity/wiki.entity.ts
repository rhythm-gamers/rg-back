import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Wiki {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column({ length: 20 })
  title: string;

  @Column({ length: 2, comment: "즈레면 ㅈ, 폭타면 ㅍ 식으로" })
  letter: string;

  @Column({ default: false })
  mustRead: boolean;

  @Column({ length: 1000, default: "" })
  content: string;
}
