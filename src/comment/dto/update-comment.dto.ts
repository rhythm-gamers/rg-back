import { CommentInterface } from './comment.interface';

export interface UpdateCommentDto extends CommentInterface {
  content?: string;
}
