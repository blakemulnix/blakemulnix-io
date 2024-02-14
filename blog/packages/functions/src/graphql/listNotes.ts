import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function listNotes(): Promise<
  Record<string, unknown>[] | undefined
> {
  console.log("listNotes");
  console.log(`Table.blogNotes.tableName: ${Table.blogNotes.tableName}`);

  const params = {
    TableName: Table.blogNotes.tableName,
  };

  const data = await dynamoDb.scan(params).promise();

  return data.Items;
}
