export type Post = {
  _id: string;
  text: string;
  img: string;
  createdAt: string;
  isPublished: boolean;
  tobePublishedAt: string | null;
  imageData?: string;
  date: string;
};
