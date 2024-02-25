import listPosts from "./graphql/listPosts";
import createPost from "./graphql/createPost";
import updatePost from "./graphql/updatePost";
import deletePost from "./graphql/deletePost";
import getPostById from "./graphql/getPostById";
import { CreatePostInput, Post, UpdatePostInput } from "./graphql/Post";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    createPostInput: CreatePostInput;
    updatePostInput: UpdatePostInput;
    postId: string;
  };
};

export async function handler(
  event: AppSyncEvent
): Promise<Record<string, unknown>[] | Post | string | null | undefined> {
  switch (event.info.fieldName) {
    case "listPosts":
      return await listPosts();
    case "createPost":
      return await createPost(event.arguments.createPostInput);
    case "updatePost":
      return await updatePost(event.arguments.updatePostInput);
    case "deletePost":
      return await deletePost(event.arguments.postId);
    case "getPostById":
      return await getPostById(event.arguments.postId);
    default:
      return null;
  }
}
