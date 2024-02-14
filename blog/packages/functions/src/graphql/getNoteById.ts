import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import Note from "./Note";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function getNoteById(
  noteId: string
): Promise<Note | undefined> {
  console.log("Table.blogNotes.tableName: ", Table.blogNotes.tableName);

  const params = {
    Key: { id: noteId },
    TableName: Table.blogNotes.tableName,
  };

  const { Item } = await dynamoDb.get(params).promise();

  return Item as Note;
}
