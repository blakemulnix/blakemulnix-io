import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import Note from "./Note";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function createNote(note: Note): Promise<Note> {
  console.log("createNote", note);

  const params = {
    Item: note as Record<string, unknown>,
    TableName: Table.blogNotes.tableName,
  };

  console.log("params", params);

  await dynamoDb.put(params).promise();

  return note;
}
