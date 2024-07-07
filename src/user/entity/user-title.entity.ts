import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserTitle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  djmax: boolean;

  @Column({ default: false })
  ez2on: boolean;

  @Column({ default: false })
  rhythmdoctor: boolean;

  @Column({ default: false })
  adofai: boolean;

  @Column({ default: false })
  sixtargate: boolean;

  @Column({ default: false })
  muzedash: boolean;
}
