import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function listPosts(): Promise<
  Record<string, unknown>[] | undefined
> {
  const params = {
    // @ts-ignore
    TableName: Table.blogPosts.tableName,
  };

  const data = await dynamoDb.scan(params).promise();
  
  console.log("data", data);

  return data.Items;
}
