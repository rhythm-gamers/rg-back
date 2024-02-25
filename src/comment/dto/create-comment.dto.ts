export interface CreateComment {
  content: string;
  post_uid: number;
  parent_id?: number;
}
