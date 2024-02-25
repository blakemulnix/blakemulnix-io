import { gql as graphql } from '@apollo/client';

export const LIST_POSTS = graphql(`
  query listPosts {
    listPosts {
      id
      title
      content
    }
  }
`);

export const CREATE_POST = graphql(`
  mutation CreatePost($createPostInput: CreatePostInput!) {
    createPost(createPostInput: $createPostInput) {
      title
      content
    }
  }
`);

export const DELETE_POST = graphql(`
  mutation DeletePost($postId: String!) {
    deletePost(postId: $postId) {
      title
      content
      id
    }
  }
`);