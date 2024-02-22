import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PlateSetting } from "./plate-setting.entity";
import { UserTitle } from "./user-title.entity";
import { PatternProgress } from "./pattern-progress.entity";
import { Post } from "src/post/entity/post.entity";
import { Comment } from "src/comment/entity/comment.entity";
import { PostReport } from "src/report/entity/post-report.entity";
import { CommentReport } from "src/report/entity/comment-report.entity";
import { UserReport } from "src/report/entity/user-report.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  uid: number;

  @OneToOne(() => PlateSetting, (platesetting) => platesetting.user)
  @JoinColumn()
  platesetting: PlateSetting;

  @OneToOne(() => UserTitle, (usertitle) => usertitle.user)
  @JoinColumn()
  usertitle: UserTitle;

  @OneToMany(() => PatternProgress, (patternprogress) => patternprogress.user)
  pattern_progresses: PatternProgress[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => PostReport, (postreport) => postreport.user)
  post_reports: PostReport[];

  @OneToMany(() => CommentReport, (commentreport) => commentreport.user)
  comment_reports: CommentReport[];

  // 신고를 함
  @OneToMany(() => UserReport, (userreport) => userreport.reporting_user)
  reporting: UserReport[];

  // 신고를 당함
  @OneToMany(() => UserReport, (userreport) => userreport.reported_user)
  reported: UserReport[];

  @Column({ length: 20 })
  name: string;

  @Column({ length: 20 })
  register_id: string;

  @Column({ length: 150 })
  password: string;

  @Column({ default: "local", length: 20 })
  login_type: string;

  @Column({ nullable: true, default: "", length: 200 })
  describe: string | null;

  @Column({ default: false })
  admin_yn: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  suspension_date: Date;

  @Column({ nullable: true })
  steam_id: number | null;
}
