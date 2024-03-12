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
import { Post } from "src/post/entity/post.entity";
import { Comment } from "src/comment/entity/comment.entity";
import { PostReport } from "src/report/entity/post-report.entity";
import { CommentReport } from "src/report/entity/comment-report.entity";
import { UserReport } from "src/report/entity/user-report.entity";
import { LevelTestProgress } from "../../progress/entity/level-test-progress.entity";
import { PracticeProgress } from "../../progress/entity/practice-progress.entity";
import { CommentLike } from "src/comment/entity/comment-like.entity";
import { PostLike } from "src/post/entity/post-like.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @OneToOne(() => PlateSetting, (platesetting) => platesetting.user)
  @JoinColumn()
  platesetting: PlateSetting;

  @OneToOne(() => UserTitle, (usertitle) => usertitle.user)
  @JoinColumn()
  usertitle: UserTitle;

  @OneToMany(() => LevelTestProgress, (progress) => progress.user, {
    cascade: true,
  })
  levelTestProgresses: LevelTestProgress[];

  @OneToMany(() => PracticeProgress, (progress) => progress.user, {
    cascade: true,
  })
  practiceProgresses: PracticeProgress[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => CommentLike, (like) => like.user, {
    cascade: true,
  })
  commentLikeList: CommentLike[];

  @OneToMany(() => PostLike, (like) => like.user, {
    cascade: true,
  })
  postLikeList: PostLike[];

  @OneToMany(() => PostReport, (postreport) => postreport.reporter, {
    cascade: true,
  })
  postReports: PostReport[];

  @OneToMany(() => CommentReport, (commentreport) => commentreport.reporter)
  commentReports: CommentReport[];

  // 신고를 함
  @OneToMany(() => UserReport, (userreport) => userreport.reporter)
  reporting: UserReport[];

  // 신고를 당함
  @OneToMany(() => UserReport, (userreport) => userreport.reported)
  reported: UserReport[];

  @Column({ length: 20, unique: true })
  nickname: string;

  @Column({ length: 20 })
  registerId: string;

  @Column({ length: 150 })
  password: string;

  @Column({ default: "local", length: 20 })
  loginType: string;

  @Column({ nullable: true, default: "", length: 200 })
  describe: string | null;

  @Column({ default: false })
  adminYn: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  suspendedAt: Date;

  @Column({ nullable: true })
  steamId: number | null;
}
