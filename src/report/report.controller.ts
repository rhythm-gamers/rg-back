import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ReportService } from "./report.service";
import { ReportCommentDto } from "./dto/report-comment.dto";
import { HandleReportedCommentDto } from "./dto/handle-reported-comment.dto";
import { ReportPostDto } from "./dto/report-post.dto";
import { HandleReportedPostDto } from "./dto/handle-reported-post.dto";
import { HandleReportedUserDto } from "./dto/handle-reported-user.dto";
import { ReportUserDto } from "./dto/report-user.dto";

@Controller("report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  private default_page: number = 0;
  private default_limit: number = 20;

  @Get("comments")
  async getNotProceedCommentList(
    @Query("page") page: number = this.default_page,
    @Query("limit") limit: number = this.default_limit,
  ) {
    const result = await this.reportService.fetchNotProceedReportedCommentList({
      page: +page,
      limit: +limit,
    });
    return result;
  }

  @Post("comment")
  async reportComment(@Body() body: ReportCommentDto) {
    const reporter_id: number = 1;
    const result = await this.reportService.reportComment(body, reporter_id);
    return result;
  }

  @Post("handle/comment")
  async handleReportedComment(@Body() body: HandleReportedCommentDto) {
    const result = await this.reportService.handleReportedComment(body);
    return result;
  }

  @Get("posts")
  async getNotProceedPostList(
    @Query("page") page: number = this.default_page,
    @Query("limit") limit: number = this.default_limit,
  ) {
    const result = await this.reportService.fetchNotProceedReportedPostList({
      page: +page,
      limit: +limit,
    });
    return result;
  }

  @Post("post")
  async reportPost(@Body() body: ReportPostDto) {
    const reporter_id: number = 1;
    const result = await this.reportService.reportPost(body, reporter_id);
    return result;
  }

  @Post("handle/post")
  async handleReportedPost(@Body() body: HandleReportedPostDto) {
    const result = await this.reportService.handleReportedPost(body);
    return result;
  }

  @Get("users")
  async getNotProceedUserList(
    @Query("page") page: number = this.default_page,
    @Query("limit") limit: number = this.default_limit,
  ) {
    const result = await this.reportService.fetchNotProceedReportedUserList({
      page: +page,
      limit: +limit,
    });
    return result;
  }

  @Post("user")
  async reportUser(@Body() body: ReportUserDto) {
    const reporter_id: number = 1;
    const result = await this.reportService.reportUser(body, reporter_id);
    return result;
  }

  @Post("handle/user")
  async handleReportedUser(@Body() body: HandleReportedUserDto) {
    const result = await this.reportService.handleReportedUser(body);
    return result;
  }
}
