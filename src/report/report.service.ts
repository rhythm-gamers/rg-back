import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentReport } from "./entity/comment-report.entity";
import { Repository } from "typeorm";
import { PostReport } from "./entity/post-report.entity";
import { UserReport } from "./entity/user-report.entity";
import { UserService } from "src/user/user.service";
import { PostService } from "src/post/post.service";
import { CommentService } from "src/comment/comment.service";
import { HandleReportedDao } from "./dao/handle-reported.dao";
import { ReportDao } from "./dao/report.dao";
import { FetchNotProceedListDao } from "./dao/fetch-not-proceed-list.dao";
import { HandleReportedCommentDto } from "./dto/handle-reported-comment.dto";
import { HandleReportedUserDto } from "./dto/handle-reported-user.dto";

interface TargerQueryOptions {
  post?: {
    post_id: boolean;
    title: boolean;
  };
  post_report_id?: boolean;

  comment?: {
    comment_id: boolean;
    content: boolean;
  };
  comment_report_id?: boolean;

  reported?: {
    user_id: boolean;
    name: boolean;
  };
  user_report_id?: boolean;
}

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(CommentReport)
    private commentReportRepository: Repository<CommentReport>,
    @InjectRepository(PostReport)
    private postReportRepository: Repository<PostReport>,
    @InjectRepository(UserReport)
    private userReportRepository: Repository<UserReport>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
  ) {}

  private fetch_not_proceed_list_format = (
    selecter: TargerQueryOptions,
    paging: FetchNotProceedListDao,
    relations: string[],
  ) => {
    return {
      select: {
        reporter: {
          user_id: true,
          name: true,
        },
        reason: true,
        report_recieved: true,
        ...selecter,
      },
      where: {
        handled: false, // 처리되지 않은 내역만 표시
      },
      skip: paging.page * paging.limit,
      take: paging.limit,
      relations: relations,
      orderBy: "DESC",
    };
  };

  async reportPost(report_info: ReportDao, reporter_id: number) {
    const reporter = await this.userService.fetchUserWithUserID(reporter_id);
    const post = await this.postService.fetchPostWithPostID(
      +report_info.target_id,
    );

    const postReport = new PostReport();
    postReport.post = post;
    postReport.reporter = reporter;
    postReport.reason = report_info.reason;

    const result = await this.postReportRepository.save(postReport);
    return result;
  }

  async fetchNotProceedReportedPostList(paging: FetchNotProceedListDao) {
    const reported_list = await this.postReportRepository.findAndCount(
      this.fetch_not_proceed_list_format(
        {
          post: {
            post_id: true,
            title: true,
          },
          post_report_id: true,
        },
        paging,
        ["reporter", "post"],
      ),
    );
    return reported_list;
  }

  async handleReportedPost(reported_info: HandleReportedDao) {
    const result = await this.postReportRepository.update(
      +reported_info.report_id,
      {
        handled: true,
        report_confirmed: new Date(),
      },
    );
    return result;
  }

  async reportComment(report_info: ReportDao, reporter_id: number) {
    const reporter = await this.userService.fetchUserWithUserID(reporter_id);
    const comment = await this.commentService.fetchCommentWithCommentID(
      +report_info.target_id,
    );

    const commentReport = new CommentReport();
    commentReport.comment = comment;
    commentReport.reporter = reporter;
    commentReport.reason = report_info.reason;

    const result = await this.commentReportRepository.save(commentReport);
    return result;
  }

  async fetchNotProceedReportedCommentList(paging: FetchNotProceedListDao) {
    const reported_list = await this.commentReportRepository.find(
      this.fetch_not_proceed_list_format(
        {
          comment: {
            comment_id: true,
            content: true,
          },
          comment_report_id: true,
        },
        paging,
        ["reporter", "comment"],
      ),
    );
    return reported_list;
  }

  async handleReportedComment(reported_info: HandleReportedCommentDto) {
    const result = await this.commentReportRepository.update(
      +reported_info.report_id,
      {
        handled: true,
        report_confirmed: new Date(),
      },
    );
    return result;
  }

  async reportUser(report_info: ReportDao, reporter_id: number) {
    const reporter = await this.userService.fetchUserWithUserID(reporter_id);
    const reported = await this.userService.fetchUserWithUserID(
      +report_info.target_id,
    );

    const userReport = new UserReport();
    userReport.reported = reported;
    userReport.reporter = reporter;
    userReport.reason = report_info.reason;

    const result = await this.userReportRepository.save(userReport);
    return result;
  }

  async fetchNotProceedReportedUserList(paging: FetchNotProceedListDao) {
    const reported_list = await this.userReportRepository.findAndCount(
      this.fetch_not_proceed_list_format(
        {
          reported: {
            user_id: true,
            name: true,
          },
          user_report_id: true,
        },
        paging,
        ["reporter", "reported"],
      ),
    );
    return reported_list;
  }

  async handleReportedUser(reported_info: HandleReportedUserDto) {
    const result = await this.userReportRepository.update(
      +reported_info.report_id,
      {
        handled: true,
        report_confirmed: new Date(),
      },
    );

    const reported_user = await this.userReportRepository.findOne({
      select: {
        reported: {
          user_id: true,
        },
      },
      where: {
        user_report_id: +reported_info.report_id,
      },
      relations: ["reported"],
    });
    const reported_user_id = reported_user.reported.user_id;
    const reason = reported_info.reason;
    const duration = +reported_info.duration;

    // TODO: UserService에 정지 기간, 사유 update문 필요 <=
    // TODO: User entity에 정지 사유 추가

    return result;
  }
}
