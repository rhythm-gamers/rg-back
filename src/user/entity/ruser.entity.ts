import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "src/post/entity/post.entity";
import { Comment } from "src/comment/entity/comment.entity";
import { PostReport } from "src/report/entity/post-report.entity";
import { CommentReport } from "src/report/entity/comment-report.entity";
import { UserReport } from "src/report/entity/user-report.entity";
import { LevelTestProgress } from "../../progress/entity/level-test-progress.entity";
import { PracticeProgress } from "../../progress/entity/practice-progress.entity";
import { CommentLike } from "src/comment/entity/comment-like.entity";
import { PostLike } from "src/post/entity/post-like.entity";
import { Chingho } from "src/chingho/entity/chingho.entity";
import { RPlateData } from "src/plate/entity/rplate-data.entity";
import { RPlateSetting } from "src/plate/entity/rplate-setting.entity";

@Entity()
export class RUser {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => RPlateSetting, (plateSetting) => plateSetting.user, {
    onDelete: "CASCADE",
  })
  plateSetting: RPlateSetting;

  @OneToOne(() => RPlateData, (plateData) => plateData.user, {
    onDelete: "CASCADE",
  })
  plateData: RPlateData;

  @OneToOne(() => Chingho, (chingho) => chingho.user, {
    onDelete: "CASCADE",
  })
  chingho: Chingho;

  @OneToMany(() => LevelTestProgress, (progress) => progress.user, {
    cascade: true,
  })
  levelTestProgresses: LevelTestProgress[];

  @OneToMany(() => PracticeProgress, (progress) => progress.user, {
    cascade: true,
  })
  practiceProgresses: PracticeProgress[];

  @OneToMany(() => Post, (post) => post.user, {
    onDelete: "CASCADE",
  })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user, {
    onDelete: "CASCADE",
  })
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

  @OneToMany(() => CommentReport, (commentReport) => commentReport.reporter, {
    onDelete: "CASCADE",
  })
  commentReports: CommentReport[];

  // 신고를 함
  @OneToMany(() => UserReport, (userReport) => userReport.reporter, {
    onDelete: "CASCADE",
  })
  reporting: UserReport[];

  // 신고를 당함
  @OneToMany(() => UserReport, (userReport) => userReport.reported, {
    onDelete: "CASCADE",
  })
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
