import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import { randomUUID } from 'crypto';
import { Post, CreatePostInput } from "./Post";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function createPost(createPostInput: CreatePostInput): Promise<Post> {
  const newPost = {
    id: randomUUID(),
    title: createPostInput.title,
    content: createPostInput.content,
  };

  const params = {
    Item: newPost as Record<string, unknown>,
    // @ts-ignore
    TableName: Table.blogPosts.tableName,
  };

  await dynamoDb.put(params).promise();

  return newPost;
}
