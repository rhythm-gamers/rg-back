export interface CreateCommentDto {
  content: string;
  post_uid: number;
  parent_id?: number;
}
