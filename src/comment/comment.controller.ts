import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { IncreaseCommentLikesDto } from './dto/increase-comment-likes.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('post/:post_id')
  async getCommentAtAssociatePost(
    @Param('post_id') post_id: number,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = +process.env.COMMENT_LIMIT,
  ) {
    return await this.commentService.fetchCommentAssociatePostID(
      +post_id,
      +page,
      +limit,
    );
  }

  @Post()
  async craeteComment(@Body() body: CreateCommentDto) {
    const user_uid = 1;
    return await this.commentService.createComment(user_uid, body);
  }

  @Put()
  async updateComment(@Body() body: UpdateCommentDto) {
    const user_uid = 1;
    return await this.commentService.updateComment(user_uid, body);
  }

  @Delete()
  async deleteComment(@Body() body: DeleteCommentDto) {
    const user_uid = 1;
    return await this.commentService.deleteComment(user_uid, body);
  }

  @Post('inc_like')
  async increaseCommentLike(@Body() body: IncreaseCommentLikesDto) {
    return await this.commentService.increaseCommentLikes(0, body);
  }
}
