import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentReport } from "./entity/comment-report.entity";
import { Repository } from "typeorm";
import { PostReport } from "./entity/post-report.entity";
import { UserReport } from "./entity/user-report.entity";
import { UserService } from "src/user/user.service";
import { PostService } from "src/post/service/post.service";
import { CommentService } from "src/comment/service/comment.service";
import { HandleReportedDao } from "./dao/handle-reported.dao";
import { ReportDao } from "./dao/report.dao";
import { FetchNotProceedListDao } from "./dao/fetch-not-proceed-list.dao";
import { HandleReportedCommentDto } from "./dto/handle-reported-comment.dto";
import { HandleReportedUserDto } from "./dto/handle-reported-user.dto";

interface TargetQueryOptions {
  post?: {
    id: boolean;
    title: boolean;
  };

  comment?: {
    id: boolean;
    content: boolean;
  };

  reported?: {
    id: boolean;
    name: boolean;
  };

  id?: boolean;
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

  private fetchNotProceedListFormat = (
    selecter: TargetQueryOptions,
    paging: FetchNotProceedListDao,
    relations: string[],
  ) => {
    return {
      select: {
        reporter: {
          id: true,
          name: true,
        },
        reason: true,
        reportRecieved: true,
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

  async reportPost(reportInfo: ReportDao, reporterId: number) {
    const reporter = await this.userService.fetchWithUserId(reporterId);
    const post = await this.postService.fetchPostWithPostID(
      +reportInfo.targetId,
    );

    const postReport = new PostReport();
    postReport.post = post;
    postReport.reporter = reporter;
    postReport.reason = reportInfo.reason;

    const result = await this.postReportRepository.save(postReport);
    return result;
  }

  async fetchNotProceedReportedPostList(paging: FetchNotProceedListDao) {
    const reportedList = await this.postReportRepository.findAndCount(
      this.fetchNotProceedListFormat(
        {
          id: true,
          post: {
            id: true,
            title: true,
          },
        },
        paging,
        ["reporter", "post"],
      ),
    );
    return reportedList;
  }

  async handleReportedPost(reportedInfo: HandleReportedDao) {
    const result = await this.postReportRepository.update(
      +reportedInfo.reportId,
      {
        handled: true,
        reportConfirmed: new Date(),
      },
    );
    return result;
  }

  async reportComment(reportInfo: ReportDao, reporterId: number) {
    const reporter = await this.userService.fetchWithUserId(reporterId);
    const comment = await this.commentService.fetchCommentWithCommentID(
      +reportInfo.targetId,
    );

    const commentReport = new CommentReport();
    commentReport.comment = comment;
    commentReport.reporter = reporter;
    commentReport.reason = reportInfo.reason;

    const result = await this.commentReportRepository.save(commentReport);
    return result;
  }

  async fetchNotProceedReportedCommentList(paging: FetchNotProceedListDao) {
    const reportedList = await this.commentReportRepository.find(
      this.fetchNotProceedListFormat(
        {
          id: true,
          comment: {
            id: true,
            content: true,
          },
        },
        paging,
        ["reporter", "comment"],
      ),
    );
    return reportedList;
  }

  async handleReportedComment(reportedInfo: HandleReportedCommentDto) {
    const result = await this.commentReportRepository.update(
      +reportedInfo.reportId,
      {
        handled: true,
        reportConfirmed: new Date(),
      },
    );
    return result;
  }

  async reportUser(reportInfo: ReportDao, reporterId: number) {
    const reporter = await this.userService.fetchWithUserId(reporterId);
    const reported = await this.userService.fetchWithUserId(
      +reportInfo.targetId,
    );

    const userReport = new UserReport();
    userReport.reported = reported;
    userReport.reporter = reporter;
    userReport.reason = reportInfo.reason;

    const result = await this.userReportRepository.save(userReport);
    return result;
  }

  async fetchNotProceedReportedUserList(paging: FetchNotProceedListDao) {
    const reportedList = await this.userReportRepository.findAndCount(
      this.fetchNotProceedListFormat(
        {
          reported: {
            id: true,
            name: true,
          },
          id: true,
        },
        paging,
        ["reporter", "reported"],
      ),
    );
    return reportedList;
  }

  async handleReportedUser(reportedInfo: HandleReportedUserDto) {
    const result = await this.userReportRepository.update(
      +reportedInfo.reportId,
      {
        handled: true,
        reportConfirmed: new Date(),
      },
    );

    const reportedUser = await this.userReportRepository.findOne({
      select: {
        reported: {
          id: true,
        },
      },
      where: {
        id: +reportedInfo.reportId,
      },
      relations: ["reported"],
    });
    const reportedUserId = reportedUser.reported.id;
    const reason = reportedInfo.reason;
    const duration = +reportedInfo.duration;

    // TODO: UserService에 정지 기간, 사유 update문 필요 <=
    // TODO: User entity에 정지 사유 추가

    return result;
  }
}
