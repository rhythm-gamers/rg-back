import {
  Column,
  CreateDateColumn,
  Entity,
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
import { PlateData } from "./plate-data.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => PlateSetting, (plateSetting) => plateSetting.user)
  plateSetting: PlateSetting;

  @OneToOne(() => UserTitle, (userTitle) => userTitle.user)
  userTitle: UserTitle;

  @OneToOne(() => PlateData, (plateData) => plateData.user)
  plateData: PlateData;

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

  @OneToMany(() => PostReport, (postReport) => postReport.reporter, {
    cascade: true,
  })
  postReports: PostReport[];

  @OneToMany(() => CommentReport, (commentReport) => commentReport.reporter)
  commentReports: CommentReport[];

  // 신고를 함
  @OneToMany(() => UserReport, (userReport) => userReport.reporter)
  reporting: UserReport[];

  // 신고를 당함
  @OneToMany(() => UserReport, (userReport) => userReport.reported)
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
  introduction: string | null;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  suspendedAt: Date;

  @Column({ nullable: true })
  steamId: string | null;

  @Column({ default: 0 })
  userLevel: number;

  @Column({ nullable: true })
  profileImage: string | null;
}
