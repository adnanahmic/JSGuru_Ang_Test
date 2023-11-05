export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  author?: string;
  comments?: Comment[];
}
