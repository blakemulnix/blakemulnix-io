export type Post = {
  id: string;
  title: string;
  content: string;
};

export type CreatePostInput = {
  title: string;
  content: string;
};

export type UpdatePostInput = {
  id: string;
  title: string;
  content: string;
};

