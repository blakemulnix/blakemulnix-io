import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import { Post } from "./Post";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function deletePost(postId: string): Promise<Post> {
  const findParams = {
    Key: { id: postId },
    // @ts-ignore
    TableName: Table.blogPosts.tableName,
  };

  const { Item } = await dynamoDb.get(findParams).promise();

  const deleteParams = {
    Key: { id: postId },
    // @ts-ignore
    TableName: Table.blogPosts.tableName,
  };

  await dynamoDb.delete(deleteParams).promise();

  return Item as Post;
}
