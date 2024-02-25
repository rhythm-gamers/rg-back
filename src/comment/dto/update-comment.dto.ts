import { CommentInterface } from "./comment.interface";

export interface UpdateComment extends CommentInterface {
  content?: string;
}
