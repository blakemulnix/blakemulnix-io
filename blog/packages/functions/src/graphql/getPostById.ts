import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import { Post } from "./Post";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function getPostById(
  postId: string
): Promise<Post | undefined> {
  const params = {
    Key: { id: postId },
    // @ts-ignore
    TableName: Table.blogPosts.tableName,
  };

  const { Item } = await dynamoDb.get(params).promise();

  return Item as Post;
}
